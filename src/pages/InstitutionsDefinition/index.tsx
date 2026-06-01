import { yupResolver } from "@hookform/resolvers/yup";
import {
  Checkbox,
  Switch,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { down_arrow_icon, ic_check, ic_checked } from "../../assets/images";
import {
  Institution,
  InstitutionType
} from "../../models/configuration/InstitutionModel";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { LoginService } from "../../services/login-service";
import { avoidSpace } from "../../utils/commonfunction";
import { ApplicationLanguage, CodePrefix, Errors, StatusCode } from "../../utils/constant";
import { LOCALSTORAGE_KEYS, setLocalStorage } from "../../utils/helper";
import validations from "../../utils/validations";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { CurrencyService } from "../../services/configuration/currency-service";
import { InstitutionControlService } from "../../services/configuration/institution-control-service";
import { InstitutionControlModel } from "../../models/configuration/InstitutionControlModel";

function InstitutionsDefinition() {
  const { id } = useParams<{ id?: any }>();
  const { institutionControlId } = useParams<{ institutionControlId?: any }>();
  const intl = useIntl();
  const [selectVal, setSelectVal] = React.useState("");
  const [institutionTypes, setInstitutionTypes] = React.useState<
    SystemCodeModel[]
  >([]);
  const [instCodeId, setInstCodeId] = React.useState<number | null>(null);
  const [institutionData, setInstitutionData] = React.useState<Institution>();
  const [instStatus, setInstStatus] = React.useState("");
  const [currencies, setCurrencies] = React.useState<CurrencyModel[]>([]);

  const [institutionIdValue, setInstitutionIdValue] = React.useState("");

  const [selectedCurrency, setSelectedCurrency] = React.useState("");
  const [selectedMerchantRateUsage, setSelectedMerchantRateUsage] = React.useState("");
  const [selectedWeekDay, setSelectedWeekDay] = React.useState("");
  const [inputDirectoryValue, setInputDirectoryValue] = React.useState("");
  const [outputDirectoryValue, setOutputDirectoryValue] = React.useState("");
  const [discountReturnOnValue, setDiscountReturnOnValue] = React.useState("");
  const [selectedEodProcessByTxn, setSelectedEodProcessByTxn] = React.useState("");

  const updateInstListHeader = async () => {
    await LoginService.refreshAuthenticateUser().then(res => {
      if (res.status === StatusCode.Success) {
        const data = JSON.stringify(res.data);
        if (res.data?.user && res.data?.user?.institution?.length !== 0) {
          setLocalStorage(LOCALSTORAGE_KEYS.USER, data);
          const filteredInstitute = res.data?.user?.institution?.filter(
            (s: any) => s.status === "1"
          );
          if (res.data?.user?.defaultInstitutionId) {
            setLocalStorage(
              LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE,
              res.data?.user?.defaultInstitutionId
            );
          }

          if (res.data?.user?.preferedLanguageCodeDescription.toString().toLowerCase() === 'arabic') {
            setLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE, ApplicationLanguage.ARABIC);
          }

          if (res.data?.user?.userRoles) {
            setLocalStorage(
              LOCALSTORAGE_KEYS.ROLE_ACTIVITY,
              JSON.stringify(res.data?.user?.userRoles)
            );
          }

          setLocalStorage(
            LOCALSTORAGE_KEYS.INSTITUTES,
            JSON.stringify(filteredInstitute)
          );
          window.location.reload();
        }
      }
    })
  }

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Institution>({
    mode: "onChange",
    resolver: yupResolver(validations.createInstitutionValidations),
  });

  const handleChange = (event: SelectChangeEvent) => {
    setSelectVal(event.target.value);
  };

  console.log("Here ", errors);

  useEffect(() => {
    getAllInstitutionTypes();

    CurrencyService.getAllCurrencies()
      .then((response: { data: any }) => {
        setCurrencies(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (id) {
      getInstitutionById();
    }
  }, [id, reset]);

  const getInstitutionById = async () => {
    InstitutionService.getInstitutionById(id)
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        reset(data);
        reset({ institutionId: data.institutionId });
        setInstitutionData(data);
        setSelectVal(data.institutionTypeCodeDescription);
        setInstCodeId(data.institutionTypeSystemCodeId);
        setInstStatus(data.status);
        setInstitutionIdValue(data.institutionId);

        InstitutionControlService.getInstitutionControlByInstitution(id)
          .then((res) => {
            reset({
              ...data,
              baseCurrency: res.data.baseCurrency,
              merchantRateUsage: res.data.merchantRateUsage,
              weekDay: res.data.weekDay,
              inputDirectory: res.data.inputDirectory,
              outputDirectory: res.data.outputDirectory,
              discountReturnOn: res.data.discountReturnOn,
              eodProcessByTxn: res.data.eodProcessByTxn
            });
            setSelectedCurrency(res.data.baseCurrency);
            setSelectedMerchantRateUsage(res.data.merchantRateUsage);
            setSelectedWeekDay(res.data.weekDay);
            setInputDirectoryValue(res.data.inputDirectory);
            setOutputDirectoryValue(res.data.outputDirectory);
            setDiscountReturnOnValue(res.data.discountReturnOn.toString());
            setSelectedEodProcessByTxn(res.data.eodProcessByTxn);
          })
          .catch((err) =>   toast.error(err.response.data.errors[0]));

      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllInstitutionTypes = async () => {
    const model = {
      // institutionId: inst,
      codePrefix: CodePrefix.INSTITUTION_TYPE,
    }
    SystemCodeServices.getSystemCodesByPrefixSuffix(model).then(res => {
      setInstitutionTypes(res?.data);
    }).catch(err =>   toast.error(err.response.data.errors[0]))
  };

  const changeStatus = async (event: any) => {
    setInstStatus(event.target.checked === true ? "1" : "0");
  };

  const changeEodProcessByTxn = async (event: any) => {
    setSelectedEodProcessByTxn(event.target.checked === true ? "1" : "0");
  };

  const onSubmit = async (value: Institution) => {
    const model = {
      institutionTypeAlt: value.institutionTypeAlt,
      institutionName: value.institutionName,
      institutionId: value.institutionId ? value.institutionId : "",
      institutionTypeId: instCodeId,
      status: instStatus,
      updateFlag: id ? '1' : '0'
    };

    const controlModel = {
      baseCurrency: selectedCurrency,
      discountReturnOn: discountReturnOnValue,
      eodProcessByTxn: selectedEodProcessByTxn ? selectedEodProcessByTxn : "0",
      inputDirectory: inputDirectoryValue,
      institutionId: value.institutionId ? value.institutionId : "",
      merchantRateUsage: selectedMerchantRateUsage,
      outputDirectory: outputDirectoryValue,
      recordSeqId: institutionControlId ? institutionControlId : 0,
      weekDay: selectedWeekDay
    }

    console.log(controlModel)

    await InstitutionService.saveOrUpdateInstitutions(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {

          InstitutionControlService.saveOrUpdateInstitutionControl(controlModel)
            .then((res) => {
              console.log(res);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));

          if (id) {
            toast.success("Institution details updated successfully");
          } else {
            toast.success("Institution record added successfully");
          }
          //updateInstListHeader();
          navigate(-1);
        }
      })
      .catch((err) => {
        // if (err && err?.response?.status === 400) {
        //   if (err.response.data.errors[0] === 'CFG-335') {
        //     toast.error("Institution Control Record already exists");
        //   }
        // }
        // else if (
        //   err &&
        //   err.response &&
        //   err.response.data === Errors.uniqueInstitution
        // ) {
        //   toast.error(Errors.uniqueInstitution);
        // } else if (
        //   err &&
        //   err.response &&
        //   err.response.data === Errors.validInstId
        // ) {
        //   toast.error(Errors.validInstId);
        // } else if (
        //   err &&
        //   err.response &&
        //   err.response.data === Errors.invalidRole
        // ) {
        //   toast.error(Errors.invalidRole);
        // }
        // else 
        //   if (
        //   err &&
        //   err.response &&
        //   err.response.data === "Id Already exists"
        // ) {
        //   toast.error(Errors.uniqueInstitution)
        // }
        // else {
      toast.error(err.response.data.errors[0]) 
        //     }
      });
  };

  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "Institution.definition",
                    defaultMessage: "Institutions Definition",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "Institution.adddUpdateTitle",
                    defaultMessage: "Add/Update Institution",
                  })}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="inner-card">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.id",
                          defaultMessage: "ID",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          onKeyPress={avoidSpace}
                          placeholder={intl.formatMessage({
                            id: "Institution.enterIDPlaceholder",
                            defaultMessage: "Write your institution ID",
                          })}
                          value={institutionIdValue}
                          error
                          fullWidth
                          disabled={id ? true : false}
                          id="institutionId"
                          autoComplete="off"
                          inputProps={{
                            maxLength: 10,
                          }}
                          aria-describedby="error-helper-text"
                          {...register("institutionId")}
                          onChange={(event) => {
                            // Allow only numeric input
                            const inputValue = event.target.value.replace(/[^a-zA-Z0-9]/g, '');

                            // Update the state with the sanitized value
                            setInstitutionIdValue(inputValue);
                          }}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.institutionId?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.name",
                          defaultMessage: "Name",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Institution.enterNamePlaceholder",
                            defaultMessage: "Write your institutionName",
                          })}
                          error
                          fullWidth
                          id="institutionName"
                          autoComplete="off"
                          inputProps={{ maxLength: 50 }}
                          aria-describedby="error-helper-text"
                          {...register("institutionName")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.institutionName?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.alternateName",
                          defaultMessage: "Alternate Name",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Institution.enterALTNamePlaceHolder",
                            defaultMessage: "Write your institution ALT Name",
                          })}
                          error
                          fullWidth
                          id="institutionTypeAlt"
                          autoComplete="off"
                          inputProps={{ maxLength: 100 }}
                          aria-describedby="error-helper-text"
                          {...register("institutionTypeAlt")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.institutionTypeAlt?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="input-with-label mb-0">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.type",
                          defaultMessage: "Type",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={selectVal}
                          {...register("institutionTypeId")}
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "Institution.selectType",
                                defaultMessage: "Select Institution Type",
                              })}
                            </em>
                          </MenuItem>
                          {institutionTypes &&
                            institutionTypes.length > 0 &&
                            institutionTypes.map((type) => {
                              return (
                                <MenuItem value={type.codeSuffix} key={type.systemCodeId} onClick={() => setInstCodeId(type.systemCodeId)}>
                                  {type.description}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {selectVal === "" &&
                          errors.institutionTypeId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {validations.createInstitute.institutionType}
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Currency.label",
                          defaultMessage: "Base Currency",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("baseCurrency")}
                          value={selectedCurrency}
                          onChange={(event) => setSelectedCurrency(event.target.value)}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        >
                          <MenuItem disabled value="">{intl.formatMessage({ id: "InstitutionAccounts.selectCurrency", defaultMessage: "Select Currency" })}</MenuItem>
                          {currencies &&
                            currencies.length > 0 &&
                            currencies
                              .sort((a, b) => a.currencyName.localeCompare(b.currencyName))
                              .map((type) => {
                                return (
                                  <MenuItem key={type.currencyId} value={type.currencyCode}>
                                    {type.currencyName}
                                  </MenuItem>
                                );
                              })}
                        </Select>
                        {
                          (selectedCurrency === "" || selectedCurrency === undefined) && errors.baseCurrency?.message &&
                          <FormHelperText id="error-helper-text" error>
                            {errors.baseCurrency?.message}
                          </FormHelperText>
                        }
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Currency.label",
                          defaultMessage: "Merchant Rate Usage",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("merchantRateUsage")}
                          value={selectedMerchantRateUsage}
                          onChange={(event) => setSelectedMerchantRateUsage(event.target.value)}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        >
                          <MenuItem disabled value="">{intl.formatMessage({ id: "Institution.selectMerchantRateUsage", defaultMessage: "Select Merchant Rate Usage" })}</MenuItem>
                          <MenuItem value="B">{intl.formatMessage({ id: "Institution.buyRate", defaultMessage: "Buy Rate" })}</MenuItem>
                          <MenuItem value="M">{intl.formatMessage({ id: "Institution.midRate", defaultMessage: "Mid Rate" })}</MenuItem>
                          <MenuItem value="S">{intl.formatMessage({ id: "Institution.sellRate", defaultMessage: "Sell Rate" })}</MenuItem>
                        </Select>
                        {
                          (selectedMerchantRateUsage === "" || selectedMerchantRateUsage === undefined) && errors.merchantRateUsage?.message &&
                          <FormHelperText id="error-helper-text" error>
                            {errors.merchantRateUsage?.message}
                          </FormHelperText>
                        }
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Currency.label",
                          defaultMessage: "WeekDay",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("weekDay")}
                          value={selectedWeekDay}
                          onChange={(event) => setSelectedWeekDay(event.target.value)}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        >
                          <MenuItem disabled value="">{intl.formatMessage({ id: "Institution.selectWeekday", defaultMessage: "Select Weekday" })}</MenuItem>
                          <MenuItem value="MON">{intl.formatMessage({ id: "Institution.monday", defaultMessage: "Monday" })}</MenuItem>
                          <MenuItem value="TUE">{intl.formatMessage({ id: "Institution.tuesday", defaultMessage: "Tuesday" })}</MenuItem>
                          <MenuItem value="WED">{intl.formatMessage({ id: "Institution.wednesday", defaultMessage: "Wednesday" })}</MenuItem>
                          <MenuItem value="THU">{intl.formatMessage({ id: "Institution.thursday", defaultMessage: "Thursday" })}</MenuItem>
                          <MenuItem value="FRI">{intl.formatMessage({ id: "Institution.friday", defaultMessage: "Friday" })}</MenuItem>
                          <MenuItem value="SAT">{intl.formatMessage({ id: "Institution.saturday", defaultMessage: "Saturday" })}</MenuItem>
                          <MenuItem value="SUN">{intl.formatMessage({ id: "Institution.sunday", defaultMessage: "Sunday" })}</MenuItem>
                        </Select>
                        {
                          (selectedWeekDay === "" || selectedWeekDay === undefined) && errors.weekDay?.message &&
                          <FormHelperText id="error-helper-text" error>
                            {errors.weekDay?.message}
                          </FormHelperText>
                        }
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.inputDirectory",
                          defaultMessage: "Input Directory",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Institution.enterInputDirectoryPlaceHolder",
                            defaultMessage: "Write your institution input directory",
                          })}
                          error
                          fullWidth
                          id="inputDirectory"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          inputProps={{ maxLength: 40 }}
                          {...register("inputDirectory")}
                          value={inputDirectoryValue}
                          onChange={(event) => setInputDirectoryValue(event.target.value)}
                        />
                        {
                          (inputDirectoryValue === "" || inputDirectoryValue === undefined) && errors.inputDirectory?.message &&
                          <FormHelperText id="error-helper-text" error>
                            {errors.inputDirectory?.message}
                          </FormHelperText>
                        }
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.outputDirectory",
                          defaultMessage: "Output Directory",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Institution.enterOutputDirectoryPlaceHolder",
                            defaultMessage: "Write your institution output directory",
                          })}
                          error
                          fullWidth
                          id="outputDirectory"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          inputProps={{ maxLength: 40 }}
                          {...register("outputDirectory")}
                          value={outputDirectoryValue}
                          onChange={(event) => setOutputDirectoryValue(event.target.value)}
                        />
                        {
                          (outputDirectoryValue === "" || outputDirectoryValue === undefined) && errors.outputDirectory?.message &&
                          <FormHelperText id="error-helper-text" error>
                            {errors.outputDirectory?.message}
                          </FormHelperText>
                        }
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.discountReturnOn",
                          defaultMessage: "Discount Return On",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Institution.enterDiscountReturnOnPlaceHolder",
                            defaultMessage: "Write your institution discountReturnOn",
                          })}
                          error
                          fullWidth
                          id="discountReturnOn"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          type="text"
                          inputProps={{
                            maxLength: 2,
                          }}
                          {...register("discountReturnOn")}
                          value={discountReturnOnValue}
                          onChange={(event) => {
                            // Allow only numeric input
                            const inputValue = event.target.value.replace(/[^0-9]/g, '');

                            // Update the state with the sanitized value
                            setDiscountReturnOnValue(inputValue);
                          }}
                        />
                        {
                          (discountReturnOnValue === "" || discountReturnOnValue === undefined) && errors.discountReturnOn?.message &&
                          <FormHelperText id="error-helper-text" error>
                            {errors.discountReturnOn?.message}
                          </FormHelperText>
                        }
                        {
                          (isNaN(Number(discountReturnOnValue)) || Number(discountReturnOnValue) > 31) &&
                          <FormHelperText id="error-helper-text" error>
                            {isNaN(Number(discountReturnOnValue)) ? "Discount Return On must be a number" : "Discount Return On must not exceed 31 days"}
                          </FormHelperText>
                        }

                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="input-with-label form-group mb-0">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.eodProcessByTxn",
                          defaultMessage: "EOD Process By Transaction",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl>
                        <Checkbox
                          icon={<img src={ic_check} alt="" />}
                          checkedIcon={<img src={ic_checked} alt="" />}
                          checked={selectedEodProcessByTxn === "1" ? true : false}
                          onChange={(e) => changeEodProcessByTxn(e)}
                          className="custom"
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Institution.enabled",
                          defaultMessage: "Enabled",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Switch
                          className="custom"
                          checked={instStatus === "1" ? true : false}
                          onChange={(e) => changeStatus(e)}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate(-1)}
                >
                  <FormattedMessage
                    id="Institution.cancel"
                    defaultMessage="Cancel"
                  />
                </Button>
                <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                  <FormattedMessage
                    id="Institution.save"
                    defaultMessage="Save"
                  />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default InstitutionsDefinition;
