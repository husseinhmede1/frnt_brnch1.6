import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  add_rounded,
  date_ic,
  delete_ic,
  down_arrow_icon,
  edit_ic,
  info_ic,
} from "../../assets/images";
import {
  ActivityFeesPackageModel,
  NoNActivityFeesPackageDefinationModel,
  NoNActivityFeesRecordModel,
} from "../../models/configuration/ActivityFeesPackageModel";
import { CardSchemeModel } from "../../models/configuration/CardSchemeModel";
import { Institution } from "../../models/configuration/InstitutionModel";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { ActivityFeesPackagesService } from "../../services/configuration/activity-fee-service";
import { CardSchemeService } from "../../services/configuration/card-scheme-service";
import { CurrencyService } from "../../services/configuration/currency-service";
import { InstitutionService } from "../../services/configuration/institution-service";
import { NonActivityFeesPackagesService } from "../../services/configuration/nonactivity-fee-service";
import { TerminalTypeService } from "../../services/configuration/terminal-type-service";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { CodePrefix, Errors, StatusCode } from "../../utils/constant";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";

function NonActivityFeesPackagesDefinition() {
  const { id } = useParams<{ id?: any }>();
  const navigate = useNavigate();
  const location: any = useLocation();
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const [chargeValue, setChargeValue] = React.useState("yes");
  const [chargeFirstValue, setChargeFirstValue] = React.useState("yes");
  const selectedInstitutionId =
    location && location.state && location.state.institutionId;

  const [currency, setSelectCurrency] = React.useState("");
  const [transactionList, setTransactionList] = React.useState<any>([]);
  const [currencies, setCurrencies] = React.useState<any>([]);
  const [nonActivityDefinationList, setNonActivityDefinationList] =
    React.useState<NoNActivityFeesPackageDefinationModel[]>();
  const [frequency, setFrequency] = React.useState<SystemCodeModel[]>([]);
  const [chargeList, setChargeList] = React.useState<SystemCodeModel[]>([]);
  const [packageDetails, setPackageDetails] = React.useState<any>({
    packageDetailsId: 0,
  });
  const [institutionList, setInstitutionList] = React.useState<Institution[]>(
    []
  );
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
  
  const [institutionVal, setInstitutionVal] = useState<string>(
    selectedInstitutionId
  );
  const [terminalTypeList, setTerminalTypeList] = useState<any>([]);
  const [selectChargeType, setSelectChargeType] = React.useState("");
  const [chargeTypeId, setChargeTypeId] = React.useState<number | null>(null);
  const [frequencyVal, setFrequencyVal] = React.useState("");
  const [freqSystemCodeId, setFreqSystemCodeId] = React.useState<number | null>(null);
  const [terminalTypeVal, setTerminalTypeVal] = React.useState("");
  const [transactionVal, setTransactionVal] = React.useState("");
  // const [cardSchemeVal, setCardSchemeVal] = useState<string>("");
  const [activityPackageStatus, setActivityPackageStatus] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: recordActivityError, isSubmitting },
  } = useForm<ActivityFeesPackageModel>({
    mode: "onChange",
    resolver: yupResolver(validations.createActivityFeesPackage),
  });
  const [cardSchemes, setCardSchemes] = React.useState<CardSchemeModel[]>([]);

  const {
    register: recordRegister,
    handleSubmit: recordHandleSubmit,
    reset: recordReset,
    watch,
    formState: { errors: recordErrors, isSubmitting: recordIsSubmitting },
    setValue: recordSetValue,
    control,
  } = useForm<NoNActivityFeesRecordModel>({
    mode: "onChange",
    resolver: yupResolver(
      chargeValue === "yes"
        ? validations.createAndUpdateNonActivityValidation
        : validations.createAndUpdateNonActivityValidationforChangeCount
    ),
    defaultValues: {
      isEdit: false
    }
  });

  const getActivityPackageById = async () => {
    NonActivityFeesPackagesService.getNonActivityFeePackageById(id,institutionVal)
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        reset(data);
        setInstitutionVal(data?.institutionId?.toString());
        getAllFrequencyList(data?.institutionId?.toString());
        getAllChargeTypeList(data?.institutionId?.toString());
        getNonActivityDefinationList(data.packageId, data.institutionId);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const changeStatusOnSave = async (event: any) => {
    setActivityPackageStatus(event.target.checked === true ? "1" : "0");
  };

  useEffect(() => {
    if (id) {
      getActivityPackageById();
    }
  }, [id, reset]);

  React.useEffect(() => {
    getAllInstitutionList();
    getAllCurrencyList();
    getAllTerminalTypeList();
    getAllTransactionList();
    getAllCardSchemeList();
        setInstitutefromLocalStorage();

  }, []);
 const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
    }
  }
  const getAllCardSchemeList = async () => {
    await CardSchemeService.getActiveCardScheme()
      .then((res) => {
        setCardSchemes([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllTransactionList = async () => {
    await NonActivityFeesPackagesService.defaultTransactionId()
      .then((res) => {
        setTransactionList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllCurrencyList = async () => {
    await CurrencyService.getActiveCurrencies()
      .then((res) => {
        setCurrencies([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllFrequencyList = async (inst: string) => {
    const model = {
      codePrefix: CodePrefix.FREQUENCY_MASTER,
      institutionId: inst
    }
    await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
      .then((res) => {
        setFrequency([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllTerminalTypeList = async () => {
    await TerminalTypeService.getActive()
      .then((res) => {
        setTerminalTypeList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllChargeTypeList = async (inst: string) => {
    const model = {
      codePrefix: CodePrefix.CHARGE_TYPE_MASTER,
      institutionId: inst
    }
    await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
      .then((res) => {
        setChargeList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getNonActivityDefinationList = async (packageId: string, institutionVal: string) => {
    NonActivityFeesPackagesService.getNonActivityFeePackagesByIdDefination(packageId, institutionVal)
      .then((resDefination) => {
        const definationList = JSON.parse(JSON.stringify(resDefination.data));
        setNonActivityDefinationList(definationList);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllInstitutionList = async () => {
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitutionList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const handleClickOpen = () => {
    recordReset({
      amount: undefined,
      startDate: undefined,
      endDate: undefined,
      maxAmount: undefined,
    });
    setOpen(true);
    setSelectChargeType("");
    setFrequencyVal("");
    setTerminalTypeVal("");
    setTransactionVal("");
    // setCardSchemeVal("");
    setSelectChargeType("");
    setSelectCurrency("");
    setChargeValue("yes");
    setChargeFirstValue("yes");
    setPackageDetails({
      packageDetailsId: 0,
      amount: "",
      startDate: "",
      endDate: "",
    });
    recordSetValue("isEdit", false)
  };

  const handleClose = () => {
    setOpen(false);
    setPackageDetails({
      packageDetailsId: 0,
      amount: "",
      startDate: "",
      endDate: "",
      maxAmount: "",
    });
    recordReset({
      // here all the object
      maxAmount: undefined,
    });
    setSelectChargeType("");
    setChargeValue("");
  };

  const onSubmit = async (value: ActivityFeesPackageModel) => {
    value.institutionId = institutionVal;
    value.updateFlag = id ? '1' : '0';
    value.packageId = value.packageId.toUpperCase();
    await NonActivityFeesPackagesService.saveOrUpdateNonActivityFeePackage(
      value
    )
      .then((res) => {
        if (res.status === StatusCode.Success) {
          navigate(
            `/non-activity-fees-packages-definition/${res?.data?.packageId}`,
            { state: { institutionId: institutionVal } }
          );
          if (id) {
            toast.success(`Non Activity fees package is updated successfully`);
          } else {
            toast.success("Non Activity fees package is added successfully");
          }
        }
      })
      .catch((err) => {
        if (
          err &&
          err.response
        ) {
         toast.error(err.response.data.errors[0])
        }
        else {
            toast.error(err.response.data.errors[0])
        }
      });
  };

  const onSubmitRecord = async (value: NoNActivityFeesRecordModel) => {
    console.log("value", value);
    
    const request = {
      amount: Number(value.amount),
      // assignedTransactionId:
      //   transactionList && transactionList.length > 0
      //     ? (transactionList[0]?.transactionId)
      //     : "",
      // cardSchemeId: value.cardSchemeId,
      chargeCount: value.chargeCount === "yes" ? "Y" : "N",
      chargeFirstTransaction:
        value.chargeFirstTransaction === "yes" ? "Y" : "N",
      chargeMasterId: chargeTypeId,
      currencyId: Number(value.currencyId),
      frequencyId: freqSystemCodeId,
      institutionId: institutionVal,
      maxAmount: value?.chargeCount !== "yes" ? 0 : Number(value.maxAmount),
      numberOfInstallments: Number(value.numberOfInstallments),
      packageDetailsId: Number(packageDetails.packageDetailsId) || 0,
      packageId: id,
      startDate: moment(value.startDate).format("DD/MM/yyyy"),
      endDate: moment(value.endDate).format("DD/MM/yyyy"),
      terminalTypeId: Number(value.terminalTypeId),
      packageLine: Number(packageDetails.packageDetailsId) || 0,
      status: activityPackageStatus
    };
    await NonActivityFeesPackagesService.saveOrUpdateNonActivityFeePackageDefination(
      request
    )
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setPackageDetails(res?.data);
          // navigate(-1);
          if (packageDetails.packageDetailsId > 0) {
            toast.success(
              `Non Activity fees package definition is updated successfully`
            );
          } else {
            toast.success("Non Activity fees package is added successfully");
          }
          // getAllPackageChargeList(res?.data?.packageDetailId);
          if (id) {
            getNonActivityDefinationList(id, institutionVal);
          }
          setOpen(false);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const changeStatus = async (packageDetailsId: any, event: any) => {
    const model = {
      idString: "",
      id: packageDetailsId,
      status: event.target.checked === true ? "1" : "0",
    };
    NonActivityFeesPackagesService.changeStatusDefination(model)
      .then((res) => {
        if (id) {
          getNonActivityDefinationList(id, institutionVal);
        }
        toast.success("Status Changed Successfully")
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const onDeleteChargeDetails = (packageDetailsId: number) => {
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
        NonActivityFeesPackagesService.deleteNonActivityFeePackageDefination(
          packageDetailsId
        ).then((res) => {
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
            });
          }
          // if (Number(id) > 0) {
          //   getNonActivityDefinationList(id, institutionVal);
          // }
          if (res.data) {
            getNonActivityDefinationList(id, institutionVal);
          }
        })
          .catch((err) => {
            if (
              err &&
              err.response
            // &&
            //  err.response.data === Errors.ReferenceExists
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

  const onEditChargeDetails = async (id: number) => {
    console.log("sksksk");
    
    recordSetValue("isEdit", true)
    NonActivityFeesPackagesService.getNonActivityFeePackageByIdDefination(id)
      .then((res) => {
        setPackageDetails(res.data);
        setOpen(true);
        recordReset({
          amount: res.data.amount,
          maxAmount: res?.data?.maxAmount,
          numberOfInstallments: res?.data?.numberOfInstallments,
          startDate: new Date(
            moment(res?.data?.startDate, "DD/MM/yyyy").toString()
          ),
          endDate: new Date(
            moment(res?.data?.endDate, "DD/MM/yyyy").toString()
          ),
        });

        setChargeValue(String(res?.data?.chargeCount) === "Y" ? "yes" : "no");
        setChargeFirstValue(
          String(res?.data?.chargeFirstTransaction) === "Y" ? "yes" : "no"
        );
        setSelectChargeType(res?.data?.chargeTypeCodeSuffix);
        setChargeTypeId(res.data?.chargeTypeSystemCodeId);
        setFreqSystemCodeId(res?.data?.chargeTypeCodeSuffix === "O"? 0: res.data?.frequencySystemCodeId);
        setFrequencyVal(res?.data?.frequencyCodeSuffix);
        if (res?.data?.chargeTypeCodeSuffix === "O") {
          recordSetValue("frequencyId",0)
          recordSetValue("numberOfInstallments", 0);
        }
        setTerminalTypeVal(String(res?.data?.terminalTypesId));
        setTransactionVal(String(res?.data?.assignedTransactionId));
        // setCardSchemeVal(String(res?.data?.cardSchemeId));
        setSelectCurrency(String(res?.data?.currencyId));
        setActivityPackageStatus(res?.data?.status);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  return (
    <>
      <div className="wrapper">
        <form onSubmitCapture={handleSubmit(onSubmit)}>
          <main className="main-content">
            <div className="main-card">
              <div className="title-block">
                <div className="left-block">
                  <Typography variant={"h2"}>
                    {intl.formatMessage({
                      id: "NonActivityFeesPackage.activityFees",
                      defaultMessage: "Non Activity Fees Package Definition",
                    })}
                  </Typography>
                  <p className="pb-0">
                    {intl.formatMessage({
                      id: "NonActivityFeesPackage.addUpdateTitle",
                      defaultMessage:
                        "Add or update Non Activity Fees Packages",
                    })}
                  </p>
                </div>
                {id && (
                  <div className="right-block">
                    <Button
                      variant="contained"
                      disableElevation
                      className="btn-light"
                      endIcon={<img src={add_rounded} alt="add" />}
                      onClick={handleClickOpen}
                    >
                      {intl.formatMessage({
                        id: "NonActivityFeesPackage.addRecordTitle",
                        defaultMessage: "Add record",
                      })}
                    </Button>
                  </div>
                )}
              </div>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={4} sm={6} xl={4}>
                  <div className="input-with-label form-group">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.packageID",
                        defaultMessage: "Package ID",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "ActivityFeesPackageDefinition.packageID.placeholder",
                          defaultMessage: "Write your package ID",
                        })}
                        fullWidth
                        disabled={id ? true : false}
                        {...register("packageId")}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {recordActivityError.packageId?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} lg={4} sm={6} xl={4}>
                  <div className="input-with-label form-group">
                    <label>
                      {intl.formatMessage({
                        id: "NonActivityFeesPackage.packageNameTitle",
                        defaultMessage: "Package Name",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "ActivityFeesPackageDefinition.packageName.placeholder",
                          defaultMessage: "Write your package name",
                        })}
                        fullWidth
                        {...register("packageName")}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {recordActivityError.packageName?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} lg={4} sm={6} xl={4}>
                  <div className="input-with-label">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.institution",
                        defaultMessage: "Institution",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <Select
                        disabled
                        value={institutionVal}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                      >
                        {institutionList &&
                          institutionList.map((ins: Institution, i: number) => (
                            <MenuItem value={ins?.institutionId} key={i}>
                              {ins?.institutionName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
              {id && (
                <div className="form-group">
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.chargeType",
                              defaultMessage: "Charge Type",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.currency",
                              defaultMessage: "Currency",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.tranIdTitle",
                              defaultMessage: "Tran. ID",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.chargeCount",
                              defaultMessage: "Charge Count",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.terminalType",
                              defaultMessage: "Terminal Type",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.scheme",
                              defaultMessage: "Scheme",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.freq",
                              defaultMessage: "Freq.",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.noOfInst",
                              defaultMessage: "No. of Inst.",
                            })}
                          </TableCell>
                          <TableCell>
                            {/* <div className="tooltip-wrapper"> */}
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.charge",
                              defaultMessage: "Charge first trans",
                            })}
                            {/* <Tooltip
                                title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                arrow
                              >
                                <IconButton>
                                  <img src={info_ic} alt="info" />
                                </IconButton>
                              </Tooltip> */}
                            {/* </div> */}
                          </TableCell>

                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.amountPercentagee",
                              defaultMessage: "Amount",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.maxamntTitle",
                              defaultMessage: "Max Amount",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.sdateTitle",
                              defaultMessage: "Start Date",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.edateTitle",
                              defaultMessage: "End Date",
                            })}
                          </TableCell>
                          <TableCell align="center" width="190px" className="last-column-border-header">
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.actions",
                              defaultMessage: "Actions",
                            })}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {nonActivityDefinationList &&
                          nonActivityDefinationList.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.chargeTypeCodeDescription}</TableCell>
                              <TableCell>{row.currencyCode}</TableCell>
                              <TableCell>
                                {row.assignedTransactionDescription}
                              </TableCell>
                              <TableCell>{row.chargeCount}</TableCell>
                              <TableCell>{row.terminalType}</TableCell>
                              <TableCell>{row.cardSchemeName}</TableCell>
                              <TableCell>{row.frequencyCodeSuffix}</TableCell>
                              <TableCell>{row.numberOfInstallments}</TableCell>
                              <TableCell>
                                {row.chargeFirstTransaction}
                              </TableCell>
                              <TableCell>{row.amount}</TableCell>
                              <TableCell>{row.maxAmount}</TableCell>
                              <TableCell>{row.startDate}</TableCell>
                              <TableCell>{row.endDate}</TableCell>
                              <TableCell align="center" width="190px" className="last-column-border">
                                <div className="action btns-block">
                                  <Switch
                                    className="custom"
                                    checked={row.status === "1" ? true : false}
                                    onChange={(e) =>
                                      changeStatus(row.recordSeqId, e)
                                    }
                                  />
                                  <IconButton
                                    className="border-icon-btn no-border sm"
                                    onClick={() =>
                                      onEditChargeDetails(row.recordSeqId)
                                    }
                                  >
                                    <img src={edit_ic} alt="mail" />
                                  </IconButton>
                                  <IconButton
                                    className="border-icon-btn no-border sm"
                                    onClick={() =>
                                      onDeleteChargeDetails(
                                        row.recordSeqId
                                      )
                                    }
                                  >
                                    <img src={delete_ic} alt="mail" />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        {nonActivityDefinationList &&
                          nonActivityDefinationList.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={14} className="last-column-border">
                                <p style={{ textAlign: "center" }}>
                                  {intl.formatMessage({
                                    id: "NonActivityFeesPackage.noDataFound",
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
              )}

              <div className="btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/non-activity-fees-packages")}
                >
                  {intl.formatMessage({
                    id: "NonActivityFeesPackage.cancel",
                    defaultMessage: "Cancel",
                  })}
                </Button>
                <Button disableElevation variant="contained" type="submit" disabled={isSubmitting}>
                  {intl.formatMessage({
                    id: "NonActivityFeesPackage.save",
                    defaultMessage: "Save",
                  })}
                </Button>
              </div>
            </div>
          </main>
        </form>
        <Dialog open={open} onClose={handleClose} className="c-dialog lg">
          <form onSubmitCapture={recordHandleSubmit(onSubmitRecord)}>
            <DialogTitle component={"div"}>
              <div className="title-block mb-0">
                <div className="left-block mb-0">
                  <Typography variant={"h2"}>
                    {intl.formatMessage({
                      id: "NonActivityFeesPackage.packageDeetails",
                      defaultMessage:
                        "Package details",
                    })}
                  </Typography>
                  <p className="pb-0">
                    {intl.formatMessage({
                      id: "NonActivityFeesPackage.addPackageeDetails",
                      defaultMessage: "Add/Edit Package Details",
                    })}
                  </p>
                </div>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="inner-card">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.chargeType",
                          defaultMessage: "Charge Type",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...recordRegister("chargeMasterId")}
                          value={selectChargeType}
                          onChange={(e) => {
                            if (e?.target?.value) {
                              const value = String(e.target.value);
                              setSelectChargeType(value);
                              if (value === "O") {
                                setFrequencyVal('');
                                setFreqSystemCodeId(0)
                                recordSetValue("frequencyId",0)
                                recordSetValue("numberOfInstallments", 0);
                                // recordSetValue("maxAmount", 0);
                              }else{
                                setFrequencyVal('');
                              }
                            }
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                        >
                          <MenuItem value="">{intl.formatMessage({ id: "NonActivityPackage.selectChargeType", defaultMessage: "Select Charge Type" })}</MenuItem>
                          {chargeList &&
                            chargeList?.map((charge: SystemCodeModel) => (
                              <MenuItem
                                value={charge?.codeSuffix}
                                key={charge?.systemCodeId}
                                onClick={() => setChargeTypeId(charge?.systemCodeId)}
                              >
                                {charge?.description}
                              </MenuItem>
                            ))}
                        </Select>
                        {selectChargeType === "" &&
                          recordErrors.chargeMasterId?.message && (
                            <FormHelperText id="error-helper-text" error>
                              {recordErrors.chargeMasterId?.message}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.frequency",
                          defaultMessage: "Frequency",
                        })}
                        {selectChargeType === 'R' && <span style={{ color: "red" }}>*</span>}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          {...recordRegister("frequencyId")}
                          value={frequencyVal}
                          onChange={(e) => {
                            if (e?.target?.value) {
                              setFrequencyVal(e?.target?.value);
                            }
                          }}
                          disabled={selectChargeType === "O"}
                        >
                          <MenuItem value="">
                          {intl.formatMessage({
                             id: "NonActivityPackage.selectFrequency",
                              defaultMessage: "Select Frequency" 
                              })}
                            </MenuItem>
                          {frequency &&
                            frequency.map((f: SystemCodeModel) => (
                              <MenuItem 
                              value={f.codeSuffix}
                               key={f.systemCodeId} 
                               onClick={() => setFreqSystemCodeId(f.systemCodeId)}
                               >
                                {f.description}
                              </MenuItem>
                            ))}
                        </Select>
                        {frequencyVal === "" &&
                          recordErrors.frequencyId?.message && (
                            <FormHelperText id="error-helper-text" error>
                              {recordErrors.frequencyId?.message}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.sdateTitle",
                          defaultMessage: "Start Date",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="startDate"
                            render={({ field }) => (
                              <DatePicker
                                // placeholderText="Select date"
                                onChange={(date, keyboardInput) => {
                                  if (keyboardInput) {
                                    field.onChange(keyboardInput.length === 10 ? date : "")
                                  } else {
                                    field.onChange(date)
                                  }
                                }}
                                inputFormat="dd/MM/yyyy"
                                value={field.value ?? null}
                                components={{
                                  OpenPickerIcon: () => {
                                    return <img src={date_ic} alt="date" />;
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            )}
                          />
                        </LocalizationProvider>
                          <FormHelperText id="error-helper-text" error>
                            {!(watch("startDate")?.toLocaleDateString() < watch("endDate")?.toLocaleDateString() &&
                              recordErrors.startDate?.message === "Start date can't be after end date") && recordErrors.startDate?.message
                              }
                          </FormHelperText>
{/*                         
                        <FormHelperText id="error-helper-text" error>
                          {recordErrors.startDate?.message}
                        </FormHelperText> */}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.currency",
                          defaultMessage: "Currency",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...recordRegister("currencyId")}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          value={currency}
                          onChange={(e) => {
                            if (e?.target?.value) {
                              setSelectCurrency(e?.target?.value);
                            }
                          }}
                        >
                          <MenuItem value="">{intl.formatMessage({ id: "NonActivityPackage.selectCurrency", defaultMessage: "Select Currency" })}</MenuItem>
                          {currencies &&
                            currencies.map((cr: any, i: number) => (
                              <MenuItem value={cr.currencyId} key={i}>
                                {cr.currencyName}
                              </MenuItem>
                            ))}
                        </Select>
                        {currency === "" && recordErrors.currencyId?.message && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.currencyId?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.installments",
                          defaultMessage: "No of Installments",
                        })}
                        {selectChargeType === 'R' && <span style={{ color: "red" }}>*</span>}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder="Insert Number of Installments"
                          fullWidth
                          {...recordRegister("numberOfInstallments")}
                          inputProps={{ maxLength: 4 }}
                          onKeyDown={(event) => {
                            if (
                              !(
                                event.key === "Backspace" ||
                                event.key === "Delete" ||
                                event.key === "Tab" ||
                                event.key === "Enter" ||
                                (event.key >= "0" && event.key <= "9")
                              )
                            ) {
                              event.preventDefault();
                            }
                          }}
                          disabled={selectChargeType === "O"}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {recordErrors.numberOfInstallments?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.edateTitle",
                          defaultMessage: "End Date",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="endDate"
                            render={({ field }) => (
                              <DatePicker
                                // placeholderText="Select date"
                                onChange={(date, keyboardInput) => {
                                  if (keyboardInput) {
                                    field.onChange(keyboardInput.length === 10 ? date : "")
                                  } else {
                                    field.onChange(date)
                                  }
                                }}
                                inputFormat="dd/MM/yyyy"
                                value={field.value ?? null}
                                components={{
                                  OpenPickerIcon: () => {
                                    return <img src={date_ic} alt="date" />;
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <FormHelperText id="error-helper-text" error>
                          {recordErrors.endDate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.amountTitle",
                          defaultMessage: "Amount",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder="Enter amount"
                          fullWidth
                          {...recordRegister("amount")}
                          componentsProps={{
                            input: {
                              step: ".01",
                            },
                          }}
                          onKeyDown={(event) => {
                            if (
                              !(
                                event.key === "Backspace" ||
                                event.key === "Delete" ||
                                event.key === "Tab" ||
                                event.key === "Enter" ||
                                event.key === "." ||
                                (event.key >= "0" && event.key <= "9")
                              )
                            ) {
                              event.preventDefault();
                            }
                          }}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {recordErrors.amount?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.maxamntTitle",
                          defaultMessage: "Max Amount",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder="Enter amount"
                          fullWidth
                          {...recordRegister("maxAmount")}
                          onKeyDown={(event) => {
                            if (
                              !(
                                event.key === "Backspace" ||
                                event.key === "Delete" ||
                                event.key === "Tab" ||
                                event.key === "Enter" ||
                                event.key === "." ||
                                (event.key >= "0" && event.key <= "9")
                              )
                            ) {
                              event.preventDefault();
                            }
                          }}
                          disabled={chargeValue !== "yes"}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {recordErrors.maxAmount?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label className="center lg">
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.chargeCount",
                          defaultMessage: "Charge Count",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <RadioGroup
                          row
                          {...recordRegister("chargeCount")}
                          value={chargeValue}
                          onChange={(e) => {
                            setChargeValue(String(e.target.value));
                            recordSetValue("chargeCount", e?.target?.value);
                            if(e?.target?.value){
                              if(selectChargeType === "O")
                                setFreqSystemCodeId(0)
                                recordSetValue("frequencyId",0)
                                recordSetValue("numberOfInstallments", 0);
                            }
                          }}
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.terminalType",
                          defaultMessage: "Terminal type",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          {...recordRegister("terminalTypeId")}
                          value={terminalTypeVal}
                          onChange={(e) => {
                            if (e?.target?.value) {
                              setTerminalTypeVal(e?.target?.value);
                            }
                          }}
                        >
                          <MenuItem value="">{intl.formatMessage({ id: "NonActivityPackage.selectTerminalType", defaultMessage: "Select Terminal Type" })}</MenuItem>
                          {terminalTypeList &&
                            terminalTypeList.map((ter: any, i: number) => (
                              <MenuItem value={ter.terminalTypesId} key={i}>
                                {ter.terminalType}
                              </MenuItem>
                            ))}
                        </Select>
                        {terminalTypeVal === "" &&
                          recordErrors.terminalTypeId?.message && (
                            <FormHelperText id="error-helper-text" error>
                              {recordErrors.terminalTypeId?.message}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="form-group input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "NonActivityFeePackage.enabled",
                          defaultMessage: "Enabled",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Switch
                          className="custom"
                          checked={activityPackageStatus === "1" ? true : false}
                          onChange={(e) => changeStatusOnSave(e)}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group mb-0">
                      <label className="center lg">
                        {intl.formatMessage({
                          id: "NonActivityFeesPackage.changeFirstTransaction",
                          defaultMessage: "Charge First Transaction",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <RadioGroup
                          row
                          {...recordRegister("chargeFirstTransaction")}
                          value={chargeFirstValue}
                          onChange={(e) => {
                            setChargeFirstValue(e.target.value);
                          }}
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                        {recordErrors.chargeFirstTransaction?.message && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.chargeFirstTransaction?.message}
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
                onClick={() => setOpen(false)}
              >
                {intl.formatMessage({
                  id: "NonActivityFeesPackage.cancel",
                  defaultMessage: "Cancel",
                })}
              </Button>
              <Button disableElevation variant="contained" type="submit" disabled={recordIsSubmitting}>
                {intl.formatMessage({
                  id: "NonActivityFeesPackage.save",
                  defaultMessage: "Save",
                })}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
}

export default NonActivityFeesPackagesDefinition;
