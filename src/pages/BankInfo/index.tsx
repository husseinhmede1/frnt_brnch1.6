import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputBase,
    MenuItem,
    Select,
    TableSortLabel,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    FormHelperText
} from "@mui/material";
import {
    add_rounded,
    delete_ic,
    down_arrow_icon,
    edit_ic
} from "../../assets/images";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { BankInfoService } from "../../services/configuration/bank-info-service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import { BankInfoModel } from "../../models/configuration/BankInfoModel";
import Swal from "sweetalert2";
import { Errors, StatusCode } from "../../utils/constant";
import { toast } from "react-toastify";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { visuallyHidden } from "@mui/utils";

function BankInfo() {
    const intl = useIntl();
    const [institution, setInstitution] = useState<Institution[]>([]);
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [bankInfos, setBankInfos] = useState<BankInfoModel[]>([]);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [bankInfoDetails, setBankInfoDetails] = useState<BankInfoModel>(
        new BankInfoModel()
    );
    const [bankInfoData, setBankInfoData] = useState<BankInfoModel>();
    const [editedId, setEditedId] = useState<number | undefined>(0);
    const [isBankCodeDisabled, setIsBankCodeDisabled] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<BankInfoModel>({
        mode: "onChange",
        resolver: yupResolver(validations.createBankInfoValidations),
    });

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof BankInfoModel>('bankCode');

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
        property: keyof BankInfoModel
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */

    const handleClickOpen = (isEdit: boolean) => {
        if (!isEdit) {
            handleReset();
        }
        checkDisabled(false);
        setOpen(true);
        clearErrors();
    };

    const handleReset = (): void => {
        reset(new BankInfoModel());
        setBankInfoDetails(new BankInfoModel());
    };

    const handleClose = () => {
        setOpen(false);
    };

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
        getAllBankInfosByInstitutionId(instID);
    };

    const setInstitutefromBankInfo = async () => {
        // const instID = bankInfoData?.institutionId;
        // if (instID) {
        //     setSelectInstitutionVal(instID);
        // }
    };

    const getBankInfoById = async (id: number) => {
        BankInfoService.getBankInfoById(id)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                reset(data);
                setBankInfoData(data);
                setInstitutefromBankInfo();
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const editBankInfo = async (id: number) => {
        handleClickOpen(true);
        setEditedId(id);
        getBankInfoById(id);
        checkDisabled(true);
    };

    const getAllBankInfosByInstitutionId = async (id: string | "") => {
        await BankInfoService.getAllBankInfoByInstitution(id)
            .then((res) => {
                setBankInfos([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
        const selectedInstitutionId =
            event.target.value !== ""
                ? event.target.value
                : institution[0].institutionId;
        getAllBankInfosByInstitutionId(event.target.value);
    };

    const onDelete = (id: number) => {
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
                BankInfoService.deleteBankInfo(id).then((res) => {
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
                    getAllBankInfosByInstitutionId(selectInstitutionVal);
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
    };

    const onSubmit = async (value: BankInfoModel) => {
        const model = {
            bankCodeId: value.bankCodeId ? value.bankCodeId : 0,
            bankName: value.bankName,
            altBankName: value.altBankName,
            bankCode: value.bankCode,
            swiftCode: value.swiftCode ? value.swiftCode : '',
            institutionId: value.institutionId ? value.institutionId : selectInstitutionVal,
            institutionName: "test"
        };
        await BankInfoService.saveOrUpdateBankInfo(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    navigate(`/bankcode`);

                    if (editedId) {
                        toast.success("Record updated successfully");
                    } else {
                        toast.success("Record added successfully");
                    }
                }
                handleClose();
                getAllBankInfosByInstitutionId(model.institutionId);
            })
            .catch((err) => {
                // if (err && err?.response?.status === 400) {
                //     if (err.response.data.errors[0] === 'CFG-314') {
                //         toast.error("Bank Code already exists");
                //     }
                // } else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.IdAlreadyExists
                // ) {
                //     toast.error(Errors.IdAlreadyExists);
                // }
                // else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.uniqueBankInfo
                // ) {
                //     toast.error(Errors.uniqueBankInfo)
                // }
                // else {
                    toast.error(err.response.data.errors[0]);
               // }
            });
    };

    const checkDisabled = (isEdit: boolean) => {
        if (isEdit) {
            setIsBankCodeDisabled(true);
        }
        else {
            setIsBankCodeDisabled(false);
        }
    }

    useEffect(() => {
        InstitutionService.getActiveInstitution()
            .then((response: { data: any }) => {
                setInstitutions(response.data);
            })
            .catch((error: any) => {
                console.log(error);
            });

        setInstitutefromLocalStorage();

    }, []);
    return (
        <>
            <div className="wrapper">
                <main className="main-content">
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "BankInfo.title",
                                        defaultMessage: "Banks",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "BankInfo.subTitle",
                                        defaultMessage: "List of defined Banks",
                                    })}
                                </p>
                            </div>

                            <div className="right-block">
                                <Button
                                    sx={{ mt: 4 }}
                                    variant="contained"
                                    disableElevation
                                    className="btn-light"
                                    endIcon={<img src={add_rounded} alt="add" />}
                                    onClick={() => handleClickOpen(false)}
                                >
                                    <FormattedMessage
                                        id="BankInfo.addBtn"
                                        defaultMessage="Add Bank"
                                    />
                                </Button>
                            </div>
                        </div>
                        <Grid spacing={3} container>
                            <Grid item xs={12} lg={4} sm={6} xl={4}>
                                <div className="input-with-label form-group">
                                    <label>
                                        {intl.formatMessage({
                                            id: "Institution.label",
                                            defaultMessage: "Institution",
                                        })}
                                    </label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={selectInstitutionVal}
                                            onChange={handleInstitutionChange}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                            IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                        >

                                            {institutions &&
                                                institutions.length > 0 &&
                                                institutions.map((type) => {
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
                        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="simple table" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'bankCode'}
                                                direction={orderBy === 'bankCode' ? order : 'asc'}
                                                onClick={() => createSortHandler("bankCode")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "BankInfo.bankCode",
                                                        defaultMessage: "Bank Code"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'bankName'}
                                                direction={orderBy === 'bankName' ? order : 'asc'}
                                                onClick={() => createSortHandler("bankName")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "BankInfo.bankName",
                                                        defaultMessage: "Bank Name"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "BankInfo.atlBankName",
                                                defaultMessage: "Alternative Bank Name",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "BankInfo.swiftCode",
                                                defaultMessage: "Swift Code",
                                            })}
                                        </TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border-header">
                                            {intl.formatMessage({
                                                id: "BankInfo.actions",
                                                defaultMessage: "Actions",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {bankInfos.sort(getComparator(order, orderBy)).map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.bankCode}</TableCell>
                                            <TableCell>{row.bankName}</TableCell>
                                            <TableCell>{row.altBankName}</TableCell>
                                            <TableCell>{row.swiftCode}</TableCell>
                                            <TableCell align="center" width="190px" className="last-column-border">
                                                <div className="action btns-block">
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => editBankInfo(row.bankCodeId)}
                                                    >
                                                        <img src={edit_ic} alt="mail" />
                                                    </IconButton>
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => onDelete(row.bankCodeId)}
                                                    >
                                                        <img src={delete_ic} alt="mail" />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {bankInfos &&
                                        bankInfos.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="last-column-border">
                                                    <p style={{ textAlign: "center" }}>
                                                        {intl.formatMessage({
                                                            id: "BankInfo.noDataFound",
                                                            defaultMessage: "No Data Found.",
                                                        })}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </main>

                <Dialog open={open} onClose={handleClose} className="c-dialog">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogTitle component={"div"}>
                            <div className="title-block mb-0">
                                <div className="left-block mb-0">
                                    <Typography variant={"h2"}>
                                        {intl.formatMessage({
                                            id: "BankInfo.definitionTitle",
                                            defaultMessage: "Bank Info Definition",
                                        })}
                                    </Typography>
                                    <p className="pb-0">
                                        {intl.formatMessage({
                                            id: "BankInfo.definitionSubTitle",
                                            defaultMessage: "Add/Update Bank Info",
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
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "Institution.label",
                                                    defaultMessage: "Institution",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    disabled
                                                    {...register("institutionId")}
                                                    value={selectInstitutionVal}
                                                    onChange={handleInstitutionChange}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                >
                                                    <MenuItem value="">
                                                        <em>
                                                            {intl.formatMessage({
                                                                id: "Institution.selecteddropdown",
                                                                defaultMessage: "Default Institution selected",
                                                            })}
                                                        </em>
                                                    </MenuItem>
                                                    {institutions &&
                                                        institutions.length > 0 &&
                                                        institutions.map((type) => {
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
                                    <Grid item xs={12} sm={6}>
                                        <div className="form-group input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "BankInfoDetails.bankCode",
                                                    defaultMessage: "Bank Code",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "BankInfoDetails.enterBankCodePlaceholder",
                                                        defaultMessage: "Write Bank Code",
                                                    })}
                                                    disabled={isBankCodeDisabled}
                                                    error
                                                    fullWidth
                                                    id="bankCode"
                                                    autoComplete="off"
                                                    inputProps={{
                                                        maxLength: 10,
                                                    }}
                                                    aria-describedby="error-helper-text"
                                                    {...register("bankCode")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.bankCode?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "BankInfoDetails.bankName",
                                                    defaultMessage: "Bank Name",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "BankInfoDetails.enterBankNamePlaceholder",
                                                        defaultMessage: "Write Bank Name",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="bankName"
                                                    autoComplete="off"
                                                    inputProps={{ maxLength: 50 }}
                                                    aria-describedby="error-helper-text"
                                                    {...register("bankName")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.bankName?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "BankInfoDetails.altBankName",
                                                    defaultMessage: "Alternative Bank Name",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "BankInfoDetails.enteraltBankNamePlaceholder",
                                                        defaultMessage: "Write Alternative Bank Name",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="altBankName"
                                                    autoComplete="off"
                                                    inputProps={{ maxLength: 100 }}
                                                    aria-describedby="error-helper-text"
                                                    {...register("altBankName")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.altBankName?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} style={{marginTop: '20px'}}>
                                        <div className="form-group input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "BankInfoDetails.swiftCode",
                                                    defaultMessage: "Swift Code",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "BankInfoDetails.enterSwiftCodePlaceholder",
                                                        defaultMessage: "Write Swift Code",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="swiftCode"
                                                    autoComplete="off"
                                                    inputProps={{
                                                        maxLength: 15,
                                                    }}
                                                    aria-describedby="error-helper-text"
                                                    {...register("swiftCode")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.swiftCode?.message}
                                                </FormHelperText>
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
                                <FormattedMessage
                                    id="BankInfo.cancel"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                            <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                                <FormattedMessage id="BankInfo.save" defaultMessage="Save" />
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

            </div>
        </>
    );
}

export default BankInfo;