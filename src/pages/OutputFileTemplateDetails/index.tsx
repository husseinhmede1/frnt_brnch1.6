import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    Grid,
    InputBase,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
    FormHelperText,
} from "@mui/material";
import {
    check_rounded,
    down_arrow_icon,
    ic_check,
    ic_checked,
    ios_arrow_backward,
    ios_arrow_forward,
    uncheck_rounded,
} from "../../assets/images";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { OutputFileTemplateHdrModel } from "../../models/configuration/OutputFileTemplateHdrModel";
import { OutputTemplateHdrService } from "../../services/configuration/output-template-hdr-service";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { OutputFileTemplateDetailsModel } from "../../models/configuration/OutputTemplateDetailsModel";
import { OutputTemplateDetailsService } from "../../services/configuration/output-template-details-service";
import { Errors, StatusCode } from "../../utils/constant";
import { BankInfoModel } from "../../models/configuration/BankInfoModel";
import { BankInfoService } from "../../services/configuration/bank-info-service";
import { BankFilesOutputService } from "../../services/configuration/bank-files-output-service";
import OutputFileTemplateDetailsList from "../../components/OutputFileTemplateDetailsList";

const UNASSIGNED_LIST = "UNASSIGNED_LIST";
const ASSIGNED_LIST = "ASSIGNED_LIST";
const SHIFT_TO_ASSIGNED = "SHIFT_TO_ASSIGNED";
const SHIFT_TO_UNASSIGNED = "SHIFT_TO_UNASSIGNED";

function OutputFileTemplateDetails() {
    const { id } = useParams<{ id?: any }>();
    const { sumPerAccount } = useParams<{ sumPerAccount?: any }>();
    const { merchantSubSummary } = useParams<{ merchantSubSummary?: any }>();
    const { instSubSummary } = useParams<{ instSubSummary?: any }>();
    const { outputFormat } = useParams<{ outputFormat?: any }>();
    const { outputFileType } = useParams<{ outputFileType?: any }>();
    const { bankCode } = useParams<{ bankCode?: any }>();
    const { institutionId } = useParams<{ institutionId?: any }>();

    const intl = useIntl();
    const navigate = useNavigate();

    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [outputFormats, setOutputFormats] = useState<SystemCodeModel[]>([]);
    const [outputFileTypes, setOutputFileTypes] = useState<SystemCodeModel[]>([]);
    const [summaryBy, setSummaryBy] = useState<SystemCodeModel[]>([]);
    const [merchantSubSummaries, setMerchantSubSummaries] = useState<SystemCodeModel[]>([]);
    const [instSubSummaries, setInstSubSummaries] = useState<SystemCodeModel[]>([]);

    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [selectedSumPerAccount, setSelectedSumPerAccount] = useState('');
    const [selectedMerchantSubSummary, setSelectedMerchantSubSummary] = useState('');
    const [selectedInstSubSummary, setSelectedInstSubSummary] = useState('');
    const [selectedOutputFormat, setSelectedOutputFormat] = useState('');
    const [selectedOutputFileType, setSelectedOutputFileType] = useState('');

    const [unAssignedTemplateList, setUnAssignedTemplateList] = useState<SystemCodeModel[]>([]);
    const [assignedTemplateList, setAssignedTemplateList] = useState<OutputFileTemplateDetailsModel[]>([]);

    const [unAssignedBodyTemplateList, setUnAssignedBodyTemplateList] = useState<SystemCodeModel[]>([]);
    const [assignedBodyTemplateList, setAssignedBodyTemplateList] = useState<OutputFileTemplateDetailsModel[]>([]);

    const [unAssignedFooterTemplateList, setUnAssignedFooterTemplateList] = useState<SystemCodeModel[]>([]);
    const [assignedFooterTemplateList, setAssignedFooterTemplateList] = useState<OutputFileTemplateDetailsModel[]>([]);

    const [fieldPadsDtls, setFieldPadsDtls] = useState<string[]>([]);
    const [fieldPadsChar, setFieldPadsChar] = useState<string[]>([]);
    const [fieldLengths, setFieldLengths] = useState<number[]>([]);
    const [fieldFormatValues, setFieldFormatValues] = useState<string[]>([]);
    const [fieldCustomSyntaxValues, setFieldCustomSyntaxValues] = useState<string[]>([]);

    const [fieldPadsDtlsBody, setFieldPadsDtlsBody] = useState<string[]>([]);
    const [fieldPadsCharBody, setFieldPadsCharBody] = useState<string[]>([]);
    const [fieldLengthsBody, setFieldLengthsBody] = useState<number[]>([]);
    const [fieldFormatValuesBody, setFieldFormatValuesBody] = useState<string[]>([]);
    const [fieldCustomSyntaxValuesBody, setFieldCustomSyntaxValuesBody] = useState<string[]>([]);

    const [fieldPadsDtlsFooter, setFieldPadsDtlsFooter] = useState<string[]>([]);
    const [fieldPadsCharFooter, setFieldPadsCharFooter] = useState<string[]>([]);
    const [fieldLengthsFooter, setFieldLengthsFooter] = useState<number[]>([]);
    const [fieldFormatValuesFooter, setFieldFormatValuesFooter] = useState<string[]>([]);
    const [fieldCustomSyntaxValuesFooter, setFieldCustomSyntaxValuesFooter] = useState<string[]>([]);

    const [isMerchantSubSummaryDisabled, setIsMerchantSubSummaryDisabled] = useState(false);
    const [isInstSubSummaryDisabled, setIsInstSubSummaryDisabled] = useState(false);
    const [isOutputFileTypeDisabled, setIsOutputFileTypeDisabled] = useState(false);
    const [isSumPerAccountDisabled, setIsSumPerAccountDisabled] = useState(false);
    const [isAssignUnassignDisabled, setIsAssignUnassignDisabled] = useState(false);

    const [open, setOpen] = useState(false);
    const [fieldKey, setFieldKey] = useState<number>(0);
    const [unAssignedBankList, setUnAssignedBankList] = useState<BankInfoModel[]>([]);
    const [assignedBankList, setAssignedBankList] = useState<BankInfoModel[]>([]);
    const [unAssignedCheckedBankList, setUnAssignedCheckedBankList] = useState<BankInfoModel[]>([]);
    const [assignedCheckedBankList, setAssignedCheckedBankList] = useState<BankInfoModel[]>([]);
    const [selectedOutputFileTemplateHdrId, setSelectedOutputFileTemplateHdrId] = useState<number>(0);

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<OutputFileTemplateHdrModel>({
        mode: "onChange",
        resolver: yupResolver(validations.createOutputFileTemplateValidations),
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = (id: number) => {
        getAllBankInfoByInstitution(selectInstitutionVal, id);
        setAssignedCheckedBankList([]);
        setUnAssignedCheckedBankList([]);
        setSelectedOutputFileTemplateHdrId(id);
        setOpen(true);
    };

    const getAllBankInfoByInstitution = async (instID: string, outputFileTemplateHdrId: number) => {
        await BankInfoService.getAllBankInfoByInstitution(instID)
            .then((res) => {
                setUnAssignedBankList(res?.data);
                getAllMappedBanksByOutputTemplateHdrId(outputFileTemplateHdrId, res?.data)
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getAllMappedBanksByOutputTemplateHdrId = async (id: number, unAssignedBanks: BankInfoModel[]) => {
        let assignedBanks: BankInfoModel[] = [];
        await BankFilesOutputService.getAllMappedBanksByOutputTemplateHdrId(id).then(res => {
            setAssignedBankList(res.data);
            assignedBanks.push(...res.data)
        })
        setMappedBankList(assignedBanks, unAssignedBanks);
    }

    const setMappedBankList = (assignedBanks: BankInfoModel[], unAssignedBanks: BankInfoModel[]) => {
        assignedBanks && assignedBanks.length > 0 && assignedBanks.map((entity) => {
            unAssignedBanks = unAssignedBanks.filter((item) => item.bankCodeId !== entity.bankCodeId);
        })
        setUnAssignedBankList(unAssignedBanks);
    }

    const handleToggleStatus = (e: any, bank: BankInfoModel, type: string) => {
        if (type === UNASSIGNED_LIST) {
            if (e.target.checked) {
                const isAvaliable = unAssignedCheckedBankList && unAssignedCheckedBankList.filter(item => item.bankCodeId === bank.bankCodeId);
                if (isAvaliable && isAvaliable.length === 0) {
                    unAssignedCheckedBankList.push(bank);
                }
                setUnAssignedCheckedBankList(unAssignedCheckedBankList);
            }
            else {
                let unAssignedCheckedBanks = unAssignedCheckedBankList;
                unAssignedCheckedBanks = unAssignedCheckedBanks.filter((item) => item.bankCodeId !== bank.bankCodeId);
                setUnAssignedCheckedBankList(unAssignedCheckedBanks);
            }
        }
        else {
            if (e.target.checked) {
                const isAvaliable = assignedCheckedBankList && assignedCheckedBankList.filter(item => item.bankCodeId === bank.bankCodeId);
                if (isAvaliable && isAvaliable.length === 0) {
                    assignedCheckedBankList.push(bank);
                }
                setAssignedCheckedBankList(assignedCheckedBankList);
            }
            else {
                let assignedCheckedBanks = assignedCheckedBankList;
                assignedCheckedBanks = assignedCheckedBanks.filter((item) => item.bankCodeId !== bank.bankCodeId);
                setAssignedCheckedBankList(assignedCheckedBanks);
            }
        }
        setFieldKey(Math.random())
    }

    const mapOutputFileTemplateWithBank = () => {
        const promises = [];

        // First Section
        if (assignedBankList && assignedBankList.length > 0) {
            const assignedBankCodes = assignedBankList.map(item => item.bankCode);
            const model = {
                bankCodes: assignedBankCodes,
                outputFileTemplateHdrId: Number(selectedOutputFileTemplateHdrId)
            };
            console.log(model);
            const promise1 = BankFilesOutputService.mapOutputFileTemplateToBanks(model)
                .then(res => {
                    if (res.status === StatusCode.Success) {
                        return true; // Resolve the promise with a value
                    }
                })
                .catch(err => {
                    // if (err && err?.response?.status === 400) {
                    //     if (err.response.data.errors[0] === 'CFG-317') {
                    //         toast.error("Bank Files Output Record already exists");
                    //     }
                    // } else if (err && err.response && err.response.data === Errors.IdAlreadyExists) {
                    //     toast.error(Errors.IdAlreadyExists);
                    // } else if (err && err.response && err.response.data === Errors.uniqueIssuerProfile) {
                    //     toast.error(Errors.uniqueIssuerProfile);
                    // } else {
                    //       toast.error(err.response.data.errors[0]);
                    // }
                    toast.error(err.response.data.errors[0])

                    return false; // Resolve the promise with a value
                });

            promises.push(promise1);
        }

        // Second Section
        if (unAssignedBankList && unAssignedBankList.length > 0) {
            const unAssignedBankCodes = unAssignedBankList.map(item => item.bankCode);
            const model2 = {
                bankCodes: unAssignedBankCodes,
                outputFileTemplateHdrId: Number(selectedOutputFileTemplateHdrId)
            };
            console.log(model2);
            const promise2 = BankFilesOutputService.unMapOutputFileTemplateToBanks(model2)
                .then(res => {
                    if (res.status === StatusCode.Success) {
                        return true; // Resolve the promise with a value
                    }
                })
                .catch(err => {
                    // if (err && err?.response?.status === 400) {
                    //     // Handle specific error
                    // } else if (err && err.response && err.response.data === Errors.IdAlreadyExists) {
                    //     toast.error(Errors.IdAlreadyExists);
                    // } else if (err && err.response && err.response.data === Errors.uniqueIssuerProfile) {
                    //     toast.error(Errors.uniqueIssuerProfile);
                    // } else {
                    //       toast.error(err.response.data.errors[0]);
                    // }
                    toast.error(err.response.data.errors[0])
                    return false; // Resolve the promise with a value
                });

            promises.push(promise2);
        }

        // Wait for both promises to resolve
        Promise.all(promises)
            .then(results => {
                if (results.every(result => result === true)) {
                    toast.success("Banks assignment/unassignment is successful");
                }
                handleClose();
            })
            .catch(error => {
                console.error(error);
            });
    };


    const handleSelectAll = (e: any, type: string) => {
        if (e.target.checked) {
            if (type === UNASSIGNED_LIST) {
                setUnAssignedCheckedBankList(unAssignedBankList)
            }
            else {
                setAssignedCheckedBankList(assignedBankList)
            }
        }
        else {
            type === UNASSIGNED_LIST ? setUnAssignedCheckedBankList([]) : setAssignedCheckedBankList([])
        }
    }

    const handleShifting = (type: string) => {
        if (type === SHIFT_TO_ASSIGNED) {
            let unAssignedBanks = unAssignedBankList;
            assignedBankList.push(...unAssignedCheckedBankList)
            unAssignedCheckedBankList && unAssignedCheckedBankList.length > 0 && unAssignedCheckedBankList.map((bank) => {
                unAssignedBanks = unAssignedBanks.filter((item) => item.bankCodeId !== bank.bankCodeId);
            })
            setUnAssignedBankList(unAssignedBanks);
            setAssignedBankList(assignedBankList);
            setUnAssignedCheckedBankList([]);
        }
        else {
            unAssignedBankList.push(...assignedCheckedBankList)
            let assignedBanks = assignedBankList;
            assignedCheckedBankList && assignedCheckedBankList.length > 0 && assignedCheckedBankList.map((bank) => {
                assignedBanks = assignedBanks.filter((item) => item.bankCodeId !== bank.bankCodeId);
            })
            setAssignedCheckedBankList([]);
            setAssignedBankList(assignedBanks);
            setUnAssignedBankList(unAssignedBankList);
        }
    };

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
    };

    const getFieldsByPrefixAndInstitutionId = async () => {
        SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("FIELD_ID", "SYSTEM")
            .then((res) => {
                getAllMappedTemplates(id, res?.data)
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    }

    const getOutputFormatsByPrefixAndInstitutionId = async () => {
        SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("OUTPUT_FORMAT", "SYSTEM")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setOutputFormats(data);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    }

    const getSummaryByByPrefixAndInstitutionId = async (selectedOutputFileType: String) => {
        if (selectedOutputFileType === "TRANSACTIONS") {
            SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("OUTPUT_ACCTSUM_TRANSACTIONS", "SYSTEM")
                .then((res) => {
                    const data = JSON.parse(JSON.stringify(res.data));
                    setSummaryBy(data);
                })
                .catch((err) =>   toast.error(err.response.data.errors[0]));
        } else if (selectedOutputFileType === "ACCOUNTING") {
            SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("OUTPUT_ACCTSUM_ACCOUNTING", "SYSTEM")
                .then((res) => {
                    const data = JSON.parse(JSON.stringify(res.data));
                    setSummaryBy(data);
                })
                .catch((err) =>   toast.error(err.response.data.errors[0]));
        } else {
            setSummaryBy([]);
        }
    }

    const handleSummaryByChange = (selectedSummaryBy: String) => {
        if (selectedSummaryBy === "N") {
            setSelectedMerchantSubSummary("N");
            setSelectedInstSubSummary("N");
            setIsMerchantSubSummaryDisabled(true);
            setIsInstSubSummaryDisabled(true);
            setValue("merchantSubSummary", "N");
            setValue("instSubSummary", "N");
        } else {
            setSelectedMerchantSubSummary("");
            setSelectedInstSubSummary("");
            setIsMerchantSubSummaryDisabled(false);
            setIsInstSubSummaryDisabled(false);
            setValue("merchantSubSummary", "");
            setValue("instSubSummary", "");
        }
    };

    const handleMerchantSubSummaryChange = (selectedMerchantSubSummary: String) => {
        if (selectedMerchantSubSummary === "N") {
            setSelectedInstSubSummary("N");
            setIsInstSubSummaryDisabled(true);
            setValue("instSubSummary", "N");
        } else {
            setIsInstSubSummaryDisabled(false);
        }
    };

    const handleInstSubSummaryChange = (selectedInstSubSummary: String) => {
        if (selectedInstSubSummary === "N") {
            setSelectedMerchantSubSummary("N");
            setIsMerchantSubSummaryDisabled(true);
            setValue("merchantSubSummary", "N");
        } else {
            setIsMerchantSubSummaryDisabled(false);
        }
    };

    const getMerchantSubSummaryByPrefixAndInstitutionId = async (selectedOutputFileType: String) => {
        if (selectedOutputFileType === "TRANSACTIONS") {
            SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("OUTPUT_SUBSUM_TRANSACTIONS", "SYSTEM")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setMerchantSubSummaries(data);
                setInstSubSummaries(data);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
        } else if (selectedOutputFileType === "ACCOUNTING") {
            SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("OUTPUT_SUBSUM_ACCOUNTING", "SYSTEM")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setMerchantSubSummaries(data);
                setInstSubSummaries(data);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
        } else {
            setMerchantSubSummaries([]);
            setInstSubSummaries([]);
        }
    }

    const getAllMappedTemplates = async (id: number, unAssignedTemplates: SystemCodeModel[]) => {
        let assignedTemplates: OutputFileTemplateDetailsModel[] = [];
        let assignedTemplatesBody: OutputFileTemplateDetailsModel[] = [];
        let assignedTemplatesFooter: OutputFileTemplateDetailsModel[] = [];
        await OutputTemplateDetailsService.getOutputFileTemplateDetailsByOutputFileTemplateHdrIdAndFieldSection(id, "H").then(res => {
            setAssignedTemplateList(res.data);
            assignedTemplates.push(...res.data);

            // Loop through the fetched data and populate the field arrays
            const pads: string[] = [];
            const padsChar: string[] = [];
            const lengths: number[] = [];
            const numericValues: string[] = [];
            const customSyntax: string[] = [];

            assignedTemplates.forEach((template) => {
                pads.push(template.fieldPad || ''); // Use the fieldFormat value if available, or an empty string otherwise
                padsChar.push(template.fieldPadChar || '');
                lengths.push(template.fieldLength);
                numericValues.push(template.fieldFormat);
                customSyntax.push(template.fieldCsyntax);
            });

            // Set the field arrays with the corresponding values
            setFieldPadsDtls(pads);
            setFieldPadsChar(padsChar);
            setFieldLengths(lengths);
            setFieldFormatValues(numericValues);
            setFieldCustomSyntaxValues(customSyntax);
        })

        await OutputTemplateDetailsService.getOutputFileTemplateDetailsByOutputFileTemplateHdrIdAndFieldSection(id, "D").then(res => {
            setAssignedBodyTemplateList(res.data);
            assignedTemplatesBody.push(...res.data);

            // Loop through the fetched data and populate the field arrays
            const pads: string[] = [];
            const padsChar: string[] = [];
            const lengths: number[] = [];
            const numericValues: string[] = [];
            const customSyntax: string[] = [];

            assignedTemplatesBody.forEach((template) => {
                pads.push(template.fieldPad || ''); // Use the fieldFormat value if available, or an empty string otherwise
                padsChar.push(template.fieldPadChar || '');
                lengths.push(template.fieldLength);
                numericValues.push(template.fieldFormat);
                customSyntax.push(template.fieldCsyntax);
            });

            // Set the field arrays with the corresponding values
            setFieldPadsDtlsBody(pads);
            setFieldPadsCharBody(padsChar);
            setFieldLengthsBody(lengths);
            setFieldFormatValuesBody(numericValues);
            setFieldCustomSyntaxValuesBody(customSyntax);
        })

        await OutputTemplateDetailsService.getOutputFileTemplateDetailsByOutputFileTemplateHdrIdAndFieldSection(id, "F").then(res => {
            setAssignedFooterTemplateList(res.data);
            assignedTemplatesFooter.push(...res.data);

            // Loop through the fetched data and populate the field arrays
            const pads: string[] = [];
            const padsChar: string[] = [];
            const lengths: number[] = [];
            const numericValues: string[] = [];
            const customSyntax: string[] = [];

            assignedTemplatesFooter.forEach((template) => {
                pads.push(template.fieldPad || ''); // Use the fieldFormat value if available, or an empty string otherwise
                padsChar.push(template.fieldPadChar || '');
                lengths.push(template.fieldLength);
                numericValues.push(template.fieldFormat);
                customSyntax.push(template.fieldCsyntax);
            });

            // Set the field arrays with the corresponding values
            setFieldPadsDtlsFooter(pads);
            setFieldPadsCharFooter(padsChar);
            setFieldLengthsFooter(lengths);
            setFieldFormatValuesFooter(numericValues);
            setFieldCustomSyntaxValuesFooter(customSyntax);
        })
    }

    const getOutputFileTypesByPrefixAndInstitutionId = async () => {
        SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("OUTPUT_TYPE", "SYSTEM")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                setOutputFileTypes(data);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    }

    const getOutputFileTemplateById = async () => {
        OutputTemplateHdrService.getOutputFileTemplateById(id)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                reset(data);
                console.log(data)
                setSelectInstitutionVal(data.institutionId);
                setSelectedMerchantSubSummary(data.merchantSubSummary);
                setSelectedInstSubSummary(data.instSubSummary);
                console.log(data.summaryBy)
                if (data.sumPerAccount === "N") {
                    setIsMerchantSubSummaryDisabled(true);
                    setIsInstSubSummaryDisabled(true);
                }
                setIsMerchantSubSummaryDisabled(true);
                setIsInstSubSummaryDisabled(true);
                setIsOutputFileTypeDisabled(true);
                setIsSumPerAccountDisabled(true);
                //handleSummaryByChange(data.sumPerAccount);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const onSubmit = async (value: OutputFileTemplateHdrModel) => {

        // Header
        var updatedAssignedTemplateList;
        if (assignedTemplateList.length !== 0) {
            // Update the values in the assignedTemplateList array
            updatedAssignedTemplateList = assignedTemplateList.map((template, index) => {
                return {
                    ...template,
                    fieldPad: fieldPadsDtls[index] || "",
                    fieldPadChar: fieldPadsChar[index] || "",
                    fieldLength: fieldLengths[index] || 0,
                    fieldFormat: fieldFormatValues[index] || "",
                    fieldCsyntax: fieldCustomSyntaxValues[index] || ""
                };
            });
            // Set the updatedAssignedTemplateList as the new state
            setAssignedTemplateList(updatedAssignedTemplateList);
        }

        // Body
        var updatedAssignedTemplateListBody;
        if (assignedBodyTemplateList.length !== 0) {
            // Update the values in the assignedTemplateList array
            updatedAssignedTemplateListBody = assignedBodyTemplateList.map((template, index) => {
                return {
                    ...template,
                    fieldPad: fieldPadsDtlsBody[index] || "",
                    fieldPadChar: fieldPadsCharBody[index] || "",
                    fieldLength: fieldLengthsBody[index] || 0,
                    fieldFormat: fieldFormatValuesBody[index] || "",
                    fieldCsyntax: fieldCustomSyntaxValuesBody[index] || ""
                };
            });
            // Set the updatedAssignedTemplateList as the new state
            setAssignedBodyTemplateList(updatedAssignedTemplateListBody);
        }

        // Footer
        var updatedAssignedTemplateListFooter;
        if (assignedFooterTemplateList.length !== 0) {
            // Update the values in the assignedTemplateList array
            updatedAssignedTemplateListFooter = assignedFooterTemplateList.map((template, index) => {
                return {
                    ...template,
                    fieldPad: fieldPadsDtlsFooter[index] || "",
                    fieldPadChar: fieldPadsCharFooter[index] || "",
                    fieldLength: fieldLengthsFooter[index] || 0,
                    fieldFormat: fieldFormatValuesFooter[index] || "",
                    fieldCsyntax: fieldCustomSyntaxValuesFooter[index] || ""
                };
            });
            // Set the updatedAssignedTemplateList as the new state
            setAssignedTemplateList(updatedAssignedTemplateListFooter);
        }

        const model = {
            outputTemplateHdrId: value.outputTemplateHdrId ? Number(value.outputTemplateHdrId) : 0,
            institutionId: value.institutionId ? value.institutionId : institutionId,
            outputFileType: value.outputFileType,
            outputDescription: value.outputDescription,
            sumPerAccount: value.sumPerAccount ? value.sumPerAccount : selectedSumPerAccount,
            merchantSubSummary: value.merchantSubSummary ? value.merchantSubSummary : "N",
            instSubSummary: value.instSubSummary ? value.instSubSummary : "N",
            outputFormat: value.outputFormat ? value.outputFormat : selectedOutputFormat,
            separator: value.separator,
            outputFileTypeAbbr: value.outputFileTypeAbbr,
            outputFileTemplateDetailsHeaderRequestDtos: updatedAssignedTemplateList
                ? updatedAssignedTemplateList.map((template) => ({
                    ...template,
                    institutionId: selectInstitutionVal,
                    outputTemplateHdrId: Number(template.outputTemplateHdrId),
                    fieldSection: 'H',
                }))
                : [],
            outputFileTemplateDetailsDetailRequestDtos: updatedAssignedTemplateListBody
                ? updatedAssignedTemplateListBody.map((template) => ({
                    ...template,
                    institutionId: selectInstitutionVal,
                    outputTemplateHdrId: Number(template.outputTemplateHdrId),
                    fieldSection: 'D',
                }))
                : [],
            outputFileTemplateDetailsFooterRequestDtos: updatedAssignedTemplateListFooter
                ? updatedAssignedTemplateListFooter.map((template) => ({
                    ...template,
                    institutionId: selectInstitutionVal,
                    outputTemplateHdrId: Number(template.outputTemplateHdrId),
                    fieldSection: 'F',
                }))
                : [],
        };

        console.log(model);
        await OutputTemplateHdrService.saveOrUpdateOutputFileTemplate(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    navigate(`/output-details/${res.data.outputTemplateHdrId}/${res.data.sumPerAccount}/${res.data.merchantSubSummary}/${res.data.outputFormat}/${res.data.outputFileType}/${res.data.institutionId}/${res.data.instSubSummary}/`);
                    if (id) {
                        toast.success("Output File Template details updated successfully");

                    } else {
                        toast.success("Output File Template added successfully");
                    }
                }
                getFieldsByPrefixAndInstitutionId();
            })
            .catch((err) => {
                // if (err && err?.response?.status === 400) {
                //     if (err.response.data.errors[0] === 'CFG-302') {
                //         toast.error("Output Template HDR Record already exists");
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
        if (id) {
            getOutputFileTemplateById();
            InstitutionService.getAllInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
            setInstitutefromLocalStorage();
            setSelectedSumPerAccount(sumPerAccount);
            setSelectedMerchantSubSummary(merchantSubSummary);
            setSelectedInstSubSummary(instSubSummary);
            setSelectedOutputFormat(outputFormat);
            setSelectedOutputFileType(outputFileType);
            setIsAssignUnassignDisabled(false);
        }
        else {
            InstitutionService.getAllInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
            setInstitutefromLocalStorage();
            setIsAssignUnassignDisabled(true);

        }
        setSelectInstitutionVal(institutionId);
        getOutputFormatsByPrefixAndInstitutionId();
        getMerchantSubSummaryByPrefixAndInstitutionId(outputFileType);
        getOutputFileTypesByPrefixAndInstitutionId();
        getFieldsByPrefixAndInstitutionId();
        getSummaryByByPrefixAndInstitutionId(outputFileType);

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
                                        id: "OutputFileTemplateDetails.definition",
                                        defaultMessage: "Output File Template Definition",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "OutputFileTemplateDetails.addUpdateTitle",
                                        defaultMessage: "Add/Edit Output File Template",
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
                                                    // disabled={true}
                                                    {...register("institutionId")}
                                                    value={selectInstitutionVal}
                                                    onChange={handleInstitutionChange}
                                                    disabled
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
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "MerchantSubSummary.label",
                                                    defaultMessage: "Merchant Sub Summary",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("merchantSubSummary")}
                                                    value={selectedMerchantSubSummary}
                                                    onChange={(event) => {
                                                        const selectedMerchantSubSummary = event.target.value;
                                                        setSelectedMerchantSubSummary(selectedMerchantSubSummary);
                                                        handleMerchantSubSummaryChange(selectedMerchantSubSummary);
                                                    }}
                                                    displayEmpty
                                                    disabled={isMerchantSubSummaryDisabled}
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                >
                                                    <MenuItem value="" disabled>
                                                        {intl.formatMessage({ id: "outputFileTemplate.selectMerchantSubSummary", defaultMessage: "Select Merchant Sub Summary" })}
                                                    </MenuItem>
                                                    {merchantSubSummaries &&
                                                        merchantSubSummaries.length > 0 &&
                                                        merchantSubSummaries.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.codeSuffix}
                                                                    value={type.codeValue}
                                                                >
                                                                    {type.codeSuffix}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {/* Conditionally render the FormHelperText based on the disabled state */}
                                                {
                                                    !isMerchantSubSummaryDisabled &&
                                                    errors.merchantSubSummary?.message &&
                                                    selectedMerchantSubSummary === "" && (
                                                        <FormHelperText id="error-helper-text" error>
                                                            {errors.merchantSubSummary?.message}
                                                        </FormHelperText>
                                                    )
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "OutputFileTemplates.outputDescription",
                                                    defaultMessage: "Output Description",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "OutputFileTemplates.enterOutputDescriptionPlaceholder",
                                                        defaultMessage: "Insert Output Description",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="outputDescription"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 50 }}
                                                    {...register("outputDescription")}
                                                />

                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.outputDescription?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "InstitutionSubSummary.label",
                                                    defaultMessage: "Institution Sub Summary",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("instSubSummary")}
                                                    value={selectedInstSubSummary}
                                                    onChange={(event) => {
                                                        const selectedInstSubSummary = event.target.value;
                                                        setSelectedInstSubSummary(selectedInstSubSummary);
                                                        handleInstSubSummaryChange(selectedInstSubSummary);
                                                    }}
                                                    displayEmpty
                                                    disabled={isInstSubSummaryDisabled}
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                >
                                                    <MenuItem value="" disabled>
                                                        {intl.formatMessage({ id: "outputFileTemplate.selectInstSubSummary", defaultMessage: "Select Institution Sub Summary" })}
                                                    </MenuItem>
                                                    {instSubSummaries &&
                                                        instSubSummaries.length > 0 &&
                                                        instSubSummaries.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.codeSuffix + "_inst"}
                                                                    value={type.codeValue}
                                                                >
                                                                    {type.codeSuffix}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {
                                                    !isInstSubSummaryDisabled &&
                                                    errors.instSubSummary?.message &&
                                                    selectedInstSubSummary === "" && (
                                                        <FormHelperText id="error-helper-text" error>
                                                            {errors.instSubSummary?.message}
                                                        </FormHelperText>
                                                    )
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "OutputFileType.label",
                                                    defaultMessage: "Output File Type",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("outputFileType")}
                                                    value={selectedOutputFileType}
                                                    disabled={isOutputFileTypeDisabled}
                                                    onChange={(event) => {
                                                        const selectedFileType = event.target.value;
                                                        setSelectedOutputFileType(selectedFileType);
                                                        getSummaryByByPrefixAndInstitutionId(selectedFileType);
                                                        getMerchantSubSummaryByPrefixAndInstitutionId(selectedFileType);
                                                    }}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                >
                                                    <MenuItem value="">{intl.formatMessage({ id: "outputFileTemplate.selectOutputFileType", defaultMessage: "Select Output File Type" })}</MenuItem>
                                                    {outputFileTypes &&
                                                        outputFileTypes.length > 0 &&
                                                        outputFileTypes.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.codeSuffix}
                                                                    value={type.codeSuffix}
                                                                >
                                                                    {type.codeSuffix}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {
                                                    selectedOutputFileType === "" && errors.outputFileType?.message &&
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.outputFileType?.message}
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "OutputFormat.label",
                                                    defaultMessage: "Output Format",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("outputFormat")}
                                                    value={selectedOutputFormat}
                                                    onChange={(event) => setSelectedOutputFormat(event.target.value)}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                >
                                                    <MenuItem value="">{intl.formatMessage({ id: "outputFileTemplate.selectOutputFormat", defaultMessage: "Select Output Format" })}</MenuItem>
                                                    {outputFormats &&
                                                        outputFormats.length > 0 &&
                                                        outputFormats.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.codeSuffix}
                                                                    value={type.codeSuffix}
                                                                >
                                                                    {type.codeSuffix}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {
                                                    selectedOutputFormat === "" && errors.outputFormat?.message &&
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.outputFormat?.message}
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "SumPerAccount.label",
                                                    defaultMessage: "Sum Per Account",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("sumPerAccount")}
                                                    value={selectedSumPerAccount}
                                                    disabled={isSumPerAccountDisabled}
                                                    onChange={(event) => {
                                                        const selectedSummaryBy = event.target.value;
                                                        setSelectedSumPerAccount(selectedSummaryBy);
                                                        handleSummaryByChange(selectedSummaryBy);
                                                    }}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => (
                                                        <img src={down_arrow_icon} alt="" />
                                                    )}
                                                >
                                                    <MenuItem value="">{intl.formatMessage({ id: "outputFileTemplate.selectSumPerAccount", defaultMessage: "Select Sum Per Account" })}</MenuItem>
                                                    {summaryBy &&
                                                        summaryBy.length > 0 &&
                                                        summaryBy.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.codeSuffix}
                                                                    value={type.codeValue}
                                                                >
                                                                    {type.codeSuffix}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {
                                                    selectedSumPerAccount === "" && errors.sumPerAccount?.message &&
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.sumPerAccount?.message}
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "Separator.label",
                                                    defaultMessage: "Separator",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "Separator.enterSeparatorPlaceholder",
                                                        defaultMessage: "Insert Separator",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="separator"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 4 }}
                                                    {...register("separator")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.separator?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "Abbreviation.label",
                                                    defaultMessage: "Abbreviation",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "Abbreviation.enterAbbreviationPlaceholder",
                                                        defaultMessage: "Insert Abbreviation",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="separator"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    inputProps={{ maxLength: 50 }}
                                                    {...register("outputFileTypeAbbr")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.outputFileTypeAbbr?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            <OutputFileTemplateDetailsList
                                name="Header"
                                result="1"
                                fieldSection="H"
                                outputFileType={selectedOutputFileType}
                                merchantSubSummary={selectedMerchantSubSummary}
                                instSubSummary={selectedInstSubSummary}
                                summaryBy={selectedSumPerAccount}
                                unAssignedTemplateList={unAssignedTemplateList}
                                setUnAssignedTemplateList={setUnAssignedTemplateList}
                                assignedTemplateList={assignedTemplateList}
                                setAssignedTemplateList={setAssignedTemplateList}
                                fieldPadsDtls={fieldPadsDtls}
                                setFieldPadsDtls={setFieldPadsDtls}
                                fieldPadsChar={fieldPadsChar}
                                setFieldPadsChar={setFieldPadsChar}
                                fieldLengths={fieldLengths}
                                setFieldLengths={setFieldLengths}
                                fieldFormatValues={fieldFormatValues}
                                setFieldFormatValues={setFieldFormatValues}
                                fieldCustomSyntaxValues={fieldCustomSyntaxValues}
                                setFieldCustomSyntaxValues={setFieldCustomSyntaxValues}
                            />

                            <OutputFileTemplateDetailsList
                                name="Body"
                                result="2"
                                fieldSection="D"
                                outputFileType={selectedOutputFileType}
                                merchantSubSummary={selectedMerchantSubSummary}
                                instSubSummary={selectedInstSubSummary}
                                summaryBy={selectedSumPerAccount}
                                unAssignedTemplateList={unAssignedBodyTemplateList}
                                setUnAssignedTemplateList={setUnAssignedBodyTemplateList}
                                assignedTemplateList={assignedBodyTemplateList}
                                setAssignedTemplateList={setAssignedBodyTemplateList}
                                fieldPadsDtls={fieldPadsDtlsBody}
                                setFieldPadsDtls={setFieldPadsDtlsBody}
                                fieldPadsChar={fieldPadsCharBody}
                                setFieldPadsChar={setFieldPadsCharBody}
                                fieldLengths={fieldLengthsBody}
                                setFieldLengths={setFieldLengthsBody}
                                fieldFormatValues={fieldFormatValuesBody}
                                setFieldFormatValues={setFieldFormatValuesBody}
                                fieldCustomSyntaxValues={fieldCustomSyntaxValuesBody}
                                setFieldCustomSyntaxValues={setFieldCustomSyntaxValuesBody}
                            />

                            <OutputFileTemplateDetailsList
                                name="Footer"
                                result="4"
                                fieldSection="F"
                                outputFileType={selectedOutputFileType}
                                merchantSubSummary={selectedMerchantSubSummary}
                                instSubSummary={selectedInstSubSummary}
                                summaryBy={selectedSumPerAccount}
                                unAssignedTemplateList={unAssignedFooterTemplateList}
                                setUnAssignedTemplateList={setUnAssignedFooterTemplateList}
                                assignedTemplateList={assignedFooterTemplateList}
                                setAssignedTemplateList={setAssignedFooterTemplateList}
                                fieldPadsDtls={fieldPadsDtlsFooter}
                                setFieldPadsDtls={setFieldPadsDtlsFooter}
                                fieldPadsChar={fieldPadsCharFooter}
                                setFieldPadsChar={setFieldPadsCharFooter}
                                fieldLengths={fieldLengthsFooter}
                                setFieldLengths={setFieldLengthsFooter}
                                fieldFormatValues={fieldFormatValuesFooter}
                                setFieldFormatValues={setFieldFormatValuesFooter}
                                fieldCustomSyntaxValues={fieldCustomSyntaxValuesFooter}
                                setFieldCustomSyntaxValues={setFieldCustomSyntaxValuesFooter}
                            />

                            <div className="btns-block right">
                                <Button
                                    disableElevation
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate('/output-template')}
                                >
                                    <FormattedMessage
                                        id="OutputFileTemplateDetails.cancel"
                                        defaultMessage="Cancel"
                                    />
                                </Button>
                                <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                                    <FormattedMessage
                                        id="OutputFileTemplateDetails.save"
                                        defaultMessage="Save"
                                    />
                                </Button>
                                <Button
                                    variant="contained"
                                    disabled={isAssignUnassignDisabled}
                                    disableElevation
                                    onClick={() => handleClickOpen(id)}
                                >
                                    {intl.formatMessage({
                                        id: "OutputFileTemplate.assignUnAssign",
                                        defaultMessage: "Bank Assign/UnAssign",
                                    })}

                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
                <Dialog open={open} onClose={handleClose} className="c-dialog md">
                    <DialogTitle component={"div"}>
                        <div className="title-block mb-0">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "OutputFileTemplate.assignUnAssign.title",
                                        defaultMessage: "Assigning Output FileTemplate To Banks",
                                    })}</Typography>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="inner-card to-do-block">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <div className="title">
                                        {intl.formatMessage({
                                            id: "OutputFileTemplate.assignUnAssign.allBanks",
                                            defaultMessage: "All Banks",
                                        })}
                                        <FormGroup row className="checbox-grp">
                                            <FormControlLabel
                                                key={fieldKey}
                                                control={
                                                    <Checkbox
                                                        icon={<img src={ic_check} alt="" />}
                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                        checked={(unAssignedCheckedBankList && unAssignedCheckedBankList.length) === (unAssignedBankList && unAssignedBankList.length) && unAssignedBankList.length > 0}
                                                    />}
                                                label={intl.formatMessage({
                                                    id: "OutputFileTemplate.assignUnAssign.selectAll",
                                                    defaultMessage: "Select All",
                                                })} labelPlacement="start" onClick={(e) => handleSelectAll(e, UNASSIGNED_LIST)} />
                                        </FormGroup>
                                    </div>
                                    <div className="to-do-card">
                                        <ul>
                                            {
                                                unAssignedBankList && unAssignedBankList.length > 0 &&
                                                unAssignedBankList.map((bank, i) => (
                                                    <li className="to-do-check" onChange={(e) => handleToggleStatus(e, bank, UNASSIGNED_LIST)}>
                                                        <FormControlLabel
                                                            key={fieldKey}
                                                            control={
                                                                <Checkbox
                                                                    icon={<img src={uncheck_rounded} alt="" />}
                                                                    checkedIcon={<img src={check_rounded} alt="" />}
                                                                />}
                                                            checked={unAssignedCheckedBankList && unAssignedCheckedBankList.filter(item => item.bankCodeId === bank.bankCodeId).length > 0}
                                                            label={bank.bankName} labelPlacement="start" />
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <div className="left-right-btns">
                                        <IconButton className="border-icon-btn no-border primary" onClick={() => handleShifting(SHIFT_TO_ASSIGNED)}>
                                            <img src={ios_arrow_forward} alt="ios_arrow_forward" />
                                        </IconButton>
                                        <IconButton className="border-icon-btn no-border primary" onClick={() => handleShifting(SHIFT_TO_UNASSIGNED)}>
                                            <img src={ios_arrow_backward} alt="ios_arrow_backward" />
                                        </IconButton>
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <div className="title">
                                        {intl.formatMessage({
                                            id: "OutputFileTemplate.assignUnAssign.assignedBanks",
                                            defaultMessage: "Assigned Banks",
                                        })}
                                        <FormGroup row className="checbox-grp">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        key={fieldKey}
                                                        icon={<img src={ic_check} alt="" />}
                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                        checked={(assignedCheckedBankList && assignedCheckedBankList.length) === (assignedBankList && assignedBankList.length) && assignedBankList.length > 0}
                                                    />}
                                                label={intl.formatMessage({
                                                    id: "OutputFileTemplate.assignUnAssign.selectAll",
                                                    defaultMessage: "Select All",
                                                })} labelPlacement="start" onClick={(e) => handleSelectAll(e, ASSIGNED_LIST)} />
                                        </FormGroup>
                                    </div>
                                    <div className="to-do-card right">
                                        <ul>
                                            {
                                                assignedBankList && assignedBankList.length > 0 &&
                                                assignedBankList.map((bank, i) => (
                                                    <li className="to-do-check">
                                                        <FormControlLabel
                                                            key={fieldKey}
                                                            control={
                                                                <Checkbox
                                                                    icon={<img src={uncheck_rounded} alt="" />}
                                                                    checkedIcon={<img src={check_rounded} alt="" />}
                                                                />}
                                                            checked={assignedCheckedBankList && assignedCheckedBankList.filter(item => item.bankCodeId === bank.bankCodeId).length > 0}
                                                            label={bank.bankName} labelPlacement="start" onClick={(e) => handleToggleStatus(e, bank, ASSIGNED_LIST)} />
                                                    </li>
                                                ))
                                            }
                                        </ul>
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
                            {intl.formatMessage({
                                id: "ActivityFeesPackageDefinition.cancel",
                                defaultMessage: "Cancel",
                            })}
                        </Button>
                        <Button disableElevation variant="contained" onClick={mapOutputFileTemplateWithBank}>
                            {intl.formatMessage({
                                id: "ActivityFeesPackageDefinition.save",
                                defaultMessage: "Save",
                            })}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        </>
    );
}

export default OutputFileTemplateDetails;