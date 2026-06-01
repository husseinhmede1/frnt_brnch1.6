import {
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import Swal from "sweetalert2";
import { Errors, StatusCode } from "../../utils/constant";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { AccountingTemplateHDRService, AccountingTemplateSubheaderService } from "../../services/configuration/accounting-template-hdr-service";
import { AccountingTemplateSubHeader } from "../../models/configuration/AccountingTemplateDetailsModel";

function AccountingTemplateBank() {
    const { id } = useParams<{ id?: any }>();
    const { institutionId } = useParams<{ institutionId?: any }>();

    const intl = useIntl();
    const navigate = useNavigate();
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [accountingTemplateDetails, setAccountingTemplateDetails] = useState<AccountingTemplateSubHeader[]>([]);
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");

    const {
        register: registerTemplate,
        handleSubmit,
        reset: resetTemplate,
        formState: { errors, isSubmitting },
    } = useForm<AccountingTemplateSubHeader>({
        mode: "onChange",
        resolver: yupResolver(validations.accountingTemplateSubHDRValidations),
    });

    const getAccountingTemplateHDRById = async () => {
        AccountingTemplateHDRService.getAccountingTemplateHDRById(id)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                resetTemplate({ templateCode: res.data?.accountTemplate, tenplateDescription: res.data?.templateDescription });
                setSelectInstitutionVal(data.institutionId);
            })
            .catch((err) =>           toast.error(err.response.data.errors[0])
            );
    };


    const getAllAccountingTemplateDetailsByAccountingTemplateHDRId = async () => {
        AccountingTemplateSubheaderService.getAllAccountingTemplateHDRSubByAccrTemplateHdrSubId(id)
            .then((res) => {
                setAccountingTemplateDetails([...res.data]);
            })
            .catch((err) =>           toast.error(err.response.data.errors[0])
            );
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
    };

    const editAccountingTemplateSubheader = (subheader: AccountingTemplateSubHeader) => {
        if(subheader.bankCode === null) {
            navigate(`/accounting-subheader-details/${selectInstitutionVal}/${id}/${subheader.acctTemplateHdrSubId}/DEFAULT/${subheader.tenplateDescription}`);
        } else {
            navigate(`/accounting-subheader-details/${selectInstitutionVal}/${id}/${subheader.acctTemplateHdrSubId}/${subheader.bankCode}/${subheader.tenplateDescription}`);
        }
       
    }

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
                AccountingTemplateSubheaderService.deleteAccountingTemplateSubHDR(id).then((res) => {
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
                    getAllAccountingTemplateDetailsByAccountingTemplateHDRId();
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

    useEffect(() => {
        if (id) {
            getAccountingTemplateHDRById();
            getAllAccountingTemplateDetailsByAccountingTemplateHDRId();
            InstitutionService.getActiveInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
          toast.error(error.response.data.errors[0])
                });
        }
        else {
            InstitutionService.getActiveInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
          toast.error(error.response.data.errors[0])
                });

            setSelectInstitutionVal(institutionId);
        }
    }, [id]);

    const onSubmit = (values: AccountingTemplateSubHeader) => {
        let model = {
            accountTemplate: values.templateCode,
            acctTemplateHdrId: id ?? 0,
            institutionId: selectInstitutionVal,
            templateDescription: values?.tenplateDescription
        }

        AccountingTemplateHDRService.saveAccountingTemplateHDR(model).then(res => {
            if (res.status === StatusCode.Success) {
                if(id) {
                    toast.success("Accounting template header updated successfully");
                } else {
                    toast.success("Accounting template header added successfully");
                }
                navigate(
                    `/accounting-details/${res.data?.acctTemplateHdrId}`,
                    { replace: true }
                )
            }
        }).catch((err) => {
            // if (err && err?.response?.status === 400) {
            //     if (err.response.data.errors[0] === 'CFG-287') {
            //         toast.error("Accounting Template HDR already exists");
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
    }

    return (
        <div className="wrapper">
            <main className="main-content">
                <div className="main-card">
                    <div className="title-block">
                        <div className="left-block">
                            <Typography variant={"h2"}>
                                {intl.formatMessage({
                                    id: "AccountingTemplate.title",
                                    defaultMessage: "Accounting Template Definition",
                                })}
                            </Typography>
                            <p className="pb-0">
                                {intl.formatMessage({
                                    id: "AccountingTemplate.subTitle",
                                    defaultMessage: "Add/Update Accounting Template",
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
                                disabled={id ? false : true}
                                id="addBtn"
                                // onClick={() => handleClickOpen(false)}
                                onClick={() => navigate(`/accounting-subheader-details/${selectInstitutionVal}/${id}`)}
                            >
                                <FormattedMessage
                                    id="AccountingTemplate.addbankspec."
                                    defaultMessage="Add Bank Spec."
                                />
                            </Button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-elements">
                            <Grid spacing={3} container className="compact-grid">
                                <Grid item xs={12} lg={6} xl={4}>
                                    <div className="form-group input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "Institution.label",
                                                defaultMessage: "Institution",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                {...registerTemplate("institutionId")}
                                                value={selectInstitutionVal}
                                                onChange={handleInstitutionChange}
                                                // disabled
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
                                            <FormHelperText id="error-helper-text" error>
                                                {/* {detailsErrors.institutionId?.message} */}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid spacing={3} container className="compact-grid">
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <div className="form-group input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "AcountingTemplate.templatecode",
                                                defaultMessage: "Template Code",
                                            })}<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                disabled={id ? true : false}
                                                placeholder={intl.formatMessage({
                                                    id: "AcountingTemplate.writeyourtemplatecode",
                                                    defaultMessage: "Write your template code",
                                                })}
                                                error
                                                fullWidth
                                                id="templateDesc"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                inputProps={{ maxLength: 10 }}
                                                {...registerTemplate("templateCode")}
                                            />

                                            <FormHelperText id="error-helper-text" error>
                                                {errors.templateCode?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid spacing={3} container className="compact-grid">
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <div className="form-group input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "AcountingTemplate.templatedescription",
                                                defaultMessage: "Template Description",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "AcountingTemplate.writeyourtemplatedescription",
                                                    defaultMessage: "Write your template description",
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
                                                {errors.tenplateDescription?.message}
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
                                                    id: "AccountingTemplateDetails.bankcode",
                                                    defaultMessage: "Bank Code",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateDetails.description",
                                                    defaultMessage: "Description",
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
                                                <TableCell>{row.bankCode === null ?  "DEFAULT" :  row.bankCode}</TableCell>
                                                <TableCell>{row.tenplateDescription}</TableCell>
                                                <TableCell align="center" width="190px" className="sticky-table column last-column-border">
                                                    <div className="action btns-block">
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => editAccountingTemplateSubheader(row)}
                                                        >
                                                            <img src={edit_ic} alt="mail" />
                                                        </IconButton>
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => onDelete(row.acctTemplateHdrSubId)}
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
                                onClick={() => navigate("/accounting-template")}
                            >
                                <FormattedMessage
                                    id="AccountingTemplateHdr.cancel"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                <FormattedMessage
                                    id="AccountingTemplateHdr.save"
                                    defaultMessage="Save"
                                />
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div >
    )
}
export default AccountingTemplateBank;