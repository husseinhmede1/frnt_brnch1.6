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
import { toast } from "react-toastify";
import {
  EntityListModel,
  TerminalModel,
} from "../../models/entityManagement/EntityModel";
import { MerchantTransactionDefinitionModel } from "../../models/entityManagement/MerchantTransactionModel";
import { Controller, useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { TerminalService } from "../../services/entityManagement/terminal-service";
import moment from "moment";
import { TransactionGroupService } from "../../services/configuration/transaction-group-service";
import { TransactionUsageModel } from "../../models/configuration/TransactionGroupModel";
import { CurrencyService } from "../../services/configuration/currency-service";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { MerchantTransactionServices } from "../../services/entityManagement/merchant-transaction-services";
import { useNavigate, useParams } from "react-router";
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

function maskCardNumber(cardNumber: string, prefixLength: number): string {
  const suffixLength = 4;
  if (cardNumber.length <= prefixLength + suffixLength) return cardNumber;
  const middleLength = cardNumber.length - prefixLength - suffixLength;
  return (
    cardNumber.slice(0, prefixLength) +
    "*".repeat(middleLength) +
    cardNumber.slice(-suffixLength)
  );
}

function MerchantTransacionDefinition() {
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
  const [terminalList, setTerminalList] = React.useState<TerminalModel[]>([]);
  const [transactionList, setTransactionList] = React.useState<
    TransactionUsageModel[]
  >([]);
  const [systemCodes, setSystemCodes] = React.useState<SystemCodeModel[]>([]);
  const [reasonId, setReasonId] = React.useState(" ");
  const [currencyList, setCurrencyList] = React.useState<CurrencyModel[]>([]);
  const [addNew, setAddNew] = React.useState<boolean>(false);
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState(
    isEdit!=false ? selectedInstitutionId : getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string
  );
  const [merchantTransactionDetails, setMerchantTransactionDetails] =
    React.useState<MerchantTransactionDefinitionModel>(
      new MerchantTransactionDefinitionModel()
    );
  const [outletId, setOutletId] = React.useState<{
    label: string;
    value: string;
  }>();
  const [outletErr, setOutletErr] = React.useState("");
  const [rawCardNumber, setRawCardNumber] = React.useState("");
  const [isCardMasked, setIsCardMasked] = React.useState(false);
  const [cardMaskPrefixLength, setCardMaskPrefixLength] = React.useState(6);

  const fetchCardMaskPrefixLength = (instId: string) => {
    SystemCodeServices.getSystemCodesByPrefixSuffix({
      institutionId: instId,
      codePrefix: "MASK",
      codeSuffix: "LENGTH",
    })
      .then((res) => {
        const value = Number(res.data?.[0]?.codeValue);
        if (value === 6 || value === 8) {
          setCardMaskPrefixLength(value);
        }
      })
      .catch(() => {});
  };

  const outLetIdRequired = "Entity/OutletId is required.";

  const handleChange = (event: any) => {
    setMerchantTransactionDetails({
      ...merchantTransactionDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeReason = (event: any) => {
    setReasonId(event.target.value);
  };

  useEffect(() => {
    if (selectedInstitutionId) {
      getEntitiesByInstitutionId(selectedInstitutionId, null);
      getAllSystemCodes(selectedInstitutionId);
      fetchCardMaskPrefixLength(selectedInstitutionId);
    } else {
      setInstitutefromLocalStorage();
    }
    getAllTransactionsByUsage();
    getAllActiveCurrency();
    if (id) {
      getMerchantTransactionDetailById(Number(id));
    }
    getAllSystemCodes(selectInstitutionVal);
  }, []);

  const setInstitutefromLocalStorage = async () => {
    const instID = JSON.parse(
      getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string
    );
    if (instID) {
      setSelectInstitutionVal(instID);
      getEntitiesByInstitutionId(instID, null);
      getAllSystemCodes(instID);
      fetchCardMaskPrefixLength(instID);
    }
  };

  const getMerchantTransactionDetailById = (id: number) => {
    MerchantTransactionServices.getById(id)
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        let model = new MerchantTransactionDefinitionModel();
        getAllSystemCodes(data.institutionId);
        model = {
          authorizationNumber: data.authorizationNumber,
          cardNumber: data.cardNumber,
          cardSeqNbr: data.cardSeqNbr? Number(data.cardSeqNbr): 0,
          comments: data.comments,
          expiryDate: data?.expiryDate
            ? new Date(moment(data?.expiryDate, "DD/MM/yyyy").toString())
            : null,
          institutionId: data.institutionId,
          merchantTransactionId: data.merchantTransactionId,
          outletId: data.entityId,
          reversalFlag: data.reversalFlag,
          terminalId: data.terminalId,
          pan: data.pan,
          systemCodeId: data.systemCodeId.toString(),
          tipsAmount: data.tipsAmount,
          tipsCurrencyId: data.tipsCurrencyId,
          transactionAmount: data.transactionAmount,
          transactionCurrencyId: data.transactionCurrencyId,
          transactionDate: new Date(
            moment(data?.transactionDate, "DD/MM/yyyy").toString()
          ),
          transactionId: data.transactionId,
        };

        setReasonId(data.systemCodeId.toString());
        setMerchantTransactionDetails(model);
        reset(model);
        getTerminalsByEntityId(model.outletId);
        getEntitiesByInstitutionId(model.institutionId, model.outletId);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  useEffect(() => {
    if (merchantTransactionDetails?.outletId) {
      getTerminalsByEntityId(merchantTransactionDetails?.outletId);
    }
  }, [merchantTransactionDetails?.outletId]);

  const getTerminalsByEntityId = (id: string) => {
    TerminalService.getAllByEntityId(id)
      .then((res) => {
        setTerminalList(res?.data);
      })
      .catch((err) => {
          toast.error(err.response.data.errors[0]);
        setTerminalList([]);
      });
  };

  const getAllSystemCodes = (instID: string) => {
    const model = {
      institutionId: instID,
      codePrefix: CodePrefix.MAN_ACT_RSN,
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
        // const filteredEntities = res.data.filter(
        //     (s: any) => s.status === "1"
        // );
        if (res && res.data) {
          option = res.data.map((data: any) => {
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

  const getAllTransactionsByUsage = () => {
    //     let UsageSysId = 0;
    // SystemCodeServices.getAllSystemCodes().then(res => {
    //     UsageSysId = res.data.find(data => data.codePrefix === CodePrefix.TRANS_USAGE && data.description === TRANS_USAGE.TRANS)?.systemCodeId ?? 0;

    //     if(UsageSysId !== 0){
    //       TransactionGroupService.getAllTransactionsByUsage(UsageSysId, "").then(res => {
    //         setTransactionList(res?.data);
    //       }).catch(err =>   toast.error(err.response.data.errors[0]))
    //     }

    // });
    TransactionGroupService.getAllTransactionsByUsage(TRANS_USAGE.TRANS,selectInstitutionVal)
      .then((res) => {
        setTransactionList(res?.data);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const handleReset = () => {
    // const model = new MerchantTransactionDefinitionModel()
    // setMerchantTransactionDetails({
    //     ...model,
    //     cardNumber: "",
    //     cardSeqNbr: 0,
    //     transactionAmount: 0,
    //     authorizationNumber: "",
    //     tipsAmount: 0,
    //     reversalFlag: "",
    //     comments: "",
    //     expiryDate: null,
    //     transactionDate: null
    // });

    setValue("cardNumber", "");
    setRawCardNumber("");
    setIsCardMasked(false);
    setValue("authorizationNumber", "");
    setValue("comments", "");
    setValue("systemCodeId", "");
    setReasonId("");
    setOutletId({ label: "", value: "" });

    setValue("tipsAmount", 0);
    setValue("transactionAmount", 0);
    setValue("cardSeqNbr", 0);
    reset(new MerchantTransactionDefinitionModel());
    setMerchantTransactionDetails(new MerchantTransactionDefinitionModel());
    clearErrors();
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
  } = useForm<MerchantTransactionDefinitionModel>({
    mode: "onChange",
    resolver: yupResolver(validations.addMerchantTransactionValidation),
  });

  const onSubmit = (values: MerchantTransactionDefinitionModel) => {
    if (
      outletId?.value === "" ||
      outletId?.value === undefined ||
      outletId?.value === null
    ) {
      setOutletErr(outLetIdRequired);
    } else {
      const maskedCard = maskCardNumber(values.cardNumber, cardMaskPrefixLength);
      const model = {
        ...values,
        expiryDate: merchantTransactionDetails?.expiryDate
          ? moment(merchantTransactionDetails?.expiryDate).format("DD/MM/YYYY")
          : "",
        transactionDate: moment(merchantTransactionDetails?.transactionDate).format("DD/MM/YYYY"),
        reversalFlag:
          merchantTransactionDetails?.reversalFlag === "Y" ? "Y" : "N",
        institutionId: merchantTransactionDetails.institutionId
          ? merchantTransactionDetails.institutionId
          : selectInstitutionVal,
        outletId: outletId.value,
        authorizationNumber: values.authorizationNumber,
        cardNumber: maskedCard,
        cardSeqNbr: values.cardSeqNbr? Number(values.cardSeqNbr): 0,
        comments: values.comments || null,
        transactionAmount: Number(values.transactionAmount),
        tipsAmount: Number(values.tipsAmount),
        tipsCurrencyId: merchantTransactionDetails.tipsCurrencyId,
        transactionCurrencyId: merchantTransactionDetails.transactionCurrencyId,
        transactionId: merchantTransactionDetails.transactionId,
        terminalId: merchantTransactionDetails.terminalId,
        merchantTransactionId: merchantTransactionDetails.merchantTransactionId
          ? merchantTransactionDetails.merchantTransactionId
          : 0,
        systemCodeId: Number(reasonId),
      };
      MerchantTransactionServices.saveOrUpdate(model)
        .then((res) => {
          if (res && res.status === StatusCode.Success) {
            setValue("cardNumber", maskedCard);
            setIsCardMasked(true);
            if (id) {
              toast.success("Manual Transaction details updated successfully.");
            } else {
              toast.success("Manual Transaction details added successfully.");
            }
            if (addNew) {
              if (id) {
                navigate("/merchant-transaction-definition");
              }
              handleReset();
            } else {
              navigate("/merchant-transaction-listing");
            }
            setAddNew(!addNew);
          }
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };

  const handleOutletChange = (e: OptionType) => {
    if (e) {
      setMerchantTransactionDetails((prev) => ({
        ...prev,
        outletId: e.value!.toString(),
      }));
      setOutletErr("");
      setOutletId({ value: e?.value!, label: e?.label! });
    } else {
      setMerchantTransactionDetails((prev) => ({
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="main-card">
              <div className="title-block">
                <div className="left-block">
                  <Typography variant={"h2"} className="pb-0">
                    {intl.formatMessage({
                      id: "Entity.merchantTransaction",
                      defaultMessage: "Manual Transaction",
                    })}
                  </Typography>
                </div>
              </div>
              <div className="input-elements">
                <Grid spacing={5} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
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
                      </FormControl>
                    </div>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.termialId",
                          defaultMessage: " Terminal ID",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("terminalId")}
                          value={
                            merchantTransactionDetails.terminalId
                              ? merchantTransactionDetails.terminalId.toString()
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
                          {terminalList &&
                            terminalList.length > 0 &&
                            terminalList.map((item) => (
                              <MenuItem
                                value={item.terminalId}
                                key={item.terminalId}
                              >
                                {item.terminalId}
                              </MenuItem>
                            ))}
                        </Select>
                        {(merchantTransactionDetails.terminalId
                          ? merchantTransactionDetails.terminalId.toString()
                          : "") === "" && errors?.terminalId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.merchantTransactionValidationMessage
                                .terminalId
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.cardNumber",
                          defaultMessage: "Card Number",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.cardNumber",
                            defaultMessage: "Enter card number",
                          })}
                          fullWidth
                          error
                          id="cardNumber"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("cardNumber")}
                          onChange={(e) => {
                            register("cardNumber").onChange(e);
                            setRawCardNumber(e.target.value);
                            setIsCardMasked(false);
                          }}
                          onFocus={() => {
                            if (isCardMasked) {
                              setValue("cardNumber", rawCardNumber);
                              setIsCardMasked(false);
                            }
                          }}
                        />
                        {merchantTransactionDetails.cardNumber ? null : (
                          <FormHelperText id="error-helper-text" error>
                            {errors.cardNumber?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>

                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.cardSequence",
                          defaultMessage: "Card Sequence",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.cardSequence",
                            defaultMessage: "Enter Card sequence",
                          })}
                          type="number"
                          error
                          id="cardSeqNbr"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          fullWidth
                          {...register("cardSeqNbr")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.cardSeqNbr?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.expiryDate",
                          defaultMessage: "Expiry date",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="expiryDate"
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
                                  setMerchantTransactionDetails((prev) => ({
                                    ...prev,
                                    expiryDate: date,
                                  }));
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
                        {merchantTransactionDetails.expiryDate ? null : (
                          <FormHelperText id="error-helper-text" error>
                            {errors.expiryDate?.message}
                          </FormHelperText>
                        )}
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
                            merchantTransactionDetails.transactionId
                              ? merchantTransactionDetails.transactionId.toString()
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
                        {(merchantTransactionDetails.transactionId
                          ? merchantTransactionDetails.transactionId.toString()
                          : "") === "" && errors?.transactionId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.merchantTransactionValidationMessage
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
                                onChange={(date) => {
                                  field.onChange(date);
                                  setMerchantTransactionDetails((prev) => ({
                                    ...prev,
                                    transactionDate: date,
                                  }));
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
                          id: "Entity.label.authorizationNumber",
                          defaultMessage: "Authorization Number",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.authorizationNumber",
                            defaultMessage: "Enter Authorization Number",
                          })}
                          fullWidth
                          error
                          id="authorizationNumber"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("authorizationNumber")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.authorizationNumber?.message}
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
                            defaultMessage: "Enter Transaction Amount",
                          })}
                          fullWidth
                          error
                          id="transactionAmount"
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
                        <FormHelperText id="error-helper-text" error>
                          {errors.transactionAmount?.message}
                        </FormHelperText>
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
                            merchantTransactionDetails.transactionCurrencyId
                              ? merchantTransactionDetails.transactionCurrencyId.toString()
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
                        {(merchantTransactionDetails.transactionCurrencyId
                          ? merchantTransactionDetails.transactionCurrencyId.toString()
                          : "") === "" &&
                        errors?.transactionCurrencyId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.merchantTransactionValidationMessage
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
                          defaultMessage: "Reverse Flag",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <RadioGroup
                          row
                          {...register("reversalFlag")}
                          value={
                            merchantTransactionDetails.reversalFlag === "Y"
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
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.tipsAmount",
                          defaultMessage: "Tips Amount",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.tipsAmount",
                            defaultMessage: "Enter Tips Amount",
                          })}
                          fullWidth
                          error
                          id="tipsAmount"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("tipsAmount")}
                          type="number"
                          componentsProps={{
                            input: {
                              step: ".00000001",
                            },
                          }}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.tipsAmount?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.tipsCurrency",
                          defaultMessage: "Tips Currency",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("tipsCurrencyId")}
                          value={
                            merchantTransactionDetails.tipsCurrencyId
                              ? merchantTransactionDetails.tipsCurrencyId.toString()
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
                          value={reasonId}
                          {...register("systemCodeId")}
                          onChange={handleChangeReason}
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
                                value={item.systemCodeId.toString()}
                                key={item.systemCodeId}
                              >
                                {item.description}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={8}
                    sx={{ display: { xs: "none", md: "block" } }}
                  ></Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    sx={{ display: { xs: "none", md: "block" } }}
                  ></Grid>
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
                          minRows={3}
                          id="comments"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
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
                  onClick={() => {
                    const data = getValues();
                    console.log("errors", errors, isValid, data);
                    setOutletValidation();
                  }}
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
                  disabled={isSubmitting}
                  onClick={() => {
                    setOutletValidation();
                    setAddNew(true);
                  }}
                >
                  {intl.formatMessage({
                    id: "Entity.button.saveAndAddNew",
                    defaultMessage: "Save and Add New",
                  })}
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default MerchantTransacionDefinition;
