import {
    FormControl,
    Grid,
    InputBase,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
    FormHelperText
} from "@mui/material";
import {
    down_arrow_icon,
} from "../../assets/images";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { IssuerProfileService } from "../../services/configuration/issuer-profile-service";
import { BankInfoService } from "../../services/configuration/bank-info-service";
import { CardSchemeService } from "../../services/configuration/card-scheme-service";
import { CurrencyService } from "../../services/configuration/currency-service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import { IssProfile } from "../../models/configuration/IssuerProfileModel";
import { InstitutionAccountsModel } from "../../models/configuration/InstitutionAccountsModel";
import { BankInfoModel } from "../../models/configuration/BankInfoModel";
import { CardSchemeModel } from "../../models/configuration/CardSchemeModel";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { Errors, StatusCode } from "../../utils/constant";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { InstitutionAccountsService } from "../../services/configuration/institution-accounts-service";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";

function InstitutionAccountsDefinition() {
    const { id } = useParams<{ id?: any }>();
    const { issuerAcqProfile } = useParams<{ issuerAcqProfile?: any }>();
    const { cardSchemeId } = useParams<{ cardSchemeId?: any }>();
    const { currencyCode } = useParams<{ currencyCode?: any }>();
    const { bankCode } = useParams<{ bankCode?: any }>();
    const { institutionId } = useParams<{ institutionId?: any }>();

    const intl = useIntl();
    const navigate = useNavigate();

    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [issProfiles, setIssProfiles] = useState<IssProfile[]>([]);
    const [bankInfos, setBankInfos] = useState<BankInfoModel[]>([]);
    const [cardSchemes, setCardSchemes] = useState<CardSchemeModel[]>([]);
    const [currencies, setCurrencies] = useState<CurrencyModel[]>([]);


    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [selectedBankCode, setSelectedBankCode] = useState('');
    const [selectedIssuerProfile, setSelectedIssuerProfile] = useState('');
    const [selectedCardScheme, setSelectedCardScheme] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');

    const [selectChargingInstitution, setSelectChargingInstitution] = useState("");
    const [chargingInstitutions, setChargingInstitutions] = useState<Institution[]>([]);
    const [selectAccountOrigin, setSelectAccountOrigin] = useState("");
    const [accountOrigins, setAccountOrigins] = useState<SystemCodeModel[]>([]);
    const [isChargingInstitutionDisabled, setIsChargingInstitutionDisabled] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<InstitutionAccountsModel>({
        mode: "onChange",
        resolver: yupResolver(validations.createInstitutionAccountsValidations),
    });

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
    };

    const getAccountOriginsByPrefixAndInstitutionId = async () => {
        SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("ACCOUNT_ORIGIN", "SYSTEM")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                const filteredAccountOrigins = data.filter((item: SystemCodeModel) => item.codeValue !== 'M');
                setAccountOrigins(filteredAccountOrigins);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const handleAccountOriginChange = (event: SelectChangeEvent) => {
        setSelectAccountOrigin(event.target.value);
        if (event.target.value === "B") {
            setChargingInstitutions([]);
            setSelectChargingInstitution("");
            setIsChargingInstitutionDisabled(true);
        }
        else {
            setChargingInstitutions(institutions);
            setIsChargingInstitutionDisabled(false);
        }
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
    };

    const getInstitutionAccountsById = async () => {
        InstitutionAccountsService.getInstitutionAccountsById(id)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                reset(data);
                setSelectInstitutionVal(data.institutionId);
                setSelectAccountOrigin(data.accountOrigin);

                if (data.accountOrigin === "B") {
                    setChargingInstitutions([]);
                    setSelectChargingInstitution("");
                    setIsChargingInstitutionDisabled(true);
                }
                else {
                    setSelectChargingInstitution(data.chargingInstitution);
                }
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const onSubmit = async (value: InstitutionAccountsModel) => {
        const model = {
            institutionAcctsId: value.institutionAcctsId ? value.institutionAcctsId : 0,
            institutionId: value.institutionId ? value.institutionId : selectInstitutionVal,
            accountType: value.accountType,
            accountDescription: value.accountDescription,
            cardSchemeId: value.cardSchemeId ? value.cardSchemeId : selectedCardScheme,
            issuerAcqProfile: value.issuerAcqProfile ? value.issuerAcqProfile : selectedIssuerProfile,
            currencyCode: value.currencyCode ? value.currencyCode : selectedCurrency,
            accountOrigin: value.accountOrigin ? value.accountOrigin : selectAccountOrigin,
            chargingInstitution: value.chargingInstitution ? value.chargingInstitution : selectChargingInstitution,
            bankCode: value.bankCode ? value.bankCode : selectedBankCode,
            accountNumber: value.accountNumber,
            iban: value.iban,
            branch: value.branch,
            beneficiaryName: value.beneficiaryName
        };
        console.log(model);
        await InstitutionAccountsService.saveOrUpdateInstitutionAccounts(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    navigate(`/institution-accounts`);
                    if (id) {
                        toast.success("Record updated successfully");

                    } else {
                        toast.success("Record added successfully");
                    }
                }
            })
            .catch((err) => {
                // if (err && err?.response?.status === 400) {
                //     if (err.response.data.errors[0] === 'CFG-283') {
                //         toast.error("Institution Account Record already exists");
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

    useEffect(() => {
        if (selectInstitutionVal !== "") {

            IssuerProfileService.getIssuerProfilesByInstitution(selectInstitutionVal)
                .then((response: { data: any }) => {
                    setIssProfiles(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });

            BankInfoService.getAllBankInfoByInstitution(selectInstitutionVal)
                .then((response: { data: any }) => {
                    setBankInfos(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
    }, [selectInstitutionVal]);

    useEffect(() => {
        if (id) {
            getInstitutionAccountsById();
            InstitutionService.getAllInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                    setChargingInstitutions(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
            //setInstitutefromLocalStorage();

            CardSchemeService.getAllCardScheme()
                .then((response: { data: any }) => {
                    setCardSchemes(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });

            CurrencyService.getAllCurrencies()
                .then((response: { data: any }) => {
                    setCurrencies(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });

            setSelectedIssuerProfile(issuerAcqProfile);
            setSelectedCardScheme(cardSchemeId);
            setSelectedCurrency(currencyCode);
            setSelectedBankCode(bankCode);
        }
        else {
            InstitutionService.getAllInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                    setChargingInstitutions(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
            //setInstitutefromLocalStorage();
            setSelectInstitutionVal(institutionId);
            CardSchemeService.getAllCardScheme()
                .then((response: { data: any }) => {
                    setCardSchemes(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });

            CurrencyService.getAllCurrencies()
                .then((response: { data: any }) => {
                    setCurrencies(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
        getAccountOriginsByPrefixAndInstitutionId();
    }, [id, reset]);

    return (
        <>
            <div className="wrapper">
                <main className="main-content">
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "InstitutionAccountsDefinition.definition",
                                        defaultMessage: "Institution Account Definition",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "InstitutionAccountsDefinition.addUpdateTitle",
                                        defaultMessage: "Add/Edit Institution Account",
                                    })}
                                </p>
                            </div>
                        </div>
                        <form onSubmitCapture={handleSubmit(onSubmit)}>
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
                                                    disabled={true}
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
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {intl.formatMessage({
                                                    id: "IssuerProfile.label",
                                                    defaultMessage: "Issuer Profile",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("issuerAcqProfile")}
                                                    value={selectedIssuerProfile}
                                                    onChange={(event) => setSelectedIssuerProfile(event.target.value)}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                >
                                                    <MenuItem disabled value="">{intl.formatMessage({ id: "InstitutionAccounts.selectIssuerProfile", defaultMessage: "Select Issuer Profile" })}</MenuItem>
                                                    {issProfiles &&
                                                        issProfiles.length > 0 &&
                                                        issProfiles.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.profileId}
                                                                    value={type.issuerAcqProfile}
                                                                >
                                                                    {type.issuerAcqProfile}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {
                                                    (selectedIssuerProfile === "" || selectedIssuerProfile === undefined) && errors.issuerAcqProfile?.message &&
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.issuerAcqProfile?.message}
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "InstitutionAccountsDefinition.accountDescription",
                                                    defaultMessage: "Account Description",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "InstitutionAccountsDefinition.enterAccountDescriptionPlaceholder",
                                                        defaultMessage: "Write account description",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="accountDescription"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 50 }}
                                                    {...register("accountDescription")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.accountDescription?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {intl.formatMessage({
                                                    id: "CardScheme.label",
                                                    defaultMessage: "Card Scheme",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("cardSchemeId")}
                                                    value={selectedCardScheme}
                                                    onChange={(event) => setSelectedCardScheme(event.target.value)}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                >
                                                    <MenuItem disabled value="">{intl.formatMessage({ id: "InstitutionAccounts.selectCardScheme", defaultMessage: "Select Card Scheme" })}</MenuItem>
                                                    {cardSchemes &&
                                                        cardSchemes.length > 0 &&
                                                        cardSchemes.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.cardSchemeId}
                                                                    value={type.cardSchemeId}
                                                                >
                                                                    {type.cardSchemeName}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {
                                                    (selectedCardScheme === "" || selectedCardScheme === undefined) && errors.cardSchemeId?.message &&
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.cardSchemeId?.message}
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "InstitutionAccountsDefinition.accountType",
                                                    defaultMessage: "Account Type",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "InstitutionAccountsDefinition.enterAccountTypePlaceholder",
                                                        defaultMessage: "Write account type",
                                                    })}
                                                    error
                                                    fullWidth
                                                    inputProps={{ maxLength: 6 }}
                                                    id="accountType"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    {...register("accountType")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.accountType?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {intl.formatMessage({
                                                    id: "BankCode.label",
                                                    defaultMessage: "Bank Code",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("bankCode")}
                                                    value={selectedBankCode}
                                                    onChange={(event) => setSelectedBankCode(event.target.value)}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                >
                                                    <MenuItem disabled value="">{intl.formatMessage({ id: "InstitutionAccounts.selectBankCode", defaultMessage: "Select Bank Code" })}</MenuItem>
                                                    {bankInfos &&
                                                        bankInfos.length > 0 &&
                                                        bankInfos.map((type) => {
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
                                                    (selectedBankCode === "" || selectedBankCode === undefined) && errors.bankCode?.message &&
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.bankCode?.message}
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "InstitutionAccountsDefinition.accountNumber",
                                                    defaultMessage: "Account Number",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "InstitutionAccountsDefinition.enterAccountNumberPlaceholder",
                                                        defaultMessage: "Write account number",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="accountNumber"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 30 }}
                                                    {...register("accountNumber")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.accountNumber?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {intl.formatMessage({
                                                    id: "AccountOrigin.label",
                                                    defaultMessage: "Account Origin",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("accountOrigin")}
                                                    value={selectAccountOrigin}
                                                    onChange={handleAccountOriginChange}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                >
                                                    <MenuItem value="">{intl.formatMessage({ id: "accountingTemplateDetails.selectAccountOrigin", defaultMessage: "Select Account Origin" })}</MenuItem>
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
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "InstitutionAccountsDefinition.iban",
                                                    defaultMessage: "IBAN",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "InstitutionAccountsDefinition.enterIbanPlaceholder",
                                                        defaultMessage: "Write IBAN",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="iban"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 30 }}
                                                    {...register("iban")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.iban?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {intl.formatMessage({
                                                    id: "DestinationInstitution.label",
                                                    defaultMessage: "Charging Institution",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("chargingInstitution")}
                                                    disabled={isChargingInstitutionDisabled}
                                                    value={selectChargingInstitution}
                                                    onChange={(event) => setSelectChargingInstitution(event.target.value)}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                >
                                                    <MenuItem value="">{intl.formatMessage({ id: "institutionAccountsDefinition.selectChargingInstitution", defaultMessage: "Select Charging Institution" })}</MenuItem>
                                                    {chargingInstitutions &&
                                                        chargingInstitutions.length > 0 &&
                                                        chargingInstitutions.map((type) => {
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
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "Currency.label",
                                                    defaultMessage: "Currency",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("currencyCode")}
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
                                                    (selectedCurrency === "" || selectedCurrency === undefined) && errors.currencyCode?.message &&
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.currencyCode?.message}
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label>
                                                {intl.formatMessage({
                                                    id: "InstitutionAccountsDefinition.branch",
                                                    defaultMessage: "Branch",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "InstitutionAccountsDefinition.enetrbranch",
                                                        defaultMessage: "Enter Branch",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="branch"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 10 }}
                                                    {...register("branch")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.branch?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "InstitutionAccountsDefinition.beneficiaryName",
                                                    defaultMessage: "Beneficiary Name",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "InstitutionAccountsDefinition.enterBeneficiaryName",
                                                        defaultMessage: "Enter Beneficiary Name",
                                                    })}
                                                    fullWidth
                                                    id="beneficiaryName"
                                                    error={Boolean(errors.beneficiaryName?.message)}
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 50 }}
                                                    {...register("beneficiaryName")}
                                                />
                                                {errors.beneficiaryName?.message && (
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.beneficiaryName?.message}
                                                    </FormHelperText>
                                                )}
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
                                        id="CardScheme.cancel"
                                        defaultMessage="Cancel"
                                    />
                                </Button>
                                <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                                    <FormattedMessage
                                        id="CardScheme.save"
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

export default InstitutionAccountsDefinition;
