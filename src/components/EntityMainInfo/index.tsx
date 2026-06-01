import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputBase,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { date_ic, down_arrow_icon } from "../../assets/images";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { EmployeeModel } from "../../models/configuration/EmployeeModel";
import { BankCodeModel } from "../../models/entityManagement/EntityModel";
import { CurrencyService } from "../../services/configuration/currency-service";
import { EmployeeService } from "../../services/configuration/employee-service";
import { EntityService } from "../../services/entityManagement/entity-service";
import { PaymentAccountService } from "../../services/entityManagement/payment-account";
import { Errors, StatusCode } from "../../utils/constant";
import { useLocation } from "react-router";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";
import { isValid } from 'date-fns';
const EntityMainInfo = forwardRef((props: any, ref: any) => {
  const {
    register,
    errors,
    getEntityById,
    setValue,
    entityDetails,
    businessTypeId,
    setEntityDetails,
    control,
    getValues,
    entityId,
    entityIdDisabled,
    watch,
    institutionId,
    activityFeePackageList  
  } = props;

  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const intl = useIntl();
  const location: any = useLocation();
  const isClone =  location.pathname.includes('/entities-definition-clone')
  const [employeeList, setEmployeeList] = React.useState<EmployeeModel[]>([]);
  const [currencyList, setCurrencyList] = React.useState<CurrencyModel[]>([]);

  useEffect(() => {
    const setInstitutefromLocalStorage = async () => {
      // const instID = getLocalStorage(
      //   LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
      // ) as string;
      const instID = entityDetails.institutionId;
      if (instID) {
        getEmployeesByInstitutionId(instID);
      }
    };
    setInstitutefromLocalStorage();
    getAllCurrency();
  }, [entityDetails.institutionId]);

  const getEmployeesByInstitutionId = async (instID: string) => {
    await EmployeeService.getEmployeesByInstitutionId(instID)
      .then((res) => {
        const filteredEmployees = res.data.filter((s: any) => s.status == "1");
        setEmployeeList(filteredEmployees);
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  };

  const getAllCurrency = async () => {
    await CurrencyService.getActiveCurrencies()
      .then((res) => {
        setCurrencyList([...res.data]);
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  };

  const chargeValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) =>
    setEntityDetails((prev: any) => ({
      ...prev,
      [name]: (event.target as HTMLInputElement).value,
    }));

  const changeDateValue = (value: any, name: string) =>
    setEntityDetails((prev: any) => ({
      ...prev,
      [name]: value,
    }));

  const handleValueChange = (e: any) =>
    setEntityDetails((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  useImperativeHandle(ref, () => ({
    onSubmitMainInfo() {

      let model = {
        activityPackageId: (entityDetails.activityPackageId && activityFeePackageList?.length > 0)
          ? activityFeePackageList?.find((a: any) => a.packageId?.toString() === entityDetails.activityPackageId?.toString())?.recordSeqId
          : null,
        actualStartDate: moment(entityDetails.actualStartDate).format(
          "DD/MM/yyyy"
        ),
        addValueDateDays: getValues("addValueDateDays")
          ? getValues("addValueDateDays")
          : 0,
        associatedPayment: entityDetails.associatedPayment
          ? entityDetails.associatedPayment
          : "N",
        bankCodeId: entityDetails.bankCodeId ? entityDetails.bankCodeId : 0,
        businessTypeId: businessTypeId ? businessTypeId : 0,
        companyRegisterNBR: getValues("companyRegisterNBR"),
        companyVatNBR: getValues("companyVatNBR")
          ? getValues("companyVatNBR")
          : "",
        contractDate: moment(entityDetails.contractDate).format("DD/MM/yyyy"),
        dbaName: getValues("dbaName"),
        dbaNameAlt: getValues("dbaNameAlt"),
        defAccountNumber: entityDetails.defAccountNumber
          ? entityDetails.defAccountNumber
          : "",
        defIBAN: entityDetails.defIBAN ? entityDetails.defIBAN : "",
        employeeInchargeId: entityDetails.employeeIncharge,
        entityId: entityId,
        entityLevelId: entityDetails.entityLevelId
          ? entityDetails.entityLevelId
          : 0,
        entityName: getValues("entityName"),
        entityNameAlt: getValues("entityNameAlt"),
        entityStatus: entityDetails.entityStatus
          ? entityDetails.entityStatus
          : "D",
        estatementToEntity: entityDetails.estatementToEntity
          ? entityDetails.estatementToEntity
          : "N",
        expStartDate: entityDetails.expStartDate
          ? moment(entityDetails.expStartDate).format("DD/MM/yyyy")
          : "",
        hotMerchantFlag: entityDetails.hotMerchantFlag
          ? entityDetails.hotMerchantFlag
          : "N",
        institutionId: entityDetails.institutionId,
        lastTransDate: entityDetails.lastTransDate
          ? moment(entityDetails.lastTransDate).format("DD/MM/yyyy")
          : "",
        mccId: entityDetails.mccId,
        nonActivityPackageId: entityDetails.nonActivityPackageId
          ? entityDetails.nonActivityPackageId
          : "",
        onHoldInd: entityDetails.onHoldInd ? entityDetails.onHoldInd : "N",
        parentId: entityDetails.parentId ? entityDetails.parentId : "",
        paymentFrequency: entityDetails.paymentFrequency
          ? entityDetails.paymentFrequency
          : "D",
        paymentMethod: entityDetails.paymentMethod
          ? entityDetails.paymentMethod
          : "T",
        salesmanId: entityDetails.salesmanId,
        statementType: entityDetails.statementType
          ? entityDetails.statementType
          : "P",
        terminationDate: entityDetails.terminationDate
          ? moment(entityDetails.terminationDate).format("DD/MM/yyyy")
          : "",
        defSettlementCurrency: entityDetails.defSettlementCurrency,
        status:
          entityDetails.status === "1" || entityDetails.status === true
            ? "1"
            : "0",
        updateFlag: entityIdDisabled ? "1" : "0",
        acctTemplateHdrId: entityDetails.acctTemplateHdrId
          ? entityDetails.acctTemplateHdrId
          : 0,
      };
      console.log(model);
      if(isClone && id){
        EntityService.saveCloneEntity(model,  id)
        .then((res) => {
          if (res.status === StatusCode.Success) {
            if (id && entityIdDisabled) {
              toast.success("Entity updated successfully");
              getEntityById(id);
            } else {
              toast.success("Entity added successfully");
              if (res && res.data && res.data.entityId) {
                navigate(`/entities-definition/${res.data.entityId}`,{ state: { instId: entityDetails.institutionId }});
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
              }
            }
          }
        })
        .catch((err) => {
          if (
            err &&
            err.response &&
            err.response.data === Errors.uniqueEntity
          ) {
            Swal.fire(
              "Cannot Enable !",
              "Entity with same name and Status already enabled.",
              "error"
            );
          } else
          //    if (
          //   err &&
          //   err.response &&
          //   err.response.data === Errors.IdAlreadyExists
          // ) 
          {
            toast.error(err.response.data.errors[0])
          }
        });
      }
      else {
      EntityService.saveOrUpdate(model)
        .then((res) => {
          if (res.status === StatusCode.Success) {
            if (id && entityIdDisabled) {
              toast.success("Entity updated successfully");
              getEntityById(id);
            } else {
              toast.success("Entity added successfully");
              if (res && res.data && res.data.entityId) {
                navigate(`/entities-definition/${res.data.entityId}`);
                getEntityById(res.data.entityId);
              }
            }
          }
        })
        .catch((err) => {
          if (
            err &&
            err.response &&
            err.response.data === Errors.uniqueEntity
          ) {
            Swal.fire(
              "Cannot Enable !",
              "Entity with same name and Status already enabled.",
              "error"
            );
          } else
          //    if (
          //   err &&
          //   err.response &&
          //   err.response.data === Errors.IdAlreadyExists
          // )
           {
                toast.error(err.response.data.errors[0]);
          }
        });
      }
    },
  }));

  return (
    <>
      <div className="panel-body">
        <Grid spacing={5} container>
          <Grid item xs={12} md={6} xl={3}>
            <div className="input-with-label form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.companyRegisterationNo",
                  defaultMessage: "Company Registration No.",
                })}
              </label>
              <FormControl fullWidth>
                <InputBase
                  placeholder={intl.formatMessage({
                    id: "Entity.placeholder.companyRegisterationNo",
                    defaultMessage: "Enter Company Registration No.",
                  })}
                  error
                  fullWidth
                  autoComplete="off"
                  aria-describedby="error-helper-text"
                  {...register("companyRegisterNBR")}
                // value={entityDetails.companyRegisterNBR}
                // onChange={handleValueChange}
                />
                {
                  <FormHelperText id="error-helper-text" error>
                    {errors.companyRegisterNBR?.message}
                  </FormHelperText>
                }
              </FormControl>
            </div>
            <div className="input-with-label form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.companyVatNo",
                  defaultMessage: "Company VAT No.",
                })}
              </label>
              <FormControl fullWidth>
                <InputBase
                  placeholder={intl.formatMessage({
                    id: "Entity.placeholder.companyVatNo",
                    defaultMessage: "Enter Company VAT No.",
                  })}
                  error
                  fullWidth
                  autoComplete="off"
                  aria-describedby="error-helper-text"
                  {...register("companyVatNBR")}
                // value={entityDetails.companyVatNBR}
                // onChange={handleValueChange}
                />
                {
                  <FormHelperText id="error-helper-text" error>
                    {errors.companyVatNBR?.message}
                  </FormHelperText>
                }
              </FormControl>
            </div>
            <div className="input-with-label date-select-input form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.contractDate",
                  defaultMessage: "Contract Date",
                })}
                <span style={{ color: "red" }}>*</span>
              </label>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    control={control}
                    name="contractDate"
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
                          changeDateValue(date, "contractDate");
                        }}
                        value={
                          entityDetails.contractDate
                            ? entityDetails.contractDate
                            : null
                        }
                        components={{
                          OpenPickerIcon: () => {
                            return <img src={date_ic} alt="date" />;
                          },
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText id="error-helper-text" error>
                  {errors.contractDate?.message}
                </FormHelperText>
              </FormControl>
            </div>
            <div className="input-with-label date-select-input form-group mb-0">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.expectedStartdate",
                  defaultMessage: "Expected Start Date",
                })}
              </label>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    control={control}
                    name="expStartDate"
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
                          changeDateValue(date, "expStartDate");
                        }}
                        value={
                          entityDetails.expStartDate
                            ? entityDetails.expStartDate
                            : null
                        }
                        components={{
                          OpenPickerIcon: () => {
                            return <img src={date_ic} alt="date" />;
                          },
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText id="error-helper-text" error>
                  {!(watch("expStartDate")?.toLocaleDateString() > watch("contractDate")?.toLocaleDateString() &&
                    errors.expStartDate?.message === "Expected start date can't be before contract date") && errors.expStartDate?.message
                    }
                </FormHelperText>
                {/* <FormHelperText id="error-helper-text" error>
                  {errors.expStartDate?.message}
                </FormHelperText> */}
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
            <div className="input-with-label date-select-input form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.actualStartdate",
                  defaultMessage: "Actual Start Date",
                })}
                <span style={{ color: "red" }}>*</span>
              </label>

              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    control={control}
                    name="actualStartDate"
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
                          changeDateValue(date, "actualStartDate");
                        }}
                        value={
                          entityDetails.actualStartDate
                            ? entityDetails.actualStartDate
                            : null
                        }
                        components={{
                          OpenPickerIcon: () => {
                            return <img src={date_ic} alt="date" />;
                          },
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText id="error-helper-text" error>
                  {!(watch("actualStartDate")?.toLocaleDateString() > watch("contractDate")?.toLocaleDateString() &&
                    errors.actualStartDate?.message === "Actual start date can't be before contract date") && errors.actualStartDate?.message
                    }
                </FormHelperText>
                {/* <FormHelperText id="error-helper-text" error>
                  {errors.actualStartDate?.message}
                </FormHelperText> */}
              </FormControl>
            </div>
            <div className="input-with-label date-select-input form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.terminationdate",
                  defaultMessage: "Termination Date",
                })}
              </label>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    control={control}
                    name="terminationDate"
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
                          changeDateValue(date, "terminationDate");
                        }}
                        value={
                          entityDetails.terminationDate
                            ? entityDetails.terminationDate
                            : null
                        }
                        components={{
                          OpenPickerIcon: () => {
                            return <img src={date_ic} alt="date" />;
                          },
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText id="error-helper-text" error>
                  {!(watch("terminationDate")?.toLocaleDateString() > watch("actualStartDate")?.toLocaleDateString() &&
                    errors.terminationDate?.message === "Termination date can't be before actual start date") && errors.terminationDate?.message
                    }
                </FormHelperText>

                {/* <FormHelperText id="error-helper-text" error>
                  {errors.terminationDate?.message}
                </FormHelperText> */}
              </FormControl>
            </div>
            <div className="input-with-label date-select-input form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.lastTransactiondate",
                  defaultMessage: "Last Trans Date",
                })}
              </label>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    control={control}
                    name="lastTransDate"
                    render={({ field }) => (
                      <DatePicker
                        disabled
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
                        value={
                          entityDetails.lastTransDate
                            ? entityDetails.lastTransDate
                            : null
                        }
                        // components={{
                        //   OpenPickerIcon: () => {
                        //     return <img src={date_ic} alt="date" />;
                        //   },
                        // }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText id="error-helper-text" error>
                  {errors.lastTransDate?.message}
                </FormHelperText>
              </FormControl>
            </div>
            <div className="input-with-label form-group mb-0">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.associatedPayment",
                  defaultMessage: "Associated Payment",
                })}
              </label>
              <FormControl fullWidth>
                <RadioGroup
                  row
                  {...register("associatedPayment")}
                  value={
                    entityDetails.associatedPayment
                      ? entityDetails.associatedPayment
                      : "N"
                  }
                  onChange={(e) => chargeValueChange(e, "associatedPayment")}
                >
                  <FormControlLabel value="Y" control={<Radio />} label="Yes" />
                  <FormControlLabel value="N" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
            <div className="input-with-label form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.paymentMethod",
                  defaultMessage: "Payment Method",
                })}
              </label>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  IconComponent={() => <img src={down_arrow_icon} alt="" />}
                  placeholder={intl.formatMessage({
                    id: "Entity.select",
                    defaultMessage: "Select",
                  })}
                  autoComplete="off"
                  aria-describedby="error-helper-text"
                  {...register("paymentMethod")}
                  onChange={handleValueChange}
                  value={
                    entityDetails.paymentMethod
                      ? entityDetails.paymentMethod
                      : "T"
                  }
                >
                  <MenuItem value={"T"}>Transfer</MenuItem>
                  <MenuItem value={"C"}>Cheque</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="input-with-label form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.paymentFrequency",
                  defaultMessage: "Payment Frequency",
                })}
              </label>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  IconComponent={() => <img src={down_arrow_icon} alt="" />}
                  placeholder={intl.formatMessage({
                    id: "Entity.select",
                    defaultMessage: "Select",
                  })}
                  autoComplete="off"
                  aria-describedby="error-helper-text"
                  {...register("paymentFrequency")}
                  onChange={handleValueChange}
                  value={
                    entityDetails.paymentFrequency
                      ? entityDetails.paymentFrequency
                      : "D"
                  }
                >
                  <MenuItem value={"D"}>Daily</MenuItem>
                  <MenuItem value={"W"}>Weekly</MenuItem>
                  <MenuItem value={"M"}>Monthly</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="input-with-label  date-select-input form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: `Entity.label.addValueDateDays${entityDetails.paymentFrequency}`,
                  defaultMessage: entityDetails.paymentFrequency === "W"? "Day of the week": entityDetails.paymentFrequency === "M"? "Day of the month": "Add Value Date Days",
                })}
              </label>
              <FormControl>
                <InputBase
                  placeholder={intl.formatMessage({
                    id: `Entity.placeholder.addValueDateDays${entityDetails.paymentFrequency}`,
                    defaultMessage: entityDetails.paymentFrequency === "W"? "Enter day of the week": entityDetails.paymentFrequency === "M"? "Enter day of the month": "Enter Add Value Date Days",
                  })}
                  error
                  fullWidth
                  autoComplete="off"
                  aria-describedby="error-helper-text"
                  // value={entityDetails.addValueDateDays}
                  // onChange={handleValueChange}
                  type="number"
                  onInput={(e: any) => {
                    e.target.value = Math.max(0, parseInt(e.target.value))
                      .toString()
                      .slice(0, 2);
                  }}
                  {...register("addValueDateDays")}
                />
              </FormControl>
            </div>
            <div className="input-with-label form-group mb-0">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.statementType",
                  defaultMessage: "Statement Type",
                })}
              </label>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  IconComponent={() => <img src={down_arrow_icon} alt="" />}
                  placeholder={intl.formatMessage({
                    id: "Entity.select",
                    defaultMessage: "Select",
                  })}
                  {...register("statementType")}
                  onChange={handleValueChange}
                  value={
                    entityDetails.statementType
                      ? entityDetails.statementType
                      : "P"
                  }
                >
                  <MenuItem value={"P"}>P</MenuItem>
                  <MenuItem value={"E"}>E</MenuItem>
                  <MenuItem value={"B"}>B</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
            <div className="input-with-label form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.salesMan",
                  defaultMessage: "Sales Man",
                })}
                <span style={{ color: "red" }}>*</span>
              </label>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  defaultValue=""
                  IconComponent={() => <img src={down_arrow_icon} alt="" />}
                  placeholder={intl.formatMessage({
                    id: "Entity.select",
                    defaultMessage: "Select",
                  })}
                  {...register("salesmanId")}
                  onChange={handleValueChange}
                  value={
                    entityDetails.salesmanId
                      ? entityDetails.salesmanId.toString()
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
                  {employeeList &&
                    employeeList.length > 0 &&
                    employeeList.map((item) => (
                      <MenuItem value={item.employeeId} key={item.employeeId}>
                        {item.employeeName}
                      </MenuItem>
                    ))}
                </Select>
                {(entityDetails.salesmanId
                  ? entityDetails.salesmanId.toString()
                  : "") === "" && errors.salesmanId?.message ? (
                  <FormHelperText id="error-helper-text" error>
                    {validations.entityValidationMessages.salesmanId}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </div>
            <div className="input-with-label form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.employeeIncharge",
                  defaultMessage: "Employee in Charge",
                })}
                <span style={{ color: "red" }}>*</span>
              </label>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  defaultValue=""
                  IconComponent={() => <img src={down_arrow_icon} alt="" />}
                  placeholder={intl.formatMessage({
                    id: "Entity.select",
                    defaultMessage: "Select",
                  })}
                  {...register("employeeIncharge")}
                  onChange={handleValueChange}
                  value={
                    entityDetails.employeeIncharge
                      ? entityDetails.employeeIncharge.toString()
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
                  {employeeList &&
                    employeeList.length > 0 &&
                    employeeList.map((item) => (
                      <MenuItem value={item.employeeId} key={item.employeeId}>
                        {item.employeeName}
                      </MenuItem>
                    ))}
                </Select>
                {(entityDetails.employeeIncharge
                  ? entityDetails.employeeIncharge.toString()
                  : "") === "" && errors.employeeIncharge?.message ? (
                  <FormHelperText id="error-helper-text" error>
                    {validations.entityValidationMessages.employeeIncharge}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </div>
            <div className="input-with-label form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.estatementToEntity",
                  defaultMessage: "E-Statement to Entity",
                })}
              </label>
              <FormControl fullWidth>
                <RadioGroup
                  row
                  {...register("estatementToEntity")}
                  value={
                    entityDetails.estatementToEntity
                      ? entityDetails.estatementToEntity
                      : "N"
                  }
                  onChange={(e) => chargeValueChange(e, "estatementToEntity")}
                >
                  <FormControlLabel value="Y" control={<Radio />} label="Yes" />
                  <FormControlLabel value="N" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="input-with-label  date-select-input form-group">
              <label className="lg">
                {intl.formatMessage({
                  id: "Entity.label.defaultSettlementCurrency",
                  defaultMessage: "Default Settlement Currency",
                })}

                <span style={{ color: "red" }}>*</span>
              </label>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  defaultValue=""
                  IconComponent={() => <img src={down_arrow_icon} alt="" />}
                  placeholder={intl.formatMessage({
                    id: "Entity.select",
                    defaultMessage: "Select",
                  })}
                  autoComplete="off"
                  aria-describedby="error-helper-text"
                  {...register("defSettlementCurrency")}
                  onChange={handleValueChange}
                  value={
                    entityDetails.defSettlementCurrency
                      ? entityDetails.defSettlementCurrency.toString()
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
                  {currencyList &&
                    currencyList.length > 0 &&
                    currencyList.map((code) => (
                      <MenuItem value={code.currencyId} key={code.currencyId}>
                        {code.currencyName}
                      </MenuItem>
                    ))}
                </Select>
                {(entityDetails.defSettlementCurrency
                  ? entityDetails.defSettlementCurrency.toString()
                  : "") === "" && errors.defSettlementCurrency?.message ? (
                  <FormHelperText id="error-helper-text" error>
                    {validations.entityValidationMessages.defSettlementCurrency}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
});

export default EntityMainInfo;
