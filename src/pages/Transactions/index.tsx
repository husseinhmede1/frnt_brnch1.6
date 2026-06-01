import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputBase, MenuItem, Select, SelectChangeEvent, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { visuallyHidden } from "@mui/utils";
import { add_rounded, delete_ic, down_arrow_icon, edit_ic, resetIcon } from '../../assets/images';
import { SystemCodeModel } from '../../models/entityManagement/SystemCodeModel';
import { TransactionsModel } from '../../models/entityManagement/TransactionModel';
import { RoleMainModel } from '../../models/security/RoleModel';
import { TransactionService } from '../../services/configuration/transaction-service';
import { SystemCodeServices } from '../../services/entityManagement/system-code-services';
import { AssignRoles, selectedInst } from '../../services/request';
import { CodePrefix, CodeSuffix, Errors, ROLE_ACTIVITY, StatusCode } from '../../utils/constant';
import { getLocalStorage, LOCALSTORAGE_KEYS } from '../../utils/helper';
import validations from '../../utils/validations';
import { avoidSpace } from '../../utils/commonfunction';

const Transactions = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [traType, setTraType] = React.useState<string>(" ");
    const [transactions, setTransactions] = React.useState<TransactionsModel[]>([]);
    const [updateFlag, setUpdateFlag] = React.useState<string>("0");
    const [roleActivity, setRoleActivity] = React.useState<RoleMainModel>();
    const [usageList, setUsageList] = React.useState<SystemCodeModel[]>([]);
    const [trasUsage, setTransUsage] = React.useState<string>(" ");
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof TransactionsModel>('transactionId');
    // const [transUsageId, setTransUsageId] = React.useState<number| null>(null);
    const handleTransUsage = (event: SelectChangeEvent) => {
        setTransUsage(event.target.value);
    }

    useEffect(() => {
        const assignRole = AssignRoles.find((role: RoleMainModel) => role.instId === selectedInst);
        if (assignRole !== undefined) {
            setRoleActivity(assignRole);
        }
    }, [selectedInst]);

    const handleClose = () => {
        setOpen(false);
        setUpdateFlag("0");
    };

    const handleClickOpen = () => {
        handleReset();
        setTraType(" ");
        setOpen(true);
        clearErrors();
    };

    useEffect(() => {
        getTransactions();
        getUsageList();
    }, []);


    const getUsageList = async () => {
        const model = {
            codePrefix: CodePrefix.TRANS_USAGE,
            //codeSuffix: CodeSuffix.TRANS
        }

        await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
            .then((res) => {
                setUsageList([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    }

    const getTransactions = () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        TransactionService.getInstDefaultTransactionIdByInstitutionId(instID).then(res => {
            setTransactions([...res.data]);
        }).catch((err) =>   toast.error(err.response.data.errors[0]));
    }

    const handleTransactionType = (event: SelectChangeEvent) => {
        setTraType(event.target.value);
    }

    const handleReset = () => {
        reset(new TransactionsModel());
        setTraType(" ");
        setTransUsage(" ");
        // setTransUsageId(null);
    };

    const editTransactions = (id: string) => {
        handleClickOpen();
        setUpdateFlag("1");
        TransactionService.getDefaultTransactionId(id).then(res => {
            reset(res.data);
            setTraType(res.data?.signFlag);
            //setTransUsageId(res.data?.usageSystemCodeId);
            setTransUsage(res.data?.transUsage);
        })
    }

    const onDelete = (id: string) => {
        Swal.fire({
            title: intl.formatMessage({
                id: "DeleteAlert.title",
                defaultMessage: "Are you sure?"
            }),
            text: intl.formatMessage({
                id: "DeleteAlert.text",
                defaultMessage: "You won't be able to revert this!",
            }),
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: intl.formatMessage({
                id: "DeleteAlert.cancelButtonText",
                defaultMessage: "Cancel",
            }),
            confirmButtonText: intl.formatMessage({
                id: "DeleteAlert.confirmButtonText",
                defaultMessage: "Yes, delete it!",
            }),
        }).then((result: any) => {
            if (result.isConfirmed) {
                TransactionService.deleteDefaultTransactionId(id).then((res) => {
                    if (res.status === StatusCode.Success) {
                        Swal.fire({
                            title: intl.formatMessage({
                                id: "DeleteAlert.DeleteSuccess.title",
                                defaultMessage: "Deleted!",
                            }),
                            text: intl.formatMessage({
                                id: "DeleteAlert.DeleteSuccess.text",
                                defaultMessage: "Record has been deleted.",
                            }),
                            icon: "success",
                            confirmButtonText: intl.formatMessage({
                                id: "DeleteAlert.okButtonText",
                                defaultMessage: "OK",
                            }),
                        })
                        getTransactions();
                    }
                }).catch(err => {
                    if (err && err.response
                        //  && err.response.data === Errors.ReferenceExists
                        ) {
                        Swal.fire({
                            title: intl.formatMessage({
                                id: "DeleteAlert.DeleteError.title",
                                defaultMessage: "Cannot be deleted!",
                            }),
                            text: intl.formatMessage({
                                id: "DeleteAlert.DeleteError.referenceExist",
                                defaultMessage:err.response.data.errors[0]
                            }),
                            icon: "error",
                            confirmButtonText: intl.formatMessage({
                                id: "DeleteAlert.okButtonText",
                                defaultMessage: "OK",
                            }),
                        });
                    }else{
                        toast.error(err.response.data.errors[0])
                    }
                });
            }
        });
    }

    const changeStatus = (id: string, event: any) => {
        const model = {
            id: 0,
            idString: id,
            status: event.target.checked === true ? "1" : "0",
        };
        TransactionService.changeStatus(model).then(res => {
            getTransactions();
            toast.success(res?.data+"")
        }).catch(err =>   toast.error(err.response.data.errors[0]));
    }


    /* START (sort table data) */
    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    type Order = 'asc' | 'desc';

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key,
    ): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const createSortHandler = (
        property: keyof TransactionsModel
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */

    const {
        register,
        reset,
        handleSubmit,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<TransactionsModel>({
        mode: "onChange",
        resolver: yupResolver(validations.transactionValidations),
    });

    const onSubmit = (value: TransactionsModel) => {
        let model = {
            description: value.description,
            institutionId: getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string,
            signFlag: value.signFlag,
            transUsage: trasUsage,
            transactionId: value.transactionId,
            updateFlag: updateFlag
        }

        TransactionService.addDefaulTransactionId(model as TransactionsModel).then(res => {
            console.log("value>>>>",value);
            if (res.status === StatusCode.Success) {
                if (updateFlag === "1") {
                    toast.success("Transaction details updated successfully");
                    setUpdateFlag("0");
                } else {
                    toast.success("Transaction record added successfully");
                }
                handleReset();
                handleClose();
            }
            getTransactions();
        }).catch(err => {
            if (err.response.data) toast.error(err.response.data.errors[0]);
        });
    }

    return (
        <>
            <div className="wrapper">
                <main className="main-content" >
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block">
                                <Typography variant={"h2"} className="pb-0">
                                    {intl.formatMessage({
                                        id: "Transactions.transactions",
                                        defaultMessage: "Transactions",
                                    })}
                                </Typography>
                            </div>
                            <div className="right-block">
                                <Button
                                    variant="contained"
                                    disableElevation className="btn-light"
                                    endIcon={<img src={add_rounded} alt="add" />}
                                    onClick={() => handleClickOpen()}
                                    disabled={!(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions)?.accessAdd === "1")}
                                >
                                    <FormattedMessage
                                        id="Transactions.addtransaction"
                                        defaultMessage="Add Transaction"
                                    />
                                </Button>
                            </div>
                        </div>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'transactionId'}
                                                direction={orderBy === 'transactionId' ? order : 'asc'}
                                                onClick={() => createSortHandler("transactionId")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "Transactions.transactionid",
                                                        defaultMessage: "Transaction ID"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                intl.formatMessage({
                                                    id: "Transactions.description",
                                                    defaultMessage: "Description"
                                                })
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'signFlag'}
                                                direction={orderBy === 'signFlag' ? order : 'asc'}
                                                onClick={() => createSortHandler("signFlag")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "Transactions.debit/credit",
                                                        defaultMessage: "Debit/Credit"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'transUsage'}
                                                direction={orderBy === 'transUsage' ? order : 'asc'}
                                                onClick={() => createSortHandler("transUsage")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "Transactions.usage",
                                                        defaultMessage: "Usage",
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>

                                        </TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border-header">
                                            {
                                                intl.formatMessage({
                                                    id: "Entity.label.actions",
                                                    defaultMessage: "Actions",
                                                })
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.sort(getComparator(order, orderBy)).map((row, i) => (
                                        <TableRow
                                            key={i}
                                        >
                                            <TableCell>{row.transactionId}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.signFlag}</TableCell>
                                            <TableCell>{row.transUsage}</TableCell>
                                            <TableCell align="center" width="220px" className="last-column-border">
                                                <div className="action btns-block">
                                                    <Switch
                                                        className="custom"
                                                        defaultChecked={row.status === "1" ? true : false}
                                                        onChange={(e) =>
                                                            changeStatus(row.transactionId as string, e)
                                                        }
                                                        disabled={!(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions)?.accessUpdate === "1")}
                                                    />
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => editTransactions(row.transactionId as string)}
                                                        disabled={!(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions)?.accessUpdate === "1")}
                                                    >
                                                        <img src={edit_ic} alt="edit" />
                                                    </IconButton>
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => onDelete(row.transactionId as string)}
                                                        disabled={!(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions)?.accessDelete === "1")}
                                                    >
                                                        <img src={delete_ic} alt="delete" />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {transactions &&
                                        transactions.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="last-column-border">
                                                    <p style={{ textAlign: "center" }}>
                                                        {intl.formatMessage({
                                                            id: "Entity.noDataFound",
                                                            defaultMessage: "No Data Found",
                                                        })}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </main >
                <Dialog open={open} onClose={handleClose} className="c-dialog">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogTitle component={"div"}>
                            <div className="title-block mb-0">
                                <div className="left-block mb-0">
                                    <Typography variant={"h2"}>
                                        {intl.formatMessage({
                                            id: "Transactions.transactiondefinition",
                                            defaultMessage: "Transaction Defintion",
                                        })}
                                    </Typography>
                                    <p className="pb-0">
                                        {intl.formatMessage({
                                            id: "Transactions.addorupdatetransaction",
                                            defaultMessage: "Add or Update Transaction",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className="inner-card">
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {intl.formatMessage({
                                                    id: "Transactions.transactionid",
                                                    defaultMessage: "Transaction ID"
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    error
                                                    fullWidth
                                                    onKeyPress={avoidSpace}
                                                    placeholder={intl.formatMessage({
                                                        id: "Transactions.transactionid",
                                                        defaultMessage: "Transaction ID"
                                                    })}
                                                    {...register("transactionId")}
                                                    // autoComplete="off"
                                                    // aria-describedby="error-helper-text"
                                                    id="transaction-id"
                                                    disabled={updateFlag === "1"}
                                                    inputProps={{ maxLength: 12 }}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.transactionId?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {
                                                    intl.formatMessage({
                                                        id: "Transactions.description",
                                                        defaultMessage: "Description"
                                                    })
                                                }
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    error
                                                    fullWidth
                                                    placeholder={intl.formatMessage({
                                                        id: "Mcc.descriptionPlaceholder",
                                                        defaultMessage: "Write your description",
                                                    })}
                                                    {...register("description")}
                                                    // autoComplete="off"
                                                    // aria-describedby="error-helper-text"
                                                    id="description"
                                                    inputProps={{ maxLength: 30 }}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.description?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label ">
                                            <label>
                                                {
                                                    intl.formatMessage({
                                                        id: "Transactions.debit/credit",
                                                        defaultMessage: "Debit/Credit"
                                                    })
                                                }
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    displayEmpty
                                                    value={traType}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                    placeholder={intl.formatMessage({
                                                        id: "Mcc.merchantTypePlaceholder",
                                                        defaultMessage: "Select",
                                                    })}
                                                    {...register("signFlag")}
                                                    onChange={handleTransactionType}
                                                >
                                                    <MenuItem value=" ">
                                                        <em>
                                                            {intl.formatMessage({
                                                                id: "Mcc.merchantTypePlaceholder",
                                                                defaultMessage: "Select",
                                                            })}
                                                        </em>
                                                    </MenuItem>
                                                    <MenuItem value="C">C</MenuItem>
                                                    <MenuItem value="D">D</MenuItem>
                                                </Select>
                                                {traType === " " &&
                                                    errors.signFlag?.message ? (
                                                    <FormHelperText id="error-helper-text" error>
                                                        {validations.createTransactionValidation.transactionType}
                                                    </FormHelperText>
                                                ) : null}
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label ">
                                            <label>
                                                {
                                                    intl.formatMessage({
                                                        id: "Transactions.usage",
                                                        defaultMessage: "Usage",
                                                    })
                                                }
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    displayEmpty
                                                    value={trasUsage}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                    placeholder={intl.formatMessage({
                                                        id: "Mcc.merchantTypePlaceholder",
                                                        defaultMessage: "Select",
                                                    })}
                                                    {...register("transUsage")}
                                                    onChange={handleTransUsage}
                                                >
                                                    <MenuItem value=" ">
                                                        <em>
                                                            {intl.formatMessage({
                                                                id: "Mcc.merchantTypePlaceholder",
                                                                defaultMessage: "Select",
                                                            })}
                                                        </em>
                                                    </MenuItem>
                                                    {usageList &&
                                                        usageList.length > 0 &&
                                                        usageList.map((type) => {
                                                            return (
                                                                <MenuItem value={type.codeSuffix} key={type.systemCodeId} >
                                                                    {type.description}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {trasUsage === " " &&
                                                    errors.transUsage?.message ? (
                                                    <FormHelperText id="error-helper-text" error>
                                                        {validations.createTransactionValidation.transUsage}
                                                    </FormHelperText>
                                                ) : null}
                                            </FormControl>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </DialogContent>
                        <DialogActions className="btns-block right">
                            <Button
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={handleClose}
                            >
                                <FormattedMessage id="Mcc.cancel" defaultMessage="Cancel" />
                            </Button>
                            <Button disableElevation variant="contained" type="submit" disabled={isSubmitting}>
                                <FormattedMessage id="Mcc.save" defaultMessage="Save" />
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div >
        </>
    )
}

export default Transactions