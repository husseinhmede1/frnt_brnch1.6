import {
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
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    FormHelperText,
    Radio,
    RadioGroup,
    FormControlLabel
} from "@mui/material";
import {
    add_rounded,
    delete_ic,
    down_arrow_icon,
    edit_ic
} from "../../assets/images";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import Swal from "sweetalert2";
import { Errors, StatusCode, TRANS_USAGE } from "../../utils/constant";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { AccountingTemplateDetailsModel, AccountingTemplateSubHeader } from "../../models/configuration/AccountingTemplateDetailsModel";
import { AccountingTemplateDetailsService } from "../../services/configuration/accounting-template-details-service";
import { TransactionService } from "../../services/configuration/transaction-service";
import { TransactionsModel } from "../../models/configuration/TransactionGroupModel";
import { InstitutionAccountsModel } from "../../models/configuration/InstitutionAccountsModel";
import { InstitutionAccountsService } from "../../services/configuration/institution-accounts-service";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { BankInfoModel } from "../../models/configuration/BankInfoModel";
import { BankInfoService } from "../../services/configuration/bank-info-service";
import React from "react";
import { AccountingTemplateSubheaderService } from "../../services/configuration/accounting-template-hdr-service";

function AccountingTemplateDetails() {
    const { instId, headerId, subId, bankCode, desc } = useParams<{ instId?: string, headerId?: string, subId?: string, bankCode?: string, desc?: string }>();

    const intl = useIntl();
    const navigate = useNavigate();
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [accountingTemplateDetails, setAccountingTemplateDetails] = useState<AccountingTemplateDetailsModel[]>([]);
    const [open, setOpen] = useState(false);
    const [accountingTemplateDetailsData, setAccountingTemplateDetailsData] = useState<AccountingTemplateDetailsModel>();
    const [transactions, setTransactions] = useState<TransactionsModel[]>([]);
    const [accountTypes, setAccountTypes] = useState<string[]>([]);
    const [accountOrigins, setAccountOrigins] = useState<SystemCodeModel[]>([]);
    const [amountTypes, setAmountTypes] = useState<SystemCodeModel[]>([]);
    const [bankList, setBankList] = useState<BankInfoModel[]>([]);
    const [selectedBankCode, setSelectedBankCode] = React.useState<string>("");
    const [percentSrcs, setPercentSrcs] = useState<SystemCodeModel[]>([]);

    const [selectTransaction, setSelectTransaction] = useState("");
    const [selectAccountOrigin, setSelectAccountOrigin] = useState("");
    const [selectSignFlag, setSelectSignFlag] = useState("");
    const [selectAccountType, setSelectAccountType] = useState("");
    const [selectAmountType, setSelectAmountType] = useState("");
    const [selectPercentSrc, setSelectPercentSrc] = useState("");
    const [showFlag, setShowFlag] = useState(0);
    const [selectDestinationInstitution, setSelectDestinationInstitution] = useState("");
    const [isPercentageSourceDisabled, setIsPercentageSourceDisabled] = useState(true);

    const {
        register: registerTemplate,
        handleSubmit: handleSubmitTemplate,
        reset: resetTemplate,
        formState: { errors: templateErrors, isSubmitting: isSubmittingTemplate },
    } = useForm<AccountingTemplateSubHeader>({
        mode: "onChange",
        resolver: yupResolver(validations.createAccountingTemplatesubHDRValidations),
    });

    const {
        register: registerDetails,
        handleSubmit: handleSubmitDetails,
        trigger,
        reset: resetDetails,
        setValue: setValueDetails,
        clearErrors: clearErrorsDetails,
        formState: { errors: detailsErrors, isSubmitting: isSubmittingDetails },
    } = useForm<AccountingTemplateDetailsModel>({
        mode: "all",
        resolver: yupResolver(validations.createAccountingTemplateDetailsValidations),
    });

    const handleClickOpen = (isEdit: boolean) => {
        if (!isEdit) {
            handleReset();
        }
        setOpen(true);
        clearErrorsDetails();
        getDefaultTransactionByInstitutionId();
        getAmountTypesByPrefixAndInstitutionId();
        getPercentSrcsByPrefixAndInstitutionId();
        getAccountOriginsByPrefixAndInstitutionId();
        InstitutionService.getActiveInstitution()
            .then((response: { data: any }) => {
                setInstitutions(response.data);
            })
            .catch((error: any) => {
          toast.error(error.response.data.errors[0])
            });
    };

    const handleReset = (): void => {
        resetDetails(new AccountingTemplateDetailsModel());
        setSelectAccountType("");
        setSelectAmountType("");
        setSelectTransaction("");
        setSelectSignFlag("");
        setSelectAccountOrigin("");
        setInputValue("");
        setSelectDestinationInstitution("");
        setSelectPercentSrc("");
        setShowFlag(0);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectAccountType("");
        setSelectAmountType("");
        setSelectTransaction("");
        setSelectSignFlag("");
        setSelectAccountOrigin("");
        setInputValue("");
        setSelectDestinationInstitution("");
        setSelectPercentSrc("");
        setShowFlag(0);
        setIsPercentageSourceDisabled(true);
        setAccountingTemplateDetailsData(new AccountingTemplateDetailsModel());
    };

    const getPercentSrcsByPrefixAndInstitutionId = async () => {
        SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("PERCENT_SRC", "SYSTEM")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setPercentSrcs(data);
            })
            .catch((err) =>          toast.error(err.response.data.errors[0])
            );
    }

    const getAmountTypesByPrefixAndInstitutionId = async () => {
        SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("AMOUNT_TYPE", "SYSTEM")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setAmountTypes(data);
            })
            .catch((err) =>           toast.error(err.response.data.errors[0])
            );
    }

    const getAccountOriginsByPrefixAndInstitutionId = async () => {
        SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("ACCOUNT_ORIGIN", "SYSTEM")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setAccountOrigins(data);
            })
            .catch((err) =>           toast.error(err.response.data.errors[0])
            );
    }

    const getDefaultTransactionByInstitutionId = async () => {
        let model = {
            transactionId: 0,
            transUsage: `${TRANS_USAGE.TRANS},${TRANS_USAGE.ACTFEE}`,
            institutionId: instId as string,
            description: "",
            signFlag: "",
            updateFlag: ""
        }
        TransactionService.getDefaultTransactionIdByTransUsage(model)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setTransactions(data);
            })
            .catch((err) =>          toast.error(err.response.data.errors[0])
            );
    }

    const getDistinctAccountTypes = async (destInst: string, accountOrigin: string) => {
        let model = {
            institutionId: instId,
            chargingInstitution: destInst,
            bankCode: bankCode,
            accountOrigin: accountOrigin
        }
        InstitutionAccountsService.getDistinctAccountTypes(model)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setAccountTypes(data);
            })
            .catch((err) =>           toast.error(err.response.data.errors[0])
            );
    }

    useEffect(() => {
        if ((selectAmountType === "AMT" && selectAccountOrigin === "I")) {
            setValueDetails("destinationInstitution", instId as string, { shouldValidate: true });
            //setSelectDestinationInstitution(instId as string);
            setInputValue("");
            getDistinctAccountTypes(instId as string, selectAccountOrigin);
        }
        else if (selectAmountType === "COM" && selectAccountOrigin === "I") {
            var inst = selectDestinationInstitution !== null ? selectDestinationInstitution : "";
            getDistinctAccountTypes(inst as string, selectAccountOrigin);
        }
        else if ((selectAmountType === "DCC" && selectAccountOrigin === "I") ||
            (selectAmountType === "MKP" && selectAccountOrigin === "I")
        ) {
            setSelectAccountType("");
            setInputValue("");
            //setSelectDestinationInstitution("");
            setValueDetails("accountType", "");
        }
        else if ((selectAmountType === "AMT" && selectAccountOrigin === "M") ||
            (selectAmountType === "COM" && selectAccountOrigin === "M") ||
            (selectAmountType === "DCC" && selectAccountOrigin === "M") ||
            (selectAmountType === "MKP" && selectAccountOrigin === "M")
        ) {
            setSelectAccountType("");
            setInputValue("");
           // setSelectDestinationInstitution("");
            setValueDetails("accountType", "");
        } else if (selectAmountType === "COM" && selectAccountOrigin === "B") {
            getDistinctAccountTypes("", selectAccountOrigin);
           // setSelectDestinationInstitution("");
        }
    }, [selectAccountOrigin, selectAmountType])

    useEffect(() => {
        BankInfoService.getAllBankInfoByInstitution(instId as string).then(res => {
            if (res.status === StatusCode.Success && res.data?.length > 0) {
                setBankList([...res.data]);
            }
        }).catch((error: any) => {
                     toast.error(error.response.data.errors[0])
           
        });
    }, [])

    useEffect(() => {
        if (subId) {
            getAccoutingTemplateDetails(subId);
            resetTemplate({ bankCode: bankCode, tenplateDescription: desc })
            setSelectedBankCode(bankCode as string);
        }
    }, [subId, resetTemplate, bankCode, desc])

    const getAccoutingTemplateDetails = (subId: string) => {
        AccountingTemplateDetailsService.getAllAccountingTemplateDetailsByAccountingTemplateHDRSubId(Number(subId)).then(res => {
            if (res.status === StatusCode.Success && res.data.length > 0) {
                setAccountingTemplateDetails([...res.data])
            }
            else {
                setAccountingTemplateDetails([])
            }
        }).catch((error: any) => {
          toast.error(error.response.data.errors[0])
        });
    }

    const [inputValue, setInputValue] = useState('');

    const getAccountingTemplateDetailsById = async (id: number) => {
        AccountingTemplateDetailsService.getAccountTemplateDetailsById(id)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                resetDetails(data);
                setAccountingTemplateDetailsData(data);
                setSelectAccountType(res.data.accountType);
                setSelectAmountType(res.data.amountType);
                setSelectTransaction(res.data.transId);
                setSelectSignFlag(res.data.signFlag);
                setSelectAccountOrigin(res.data.accountOrigin);
                setSelectDestinationInstitution(res.data.destinationInstitution != null ? res.data.destinationInstitution : "");
                setInputValue(res.data.percentageApplied.toString());
                setSelectPercentSrc(res.data.percentSrc != null ? res.data.percentSrc : "");
                setShowFlag(res.data.show != null ? res.data.show : 0);
                setIsPercentageSourceDisabled(res.data.amountType === "COM" ? false : true);
            })
            .catch((err) =>          toast.error(err.response.data.errors[0])
            );
    };

    const editAccountingTemplateDetails = async (id: number) => {
        handleClickOpen(true);
        getAccountingTemplateDetailsById(id);
    };

    const onSubmitAccountingTemplateDetails = async (value: AccountingTemplateDetailsModel) => {
        const model = {
            acctTemplateDtlId: accountingTemplateDetailsData?.acctTemplateDtlId ? accountingTemplateDetailsData?.acctTemplateDtlId : 0,
            acctTemplateHdrSubId: subId ?? 0,
            institutionId: instId,
            transId: selectTransaction !== "" ? selectTransaction : "",
            accountOrigin: selectAccountOrigin,
            destinationInstitution: selectDestinationInstitution !== "" ? selectDestinationInstitution : "",
            accountType: selectAccountType !== "" ? selectAccountType : "",
            amountType: selectAmountType,
            percentageApplied: parseFloat(inputValue) ? parseFloat(inputValue) : 0,
            signFlag: selectSignFlag !== "" ? selectSignFlag : "",
            lineDescription: value.lineDescription,
            show: value.show,
            percentSrc: selectPercentSrc
        };

        if (selectAmountType === "AMT" && selectAccountOrigin === "I") {
            setSelectTransaction("");
            //setSelectSignFlag("");
            setInputValue("");
        }

        if ((selectAmountType === "AMT" && selectAccountOrigin === "M") ||
            (selectAmountType === "COM" && selectAccountOrigin === "M")
        ) {
            setSelectAccountType("");
            setSelectTransaction("");
            //setSelectSignFlag("");
            setInputValue("");
        }

        console.log(model);
        await AccountingTemplateDetailsService.saveAccountingTemplateDetails(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    handleClose();
                    if (model.acctTemplateDtlId !== 0) {
                        toast.success("Accounting Template details updated successfully");
                    } else {
                        toast.success("Accounting Template Details record added successfully");
                    }
                    getAccoutingTemplateDetails(subId as string);
                    setAccountingTemplateDetailsData(new AccountingTemplateDetailsModel());
                }
            })
            .catch((err) => {
                // if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.IdAlreadyExists
                // ) {
                //     toast.error(Errors.IdAlreadyExists);
                // }
                // else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.uniqueIssuerRelation
                // ) {
                //     toast.error(Errors.uniqueIssuerRelation)
                // }
                // else {
                //       toast.error(err.response.data.errors[0])
                // }
                toast.error(err.response.data.errors[0])

            });
    };

    const onSubmit = async (value: any) => {
        const model = {
            acctTemplateHdrId: headerId ? Number(headerId) : 0,
            acctTemplateHdrSubId: subId ? Number(subId) : 0,
            bankCode: value.bankCode ?? "",
            institutionId: instId ?? "",
            tenplateDescription: value.tenplateDescription ?? ""
        };
        console.log(model);
        await AccountingTemplateSubheaderService.saveAccountingTemplateHDRSub(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    console.log(res);
                    if (res.data?.bankCode === "") {
                        navigate(
                            `/accounting-subheader-details/${res.data?.institutionId}/${res.data?.acctTemplateHdrId}/${res.data?.acctTemplateHdrSubId}/DEFAULT/${res.data?.tenplateDescription}`,
                            { replace: true }
                        );
                    }
                    else {
                        navigate(
                            `/accounting-subheader-details/${res.data?.institutionId}/${res.data?.acctTemplateHdrId}/${res.data?.acctTemplateHdrSubId}/${res.data?.bankCode}/${res.data?.tenplateDescription}`,
                            { replace: true }
                        );
                    }
                    if (subId) {
                        toast.success("Accounting Template Sub HDR updated successfully");

                    } else {
                        toast.success("Accounting Template Sub HDR added successfully");
                    }
                }
            })
            .catch((err) => {
                // if (err && err?.response?.status === 400) {
                //     if (err.response.data.errors[0] === 'CFG-327') {
                //         toast.error("Accounting Template HDR Sub already exists");
                //     }
                // } else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.IdAlreadyExists
                // ) {
                //     toast.error(Errors.IdAlreadyExists);
                // } else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.uniqueIssuerProfile
                // ) {
                //     toast.error(Errors.uniqueIssuerProfile)
                // } else {
                //       toast.error(err.response.data.errors[0])
                // }
                toast.error(err.response.data.errors[0])

            });
    };

    const handleAccountOriginChange = (event: SelectChangeEvent) => {
        setSelectAccountOrigin(event.target.value);
        // checkDetailsDisabled(event.target.value, selectAmountType);
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
                AccountingTemplateDetailsService.deleteAccountingTemplateDetails(id).then((res) => {
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
                        getAccoutingTemplateDetails(subId as string);
                    }
                }).catch(err => {
                    if (err && err.response 
                    //    && err.response.data === Errors.ReferenceExists
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

    return (
        <div className="wrapper">
            <main className="main-content">
                <div className="main-card">
                    <div className="title-block">
                        <div className="left-block">
                            <Typography variant={"h2"}>
                                {intl.formatMessage({
                                    id: "AccountingTemplate.accountingtemplatebank",
                                    defaultMessage: "Accounting Template Bank",
                                })}
                            </Typography>
                            <p className="pb-0">
                                {intl.formatMessage({
                                    id: "AccountingTemplate.add/updateaccountingtemplatedetails",
                                    defaultMessage: "Add/Update Accounting Template Details",
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
                                disabled={subId ? false : true}
                                id="addBtn"
                                onClick={() => handleClickOpen(false)}
                            >
                                <FormattedMessage
                                    id="AccountingTemplate.addBtn"
                                    defaultMessage="Add Details"
                                />
                            </Button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmitTemplate(onSubmit)}>
                        <div className="input-elements">
                            <Grid spacing={3} container className="compact-grid">
                                <Grid item xs={12} lg={4} xl={3}>
                                    <div className="form-group input-with-label">
                                        <label className="lg" style={{ minWidth: "100px" }}>
                                            {intl.formatMessage({
                                                id: "BankSpecification.label",
                                                defaultMessage: "Bank",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl sx={{ width: "50%" }}>
                                            <Select
                                                {...registerTemplate("bankCode")}
                                                value={selectedBankCode}
                                                onChange={(event: any) => setSelectedBankCode(event.target.value)}
                                                disabled={subId ? true : false}
                                                fullWidth
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                            >
                                                <MenuItem value="">{intl.formatMessage({ id: "BankSpecification.selectbank", defaultMessage: "Select Bank" })}</MenuItem>
                                                {/* <MenuItem key="DEFAULT" value="DEFAULT">DEFAULT</MenuItem> */}
                                                {bankList &&
                                                    bankList.length > 0 &&
                                                    bankList.map((type: BankInfoModel) => {
                                                        return (
                                                            <MenuItem
                                                                key={type.bankCodeId}
                                                                value={type.bankCode}
                                                            >
                                                                {type.bankName}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            {
                                                selectedBankCode === "" && templateErrors.bankCode?.message &&
                                                <FormHelperText id="error-helper-text" error>
                                                    {validations?.AccTemplateSubHDRValidationMsg?.bankCode}
                                                </FormHelperText>
                                            }
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={4}>
                                    <div className="form-group input-with-label">
                                        <label className="lg" >
                                            {intl.formatMessage({
                                                id: "Mcc.description",
                                                defaultMessage: "Description",
                                            })} <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "Mcc.descriptionPlaceholder",
                                                    defaultMessage: "Write your description",
                                                })}
                                                error
                                                fullWidth
                                                id="templateDesc"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                inputProps={{ maxLength: 50 }}
                                                {...registerTemplate("tenplateDescription")}
                                            />

                                            <FormHelperText id="error-helper-text" error>
                                                {templateErrors.tenplateDescription?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <div className="table-container" style={{ marginBottom: '24px' }}>
                            <TableContainer className="has-vertical-scroll">
                                <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="simple table" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.transaction",
                                                    defaultMessage: "Transaction",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.accountOrigin",
                                                    defaultMessage: "Account Origin",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.destinationInstitution",
                                                    defaultMessage: "Destination Institution",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.accountType",
                                                    defaultMessage: "Account Type",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.amountType",
                                                    defaultMessage: "Amount Type",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.percentageApplied",
                                                    defaultMessage: "Percentage Applied",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.signFlag",
                                                    defaultMessage: "Sign Flag",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.lineDescription",
                                                    defaultMessage: "Line Description",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.PercentageSource",
                                                    defaultMessage: "Percentage Source",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.Show",
                                                    defaultMessage: "Show Flag",
                                                })}
                                            </TableCell>
                                            <TableCell align="center" width="190px" className="sticky-table head last-column-border-header">
                                                {intl.formatMessage({
                                                    id: "IssuerRelation.actions",
                                                    defaultMessage: "Actions",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {accountingTemplateDetails && accountingTemplateDetails.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{row.transId}</TableCell>
                                                <TableCell>{row.accountOrigin}</TableCell>
                                                <TableCell>{row.destinationInstitutionName}</TableCell>
                                                <TableCell>{row.accountType}</TableCell>
                                                <TableCell>{row.amountType}</TableCell>
                                                <TableCell>{row.percentageApplied}</TableCell>
                                                <TableCell>{row.signFlag}</TableCell>
                                                <TableCell>{row.lineDescription}</TableCell>
                                                <TableCell>{row.percentSrc}</TableCell>
                                                <TableCell>{row.show === 1 ? "Yes" : "No"}</TableCell>
                                                <TableCell align="center" width="190px" className="sticky-table column last-column-border">
                                                    <div className="action btns-block">
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => editAccountingTemplateDetails(row.acctTemplateDtlId)}
                                                        >
                                                            <img src={edit_ic} alt="mail" />
                                                        </IconButton>
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => onDelete(row.acctTemplateDtlId)}
                                                        >
                                                            <img src={delete_ic} alt="mail" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {accountingTemplateDetails &&
                                            accountingTemplateDetails.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={13} className="last-column-border">
                                                        <p style={{ textAlign: "center" }}>
                                                            {intl.formatMessage({
                                                                id: "AccountingTemplateDetails.noDataFound",
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
                        <div className="btns-block right">
                            <Button
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate(-1)}
                            >
                                <FormattedMessage
                                    id="AccountingTemplateHdr.cancel"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                            <Button type="submit" variant="contained" disabled={isSubmittingTemplate}>
                                <FormattedMessage
                                    id="AccountingTemplateHdr.save"
                                    defaultMessage="Save"
                                />
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            <Dialog open={open} onClose={handleClose} className="c-dialog">
                <form onSubmit={handleSubmitDetails(onSubmitAccountingTemplateDetails)}>
                    <DialogTitle component={"div"}>
                        <div className="title-block mb-0">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "AccountingTemplateDetails.definitionTitle",
                                        defaultMessage: "Accounting Template Details",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "AccountingTemplateDetails.definitionSubTitle",
                                        defaultMessage: "Add/Edit Template Details",
                                    })}
                                </p>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="inner-card">
                            <Grid spacing={2} container>
                                <Grid item xs={18} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "AccountingTemplateDetails.lineDescription",
                                                defaultMessage: "Line Description",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "AccountingTemplateDetails.enterlineDescriptionPlaceholder",
                                                    defaultMessage: "Write line description",
                                                })}
                                                error
                                                fullWidth
                                                id="lineDescription"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                inputProps={{ maxLength: 50 }}
                                                {...registerDetails("lineDescription")}
                                            />

                                            <FormHelperText id="error-helper-text" error>
                                                {detailsErrors.lineDescription?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "AccountOrigin.label",
                                                defaultMessage: "Account Origin",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                {...registerDetails("accountOrigin")}
                                                value={selectAccountOrigin}
                                                onChange={handleAccountOriginChange}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => (
                                                    <img src={down_arrow_icon} alt="" />
                                                )}
                                            >
                                                <MenuItem disabled value="">{intl.formatMessage({ id: "accountingTemplateDetails.selectAccountOrigin", defaultMessage: "Select Account Origin" })}</MenuItem>
                                                {accountOrigins &&
                                                    accountOrigins.length > 0 &&
                                                    accountOrigins.map((type) => {
                                                        return (
                                                            <MenuItem
                                                                key={type.systemCodeId}
                                                                value={type.codeSuffix}
                                                            >
                                                                {type.codeSuffix}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            {
                                                (selectAccountOrigin === "" || selectAccountOrigin === undefined) && detailsErrors.accountOrigin?.message &&
                                                <FormHelperText id="error-helper-text" error>
                                                    {detailsErrors.accountOrigin?.message}
                                                </FormHelperText>
                                            }
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "Transaction.label",
                                                defaultMessage: "Transaction",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                {...registerDetails("transId")}
                                                value={selectTransaction}
                                                onChange={(event) => setSelectTransaction(event.target.value)}
                                                // disabled={
                                                //     selectAmountType === "AMT" && (selectAccountOrigin === "M" || selectAccountOrigin === "I") ?
                                                //         true
                                                //         : (selectAmountType === "COM" && selectAccountOrigin === "M") ?
                                                //             true
                                                //             : false
                                                // }
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => (
                                                    <img src={down_arrow_icon} alt="" />
                                                )}
                                            >
                                                <MenuItem disabled value="">{intl.formatMessage({ id: "accountingTemplateDetails.selectTransaction", defaultMessage: "Select Transaction" })}</MenuItem>
                                                {transactions &&
                                                    transactions.length > 0 &&
                                                    transactions.map((type) => {
                                                        return (
                                                            <MenuItem
                                                                key={type.transactionId}
                                                                value={type.transactionId}
                                                            >
                                                                {type.description}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            {
                                                (selectTransaction === "" || selectTransaction === undefined) && detailsErrors.transId?.message &&
                                                <FormHelperText id="error-helper-text" error>
                                                    {detailsErrors.transId?.message}
                                                </FormHelperText>
                                            }
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "DestinationInstitution.label",
                                                defaultMessage: "Destination Institution",
                                            })}
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                {...registerDetails("destinationInstitution")}
                                                value={selectDestinationInstitution}
                                                onChange={(event) => {
                                                    setSelectDestinationInstitution(event.target.value);
                                                    setSelectAccountType("");
                                                    getDistinctAccountTypes(event.target.value, selectAccountOrigin);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                            >
                                                <MenuItem value="">{intl.formatMessage({ id: "accountingTemplateDetails.selectDestinationInstitution", defaultMessage: "Select Destination Institution" })}</MenuItem>
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
                                            {/* <FormHelperText id="error-helper-text" error>
                                                {detailsErrors.institutionId?.message}
                                            </FormHelperText> */}
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "SignFlag.label",
                                                defaultMessage: "Sign Flag",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                {...registerDetails("signFlag")}
                                                value={selectSignFlag}
                                                onChange={(event) => setSelectSignFlag(event.target.value)}
                                                // disabled={
                                                //     selectAmountType === "AMT" && (selectAccountOrigin === "M" || selectAccountOrigin === "I") ?
                                                //         true
                                                //         : (selectAmountType === "COM" && selectAccountOrigin === "M") ?
                                                //             true
                                                //             : false
                                                // }
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => (
                                                    <img src={down_arrow_icon} alt="" />
                                                )}
                                            >
                                                <MenuItem disabled value="">{intl.formatMessage({ id: "accountingTemplateDetails.selectSignFlag", defaultMessage: "Select Sign Flag" })}</MenuItem>
                                                <MenuItem
                                                    key={"DB"}
                                                    value="DB"
                                                >
                                                    DB
                                                </MenuItem>
                                                <MenuItem
                                                    key={"CR"}
                                                    value="CR"
                                                >
                                                    CR
                                                </MenuItem>
                                            </Select>
                                            {
                                                (selectSignFlag === "" || selectSignFlag === undefined) && detailsErrors.signFlag?.message &&
                                                <FormHelperText id="error-helper-text" error>
                                                    {detailsErrors.signFlag?.message}
                                                </FormHelperText>
                                            }
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={18} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "AccountingTemplateDetails.percentationApplied",
                                                defaultMessage: "Percentage Applied",
                                            })}
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "AccountingTemplateDetails.enterPercentationAppliedPlaceholder",
                                                    defaultMessage: "Enter the percentage applied (e.g., 0.000)",
                                                })}
                                                // disabled={percentageAppliedDisabled}
                                                disabled={
                                                    selectAmountType === "COM" && (selectAccountOrigin === "I" || selectAccountOrigin === "B") ?
                                                        false : true
                                                }
                                                fullWidth
                                                id="percentageApplied"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                type="text"
                                                value={inputValue}
                                                {...registerDetails("percentageApplied")}
                                                onChange={(event) => {
                                                    const { value } = event.target;
                                                    const regex = /^\d{0,4}(\.\d{0,3})?$/;

                                                    if (regex.test(value)) {
                                                        setInputValue(value);
                                                    }
                                                }}
                                            />

                                            <FormHelperText id="error-helper-text" error>
                                                {detailsErrors.percentageApplied?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "AmountType.label",
                                                defaultMessage: "Amount Type",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                {...registerDetails("amountType")}
                                                value={selectAmountType}
                                                onChange={(event) => {
                                                    setSelectAmountType(event.target.value);
                                                    trigger("percentSrc");
                                                    setValueDetails("amountType", event.target.value, { shouldValidate: true });
                                                    setSelectPercentSrc("");
                                                    if (event.target.value === "COM") {
                                                        setIsPercentageSourceDisabled(false);
                                                    } else {
                                                        setIsPercentageSourceDisabled(true);
                                                        setSelectPercentSrc("");
                                                    }
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => (
                                                    <img src={down_arrow_icon} alt="" />
                                                )}
                                            >
                                                <MenuItem disabled value="">{intl.formatMessage({ id: "accountingTemplateDetails.selectAmountType", defaultMessage: "Select Amount Type" })}</MenuItem>
                                                {amountTypes &&
                                                    amountTypes.length > 0 &&
                                                    amountTypes.map((type) => {
                                                        return (
                                                            <MenuItem
                                                                key={type.systemCodeId}
                                                                value={type.codeValue}
                                                            >
                                                                {type.codeSuffix}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            {
                                                (selectAmountType === "" || selectAmountType === undefined) && detailsErrors.amountType?.message &&
                                                <FormHelperText id="error-helper-text" error>
                                                    {detailsErrors.amountType?.message}
                                                </FormHelperText>
                                            }
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "AccountType.label",
                                                defaultMessage: "Account Type",
                                            })}
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                {...registerDetails("accountType")}
                                                value={selectAccountType}
                                                disabled={
                                                    (selectAmountType === "COM" && (selectAccountOrigin === "I" || selectAccountOrigin === "B")) || (selectAmountType === "AMT" && selectAccountOrigin === "I") ?
                                                        false : true
                                                }
                                                onChange={(event) => setSelectAccountType(event.target.value)}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => (
                                                    <img src={down_arrow_icon} alt="" />
                                                )}
                                            >
                                                <MenuItem value="">{intl.formatMessage({ id: "accountingTemplateDetails.selectAccountType", defaultMessage: "Select Account Type" })}</MenuItem>
                                                {accountTypes &&
                                                    accountTypes.length > 0 &&
                                                    accountTypes.map((type) => {
                                                        return (
                                                            <MenuItem
                                                                key={type}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            <FormHelperText id="error-helper-text" error>
                                                {detailsErrors.accountType?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "PercentageSrc.label",
                                                defaultMessage: "Percentage Source",
                                            })}
                                            {!isPercentageSourceDisabled && <span style={{ color: "red" }}>*</span>}
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                {...registerDetails("percentSrc")}
                                                value={selectPercentSrc}
                                                onChange={(event) => {
                                                    setSelectPercentSrc(event.target.value);
                                                    // checkDetailsDisabled(selectAccountOrigin, event.target.value);
                                                }}
                                                displayEmpty
                                                disabled={isPercentageSourceDisabled}
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => (
                                                    <img src={down_arrow_icon} alt="" />
                                                )}
                                            >
                                                <MenuItem value="">{intl.formatMessage({ id: "accountingTemplateDetails.selectPercentageSource", defaultMessage: "Select Percentage Source" })}</MenuItem>
                                                {percentSrcs &&
                                                    percentSrcs.length > 0 &&
                                                    percentSrcs.map((type) => {
                                                        return (
                                                            <MenuItem
                                                                key={type.systemCodeId}
                                                                value={type.codeValue}
                                                            >
                                                                {type.codeSuffix}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            {
                                                selectAmountType === "COM" && selectPercentSrc === "" &&
                                                <FormHelperText id="error-helper-text" error>
                                                    {detailsErrors.percentSrc?.message}
                                                </FormHelperText>
                                            }
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <div className="input-with-label form-group mb-0">
                                        <label className="center lg">
                                            {intl.formatMessage({
                                                id: "AccountingTemplateDetail.show",
                                                defaultMessage: "Show",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <RadioGroup
                                                row
                                                {...registerDetails("show")}
                                                value={showFlag}
                                                onChange={(e) => {
                                                    setShowFlag(Number(e.target.value));
                                                }}
                                            >
                                                <FormControlLabel
                                                    value="1"
                                                    control={<Radio />}
                                                    label="Yes"
                                                />
                                                <FormControlLabel
                                                    value="0"
                                                    control={<Radio />}
                                                    label="No"
                                                />
                                            </RadioGroup>
                                            {detailsErrors.show?.message && (
                                                <FormHelperText id="error-helper-text" error>
                                                    {detailsErrors.show?.message}
                                                </FormHelperText>
                                            )}
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
                                id="AccountingTemplateDetails.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button type="submit" disableElevation variant="contained" disabled={isSubmittingDetails}>
                            <FormattedMessage id="AccountingTemplateDetails.save" defaultMessage="Save" />
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </div >
    )
}
export default AccountingTemplateDetails;