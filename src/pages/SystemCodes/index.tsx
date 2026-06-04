import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputBase, MenuItem, Select, SelectChangeEvent, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { add_rounded, delete_ic, down_arrow_icon, edit_ic, resetIcon } from '../../assets/images';
import { Institution } from '../../models/configuration/InstitutionModel';
import { SystemCodeModel, SystemHeaderCode } from '../../models/entityManagement/SystemCodeModel';
import { InstitutionService } from '../../services/configuration/institution-service';
import { SystemCodeServices } from '../../services/entityManagement/system-code-services';
import { ConfigurationActivities, Errors, StatusCode } from '../../utils/constant';
import { getActivityPermissions, hasApiAccess } from '../../utils/permissionUtils';
import { getLocalStorage, LOCALSTORAGE_KEYS } from '../../utils/helper';
import validations from '../../utils/validations';
import { visuallyHidden } from "@mui/utils";

const SystemCodes = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [sysCodes, setSysCodes] = React.useState<SystemCodeModel[]>([]);
    const [filteredList, setFilteredList] = React.useState<SystemCodeModel[]>([]);
    const [prefix, setPrefix] = React.useState<string>(" ");
    const [systemCodeHeaderId, setSystemCodeHeaderId] = React.useState<number>();
    const [prefixList, setPrefixList] = React.useState<SystemHeaderCode[]>([]);
    const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
    const [institution, setInstitution] = useState<Institution[]>([]);
    const [saveInstitution, setSaveInstitution] = useState<Institution[]>([]);
    const [selectInst1, setSelectInst1] = React.useState<string>(" ");
    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.SYS_CODES), []);
    const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.SYS_CODES, 'SYSCDCRT');
    const canUpdate = perms.accessUpdate === "1";
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.SYS_CODES, 'SYSCDDEL');
    const canView = perms.accessView === "1";
    const canLoadInstitutions = hasApiAccess(ConfigurationActivities.SYS_CODES, 'GAAINST');
    const canLoadSysCodesByInst = hasApiAccess(ConfigurationActivities.SYS_CODES, 'SYSCDINST');
    const canLoadSysHeaderCodes = hasApiAccess(ConfigurationActivities.SYS_CODES, 'SYSHDRCD');
    const canLoadAllActiveInstitutions = hasApiAccess(ConfigurationActivities.SYS_CODES, 'INSTALACT');

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof SystemCodeModel>('codePrefix');
    const [update, setUpdate] = React.useState<boolean>(false);
    const [isInstitutionDisabled, setIsInstitutionDisabled] = React.useState(false);
    const loginUser = JSON.parse(
        getLocalStorage(LOCALSTORAGE_KEYS.USER) as string
      );

    useEffect(() => {
        getActiveInstitution();
        setInstitutefromLocalStorage();
        const instID = getLocalStorage(
            LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
        ) as string;
        if (canLoadSysCodesByInst) {
            SystemCodeServices.getAllSystemCodesByInstitution(instID).then(res => {
                setSysCodes([...res.data]);
                setFilteredList([...res.data])
            });
        }
        getSystemHeaderPrefix();
    }, []);

    // useEffect(() => {
    //     const instID = getLocalStorage(
    //         LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    //       ) as string;
    //     SystemCodeServices.getAllSystemCodesByInstitution(instID).then(res => {
    //         setSysCodes([...res.data]);
    //         setFilteredList([...res.data])
    //     });
    // }, [selectInstitutionVal, sysCodes]);

    const getSystemCodes = async () => {
        if (!canLoadSysCodesByInst) return;
        SystemCodeServices.getAllSystemCodesByInstitution(selectInstitutionVal).then(res => {
            setSysCodes([...res.data]);
            setFilteredList([...res.data])
        });
    }

    const getSystemHeaderPrefix = () => {
        if (!canLoadSysHeaderCodes) return;
        SystemCodeServices.getAllSystemCodesHeader().then(res => {
            setPrefixList([...res.data]);
        });
    }

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
    };

    const getActiveInstitution = async () => {
        if (!canLoadInstitutions) return;
        await InstitutionService.getActiveInstitution()
            .then((res) => {
                setInstitution([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));

        if (canLoadAllActiveInstitutions) {
            await InstitutionService.getAllActiveInstitution()
                .then((res) => {
                    setSaveInstitution([...res.data]);
                })
                .catch((err) =>   toast.error(err.response.data.errors[0]));
        }
    };

    const handleClose = () => {
        setOpen(false);
        setIsInstitutionDisabled(false);
    };

    const handleClickOpen = () => {
        handleReset();
        setOpen(true);
        clearErrors();
    };

    const handleReset = () => {
        reset(new SystemCodeModel());
        setUpdate(false);
        setSelectInst1(" ");
        setPrefix(" ");
    };

    const editSystemCode = (id: number) => {
        handleClickOpen();
        setUpdate(true);
        setIsInstitutionDisabled(true);
        SystemCodeServices.getSystemCodeById(id).then(res => {
            reset(res.data);
            setSelectInst1(res.data?.institutionId);
            setPrefix(res.data?.codePrefix);
            setSystemCodeHeaderId(res.data?.systemCodeHeaderId);
        });
    }

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
        if (!canLoadSysCodesByInst) return;
                SystemCodeServices.getAllSystemCodesByInstitution(event.target.value).then(res => {
            setSysCodes([...res.data]);
            setFilteredList([...res.data])
        });
    };

    const handleInstitutionChange1 = (event: SelectChangeEvent) => {
        setSelectInst1(event.target.value);
    };

    const handlePrefixChange = (event: SelectChangeEvent) => {
        setPrefix(event.target.value);
    }

    const onDelete = (id: number | undefined) => {
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
                SystemCodeServices.deleteSystemCode(id as number).then((res) => {
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
                    }
                    getSystemCodes();
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
                    }
                });
            }
        });
    }

    const changeStatus = (id: number, event: any) => {
        const model = {
            id: id,
            idString: id.toString(),
            status: event.target.checked === true ? "1" : "0",
        };
        SystemCodeServices.changeSystemCodeStatus(model).then(res => {
            getSystemCodes();
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
        property: keyof SystemCodeModel
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
    } = useForm<SystemCodeModel>({
        mode: "onChange",
        resolver: yupResolver(validations.systemcodeValidations),
    })

    const onSubmit = (value: SystemCodeModel) => {
        SystemCodeServices.saveOrUpdateSystemCode({ ...value, systemCodeHeaderId: systemCodeHeaderId as number }).then(res => {
            if (res.status === StatusCode.Success) {
                if (value.systemCodeId !== undefined) {
                    toast.success("System Code details updated successfully");
                } else {
                    toast.success("System Code record added successfully");
                }
                getSystemCodes();
            }
        }).catch((error: any) => {
            toast.error(error.response.data.errors[0])
        });
        handleReset();
        handleClose();
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
                                        id: "SystemCodes.systemcodes",
                                        defaultMessage: "System Codes",
                                    })}
                                </Typography>
                            </div>
                            <div className="right-block">
                                <Button
                                    variant="contained"
                                    disableElevation className="btn-light"
                                    endIcon={<img src={add_rounded} alt="add" />}
                                    onClick={() => handleClickOpen()}
                                    disabled={!canAdd}
                                >
                                    <FormattedMessage
                                        id="SystemCodes.addcode"
                                        defaultMessage="Add Code"
                                    />
                                </Button>
                            </div>
                        </div>
                        <Grid spacing={3} container>
                            <Grid item xs={12} lg={4} sm={6} xl={4}>
                                <div className="input-with-label form-group">
                                    <label>
                                        {
                                            intl.formatMessage({
                                                id: "Entity.label.institution",
                                                defaultMessage: "Institution"
                                            })
                                        }
                                    </label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={selectInstitutionVal}
                                            onChange={handleInstitutionChange}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                            IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                        >
                                            {institution &&
                                                institution.length > 0 &&
                                                institution.map((type) => {
                                                    return (
                                                        <MenuItem
                                                            key={type.institutionId}
                                                            value={type.institutionId}
                                                        >
                                                            {type.institutionName}
                                                        </MenuItem>
                                                    );
                                                })}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Grid>
                        </Grid>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'codePrefix'}
                                                direction={orderBy === 'codePrefix' ? order : 'asc'}
                                                onClick={() => createSortHandler("codePrefix")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "SystemCodes.codeprefix",
                                                        defaultMessage: "Code Prefix"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'codeSuffix'}
                                                direction={orderBy === 'codeSuffix' ? order : 'asc'}
                                                onClick={() => createSortHandler("codeSuffix")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "SystemCodes.codesuffix",
                                                        defaultMessage: "Code Suffix"
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
                                                active={orderBy === 'codeValue'}
                                                direction={orderBy === 'codeValue' ? order : 'asc'}
                                                onClick={() => createSortHandler("codeValue")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "SystemCodes.codevalue",
                                                        defaultMessage: "Code Value"
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
                                    {filteredList.sort(getComparator(order, orderBy)).map((row, i) => (
                                        <TableRow
                                            key={i}
                                        >
                                            <TableCell>{row.codePrefix}</TableCell>
                                            <TableCell>{row.codeSuffix}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.codeValue}</TableCell>
                                            <TableCell align="center" width="220px" className="last-column-border">
                                                <div className="action btns-block">
                                                    {/* <Switch
                                                        className="custom"
                                                        defaultChecked={row.status === "1" ? true : false}
                                                        onChange={(e) =>
                                                            changeStatus(row.systemCodeId as number, e)
                                                        }
                                                        disabled={!canUpdate}
                                                    /> */}
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => editSystemCode(row.systemCodeId)}
                                                        disabled={!canUpdate}
                                                    >
                                                        <img src={edit_ic} alt="edit" />
                                                    </IconButton>
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => onDelete(row.systemCodeId as number)}
                                                        disabled={!canDelete}
                                                    >
                                                        <img src={delete_ic} alt="delete" />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredList &&
                                        filteredList.length === 0 && (
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
                                    {
                                        update ?
                                            <Typography variant={"h2"}>
                                                {intl.formatMessage({
                                                    id: "SystemCodes.updatesystemcode",
                                                    defaultMessage: "Update System Code",
                                                })}
                                            </Typography>
                                            :
                                            <Typography variant={"h2"}>
                                                {intl.formatMessage({
                                                    id: "SystemCodes.addsystemcode",
                                                    defaultMessage: "Add System Code",
                                                })}
                                            </Typography>
                                    }
                                    {/* <Typography variant={"h2"}>
                                        {intl.formatMessage({
                                            id: "SystemCodes.addsystemcode",
                                            defaultMessage: "Add System Code",
                                        })}
                                    </Typography> */}
                                    {/* <p className="pb-0">
                                        {intl.formatMessage({
                                            id: "Transactions.addorupdatetransaction",
                                            defaultMessage: "Add or Update Transaction",
                                        })}
                                    </p> */}
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className="inner-card">
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label form-group">
                                            <label>
                                                {
                                                    intl.formatMessage({
                                                        id: "Entity.label.institution",
                                                        defaultMessage: "Institution"
                                                    })
                                                }
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={selectInst1}
                                                    {...register("institutionId")}
                                                    onChange={handleInstitutionChange1}
                                                    displayEmpty
                                                    disabled={isInstitutionDisabled}
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                >
                                                    <MenuItem disabled value=" ">{intl.formatMessage({ id: "SystemCodes.select", defaultMessage: "Select" })}</MenuItem>
                                                    {saveInstitution &&
                                                        saveInstitution.length > 0 &&
                                                        saveInstitution.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.institutionId}
                                                                    value={type.institutionId}
                                                                >
                                                                    {type.institutionName}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {selectInst1 === " " &&
                                                    errors.institutionId?.message ? (
                                                    <FormHelperText id="error-helper-text" error>
                                                        {validations.createSystemCodesValidation.institution}
                                                    </FormHelperText>
                                                ) : null}
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label form-group">
                                            <label>
                                                {
                                                    intl.formatMessage({
                                                        id: "SystemCodes.prefix",
                                                        defaultMessage: "Prefix"
                                                    })
                                                }
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={prefix}
                                                    {...register("codePrefix")}
                                                    onChange={handlePrefixChange}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                >
                                                    <MenuItem value=" ">{intl.formatMessage({ id: "SystemCodes.select", defaultMessage: "Select" })}</MenuItem>
                                                    {prefixList.map(data => (
                                                        <MenuItem value={data.codePrefix} key={data.systemCodeHeaderId} onClick={() => setSystemCodeHeaderId(data.systemCodeHeaderId)}>{data.codePrefix}</MenuItem>
                                                    ))}
                                                </Select>
                                                {prefix === " " &&
                                                    errors.codePrefix?.message ? (
                                                    <FormHelperText id="error-helper-text" error>
                                                        {validations.createSystemCodesValidation.codePrefix}
                                                    </FormHelperText>
                                                ) : null}
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {intl.formatMessage({
                                                    id: "SystemCodes.suffix",
                                                    defaultMessage: "Suffix"
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    error
                                                    fullWidth
                                                    placeholder={intl.formatMessage({
                                                        id: "SystemCodes.suffix",
                                                        defaultMessage: "Suffix"
                                                    })}
                                                    {...register("codeSuffix")}
                                                    // autoComplete="off"
                                                    // aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 100 }}
                                                    id="transaction-id"
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.codeSuffix?.message}
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
                                                    inputProps={{ maxLength: 100 }}
                                                    // autoComplete="off"
                                                    // aria-describedby="error-helper-text"
                                                    id="description"
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.description?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {
                                                    intl.formatMessage({
                                                        id: "Transactions.codevalue",
                                                        defaultMessage: "Code Value"
                                                    })
                                                }
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    error
                                                    fullWidth
                                                    placeholder={intl.formatMessage({
                                                        id: "Mcc.entercodevalue",
                                                        defaultMessage: "Enter Code Value",
                                                    })}
                                                    {...register("codeValue")}
                                                    inputProps={{ maxLength: 100 }}
                                                    disabled={selectInst1 !== loginUser?.user?.defaultInstitutionId && update}
                                                    id="code-value"
                                                />
                                                {/* <FormHelperText id="error-helper-text" error>
                                                    {errors.codeValue?.message}
                                                </FormHelperText> */}
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

export default SystemCodes;