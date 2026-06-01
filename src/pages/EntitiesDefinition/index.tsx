import React, { useRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { down_arrow_icon, ic_check, ic_checked } from "../../assets/images";
import {
  Checkbox,
  SelectChangeEvent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputBase,
  MenuItem,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  FormHelperText,
  Switch,
} from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";
import { useIntl } from "react-intl";
import EntityMainInfo from "../../components/EntityMainInfo";
import EntityPaymentAccounts from "../../components/EntityPaymentAccounts";
import EntityTerminal from "../../components/EntityTerminal";
import {
  EntityDefinitionModel,
  EntityLevelModel,
  EntityListModel,
} from "../../models/entityManagement/EntityModel";
import { useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import EntityContacts from "../../components/EntityContacts";
import EntityAddress from "../../components/EntityAddress";
import { Institution } from "../../models/configuration/InstitutionModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { MccService } from "../../services/configuration/mcc-services";
import { MccModel } from "../../models/configuration/MccModel";
import { BusinessTypeModel } from "../../models/configuration/BusinessTypeModel";
import { ActivityFeesPackagesService } from "../../services/configuration/activity-fee-service";
import {
  ActivityFeesPackage,
  ActivityFeesPackageDefinationModel,
  NoNActivityFeesPackageDefinationModel,
} from "../../models/configuration/ActivityFeesPackageModel";
import { EntityService } from "../../services/entityManagement/entity-service";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router";
import Swal from "sweetalert2";
import {
  Errors,
  StatusCode,
  OptionType,
  CodePrefix,
} from "../../utils/constant";
import { NonActivityFeesPackagesService } from "../../services/configuration/nonactivity-fee-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import ReactSelect, { createFilter } from "react-select";
import _, { constant } from "lodash";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { AccountingTemplateHDRModel } from "../../models/configuration/AccountingTemplateHDRModel";
import { AccountingTemplateHDRService } from "../../services/configuration/accounting-template-hdr-service";
import { AccountingTemplateSubHeader } from "../../models/configuration/AccountingTemplateDetailsModel";
import { AccountingTemplateSubheaderService } from "../../services/configuration/accounting-template-hdr-service";

function EntitiesDefinition() {
  const { id } = useParams<{ id?: any }>();
  const navigate = useNavigate();
  const location: any = useLocation();
  const selectedInstitutionId =
    location && location.state && location.state.institutionId;
  var isInsertMode = id ? false : true;
  const currentPath = location.pathname;
  isInsertMode = isInsertMode === true? isInsertMode:  currentPath.includes('/entities-definition-clone')
  var entityIdDisabled = !currentPath.includes('/entities-definition-clone');
  const [entityLevels, setEntityLevels] = React.useState<EntityLevelModel[]>(
    []
  );
  const [parentEntityList, setParentEntityList] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [parentId, setParentId] = useState<{ label: string; value: string }>();
  const [mccId, setMccId] = useState<{ label: string; value: string }>();
  const [entityDetails, setEntityDetails] =
    React.useState<EntityDefinitionModel>(new EntityDefinitionModel());

  const childRefAddress = useRef<any>();
  const childRefMainInfo = useRef<any>();

  const [selectActivityFeePackageValue, setSelectActivityFeePackageValue] =
    React.useState<any>("");
  const [selectAccountingTemplateValue, setSelectAccountingTemplateValue] =
    React.useState<any>("");
  const [institutionList, setInstitutionList] = useState<Institution[]>([]);
  const [mccList, setMccList] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [businessTypeList, setBusinessTypeList] = React.useState<
    SystemCodeModel[]
  >([]);
  const [businessTypeId, setBusinessTypeId] = React.useState<number | null>(
    null
  );
  const [activityFeePackageList, setActivityFeePackageList] = React.useState<
    ActivityFeesPackage[]
  >([]);
  const [accountingTemplateHdrList, setAccountingTemplateHdrList] = React.useState<
    AccountingTemplateHDRModel[]
  >([]);
  const [accountingTemplateSubHeaderList, setAccountingTemplateSubHeaderList] = React.useState<
    AccountingTemplateSubHeader[]
  >([]);
  const [activityDefinationList, setActivityDefinationList] =
    React.useState<ActivityFeesPackageDefinationModel[]>();
  const [
    selectNonActivityFeePackageValue,
    setSelectNonActivityFeePackageValue,
  ] = React.useState<any>("");
  const [nonActivityFeePackageList, setNonActivityFeePackageList] =
    React.useState<ActivityFeesPackage[]>([]);
  const [nonActivityDefinationList, setNonActivityDefinationList] =
    React.useState<NoNActivityFeesPackageDefinationModel[]>();
  const intl = useIntl();
  const [enable, setIsEnable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [mccErr, setMccErr] = React.useState("");
  const [insertSubmit, setInsertSubmit] = React.useState({
    paymentAccounts: false,
    terminal: false,
    contacts: false,
    address: false,
  });
  const [isEmptyModules, setIsEmptyModules] = React.useState({
    paymentAccounts: false,
    terminal: false,
    contacts: false,
    address: false,
  });
  const routeState = location.state as any;
  
  const mccIdRequired = "MCC is required";

  const [clonedEntityId, setClonedEntityId] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EntityDefinitionModel>({
    mode: "onChange",
    resolver: yupResolver(
      entityIdDisabled ? validations.entityUpdateValidations : validations.entityValidations
    ),
  });

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
    if (instID) {
      setValue("institutionId", instID);
      setEntityDetails((prev) => ({
        ...prev,
        institutionId: instID,
      }));
      getActiveActivityPackageByInstitutionId(instID);
      getActiveNonActivityPackagesByInstitutionId(instID);
      //getByInstitutionId(instID);
      getAllEntityLevelsByInstitutionId(instID);
      getAccountingTemplateHdrByInstitutionId(instID);
    }
  };
  useEffect(() => {
    if (selectedInstitutionId) {
      setValue("institutionId", selectedInstitutionId);
      setEntityDetails((prev) => ({
        ...prev,
        institutionId: selectedInstitutionId,
      }));
      getActiveActivityPackageByInstitutionId(selectedInstitutionId);
      getActiveNonActivityPackagesByInstitutionId(selectedInstitutionId);
      getAccountingTemplateHdrByInstitutionId(selectedInstitutionId);
      //getByInstitutionId(selectedInstitutionId);
      getAllEntityLevelsByInstitutionId(selectedInstitutionId);
    } else {
      setInstitutefromLocalStorage();
    }
    getActiveInstitution();
    getAllMcc();
    getAllBusinessTypes();
  }, []);

  useEffect(() => {
    getAllBusinessTypes();
  }, [watch("institutionId")]);

  useEffect(() => {
    if (id) {
      getEntityById(id);
    } else {
      setEntityDetails((prev) => ({
        ...prev,
        status: enable ? "1" : "0",
      }));
    }
  }, []);

  if (!currentPath.includes('/entities-definition-clone') && !id) {
    entityIdDisabled = currentPath.includes('/entities-definition-clone');
  }

  const handleStatusChange = () => {
    const tmpVal = !enable;
    setIsEnable(tmpVal);
    setEntityDetails((prev) => ({
      ...prev,
      status: tmpVal ? "1" : "0",
    }));
  };

  const getEntityById = async (id: string) => {

    await EntityService.getById(id,routeState.instId)
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        setSelectAccountingTemplateValue(data.acctTemplateHdrId);
        setClonedEntityId(data.entityId);

        const parseDate = (dateString: string) => {
          if (!dateString) return null;
          const dateParts = dateString.split(",")[0].split("/");
          const timePart = dateString.split(",")[1]?.trim(); // Make sure to handle the case when timePart is not available
          const [month, day, year] = dateParts;
          let fullYear = parseInt(year);
          if (fullYear < 100) {
            // Convert two-digit year to four-digit year
            fullYear += 2000;
          }
          const [hours, minutes] = timePart ? timePart.split(":").map((part) => parseInt(part)) : [0, 0];
          const date = new Date(fullYear, parseInt(month) - 1, parseInt(day), hours, minutes);
          return isNaN(date.getTime()) ? null : date;
        };

        const formatData = {
          ...data,
          contractDate: parseDate(data.contractDate),
          actualStartDate: parseDate(data.actualStartDate),
          expStartDate: parseDate(data.expStartDate),
          lastTransDate: parseDate(data.lastTransDate),
          terminationDate: parseDate(data.terminationDate),
          status: data?.status === "1",
        };
        const previousData = getValues()
        reset({ ...previousData, ...formatData });
        setIsEnable(formatData.status);
        setSelectActivityFeePackageValue(
          formatData && formatData.activityPackageId
        );
        getActivityDefinationList(formatData && formatData.activityPackageId);
        getAccountingTemplateSubHeaderList(formatData && formatData.acctTemplateHdrId);
        setSelectNonActivityFeePackageValue(
          formatData && formatData.nonActivityPackageId
        );
        getNonActivityDefinationList(
          formatData && formatData.nonActivityPackageId
        );
        getParentEntities(
          formatData?.institutionId,
          formatData?.entityLevelId,
          formatData?.parentId
        );
        setEntityDetails({
          ...formatData,
          businessType: formatData.businessTypeCodeDescription,
          businessTypeId: formatData.businessTypeSystemCodeId,
        });
        setValue("businessTypeId", formatData.businessTypeSystemCodeId, { shouldValidate: true });
        setMccId({
          label: `${formatData?.mccName} - ${formatData?.mccDescription}`,
          value: formatData?.mccId,
        });
        setBusinessTypeId(formatData && formatData?.businessTypeSystemCodeId);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getActiveInstitution = async () => {
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitutionList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  // const getByInstitutionId = async (instID: string) => {
  //   await EntityService.getByInstitutionId(instID)
  //     .then((res) => {
  //       const filteredEntities = res.data.filter(
  //         (s: any) => s.status === "1" && s.entityId != id
  //       );
  //       setEntityList(filteredEntities);
  //     })
  //     .catch((err) =>   toast.error(err.response.data.errors[0]));
  // };

  const getAllBusinessTypes = async () => {
    const model = {
      codePrefix: CodePrefix.BUSINESS_TYPE,
      institutionId: getValues("institutionId") ?? selectedInstitutionId,
    };
    await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
      .then((res) => {
        setBusinessTypeList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllEntityLevelsByInstitutionId = async (id: string) => {
    if(routeState.instId!=null && routeState.instId!=undefined && routeState.instId!=""){
        id=routeState.instId;
    }
    await EntityService.getAllEntityLevelsByInstitutionId(id)
      .then((res) => {
        setEntityLevels([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllMcc = async () => {
    setIsLoading(true);
    let option: any = [];
    await MccService.getAllMcc()
      .then((res) => {
        if (res.data) {
          option = res?.data?.map((data) => {
            const label = `${data.mcc} - ${data.description}`;
            const value = data.mccId.toString();
            return { label, value };
          });
        }
        setMccList(option);
        setIsLoading(false);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAccountingTemplateHdrByInstitutionId = async (instId: string) => {
    await AccountingTemplateHDRService.getAllAccountingTemplateHDRsByInstitution(
      instId
    )
      .then((res) => {
        setAccountingTemplateHdrList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getActiveActivityPackageByInstitutionId = async (instId: string) => {
    await ActivityFeesPackagesService.getActiveActivityPackageByInstitutionId(
      instId
    )
      .then((res) => {
        setActivityFeePackageList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getActiveNonActivityPackagesByInstitutionId = async (
    instId: string
  ) => {
    await NonActivityFeesPackagesService.getActiveNonActivityPackagesByInstitutionId(
      instId
    )
      .then((res) => {
        setNonActivityFeePackageList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const handleAccountingTemplateChange = (event: SelectChangeEvent) => {
    setSelectAccountingTemplateValue(event.target.value);
    setEntityDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (parseInt(event.target.value) !== 0) {
      getAccountingTemplateSubHeaderList(parseInt(event.target.value));
    } else {
      setAccountingTemplateSubHeaderList([]);
    }
  };

  const handleActivityFeePackageChange = (event: SelectChangeEvent) => {
    setSelectActivityFeePackageValue(event.target.value);
    setEntityDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (event.target.value !== "") {
      getActivityDefinationList(event.target.value);
    } else {
      setActivityDefinationList([]);
    }
  };

  const handleNonActivityFeePackageChange = (event: SelectChangeEvent) => {
    setSelectNonActivityFeePackageValue(event.target.value);
    setEntityDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (event.target.value !== "") {
      getNonActivityDefinationList(event.target.value);
    } else {
      setNonActivityDefinationList([]);
    }
  };

  const handleEntityLevelChange = async (event: any) => {
    setEntityDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
      parentId: "",
    }));
    if (event.target.value !== "") {
      const model = {
        institutionId: getValues("institutionId"),
        entityLevelId: event.target.value,
      };
      setParentId({ label: "", value: "" });
      getParentEntities(model.institutionId, model.entityLevelId, null);
    } else {
      setParentId({ label: "", value: "" });
      setParentEntityList([]);
    }
  };

  const getParentEntities = async (
    instId: string,
    entityLevelId: number,
    selectedParentId: any
  ) => {
    const model = {
      institutionId: instId,
      entityLevelId: entityLevelId,
    };
    await EntityService.getEntitiesByEntityLevelAndInstitution(model)
      .then((res) => {
        const filteredEntities = res.data.filter((s: any) => s.entityId != id);
        const option = filteredEntities.map((data) => {
          const label = data.entityName;
          const value = data.entityId;
          return { label, value };
        });
        setParentEntityList(option);
        if (selectedParentId) {
          const parentEntity = option.filter(
            (item) => item.value === selectedParentId
          )[0];
          setParentId(parentEntity);
        }
        if (_.isEmpty(option)) {
          setParentId({ value: "", label: "" });
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAccountingTemplateSubHeaderList = async (acctTemplateHdrId: number) => {
    if (acctTemplateHdrId && (acctTemplateHdrId !== 0 || acctTemplateHdrId === null)) {
      AccountingTemplateSubheaderService.getAllAccountingTemplateHDRSubByAccrTemplateHdrSubId(acctTemplateHdrId)
        .then((resDefination) => {
          const definationList = JSON.parse(JSON.stringify(resDefination.data));
          setAccountingTemplateSubHeaderList(definationList);
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };

  const getActivityDefinationList = async (packageId: string) => {
    if(packageId &&(packageId !== "" || packageId !== null)){
      ActivityFeesPackagesService.getAllActivityFeePackagesDefination(packageId,selectedInstitutionId)
        .then((resDefination) => {
          const definationList = JSON.parse(JSON.stringify(resDefination.data));
          setActivityDefinationList(definationList);
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };

  const getNonActivityDefinationList = async (packageId: string) => {
    NonActivityFeesPackagesService.getAllNonActivityPackageDetailsByPackageId(
      packageId
    )
      .then((resDefination) => {
        const definationList = JSON.parse(JSON.stringify(resDefination.data));
        setNonActivityDefinationList(definationList);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value?: number;
  }

  const [value, setvalue] = React.useState(0);

  const TabPanel = (props: TabPanelProps) => {
    const { children, index } = props;
    return (
      <div
        role="tabpanel"
        className="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {children}
      </div>
    );
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setvalue(newValue);
  };

  // const handleTextChange = (e: any) => {
  //   setValue(e.target.name, e.target.value)
  //   setEntityDetails((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const handleSelectChange = (e: any) => {
    setEntityDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleParentChange = (e: OptionType) => {
    if (e && e?.value) {
      setEntityDetails((prev) => ({ ...prev, parentId: e.value!.toString() }));
      setParentId({ value: e?.value!, label: e?.label! });
    } else {
      setEntityDetails((prev) => ({ ...prev, parentId: "" }));
      setParentId({ label: '', value: '' });
    }
  };

  const handleMccChange = (e: any) => {
    setEntityDetails((prev) => ({ ...prev, mccId: e.value!.toString() }));
    setMccId({ value: e?.value!, label: e?.label! });
    setMccErr("");
  };

  const onSubmit = () => {
    if (!entityIdDisabled && clonedEntityId === getValues().entityId) {
      toast.error("Please enter a new Id for the cloned entity");
    }
    else if (
      mccId?.value === "" ||
      mccId?.value === undefined ||
      mccId?.value === null
    ) {
      setMccErr(mccIdRequired);
    } else {
      childRefMainInfo.current && childRefMainInfo.current.onSubmitMainInfo();
      if (id) {
        childRefAddress.current && childRefAddress.current.onSubmitAddress();
      } else {
        setInsertSubmit({
          paymentAccounts: true,
          terminal: true,
          contacts: true,
          address: true,
        });
      }
    }
  };

  const onDelete = () => {
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
        EntityService.deleteById(id,getValues("institutionId") ?? selectedInstitutionId)
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
              navigate("/entities-listing");
            }
          })
          .catch((err) => {
            if (
              err &&
              err.response
              // &&
             // err.response.data === Errors.ReferenceExists
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

  const checkIsEmptyModules = (module: string, value: boolean) => {
    if (module === "paymentAccounts") {
      setIsEmptyModules((prev) => ({ ...prev, paymentAccounts: value }));
      setInsertSubmit({
        ...insertSubmit,
        paymentAccounts: false,
      });
    } else if (module === "terminal") {
      setIsEmptyModules((prev) => ({ ...prev, terminal: value }));
      setInsertSubmit({
        ...insertSubmit,
        terminal: false,
      });
    } else if (module === "address") {
      setIsEmptyModules((prev) => ({ ...prev, address: value }));
      setInsertSubmit({
        ...insertSubmit,
        address: false,
      });
    } else if (module === "contacts") {
      setIsEmptyModules((prev) => ({ ...prev, contacts: value }));
      setInsertSubmit({
        ...insertSubmit,
        contacts: false,
      });
    }
  };

  const checkFormValues = () => {
    if (!getValues()?.contractDate) {
      setValue("contractDate", entityDetails.contractDate);
    }
    if (!getValues()?.actualStartDate) {
      setValue("actualStartDate", entityDetails.actualStartDate);
    }
    if (
      mccId?.value === "" ||
      mccId?.value === undefined ||
      mccId?.value === null
    ) {
      setMccErr(mccIdRequired);
    }
    if (!isValid && !isInsertMode) {
      if (
        errors?.mobile1 ||
        errors?.phone1 ||
        childRefAddress.current?.mobile1 === "" ||
        childRefAddress.current?.phone1 === "" ||
        !childRefAddress.current?.values ||
        childRefAddress.current?.values?.phone1 === "" ||
        childRefAddress.current?.values?.mobile1 === ""
      ) {
        setvalue(5);
      }
    }
    routeState.instId=getValues("institutionId");
  };

  return (
    <>
      <div className="wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <main className="main-content">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"} className="pb-0">
                  {intl.formatMessage({
                    id: "Entity.entitiesDefinition",
                    defaultMessage: "Entity Definition",
                  })}
                </Typography>
              </div>
            </div>
            <div className="input-elements">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6} xl={3}>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.institution",
                        defaultMessage: "Institution",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        {...register("institutionId")}
                        onChange={handleSelectChange}
                        value={
                          entityDetails.institutionId
                            ? entityDetails.institutionId
                            : ""
                        }
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder={intl.formatMessage({
                          id: "Entity.select",
                          defaultMessage: "Select",
                        })}
                      >
                        {institutionList &&
                          institutionList.length > 0 &&
                          institutionList.map((type) => {
                            return (
                              <MenuItem
                                value={type.institutionId}
                                key={type.institutionId}
                              >
                                {type.institutionName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group ">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.entityLevel",
                        defaultMessage: "Entity Level",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder={intl.formatMessage({
                          id: "Entity.select",
                          defaultMessage: "Select",
                        })}
                        {...register("entityLevelId")}
                        onChange={handleEntityLevelChange}
                        value={
                          entityDetails?.entityLevelId
                            ? entityDetails?.entityLevelId
                            : ""
                        }
                      >
                        <MenuItem value="">
                          <em>
                            {intl.formatMessage({
                              id: "Entity.select",
                              defaultMessage: "Select",
                            })}
                          </em>
                        </MenuItem>
                        {entityLevels &&
                          entityLevels.length > 0 &&
                          entityLevels.map((item) => (
                            <MenuItem
                              value={item.entityLevelId}
                              key={item.entityLevelId}
                            >
                              {item.hierarchyLevel} - {item.typeDescription}
                            </MenuItem>
                          ))}
                      </Select>
                      {(entityDetails.entityLevelId
                        ? entityDetails.entityLevelId
                        : null) === null && errors.entityLevelId?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {validations.entityValidationMessages.entityLevelId}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </div>

                  <div className="input-with-label form-group mb-0">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.entityId",
                        defaultMessage: "Entity ID",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.placeholder.entityId",
                          defaultMessage: "Enter Entity Id",
                        })}
                        error
                        fullWidth
                        {...register("entityId")}
                        disabled={entityIdDisabled}
                      // value={entityDetails.entityId}
                      // onChange={handleTextChange}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.entityId?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.name",
                        defaultMessage: "Name",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.placeholder.name",
                          defaultMessage: "Enter Name",
                        })}
                        error
                        fullWidth
                        {...register("entityName")}
                      // value={entityDetails.entityName}
                      // onChange={handleTextChange}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.entityName?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.altName",
                        defaultMessage: "Alternate Name",
                      })}

                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.placeholder.altName",
                          defaultMessage: "Enter Alternate Name",
                        })}
                        error
                        fullWidth
                        {...register("entityNameAlt")}
                      // value={entityDetails.entityNameAlt}
                      // onChange={handleTextChange}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.entityNameAlt?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group mb-0">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.doingBusinessAs",
                        defaultMessage: "Doing Business AS",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.placeholder.doingBusinessAs",
                          defaultMessage: "Enter Doing Business As",
                        })}
                        error
                        fullWidth
                        {...register("dbaName")}
                      // value={entityDetails.dbaName}
                      // onChange={handleTextChange}
                      />
                      {
                        <FormHelperText id="error-helper-text" error>
                          {errors.dbaName?.message}
                        </FormHelperText>
                      }
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.doingBusinessAsAlt",
                        defaultMessage: "Doing Business AS Alt",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.placeholder.doingBusinessAsAlt",
                          defaultMessage: "Enter Doing Business As Alt",
                        })}
                        error
                        fullWidth
                        {...register("dbaNameAlt")}
                      // value={entityDetails.dbaNameAlt}
                      // onChange={handleTextChange}
                      />
                      {
                        <FormHelperText id="error-helper-text" error>
                          {errors.dbaNameAlt?.message}
                        </FormHelperText>
                      }
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.parent",
                        defaultMessage: "Parent",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <ReactSelect
                        filterOption={createFilter({
                          matchFrom: "any",
                          stringify: (option) => `${option.label}`,
                        })}
                        {...register("parentId")}
                        value={{
                          value: parentId?.value,
                          label: parentId?.label,
                        }}
                        onChange={(e) => handleParentChange(e!)}
                        isClearable
                        options={parentEntityList}
                        placeholder="Select..."
                      />
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group mb-0">
                    <FormGroup row className="checbox-grp">
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={<img src={ic_check} alt="" />}
                            checkedIcon={<img src={ic_checked} alt="" />}
                            {...register("onHoldInd")}
                            onChange={(e) =>
                              setEntityDetails({
                                ...entityDetails,
                                onHoldInd:
                                  e.target.checked === true ? "Y" : "N",
                              })
                            }
                            checked={
                              entityDetails.onHoldInd === "Y" ||
                                entityDetails.onHoldInd === "y"
                                ? true
                                : false
                            }
                          />
                        }
                        label={intl.formatMessage({
                          id: "Entity.label.onHold",
                          defaultMessage: "On Hold",
                        })}
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={<img src={ic_check} alt="" />}
                            checkedIcon={<img src={ic_checked} alt="" />}
                            {...register("hotMerchantFlag")}
                            onChange={(e) =>
                              setEntityDetails({
                                ...entityDetails,
                                hotMerchantFlag:
                                  e.target.checked === true ? "Y" : "N",
                              })
                            }
                            checked={
                              entityDetails.hotMerchantFlag === "Y" ||
                                entityDetails.hotMerchantFlag === "y"
                                ? true
                                : false
                            }
                          />
                        }
                        label={intl.formatMessage({
                          id: "Entity.label.hot",
                          defaultMessage: "Hot",
                        })}
                        labelPlacement="start"
                      />
                      <div className="form-switch">
                        <label>
                          {intl.formatMessage({
                            id: "Entity.label.enable",
                            defaultMessage: "Enable",
                          })}
                        </label>
                        <FormControl>
                          <Switch
                            className="custom"
                            checked={enable}
                            onChange={handleStatusChange}
                          />
                        </FormControl>
                      </div>
                    </FormGroup>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.defaultMcc",
                        defaultMessage: "Default MCC",
                      })}

                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <ReactSelect
                        filterOption={createFilter({
                          matchFrom: "any",
                          stringify: (option) => `${option.label}`,
                        })}
                        {...register("mccId")}
                        value={
                          mccId
                            ? mccId
                            : entityDetails?.mccId &&
                            mccList &&
                            mccList.length > 0 &&
                            mccList.filter(
                              (item) =>
                                item.value === entityDetails.mccId.toString()
                            )[0]
                        }
                        onChange={(e) => handleMccChange(e!)}
                        // isClearable
                        options={mccList}
                        isLoading={isLoading}
                        placeholder="Select..."
                      />
                      <FormHelperText id="error-helper-text" error>
                        {mccErr !== "" ? mccErr : ""}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.businessType",
                        defaultMessage: "Business Type",
                      })}

                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder={intl.formatMessage({
                          id: "Entity.select",
                          defaultMessage: "Select",
                        })}
                        {...register("businessTypeId")}
                        value={
                          entityDetails.businessTypeId || businessTypeId || "" // Ensure the value is null or empty initially

                        }
                        onChange={handleSelectChange}
                      >
                        <MenuItem value="">
                          <em>
                            {intl.formatMessage({
                              id: "Entity.select",
                              defaultMessage: "Select",
                            })}
                          </em>
                        </MenuItem>
                        {businessTypeList &&
                          businessTypeList.length > 0 &&
                          businessTypeList.map((type) => {
                            return (
                              <MenuItem
                                value={type.systemCodeId}
                                key={type.systemCodeId}
                                onClick={() =>
                                  setBusinessTypeId(type.systemCodeId)
                                }
                              >
                                {type.description}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {(entityDetails.businessTypeId
                        ? entityDetails.businessTypeId.toString()
                        : "") === "" && errors.businessTypeId?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {validations.entityValidationMessages.businessTypeId}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group mb-0">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.label.status",
                        defaultMessage: "Status",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder={intl.formatMessage({
                          id: "Entity.select",
                          defaultMessage: "Select",
                        })}
                        {...register("entityStatus")}
                        onChange={handleSelectChange}
                        value={
                          entityDetails.entityStatus
                            ? entityDetails.entityStatus
                            : "D"
                        }
                      >
                        <MenuItem value={"D"} key={"D"}>
                          Pilot
                        </MenuItem>
                        <MenuItem value={"T"} key={"T"}>
                          Testing
                        </MenuItem>
                        <MenuItem value={"P"} key={"P"}>
                          Production
                        </MenuItem>
                      </Select>
                      {(entityDetails.entityStatus
                        ? entityDetails.entityStatus
                        : "") === "" && errors.entityStatus?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {validations.entityValidationMessages.entityStatus}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="tab-wrapper">
              <Tabs
                value={value}
                variant="scrollable"
                onChange={handleChange}
                aria-label="basic tabs example"
                scrollButtons="auto"
              >
                <Tab
                  label={intl.formatMessage({
                    id: "Entity.tab.mainInfo",
                    defaultMessage: "Main Info",
                  })}
                />
                <Tab
                  label={`${intl.formatMessage({
                    id: "Entity.tab.paymentAccounts",
                    defaultMessage: "Payment Accounts",
                  })} ${insertSubmit.paymentAccounts ||
                    (!isInsertMode &&
                      isEmptyModules &&
                      isEmptyModules.paymentAccounts)
                    ? " *"
                    : ""
                    }`}
                  disabled={isInsertMode}
                  style={
                    insertSubmit.paymentAccounts ||
                      (!isInsertMode &&
                        isEmptyModules &&
                        isEmptyModules.paymentAccounts)
                      ? { color: "red" }
                      : {}
                  }
                />
                <Tab
                  label={`${intl.formatMessage({
                    id: "Entity.tab.terminal",
                    defaultMessage: "Terminal",
                  })} ${insertSubmit.terminal ||
                    (!isInsertMode && isEmptyModules && isEmptyModules.terminal)
                    ? " *"
                    : ""
                    }`}
                  disabled={isInsertMode}
                  style={
                    insertSubmit.terminal ||
                      (!isInsertMode && isEmptyModules && isEmptyModules.terminal)
                      ? { color: "red" }
                      : {}
                  }
                />
                <Tab
                  label={`${intl.formatMessage({
                    id: "Entity.tab.activityFees",
                    defaultMessage: "Activity Fees",
                  })} ${isInsertMode ||
                    (selectActivityFeePackageValue &&
                      selectActivityFeePackageValue !== "")
                    ? ""
                    : " *"
                    }`}
                  disabled={isInsertMode}
                  style={
                    isInsertMode ||
                      (selectActivityFeePackageValue &&
                        selectActivityFeePackageValue !== "")
                      ? {}
                      : { color: "red" }
                  }
                />
                <Tab
                  label={`${intl.formatMessage({
                    id: "Entity.tab.nonActivityFees",
                    defaultMessage: "Non Activity Fees",
                  })} ${isInsertMode ||
                    (selectNonActivityFeePackageValue &&
                      selectNonActivityFeePackageValue !== "")
                    ? ""
                    : " *"
                    }`}
                  disabled={isInsertMode}
                  style={
                    isInsertMode ||
                      (selectNonActivityFeePackageValue &&
                        selectNonActivityFeePackageValue !== "")
                      ? {}
                      : { color: "red" }
                  }
                />
                <Tab
                  label={`${intl.formatMessage({
                    id: "Entity.tab.address",
                    defaultMessage: "Address",
                  })} ${insertSubmit.address ||
                    (!isInsertMode && isEmptyModules && isEmptyModules.address)
                    ? " *"
                    : ""
                    }`}
                  disabled={isInsertMode}
                  style={
                    insertSubmit.address ||
                      (!isInsertMode && isEmptyModules && isEmptyModules.address)
                      ? { color: "red" }
                      : {}
                  }
                />
                <Tab
                  label={`${intl.formatMessage({
                    id: "Entity.tab.contacts",
                    defaultMessage: "Contacts",
                  })} ${insertSubmit.contacts ||
                    (!isInsertMode && isEmptyModules && isEmptyModules.contacts)
                    ? " *"
                    : ""
                    }`}
                  disabled={isInsertMode}
                  style={
                    insertSubmit.contacts ||
                      (!isInsertMode && isEmptyModules && isEmptyModules.contacts)
                      ? { color: "red" }
                      : {}
                  }
                />
                <Tab
                  label={`${intl.formatMessage({
                    id: "Entity.tab.accountingTemplate",
                    defaultMessage: "Accounting Template",
                  })} ${isInsertMode ||
                    (selectAccountingTemplateValue &&
                      selectAccountingTemplateValue !== "")
                    ? ""
                    : " *"
                    }`}
                  disabled={isInsertMode}
                  style={
                    isInsertMode ||
                      (selectAccountingTemplateValue &&
                        selectAccountingTemplateValue !== "")
                      ? {}
                      : { color: "red" }
                  }
                />
              </Tabs>
              <div
                role="tabpanel"
                className="tabpanel"
                hidden={value !== 0}
                id={`simple-tabpanel-${0}`}
                aria-labelledby={`simple-tab-${0}`}
              >
                <EntityMainInfo
                  reset={reset}
                  setValue={setValue}
                  getValues={getValues}
                  watch={watch}
                  getEntityById={getEntityById}
                  ref={childRefMainInfo}
                  errors={errors}
                  register={register}
                  value={value}
                  entityDetails={entityDetails}
                  businessTypeId={businessTypeId}
                  setEntityDetails={setEntityDetails}
                  control={control}
                  entityId={getValues().entityId}
                  entityIdDisabled={entityIdDisabled}
                  institutionId={selectedInstitutionId}
                  activityFeePackageList={activityFeePackageList}
                />
              </div>
              <EntityPaymentAccounts
                value={value}
                TabPanel={TabPanel}
                institutionId={entityDetails && entityDetails.institutionId}
                checkIsEmptyModules={checkIsEmptyModules}
              />
              <EntityTerminal
                value={value}
                id={id}
                TabPanel={TabPanel}
                setValue={setValue}
                institutionId={entityDetails && entityDetails.institutionId}
                checkIsEmptyModules={checkIsEmptyModules}
              />
              <div
                role="tabpanel"
                className="tabpanel"
                hidden={value !== 3}
                id={`simple-tabpanel-${3}`}
                aria-labelledby={`simple-tab-${3}`}
              >
                <div className="panel-body">
                  <Grid spacing={3} container>
                    <Grid item xs={12} lg={4} sm={6} xl={4}>
                      <div className="input-with-label form-group">
                        <label>
                          {intl.formatMessage({
                            id: "Entity.label.packageName",
                            defaultMessage: "Package Name",
                          })}
                        </label>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            value={selectActivityFeePackageValue}
                            {...register("activityPackageId")}
                            onChange={handleActivityFeePackageChange}
                            inputProps={{ "aria-label": "Without label" }}
                            IconComponent={() => (
                              <img src={down_arrow_icon} alt="" />
                            )}
                          >
                            <MenuItem value="">
                              <em>
                                {intl.formatMessage({
                                  id: "Entity.select",
                                  defaultMessage: "Select",
                                })}
                              </em>
                            </MenuItem>
                            {activityFeePackageList &&
                              activityFeePackageList.length > 0 &&
                              activityFeePackageList.map((type) => {
                                return (
                                  <MenuItem
                                    value={type.packageId}
                                    key={type.packageId}
                                  >
                                    {type.packageName}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </div>
                    </Grid>
                  </Grid>
<TableContainer sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
  <Table
    sx={{
      minWidth: 650,
      borderCollapse: 'collapse',
      '& th, & td': {
        border: '1px solid #ddd',
      },
    }}
    aria-label="simple table"
  >
    <TableHead>
      <TableRow>
        <TableCell>Charge Method</TableCell>
        <TableCell>Currency Code</TableCell>
        <TableCell>Tran. Group</TableCell>
        <TableCell>Assigned Tran. ID</TableCell>
        <TableCell>Scheme</TableCell>
        <TableCell>Tips (Y/N)</TableCell>
        <TableCell>Amount</TableCell>
        <TableCell>% Amount</TableCell>
        <TableCell>Min Amnt</TableCell>
        <TableCell>Max Amnt</TableCell>
        <TableCell>Start Date</TableCell>
        <TableCell>End Date</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Issuer ACQ Profile</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {activityDefinationList?.map((row, i) => (
        <TableRow key={i}>
          <TableCell>{row.chargeMethod}</TableCell>
          <TableCell>{row.currencyCode}</TableCell>
          <TableCell>{row.tranGroupName}</TableCell>
          <TableCell>{row.tranName}</TableCell>
          <TableCell>{row.cardScheme}</TableCell>
          <TableCell>{row.tips}</TableCell>
          <TableCell>{row.fixAmount}</TableCell>
          <TableCell>{row.percentageAmount}</TableCell>
          <TableCell>{row.minAmount}</TableCell>
          <TableCell>{row.maxAmount}</TableCell>
          <TableCell>{moment(row.startDate, 'DD/MM/yyyy').format('DD/MM/YYYY')}</TableCell>
          <TableCell>{moment(row.endDate, 'DD/MM/yyyy').format('DD/MM/YYYY')}</TableCell>
          <TableCell>{row.status === '1' ? 'Enabled' : 'Disabled'}</TableCell>
          <TableCell>{row.issuer}</TableCell>
        </TableRow>
      ))}
      {activityDefinationList?.length === 0 && (
        <TableRow>
          <TableCell colSpan={14} align="center">
            No Data Found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

                </div>
              </div>
              <div
                role="tabpanel"
                className="tabpanel"
                hidden={value !== 4}
                id={`simple-tabpanel-${4}`}
                aria-labelledby={`simple-tab-${4}`}
              >
                <div className="panel-body">
                  <Grid spacing={3} container>
                    <Grid item xs={12} lg={4} sm={6} xl={4}>
                      <div className="input-with-label form-group">
                        <label>
                          {intl.formatMessage({
                            id: "Entity.label.packageName",
                            defaultMessage: "Package Name",
                          })}
                        </label>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            {...register("nonActivityPackageId")}
                            value={selectNonActivityFeePackageValue}
                            onChange={handleNonActivityFeePackageChange}
                            inputProps={{ "aria-label": "Without label" }}
                            IconComponent={() => (
                              <img src={down_arrow_icon} alt="" />
                            )}
                          >
                            <MenuItem value="">
                              <em>
                                {intl.formatMessage({
                                  id: "Entity.select",
                                  defaultMessage: "Select",
                                })}
                              </em>
                            </MenuItem>
                            {nonActivityFeePackageList &&
                              nonActivityFeePackageList.length > 0 &&
                              nonActivityFeePackageList.map((type) => {
                                return (
                                  <MenuItem
                                    value={type.packageId}
                                    key={type.packageId}
                                  >
                                    {type.packageName}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </div>
                    </Grid>
                  </Grid>
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
                              id: "NonActivityFeesPackage.assignedtranIdTitle",
                              defaultMessage: "Assigned Tran. ID",
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
                            <div className="tooltip-wrapper">
                              {intl.formatMessage({
                                id: "NonActivityFeesPackage.charge",
                                defaultMessage: "Charge",
                              })}
                            </div>
                          </TableCell>

                          <TableCell>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.amountPercentage",
                              defaultMessage: "% Amount",
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
                          <TableCell sx={{
                            border: '1px solid #ddd',
                          }}>
                            {intl.formatMessage({
                              id: "NonActivityFeesPackage.status",
                              defaultMessage: "Status",
                            })}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {nonActivityDefinationList &&
                          nonActivityDefinationList.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.chargeTypeCodeSuffix}</TableCell>
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
                              <TableCell>
                                {moment(row.startDate, "DD/MM/yyyy").format(
                                  "DD/MM/YYYY"
                                )}
                              </TableCell>
                              <TableCell>
                                {moment(row.endDate, "DD/MM/yyyy").format(
                                  "DD/MM/YYYY"
                                )}
                              </TableCell>
                              <TableCell sx={{
                                border: '1px solid #ddd',
                              }}>
                                {row.status == "1" ? "Enabled" : "Disabled"}
                              </TableCell>
                            </TableRow>
                          ))}
                        {nonActivityDefinationList &&
                          nonActivityDefinationList.length === 0 && (
                            <TableRow>
                              <TableCell
                                colSpan={14}
                                className="last-column-border"
                              >
                                <p style={{ textAlign: "center" }}>
                                  {intl.formatMessage({
                                    id: "NonActivityFeesPackageDefinition.noDataFound",
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
              </div>
              <div
                role="tabpanel"
                className="tabpanel"
                hidden={value !== 7}
                id={`simple-tabpanel-${7}`}
                aria-labelledby={`simple-tab-${7}`}
              >
                <div className="panel-body">
                  <Grid spacing={3} container>
                    <Grid item xs={12} lg={4} sm={6} xl={4}>
                      <div className="input-with-label form-group">
                        <label>
                          {intl.formatMessage({
                            id: "Entity.label.accountingTemplateHdr",
                            defaultMessage: "Accounting Template HDR",
                          })}
                        </label>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            value={selectAccountingTemplateValue}
                            {...register("acctTemplateHdrId")}
                            onChange={handleAccountingTemplateChange}
                            inputProps={{ "aria-label": "Without label" }}
                            IconComponent={() => (
                              <img src={down_arrow_icon} alt="" />
                            )}
                          >
                            <MenuItem value={0}
                              key={0}>
                              <em>
                                {intl.formatMessage({
                                  id: "Entity.select",
                                  defaultMessage: "Select",
                                })}
                              </em>
                            </MenuItem>
                            {accountingTemplateHdrList &&
                              accountingTemplateHdrList.length > 0 &&
                              accountingTemplateHdrList.map((type) => {
                                return (
                                  <MenuItem
                                    value={type.acctTemplateHdrId}
                                    key={type.acctTemplateHdrId}
                                  >
                                    {type.accountTemplate}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </div>
                    </Grid>
                  </Grid>
                  <TableContainer>
                    <Table sx={{
                      minWidth: 650,
                      borderCollapse: 'collapse',
                      border: '1px solid #ddd',
                    }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {intl.formatMessage({
                              id: "AccountingTemplateSubHeader.templateDescription",
                              defaultMessage: "Template Description",
                            })}
                          </TableCell>
                          <TableCell>
                            {intl.formatMessage({
                              id: "AccountingTemplateSubHeader.bankCode",
                              defaultMessage: "Bank Code",
                            })}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {accountingTemplateSubHeaderList &&
                          accountingTemplateSubHeaderList.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.tenplateDescription}</TableCell>
                              <TableCell sx={{
                                border: '1px solid #ddd',
                              }}>{row.bankCode}</TableCell>
                            </TableRow>
                          ))}
                        {accountingTemplateSubHeaderList &&
                          accountingTemplateSubHeaderList.length === 0 && (
                            <TableRow>
                              <TableCell
                                colSpan={13}
                                className="last-column-border"
                              >
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
              </div>
              <EntityAddress
                ref={childRefAddress}
                TabPanel={TabPanel}
                value={value}
                register={register}
                getValues={getValues}
                errors={errors}
                reset={reset}
                institutionId={entityDetails && entityDetails.institutionId}
                checkIsEmptyModules={checkIsEmptyModules}
              />
              <EntityContacts
                TabPanel={TabPanel}
                value={value}
                institutionId={entityDetails && entityDetails.institutionId}
                checkIsEmptyModules={checkIsEmptyModules}
              />
              <div className="panel-footer btns-block right">
                {id && (
                  <Button
                    disableElevation
                    variant="contained"
                    color="error"
                    onClick={onDelete}
                  >
                    {intl.formatMessage({
                      id: "Entity.button.delete",
                      defaultMessage: "Delete",
                    })}
                  </Button>
                )}
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/entities-listing")}
                >
                  {intl.formatMessage({
                    id: "Entity.button.cancel",
                    defaultMessage: "Cancel",
                  })}
                </Button>
                <Button
                  disableElevation
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  onClick={checkFormValues}
                >
                  {intl.formatMessage({
                    id: "Entity.button.save",
                    defaultMessage: "Save",
                  })}
                </Button>
              </div>
            </div>
          </main>
        </form>
      </div>
    </>
  );
}

export default EntitiesDefinition;
