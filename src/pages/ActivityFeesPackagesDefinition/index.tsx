import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  add_rounded,
  date_ic,
  delete_ic,
  down_arrow_icon,
  edit_ic,
} from "../../assets/images";
import {
  ActivityFeesChargeDetailModel,
  ActivityFeesPackageDefinationModel,
  ActivityFeesPackageModel,
  ActivityFeesRecordModel,
} from "../../models/configuration/ActivityFeesPackageModel";
import { CardSchemeModel } from "../../models/configuration/CardSchemeModel";
import { Institution } from "../../models/configuration/InstitutionModel";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { ActivityFeesPackagesService } from "../../services/configuration/activity-fee-service";
import { CardSchemeService } from "../../services/configuration/card-scheme-service";
import { CurrencyService } from "../../services/configuration/currency-service";
import { InstitutionService } from "../../services/configuration/institution-service";
import { NonActivityFeesPackagesService } from "../../services/configuration/nonactivity-fee-service";
import { TransactionGroupService } from "../../services/configuration/transaction-group-service";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import {
  CodePrefix,
  Errors,
  StatusCode,
  TRANS_USAGE,
} from "../../utils/constant";
import validations from "../../utils/validations";
import { IssuerProfileService } from "../../services/configuration/issuer-profile-service";
import { IssProfile } from "../../models/configuration/IssuerProfileModel";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";

function ActivityFeesPackageDefinition() {
  const { id } = useParams<{ id?: any }>();
  const navigate = useNavigate();
  const location: any = useLocation();
  const selectedInstitutionId =
    location && location.state && location.state.institutionId;
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
  const [cardSchemes, setCardSchemes] = React.useState<CardSchemeModel[]>([]);
  const [currencies, setCurrencies] = React.useState<any>([]);
  const [activityDefinationList, setActivityDefinationList] =
    React.useState<ActivityFeesPackageDefinationModel[]>();
  const [transactions, setTransactions] = React.useState<any>([]);
  const [transactionGroups, setTransactionGroups] = React.useState<any>([]);
  const [addChargeOpen, setAddChargeOpen] = useState(false);
  const [frequency, setFrequency] = useState<SystemCodeModel[]>([]);
  const [chargeList, setChargeList] = useState<SystemCodeModel[]>([]);
  const [packageDetails, setPackageDetails] = useState<any>({
    packageDetailId: 0,
  });
  const [institutionList, setInstitutionList] = React.useState<Institution[]>(
    []
  );
  const [issuerList, setIssuerList] = useState<IssProfile[]>([]);
  const [selectChargeMethod, setSelectChargeMethod] = useState<string>("");
  const [chargeMethodId, setChargeMethodId] = useState<number | null>(null);
  const [cardSchemeVal, setCardSchemeVal] = useState<string>("");
  const [currencyVal, setCurrencyVal] = useState<string>("");
  const [issuerVal, setIssuerVal] = useState<string>("");
  const [tipsVal, setTipsVal] = useState<string>("");
  const [transGroupVal, setTransGroupVal] = useState<string>("");
  const [transIdVal, setTransIdVal] = useState<string>("");
  const [institutionVal, setInstitutionVal] = useState<string>(
    selectedInstitutionId
  );
  const [accumulationFrequencyVal, setAccumulationFrequencyVal] =
    useState<string>("");
  const [freqSystemCodeId, setFreqSystemCodeId] = React.useState<number | null>(
    null
  );
  const [packageChargeList, setPackageChargeList] = useState<any>([]);
  const [isEditChargePackage, setIsEditChargePackage] =
    useState<boolean>(false);
  const [chargePackageId, setChargePackageId] = useState<number>(0);
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

  const {
    register: recordRegister,
    handleSubmit: recordHandleSubmit,
    reset: recordReset,
    formState: { errors: recordErrors, isSubmitting: recordIsSubmitting },
    setValue: recordSetValue,
    control,
    watch,
    clearErrors,
    getValues,
  } = useForm<ActivityFeesRecordModel>({
    mode: "onChange",
    resolver: yupResolver(
      selectChargeMethod === "VOLUME" || selectChargeMethod === "COUNT"
        ? validations.createActivityRecordPackageForCountAndValue
        : validations.createActivityRecordPackage
    ),
    defaultValues: {
      isEdit: false,
    },
  });

  const {
    register: recordChargeRegister,
    handleSubmit: recordChargeHandleSubmit,
    reset: recordChargeReset,
    formState: { errors: recordChargeErrors },
  } = useForm<ActivityFeesChargeDetailModel>({
    mode: "onChange",
    resolver: yupResolver(validations.createAddActivityPackageCharge),
  });

  const getActivityPackageById = async () => {
    await ActivityFeesPackagesService.getActivityFeePackageById(id)
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        reset(data);
        setInstitutionVal(data?.institutionId?.toString());
        getAllFrequencyList(data?.institutionId?.toString());
        getAllChargeList(data?.institutionId?.toString());
        getActivityDefinationList(data.packageId);
        getAllTransactionGroupList(data?.institutionId);
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

  useEffect(() => {
    if (Number(watch("minAmount")) < Number(watch("maxAmount"))) {
      clearErrors("minAmount");
      clearErrors("maxAmount");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("minAmount"), watch("maxAmount")]);

  React.useEffect(() => {
    getAllInstitutionList();
    getAllCardSchemeList();
    getAllCurrencyList();
    //getAllIssuerList();
    getAllTransactionsByUsage();
    setInstitutefromLocalStorage();
  }, []);

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
    }
  };

  const getAllTransactionsByUsage = () => {
    // let UsageSysId = 0;
    // SystemCodeServices.getAllSystemCodes().then(res => {
    //     UsageSysId = res.data.find(data => data.codePrefix === CodePrefix.TRANS_USAGE && data.description === TRANS_USAGE.ACTFEE)?.systemCodeId ?? 0;

    //     if(UsageSysId !== 0){
    TransactionGroupService.getAllTransactionsByUsage(TRANS_USAGE.ACTFEE, "")
      .then((res) => {
        setTransactions([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
    //     }

    // });
  };

  const getAllCardSchemeList = async () => {
    await CardSchemeService.getActiveCardScheme()
      .then((res) => {
        setCardSchemes([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllChargeList = async (inst: string) => {
    const model = {
      codePrefix: CodePrefix.CHARGE_METHOD,
      institutionId: inst,
    };
    await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
      .then((res) => {
        setChargeList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  // const getAllIssuerList = async () => {
  //   await IssuerProfileService.getAllIssuerProfiles()
  //     .then((res) => {
  //       setIssuerList([...res.data]);
  //     })
  //     .catch((err) =>   toast.error(err.response.data.errors[0]));
  // };

  const getIssuerProfilesByInstitutionId = async (id: string | "") => {
    await IssuerProfileService.getIssuerProfilesByInstitution(id)
      .then((res) => {
        setIssuerList([...res.data]);
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

  const getAllTransactionGroupList = async (institutionId: number) => {
    await TransactionGroupService.getAllActiveTransactionGroup()
      .then((res) => {
        const filteredTransactionGroup = res.data.filter(
          (s: any) => s.institutionId === institutionId
        );
        setTransactionGroups(filteredTransactionGroup);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllFrequencyList = async (inst: string) => {
    const model = {
      codePrefix: CodePrefix.FREQUENCY_MASTER,
      institutionId: inst,
    };
    await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
      .then((res) => {
        setFrequency([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const handleAddChargeClose = () => {
    setAddChargeOpen(false);
  };

  const getAllPackageChargeList = async (id: number) => {
    if (id > 0) {
      await ActivityFeesPackagesService.getActivityFeePackageDetailCharge(id)
        .then((res) => {
          setPackageChargeList([...res.data]);
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };

  const getActivityDefinationList = async (packageId: string) => {
    getIssuerProfilesByInstitutionId(institutionVal);

    await ActivityFeesPackagesService.getAllActivityFeePackagesDefination(packageId,selectedInstitutionId??institutionVal)
      .then((resDefination) => {
        const definationList = JSON.parse(JSON.stringify(resDefination.data));
        setActivityDefinationList(definationList);
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
    recordReset();
    setOpen(true);
    recordSetValue("isEdit", false);
  };

  const handleClose = () => {
    setOpen(false);
    setPackageDetails({
      packageDetailId: 0,
      percentageAmount: 0,
      fixAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      startDate: "",
      endDate: "",
    });
    recordReset({
      packageDetailId: 0,
      percentageAmount: 0,
      fixAmount: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    setSelectChargeMethod("");
    setCardSchemeVal("");
    setCurrencyVal("");
    setIssuerVal("");
    setTipsVal("");
    setTransGroupVal("");
    setTransIdVal("");
    setPackageChargeList([]);
  };

  const onSubmit = async (value: ActivityFeesPackageModel) => {
    value.institutionId = institutionVal;
    value.updateFlag = id ? "1" : "0";
    await ActivityFeesPackagesService.saveOrUpdateActivityFeePackage(value)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          handleAddChargeClose();
          navigate(`/activity-fees-packages-definition/${res.data.recordSeqId}`,{ state: { institutionId: institutionVal } });
          if (id) {
            toast.success(`Activity fees package is updated successfully`);
          } else {
            toast.success("Activity fees package is added successfully");
          }
        }
      })
      .catch((err) => {
        if (
          err &&
          err.response
          //&&
          // err.response.data === Errors.IdAlreadyExists
        ) {
          toast.error(err.response.data.errors[0])
        } else {
            toast.error(err.response.data.errors[0]);
        }
      });
  };

  const onSubmitRecord = async (value: ActivityFeesRecordModel) => {
    const request = {
      chargeMethodId: chargeMethodId,
      currencyCodeId: value.currencyId,
      startDate: moment(value.startDate).format("DD/MM/yyyy"),
      endDate: moment(value.endDate).format("DD/MM/yyyy"),
      fixAmount:
        value?.chargeMethod === "FMDR" ||
          value?.chargeMethod === "USER" ||
          value?.chargeMethod === "DCC"
          ? Number(getValues("fixAmount") ? getValues("fixAmount") : 0)
          : 0,
      percentageAmount:
        value?.chargeMethod === "FMDR" ||
          value?.chargeMethod === "USER" ||
          value?.chargeMethod === "DCC"
          ? Number(
            getValues("percentageAmount") ? getValues("percentageAmount") : 0
          )
          : 0,
      maxAmount:
        value?.chargeMethod === "FMDR" ||
          value?.chargeMethod === "USER" ||
          value?.chargeMethod === "DCC"
          ? Number(getValues("maxAmount") ? getValues("maxAmount") : 0)
          : 0,
      minAmount:
        value?.chargeMethod === "FMDR" ||
          value?.chargeMethod === "USER" ||
          value?.chargeMethod === "DCC"
          ? Number(getValues("minAmount") ? getValues("minAmount") : 0)
          : 0,
      packageDetailId: Number(packageDetails.packageDetailId) || 0,
      packageId: id,
      issuerId: Number(value.issuerId),
      tranGroupName: transGroupVal,
      tranId: value?.chargeMethod === "USER" ? value.transactionId : "",
      cardSchemeId: value.cardSchemeId,
      tips: value.tips,
      status: activityPackageStatus
    };
    await ActivityFeesPackagesService.saveOrUpdateActivityFeePackageDefination(request)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setPackageDetails(res?.data);
          if (packageDetails.packageDetailId > 0) {
            toast.success(
              `Activity fees package definition is updated successfully`
            );
          } else {
            toast.success("Activity fees package is added successfully");
          }
          getAllPackageChargeList(res?.data?.packageDetailId);
          if (id) {
            getActivityDefinationList(res?.data?.packageId);
          }
        }
        if (value?.chargeMethod === "FMDR" ||
          value?.chargeMethod === "USER" ||
          value?.chargeMethod === "DCC") {
          handleClose();
        }

      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const onSubmitChargeDetails = async (
    value: ActivityFeesChargeDetailModel
  ) => {
    const request = {
      activityPackageDetailId: Number(packageDetails.packageDetailId) || 0,
      fixAmount: value.fixAmount,
      frequencyId: freqSystemCodeId,
      percentageAmount: value.percentageAmount,
      uptoAmount: value.uptoAmount,
      activityPackageTierId: chargePackageId,
      tranGroupName: transGroupVal,
      tranId: transIdVal !== "" ? transIdVal : ""
    };

    await ActivityFeesPackagesService.saveOrUpdateActivityFeePackageChargeDetails(
      request
    )
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if (isEditChargePackage) {
            toast.success(
              `Activity fees charge package is updated successfully`
            );
          } else {
            toast.success("Activity fees charge package is added successfully");
          }
          setAddChargeOpen(false);
          setIsEditChargePackage(false);
          setChargePackageId(0);
          getAllPackageChargeList(packageDetails?.packageDetailId);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  // Package Defination
  const changeStatusForChangeDetails = async (changeId: number, IdString: string ,event: any) => {
    const model = {
      id: changeId,
      idString: IdString ,
      status: event.target.checked === true ? "1" : "0",
    };
    ActivityFeesPackagesService.changeStatusDefination(model)
      .then((res) => {
        if (id) {
          getActivityDefinationList(IdString);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const onDeleteChargeDetails = (deleteId: number) => {
    Swal.fire({
      title: intl.formatMessage({
        id: "DeleteAlert.title",
        defaultMessage: "Are you sure?",
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
        ActivityFeesPackagesService.deleteActivityFeePackageDefination(deleteId)
          .then((res) => {
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
            if (res.data) {
              getActivityDefinationList(res?.data);
            }
          })
          .catch((err) => {
            if (
              err &&
              err.response
              // &&
           //   err.response.data === Errors.ReferenceExists
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
    ActivityFeesPackagesService.getActivityFeePackageDetailByIdDefination(id)
      .then((res) => {
        setPackageDetails(res.data);
        console.log("res.data", res.data )
        setOpen(true);
        getAllPackageChargeList(res.data?.packageDetailId);
        recordReset({
          ...res.data,
          chargeMethod: res.data?.chargeMethodCodeSuffix,
          currencyId: res?.data?.currencyCodeId,
          percentageAmount: res?.data?.percentageAmount,
          fixAmount: res?.data?.fixAmount,
          maxAmount: res?.data?.maxAmount,
          minAmount: res?.data?.minAmount,
          transactionGroupId: res?.data?.tranGroupId,
          transactionId: res?.data?.tranId,
          schemeId: res?.data?.schemeId,
          startDate: new Date(
            moment(res?.data?.startDate, "DD/MM/yyyy").toString()
          ),
          endDate: new Date(
            moment(res?.data?.endDate, "DD/MM/yyyy").toString()
          ),
        });
        setTransGroupVal(res?.data?.tranGroupName);
        setSelectChargeMethod(res.data?.chargeMethodCodeSuffix);
        setChargeMethodId(res.data?.chargeMethodSystemCodeId);
        setCardSchemeVal(res?.data?.cardSchemeId?.toString());
        setCurrencyVal(res?.data?.currencyCodeId?.toString());
        setIssuerVal(res?.data?.issuerId?.toString());
        setTipsVal(res?.data?.tips?.toString());
        setTransIdVal(res?.data?.tranId?.toString());
        setActivityPackageStatus(res?.data?.status);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const onDeleteChargePackage = (id: number) => {
    Swal.fire({
      title: intl.formatMessage({
        id: "DeleteAlert.title",
        defaultMessage: "Are you sure?",
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
        ActivityFeesPackagesService.deleteActivityFeePackageCharge(id)
          .then((res) => {
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
            getAllPackageChargeList(packageDetails?.packageDetailId);
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

  const onEditChargePackage = async (id: number) => {
    recordSetValue("isEdit", true);
    ActivityFeesPackagesService.getActivityFeePackageDetailByIdCharge(id)
      .then((res) => {
        recordChargeReset({
          ...res.data,
        });
        setAccumulationFrequencyVal(res.data?.frequencyCodeSuffix);
        setFreqSystemCodeId(res.data?.frequencySystemCodeId);
        setAddChargeOpen(true);
        setIsEditChargePackage(true);
        setChargePackageId(res?.data?.activityPackageTierId);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  return (
    <div className="wrapper">
      <form onSubmitCapture={handleSubmit(onSubmit)}>
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "ActivityFeesPackageDefinition.title",
                    defaultMessage: "Activity Fees Package Definition",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "ActivityFeesPackageDefinition.subtitle",
                    defaultMessage: "Add or update Activity Fees Packages",
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
                    <FormattedMessage
                      id="ActivityFeesPackageDefinition.addRecord"
                      defaultMessage="Add record"
                    />
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
                        id: "ActivityFeesPackageDefinition.packageIdplaceholder",
                        defaultMessage: "Insert Package ID",
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
                      id: "ActivityFeesPackageDefinition.packageName",
                      defaultMessage: "Package Name",
                    })}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.packaageName.placeholder",
                        defaultMessage: "Insert Package Name",
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
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                            id: "ActivityFeesPackageDefinition.chargeMethod",
                            defaultMessage: "Charge Method",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.currencyCode",
                            defaultMessage: "Currency Code",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.tranGroup",
                            defaultMessage: "Tran. Group",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.scheme",
                            defaultMessage: "Scheme",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.issuerAcqProfile",
                            defaultMessage: "Issuer",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.tips",
                            defaultMessage: "Tips (Y/N)",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.amount",
                            defaultMessage: "Amount",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.amountPercentage",
                            defaultMessage: "% Amount",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.minAmount",
                            defaultMessage: "Min Amnt",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.maxAmount",
                            defaultMessage: "Max Amnt",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.startDate",
                            defaultMessage: "Start Date",
                          })}
                        </TableCell>
                        <TableCell>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.endDate",
                            defaultMessage: "End Date",
                          })}
                        </TableCell>
                        <TableCell
                          align="center"
                          width="190px"
                          className="last-column-border-header"
                        >
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.actions",
                            defaultMessage: "Actions",
                          })}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activityDefinationList &&
                        activityDefinationList.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              {row.chargeMethod}
                            </TableCell>
                            <TableCell>{row.currencyCode}</TableCell>
                            <TableCell>{row.tranGroupName}</TableCell>
                            <TableCell>{row.cardScheme}</TableCell>
                            <TableCell>{row.issuer}</TableCell>
                            <TableCell>{row?.tips}</TableCell>
                            <TableCell>{row.fixAmount}</TableCell>
                            <TableCell>{row.percentageAmount}</TableCell>
                            <TableCell>{row.minAmount}</TableCell>
                            <TableCell>{row.maxAmount}</TableCell>
                            <TableCell>
                              {moment(row.startDate, "DD/MM/YYYY").format(
                                "DD/MM/YYYY"
                              )}
                            </TableCell>
                            <TableCell>
                              {moment(row.endDate, "DD/MM/YYYY").format(
                                "DD/MM/YYYY"
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              width="190px"
                              className="last-column-border"
                            >
                              <div className="action btns-block">
                                <Switch
                                  className="custom"
                                  checked={row.status === "1" ? true : false}
                                  onChange={(e) =>
                                    changeStatusForChangeDetails(
                                      row.packageDetailId , row.packageId,
                                      e
                                    )
                                  }
                                />
                                <IconButton className="border-icon-btn no-border sm">
                                  <img
                                    src={edit_ic}
                                    alt="mail"
                                    onClick={() =>
                                      onEditChargeDetails(row.packageDetailId)
                                    }
                                  />
                                </IconButton>
                                <IconButton
                                  className="border-icon-btn no-border sm"
                                  onClick={() =>
                                    onDeleteChargeDetails(row.packageDetailId)
                                  }
                                >
                                  <img src={delete_ic} alt="mail" />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      {activityDefinationList &&
                        activityDefinationList.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={13}
                              className="last-column-border"
                            >
                              <p style={{ textAlign: "center" }}>
                                {intl.formatMessage({
                                  id: "ActivityFeesPackageDefinition.noDataFound",
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
                onClick={() => navigate("/activity-fees-packages")}
              >
                <FormattedMessage
                  id="ActivityFeesPackageDefinition.cancel"
                  defaultMessage="Cancel"
                />
              </Button>
              <Button
                disableElevation
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                <FormattedMessage
                  id="ActivityFeesPackageDefinition.save"
                  defaultMessage="Save"
                />
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
                    id: "ActivityFeesPackageDefinition.packageDetails",
                    defaultMessage: "Package Details",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "ActivityFeesPackageDefinition.adddPackage",
                    defaultMessage: "Add/Edit package details record",
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
                        id: "ActivityFeesPackageDefinition.chargeMethod",
                        defaultMessage: "Charge Method",
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
                        value={selectChargeMethod}
                        {...recordRegister("chargeMethod")}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setSelectChargeMethod(String(e?.target?.value));
                            recordSetValue("chargeMethod", e?.target?.value);
                          }
                        }}
                      >
                        <MenuItem value="">{intl.formatMessage({ id: "ActivityFeesPackages.selectChargeMethod", defaultMessage: "Select Charge Method" })}</MenuItem>
                        {chargeList &&
                          chargeList?.map((charge: SystemCodeModel) => (
                            <MenuItem
                              value={charge?.codeSuffix}
                              key={charge?.systemCodeId}
                              onClick={() =>
                                setChargeMethodId(charge?.systemCodeId)
                              }
                            >
                              {charge?.description}
                            </MenuItem>
                          ))}
                      </Select>
                      {selectChargeMethod === "" &&
                        recordErrors.chargeMethod?.message && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.chargeMethod?.message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.cardScheme",
                        defaultMessage: "Card Scheme",
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
                        value={cardSchemeVal}
                        {...recordRegister("cardSchemeId")}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setCardSchemeVal(e?.target?.value);
                          }
                        }}
                      >
                        <MenuItem value="">{intl.formatMessage({ id: "ActivityFeesPackages.selectCardScheme", defaultMessage: "Select Card Scheme" })}</MenuItem>
                        {cardSchemes &&
                          cardSchemes.map((card, i: number) => (
                            <MenuItem value={card?.cardSchemeId} key={i}>
                              {card?.cardSchemeName}
                            </MenuItem>
                          ))}
                      </Select>
                      {cardSchemeVal === "" &&
                        recordErrors.cardSchemeId?.message && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.cardSchemeId?.message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.feesAmount",
                        defaultMessage: "Fees Amount",
                      })}
                      {(watch("chargeMethod") === "FMDR" ||
                        watch("chargeMethod") === "USER" ||
                        watch("chargeMethod") === "DCC") && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder="Enter Fees Amount"
                        fullWidth
                        value={
                          selectChargeMethod === "FMDR" ||
                            selectChargeMethod === "USER" ||
                            selectChargeMethod === "DCC"
                            ? watch("fixAmount")
                            : 0
                        }
                        {...recordRegister("fixAmount")}
                        // onChange={(e) =>
                        //     setPackageDetails((prev: any) => ({
                        //         ...prev,
                        //         fixAmount: e.target.value,
                        //     }))
                        // }
                        disabled={
                          watch("chargeMethod") === "COUNT" ||
                          watch("chargeMethod") === "VOLUME"
                        }
                        type="number"
                        componentsProps={{
                          input: {
                            step: ".01",
                          },
                        }}
                      />
                      {(watch("chargeMethod") === "FMDR" ||
                        watch("chargeMethod") === "USER" ||
                        watch("chargeMethod") === "DCC") && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.fixAmount?.message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.currency",
                        defaultMessage: "Currency",
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
                        value={currencyVal}
                        {...recordRegister("currencyId")}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setCurrencyVal(e?.target?.value);
                          }
                        }}
                      >
                        <MenuItem value="">{intl.formatMessage({ id: "ActivityFeesPackages.selectCurrency", defaultMessage: "Select Currency" })}</MenuItem>
                        {currencies &&
                          currencies.map((cr: any, i: number) => (
                            <MenuItem value={cr.currencyId} key={i}>
                              {cr.currencyName}
                            </MenuItem>
                          ))}
                      </Select>
                      {currencyVal === "" &&
                        recordErrors.currencyId?.message && (
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
                        id: "ActivityFeesPackageDefinition.issuer",
                        defaultMessage: "Issuer",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={issuerVal}
                        {...recordRegister("issuerId")}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setIssuerVal(e?.target?.value);
                          }
                        }}
                      >
                        <MenuItem value="">{intl.formatMessage({ id: "ActivityFeesPackages.selectIssuer", defaultMessage: "Select Issuer" })}</MenuItem>
                        {issuerList && issuerList.map((row, i) => (
                          <MenuItem value={row.profileId} key={i}>
                            {row.issuerAcqProfile}
                          </MenuItem>
                        ))}
                      </Select>
                      {issuerVal === "" && recordErrors.issuerId?.message && (
                        <FormHelperText id="error-helper-text" error>
                          {recordErrors.issuerId?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.amountPercentage",
                        defaultMessage: "%Amount*",
                      })}
                      {(watch("chargeMethod") === "FMDR" ||
                        watch("chargeMethod") === "USER" ||
                        watch("chargeMethod") === "DCC") && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder="Enter Percentage Amount"
                        fullWidth
                        value={
                          selectChargeMethod === "FMDR" ||
                            selectChargeMethod === "USER" ||
                            selectChargeMethod === "DCC"
                            ? watch("percentageAmount")
                            : 0
                        }
                        {...recordRegister("percentageAmount")}
                        // onChange={(e) =>
                        //     setPackageDetails((prev: any) => ({
                        //         ...prev,
                        //         percentageAmount: e.target.value,
                        //     }))
                        // }
                        disabled={
                          watch("chargeMethod") === "COUNT" ||
                          watch("chargeMethod") === "VOLUME"
                        }
                        type="number"
                        componentsProps={{
                          input: {
                            step: ".01",
                          },
                        }}
                      />
                      {(watch("chargeMethod") === "FMDR" ||
                        watch("chargeMethod") === "USER" ||
                        watch("chargeMethod") === "DCC") && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.percentageAmount?.message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.tranGroup",
                        defaultMessage: "Tran. Group",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={transGroupVal}
                        {...recordRegister("transactionGroupId")}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setTransGroupVal(e?.target?.value);
                          }
                        }}
                      >
                        <MenuItem value="">{intl.formatMessage({ id: "ActivityFeesPackages.selectTransaction Group", defaultMessage: "Select Transaction Group" })}</MenuItem>
                        {transactionGroups &&
                          transactionGroups?.map((t: any, i: number) => (
                            <MenuItem value={t?.transactionGroupName} key={i}>
                              {t?.transactionGroupName}
                            </MenuItem>
                          ))}
                      </Select>
                      {transGroupVal === "" &&
                        recordErrors.transactionGroupId?.message && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.transactionGroupId?.message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label date-select-input">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.startDate",
                        defaultMessage: "Start date",
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
                              inputFormat="dd/MM/yyyy"
                              onChange={(date, keyboardInput) => {
                                if (keyboardInput) {
                                  field.onChange(
                                    keyboardInput.length === 10 ? date : ""
                                  );
                                } else {
                                  field.onChange(date);
                                }
                              }}
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
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.minAmount",
                        defaultMessage: "Min Amount",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder="Enter Min Amount"
                        fullWidth
                        value={
                          selectChargeMethod === "FMDR" ||
                            selectChargeMethod === "USER" ||
                            selectChargeMethod === "DCC"
                            ? watch("minAmount")
                            : 0
                        }
                        {...recordRegister("minAmount")}
                        // onChange={(e) =>
                        //     setPackageDetails({
                        //         ...packageDetails,
                        //         minAmount: e.target.value,
                        //     })
                        // }
                        disabled={
                          watch("chargeMethod") === "COUNT" ||
                          watch("chargeMethod") === "VOLUME"
                        }
                        type="number"
                        componentsProps={{
                          input: {
                            step: ".01",
                          },
                        }}
                      />
                      {(watch("chargeMethod") === "FMDR" ||
                        watch("chargeMethod") === "USER" ||
                        watch("chargeMethod") === "DCC") && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.minAmount?.message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.tips",
                        defaultMessage: "Tips",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={tipsVal}
                        {...recordRegister("tips")}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setTipsVal(e?.target?.value);
                          }
                        }}
                      >
                        <MenuItem value="">{intl.formatMessage({ id: "ActivityFeesPackages.selectTips", defaultMessage: "Select Tips" })}</MenuItem>
                        <MenuItem value="Y">Y</MenuItem>
                        <MenuItem value="N">N</MenuItem>
                      </Select>
                      {tipsVal === "" && recordErrors.tips?.message && (
                        <FormHelperText id="error-helper-text" error>
                          {recordErrors.tips?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label date-select-input">
                    <label>
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.endDate",
                        defaultMessage: "End date",
                      })}
                      {(watch("chargeMethod") === "FMDR" ||
                        watch("chargeMethod") === "USER" ||
                        watch("chargeMethod") === "DCC") && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                    </label>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                          control={control}
                          name="endDate"
                          render={({ field }) => (
                            <DatePicker
                              // placeholderText="Select date"
                              inputFormat="dd/MM/yyyy"
                              minDate={new Date()}
                              onChange={(date, keyboardInput) => {
                                if (keyboardInput) {
                                  field.onChange(
                                    keyboardInput.length === 10 ? date : ""
                                  );
                                } else {
                                  field.onChange(date);
                                }
                              }}
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
                        id: "ActivityFeesPackageDefinition.maxAmount",
                        defaultMessage: "Max Amount",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder="Enter Max Amount"
                        fullWidth
                        value={
                          selectChargeMethod === "FMDR" ||
                            selectChargeMethod === "USER" ||
                            selectChargeMethod === "DCC"
                            ? watch("maxAmount")
                            : 0
                        }
                        {...recordRegister("maxAmount")}
                        // onChange={(e) =>
                        //     setPackageDetails({
                        //         ...packageDetails,
                        //         maxAmount: e.target.value,
                        //     })
                        // }
                        disabled={
                          watch("chargeMethod") === "COUNT" ||
                          watch("chargeMethod") === "VOLUME"
                        }
                        type="number"
                        componentsProps={{
                          input: {
                            step: ".01",
                          },
                        }}
                      />
                      {(watch("chargeMethod") === "FMDR" ||
                        watch("chargeMethod") === "USER" ||
                        watch("chargeMethod") === "DCC") && (
                          <FormHelperText id="error-helper-text" error>
                            {recordErrors.maxAmount?.message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="form-group input-with-label" style={{ marginTop: "20px" }}>
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
                {watch("chargeMethod") === "USER" ? (
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "ActivityFeesPackageDefinition.feeID",
                          defaultMessage: "Fee ID",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={transIdVal}
                          {...recordRegister("transactionId")}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          onChange={(e) => {
                            if (e?.target?.value) {
                              setTransIdVal(e?.target?.value);
                            }
                          }}
                        >
                          {transactions &&
                            transactions.map((cr: any, i: number) => (
                              <MenuItem value={cr.transactionId} key={i}>
                                {cr.description}
                              </MenuItem>
                            ))}
                        </Select>
                        {transIdVal === "" &&
                          recordErrors.transactionId?.message && (
                            <FormHelperText id="error-helper-text" error>
                              {recordErrors.transactionId?.message}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6} lg={4} />
                )}
              </Grid>
            </div>
            {(watch("chargeMethod") === "COUNT" ||
              watch("chargeMethod") === "VOLUME") && (
                <>
                  <div className="title-block">
                    <div className="left-block">
                      <Typography variant={"h2"} className="pb-0">
                        {intl.formatMessage({
                          id: "ActivityFeesPackageDefinition.chargeDetails",
                          defaultMessage: "Charge Details",
                        })}
                      </Typography>
                    </div>

                    <div className="right-block mb-0">
                      <Button
                        endIcon={<img src={add_rounded} alt="add" />}
                        className="link"
                        disabled={
                          packageDetails?.packageDetailId == 0 ? true : false
                        }
                        onClick={() => {
                          if (packageDetails?.packageDetailId > 0) {
                            setAddChargeOpen(true);
                            recordChargeReset({
                              activityPackageTierId: undefined,
                              fixAmount: 0,
                              frequencyId: undefined,
                              percentageAmount: 0,
                              startAmount: undefined,
                              uptoAmount: undefined,
                            });
                            setAccumulationFrequencyVal("");
                            setIsEditChargePackage(false);
                            setChargePackageId(0);
                          }
                        }}
                      >
                        {intl.formatMessage({
                          id: "ActivityFeesPackageDefinition.addChargeDetails",
                          defaultMessage: "Add Charge Details",
                        })}
                      </Button>
                    </div>
                  </div>
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {intl.formatMessage({
                              id: "ActivityFeesPackageDefinition.accumulationFrequency",
                              defaultMessage: "Accumulation Frequency",
                            })}
                          </TableCell>
                          {/* <TableCell>
                            {intl.formatMessage({
                              id: "ActivityFeesPackageDefinition.volumeCount",
                              defaultMessage: "Volume/Count",
                            })}
                          </TableCell> */}
                          <TableCell>
                            {intl.formatMessage({
                              id: "ActivityFeesPackageDefinition.percentageAmount",
                              defaultMessage: "Percentage Amount",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "ActivityFeesPackageDefinition.fixAmount",
                              defaultMessage: "Fix Amount",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "ActivityFeesPackageDefinition.upTo",
                              defaultMessage: "Up to",
                            })}
                          </TableCell>
                          <TableCell
                            align="center"
                            width="190px"
                            className="last-column-border-header"
                          >
                            {intl.formatMessage({
                              id: "ActivityFeesPackageDefinition.actions",
                              defaultMessage: "Actions",
                            })}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {packageChargeList &&
                          packageChargeList.map((row: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{row.frequencyCodeSuffix}</TableCell>
                              <TableCell>{row.percentageAmount}</TableCell>
                              <TableCell>{row.fixAmount}</TableCell>
                              <TableCell>{row.uptoAmount}</TableCell>
                              <TableCell
                                align="center"
                                width="190px"
                                className="last-column-border"
                              >
                                <div className="action btns-block">
                                  <IconButton
                                    className="border-icon-btn no-border sm"
                                    onClick={() =>
                                      onEditChargePackage(
                                        row?.activityPackageTierId
                                      )
                                    }
                                  >
                                    <img src={edit_ic} alt="mail" />
                                  </IconButton>
                                  <IconButton
                                    className="border-icon-btn no-border sm"
                                    onClick={() =>
                                      onDeleteChargePackage(
                                        row?.activityPackageTierId
                                      )
                                    }
                                  >
                                    <img src={delete_ic} alt="mail" />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        {packageChargeList && packageChargeList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="last-column-border">
                              <p style={{ textAlign: "center" }}>
                                {intl.formatMessage({
                                  id: "ActivityFeesPackageDefinition.noDataFound",
                                  defaultMessage: "No Data Found.",
                                })}
                              </p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              onClick={handleClose}
            >
              {intl.formatMessage({
                id: "ActivityFeesPackageDefinition.cancel",
                defaultMessage: "Cancel",
              })}
            </Button>
            <Button
              type="submit"
              disableElevation
              variant="contained"
              disabled={recordIsSubmitting}
            >
              {intl.formatMessage({
                id: "ActivityFeesPackageDefinition.save",
                defaultMessage: "Save",
              })}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={addChargeOpen}
        onClose={handleAddChargeClose}
        className="c-dialog"
      >
        <form onSubmitCapture={recordChargeHandleSubmit(onSubmitChargeDetails)}>
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "ActivityFeesPackageDefinition.addChargeDetail",
                    defaultMessage: "Add Charge Details",
                  })}
                </Typography>
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
                        id: "ActivityFeesPackageDefinition.accumulationFrequency",
                        defaultMessage: "Accumulation Frequency",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder="Select"
                        {...recordChargeRegister("frequencyId")}
                        value={accumulationFrequencyVal}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setAccumulationFrequencyVal(e?.target?.value);
                          }
                        }}
                      >
                        <MenuItem value="">{intl.formatMessage({ id: "ActivityFeesPackagesDefinition.selectAccumulationFrequency", defaultMessage: "Select Accumulation Frequency" })}</MenuItem>
                        {frequency &&
                          frequency.map((f: SystemCodeModel) => (
                            <MenuItem
                              value={f.codeSuffix}
                              key={f.codeSuffix}
                              onClick={() =>
                                setFreqSystemCodeId(f.systemCodeId)
                              }
                            >
                              {f.description}
                            </MenuItem>
                          ))}
                      </Select>
                      {accumulationFrequencyVal === "" &&
                        recordChargeErrors?.frequencyId?.message && (
                          <FormHelperText id="error-helper-text" error>
                            {recordChargeErrors?.frequencyId?.message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.percentageAmount",
                        defaultMessage: "Percentage Amount",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        {...recordChargeRegister("percentageAmount")}
                        placeholder="Write Percentage Amount"
                        fullWidth
                        type="number"
                        componentsProps={{
                          input: {
                            step: ".01",
                          },
                        }}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {recordChargeErrors?.percentageAmount?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.volumeCount",
                        defaultMessage: "Volume/count",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        {...recordChargeRegister("volumeCountApplied")}
                        placeholder="Write your name"
                        fullWidth
                        type="number"
                      />
                      <FormHelperText id="error-helper-text" error>
                        {recordChargeErrors?.volumeCountApplied?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>*/}
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.fixAmount",
                        defaultMessage: "Fix Amount",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder="Write Fix Amount"
                        fullWidth
                        {...recordChargeRegister("fixAmount")}
                        type="number"
                        componentsProps={{
                          input: {
                            step: ".01",
                          },
                        }}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {recordChargeErrors?.fixAmount?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "ActivityFeesPackageDefinition.upToAmount",
                        defaultMessage: "Up To Amount",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder="Write Up To Amount"
                        fullWidth
                        {...recordChargeRegister("uptoAmount")}
                        type="number"
                        componentsProps={{
                          input: {
                            step: ".01",
                          },
                        }}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {recordChargeErrors?.uptoAmount?.message}
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
              onClick={handleAddChargeClose}
            >
              {intl.formatMessage({
                id: "ActivityFeesPackageDefinition.cancel",
                defaultMessage: "Cancel",
              })}
            </Button>
            <Button disableElevation variant="contained" type="submit">
              {intl.formatMessage({
                id: "ActivityFeesPackageDefinition.save",
                defaultMessage: "Save",
              })}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default ActivityFeesPackageDefinition;
