import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { date_ic, down_arrow_icon } from "../../assets/images";
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
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { EntityService } from "../../services/entityManagement/entity-service";
import { EntityListModel } from "../../models/entityManagement/EntityModel";
import { toast } from "react-toastify";
import { TransactionUsageModel } from "../../models/configuration/TransactionGroupModel";
import { TransactionGroupService } from "../../services/configuration/transaction-group-service";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { CurrencyService } from "../../services/configuration/currency-service";
import { Controller, useForm } from "react-hook-form";
import { ManualNonActivityTransactionModel } from "../../models/entityManagement/ManualNonActivityTransactions";
import validations from "../../utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router";
import { ManualNonActivityTransactionServices } from "../../services/entityManagement/manual-non-activity-transaction-services";
import moment from "moment";
import {
  CodePrefix,
  StatusCode,
  TRANS_USAGE,
  OptionType,
  ENTITY_LEVEL,
} from "../../utils/constant";
import { useIntl } from "react-intl";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { useLocation } from "react-router";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import ReactSelect from "react-select";

function ManualNonActivityFeesDefinition() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location: any = useLocation();
  const selectedInstitutionId = (location && location.state && location.state.isEdit!=false) ? (
    location && location.state && location.state.institutionId) : getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
      const isEdit =
    location && location.state && location.state.isEdit;
  const intl = useIntl();
  const [entityList, setEntityList] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [transactionList, setTransactionList] = React.useState<
    TransactionUsageModel[]
  >([]);
  const [currencyList, setCurrencyList] = React.useState<CurrencyModel[]>([]);
  const [systemCodes, setSystemCodes] = React.useState<SystemCodeModel[]>([]);
  const [
    manualNonActivityTransactionDetails,
    setManualNonActivityTransactionDetails,
  ] = React.useState<ManualNonActivityTransactionModel>(
    new ManualNonActivityTransactionModel()
  );
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState(
    isEdit!=false ? selectedInstitutionId : getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string
  );
  const [addNew, setAddNew] = React.useState<boolean>(false);
  const [outletId, setOutletId] = React.useState<{
    label: string;
    value: string;
  }>();
  const [outletErr, setOutletErr] = React.useState("");

  const outLetIdRequired = "Entity/OutletId is required.";

  const handleChange = (event: any) => {
    setManualNonActivityTransactionDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (selectedInstitutionId) {
      getEntitiesByInstitutionId(selectedInstitutionId, null);
      getAllSystemCodes(selectedInstitutionId);
    } else {
      setInstitutefromLocalStorage();
    }
    getAllTransactionsByUsage();
    getAllActiveCurrency();
    if (id) {
      getManualNonActivityTransactionDetailById(Number(id));
    }
  }, []);

  const setInstitutefromLocalStorage = async () => {
    console.log("instId111>>>",selectInstitutionVal);
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
    if (instID) {
      console.log("instId>>>>",instID);
      setSelectInstitutionVal(instID);
      getEntitiesByInstitutionId(instID, null);
      getAllSystemCodes(instID);
    }
  };

  const getManualNonActivityTransactionDetailById = (id: number) => {
    ManualNonActivityTransactionServices.getById(id)
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        const model = {
          ...data,
          transactionDate: new Date(
            moment(data?.transactionDate, "DD/MM/yyyy").toString()
          ),
          outletId: data.entityId,
        };

        setManualNonActivityTransactionDetails(model);
        getEntitiesByInstitutionId(model.institutionId, model.outletId);
        reset(model);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllSystemCodes = (instID: string) => {
    const model = {
      institutionId: instID,
      codePrefix: CodePrefix.MAN_NON_ACT_RSN,
    };
    SystemCodeServices.getSystemCodesByPrefixSuffix(model)
      .then((res) => {
        setSystemCodes(res?.data);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllActiveCurrency = () => {
    CurrencyService.getActiveCurrencies()
      .then((res) => {
        setCurrencyList(res?.data);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllTransactionsByUsage = () => {
    //     let UsageSysId = 0;
    // SystemCodeServices.getAllSystemCodes().then(res => {
    //     UsageSysId = res.data.find(data => data.codePrefix === CodePrefix.TRANS_USAGE && data.description === TRANS_USAGE.NACT)?.systemCodeId ?? 0;

    //     if(UsageSysId !== 0){
    //       TransactionGroupService.getAllTransactionsByUsage(UsageSysId, "").then(res => {
    //         setTransactionList(res?.data);
    //       }).catch(err =>   toast.error(err.response.data.errors[0]))
    //     }

    // });
    TransactionGroupService.getAllTransactionsByUsage(TRANS_USAGE.NACT,selectInstitutionVal)
      .then((res) => {
        setTransactionList(res?.data);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getEntitiesByInstitutionId = async (
    id: string,
    selectedOutlet: any
  ) => {
    const model = {
      institutionId: id,
      entityLevel: ENTITY_LEVEL.OUTLET,
    };
    await EntityService.getEntitiesByEntityLevelNameAndInstitution(model)
      .then((res) => {
        let option: any = [];
        if (res.data) {
          option = res.data.map((data) => {
            const label = data.entityName;
            const value = data.entityId;
            return { label, value };
          });
          if (selectedOutlet) {
            const entity = option.filter(
              (item: any) => item.value === selectedOutlet
            )[0];
            setOutletId(entity);
          }
        }
        setEntityList(option);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    getValues,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ManualNonActivityTransactionModel>({
    mode: "onChange",
    resolver: yupResolver(
      validations.addManualNonActivityTransactionValidation
    ),
  });

  const handleReset = () => {
    const model = new ManualNonActivityTransactionModel();
    setManualNonActivityTransactionDetails({
      ...model,
      reversalFlag: "",
      comments: "",
      transactionCurrencyId: 0,
      transactionId: "",
    });
    setValue("transactionAmount", 0);
    setOutletId({ label: "", value: "" });
    reset(new ManualNonActivityTransactionModel());
    clearErrors();
  };

  const onSubmit = (values: ManualNonActivityTransactionModel) => {
    if (
      outletId?.value === "" ||
      outletId?.value === undefined ||
      outletId?.value === null
    ) {
      setOutletErr(outLetIdRequired);
    } else {
      const model = {
        ...values,
        reversalFlag: values.reversalFlag ? values.reversalFlag : "N",
        transactionDate: moment(values.transactionDate).format("DD/MM/yyyy"),
        outletId: outletId.value,
        transactionCurrencyId: Number(values.transactionCurrencyId),
        transactionId: values.transactionId,
        systemCodeId: Number(values.systemCodeId),
        institutionId: selectInstitutionVal,
      };
      ManualNonActivityTransactionServices.saveOrUpdate(model)
        .then((res) => {
          if (res.status === StatusCode.Success) {
            if (id) {
              toast.success(
                "Manual Non Activity Transaction details updated successfully."
              );
            } else {
              toast.success(
                "Manual Non Activity Transaction details added successfully."
              );
            }
            if (addNew) {
              if (id) {
                navigate("/manual-non-activity-fees-transaction-definition");
              }
              handleReset();
            } else {
              navigate("/manual-non-activity-fees-transaction-listing");
            }
            setAddNew(!addNew);
          }
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };

  const handleOutletChange = (e: OptionType) => {
    if (e) {
      setManualNonActivityTransactionDetails((prev) => ({
        ...prev,
        outletId: e.value!.toString(),
      }));
      setOutletErr("");
      setOutletId({ value: e?.value!, label: e?.label! });
    } else {
      setManualNonActivityTransactionDetails((prev) => ({
        ...prev,
        outletId: "",
      }));
      setOutletErr(outLetIdRequired);
      setOutletId({ label: "", value: "" });
    }
  };

  const setOutletValidation = () => {
    if (
      outletId?.value === "" ||
      outletId?.value === undefined ||
      outletId?.value === null
    ) {
      setOutletErr(outLetIdRequired);
    }
  };

  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"} className="pb-0">
                  {intl.formatMessage({
                    id: "Entity.manualNonActivityFeesTransaction",
                    defaultMessage: "Manual Non Activity Fee Transaction",
                  })}
                </Typography>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-elements">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.entityOutlet",
                          defaultMessage: "Entity/Outlet",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="outletId"
                          render={() => (
                            <ReactSelect
                              value={outletId}
                              onChange={(e) => handleOutletChange(e!)}
                              isClearable={
                                outletId?.value === "" ? false : true
                              }
                              options={entityList}
                              // placeholder="select..."
                            />
                          )}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {outletErr !== "" ? outletErr : ""}
                        </FormHelperText>
                        {/* <Select
                                                    {...register("outletId")}
                                                    value={manualNonActivityTransactionDetails.outletId ? manualNonActivityTransactionDetails.outletId.toString() : ""}
                                                    onChange={handleChange}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                >
                                                    <MenuItem value="">
                                                        <em>
                                                            {
                                                                intl.formatMessage({
                                                                    id: "Entity.select",
                                                                    defaultMessage: "Select"
                                                                })
                                                            }
                                                        </em>
                                                    </MenuItem>
                                                    {
                                                        entityList && entityList.length > 0 &&
                                                        entityList.map(entity => (
                                                            <MenuItem value={entity.entityId} key={entity.entityId}>{entity.entityName}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                                 */}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.transactionId",
                          defaultMessage: "Transaction ID",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("transactionId")}
                          value={
                            manualNonActivityTransactionDetails.transactionId
                              ? manualNonActivityTransactionDetails.transactionId.toString()
                              : ""
                          }
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
                                id: "Entity.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {transactionList &&
                            transactionList.length > 0 &&
                            transactionList.map((item) => (
                              <MenuItem
                                value={item.transactionId}
                                key={item.transactionId}
                              >
                                {item.description}
                              </MenuItem>
                            ))}
                        </Select>
                        {(manualNonActivityTransactionDetails.transactionId
                          ? manualNonActivityTransactionDetails.transactionId.toString()
                          : "") === "" && errors?.transactionId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations
                                .manualNonActivityTransactionValidationMessage
                                .transactionId
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.transactionDate",
                          defaultMessage: "Transaction Date",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="transactionDate"
                            defaultValue={new Date()}
                            render={({ field }) => (
                              <DatePicker
                                inputFormat="dd/MM/yyyy"
                                onChange={(date, keyboardInput) => {
                                  if (keyboardInput) {
                                    field.onChange(
                                      keyboardInput.length === 10 ? date : ""
                                    );
                                  } else {
                                    field.onChange(date);
                                  }
                                  setManualNonActivityTransactionDetails(
                                    (prev) => ({
                                      ...prev,
                                      transactionDate: date,
                                    })
                                  );
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
                          {errors.transactionDate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.transactionAmount",
                          defaultMessage: "Transaction Amount",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.transactionAmount",
                            defaultMessage: "Write Transaction Amount",
                          })}
                          fullWidth
                          error
                          id="tipsAmount"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("transactionAmount")}
                          type="number"
                          componentsProps={{
                            input: {
                              step: ".00000001",
                            },
                          }}
                        />
                        {(manualNonActivityTransactionDetails.transactionAmount
                          ? manualNonActivityTransactionDetails.transactionAmount
                          : "") === "" && (
                          <FormHelperText id="error-helper-text" error>
                            {errors.transactionAmount?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.currency",
                          defaultMessage: "Currency",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("transactionCurrencyId")}
                          value={
                            manualNonActivityTransactionDetails.transactionCurrencyId
                              ? manualNonActivityTransactionDetails.transactionCurrencyId.toString()
                              : ""
                          }
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
                                id: "Entity.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {currencyList &&
                            currencyList.length > 0 &&
                            currencyList.map((item) => (
                              <MenuItem
                                value={item.currencyId}
                                key={item.currencyId}
                              >
                                {item.currencyName}
                              </MenuItem>
                            ))}
                        </Select>
                        {(manualNonActivityTransactionDetails.transactionCurrencyId
                          ? manualNonActivityTransactionDetails.transactionCurrencyId.toString()
                          : "") === "" &&
                        errors?.transactionCurrencyId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations
                                .manualNonActivityTransactionValidationMessage
                                .transactionCurrencyId
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.reverseFlag",
                          defaultMessage: "Reverse flag",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <RadioGroup
                          row
                          {...register("reversalFlag")}
                          value={
                            manualNonActivityTransactionDetails.reversalFlag ===
                            "Y"
                              ? "Y"
                              : "N"
                          }
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="Y"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="N"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.reason",
                          defaultMessage: "Reason",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={
                            manualNonActivityTransactionDetails.systemCodeId
                              ? manualNonActivityTransactionDetails.systemCodeId.toString()
                              : ""
                          }
                          {...register("systemCodeId")}
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
                                id: "Entity.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {systemCodes &&
                            systemCodes.length > 0 &&
                            systemCodes.map((item) => (
                              <MenuItem
                                value={item.systemCodeId}
                                key={item.systemCodeId}
                              >
                                {item.description}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="input-elements">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={8}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.description",
                          defaultMessage: "Description",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <TextareaAutosize
                          minRows={2}
                          // value={manualNonActivityTransactionDetails.comments}
                          // onChange={handleChange}
                          {...register("comments")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.comments?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    sx={{ display: { xs: "none", md: "block" } }}
                  ></Grid>
                </Grid>
              </div>

              <div className="btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate(-1)}
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
                  onClick={() => setOutletValidation()}
                >
                  {intl.formatMessage({
                    id: "Entity.button.save",
                    defaultMessage: "Save",
                  })}
                </Button>
                <Button
                  disableElevation
                  variant="contained"
                  type="submit"
                  onClick={() => {
                    setOutletValidation();
                    setAddNew(true);
                  }}
                  disabled={isSubmitting}
                >
                  {intl.formatMessage({
                    id: "Entity.button.saveAndAddNew",
                    defaultMessage: "Save and Add New",
                  })}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default ManualNonActivityFeesDefinition;
