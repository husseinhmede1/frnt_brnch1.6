import {
    Checkbox,
    FormControlLabel,
    FormControl,
    Grid,
    InputBase,
    MenuItem,
    Select,
    FormHelperText,
    List,
    ListItem,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    TextareaAutosize,
    DialogActions,
} from "@mui/material";
import {
    down_arrow_icon,
    uncheck_rounded,
    check_rounded
} from "../../assets/images";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { OutputFileTemplateHdrModel } from "../../models/configuration/OutputFileTemplateHdrModel";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { OutputFileTemplateDetailsModel } from "../../models/configuration/OutputTemplateDetailsModel";
import { OutputTemplateDetailsService } from "../../services/configuration/output-template-details-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { allowAlphaNumeric, allowOnlyNumbers } from "../../utils/commonfunction";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

function OutputFileTemplateDetailsList(props: any) {
    const { id } = useParams<{ id?: any }>();

    const intl = useIntl();
    const [fieldPads, setFieldPads] = useState<SystemCodeModel[]>([]);

    const [isExpanded, setIsExpanded] = useState(false);
    const [contextDesc, setContextDesc] = useState<string>("");

    const handleExpandCollapse = () => {
        setIsExpanded(!isExpanded);
    };

    const [open, setOpen] = useState(false);
    const [customSyntaxIndex, setCustomSyntaxIndex] = useState<number>(-1);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCustomSyntaxIndex(-1);
    };

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<OutputFileTemplateHdrModel>({
        mode: "onChange",
        resolver: yupResolver(validations.createOutputFileTemplateValidations),
    });

    const {
        register: registerDetails,
        handleSubmit: handleSubmitDetails,
        reset: resetDetails,
        clearErrors: clearErrorsDetails,
        formState: { errors: errorsDetails, isSubmitting: isSubmittingDetails },
    } = useForm<OutputFileTemplateDetailsModel>({
        mode: "onChange",
        resolver: yupResolver(validations.createOutputFileTemplateDetailsValidations, {
            context: {
                description: contextDesc
            }
        }),
    });

    const getFieldsByPrefixAndInstitutionId = async () => {
        const model = {
            codePrefix: "FIELD_ID",
            codeResult: props.result,
            outputFileType: props.outputFileType,
            merchantSubSummary: props.merchantSubSummary,
            instSubSummary: props.instSubSummary,
            summaryBy: props.summaryBy
        }
        SystemCodeServices.getSystemCodesByPrefixAndValue(model)
            .then((res) => {
                props.setUnAssignedTemplateList(res?.data);
                getAllMappedTemplates(id, res?.data)
            })
            .catch((err) =>           toast.error(err.response.data.errors[0])
            );
    }

    const getFieldPadsByPrefixAndInstitutionId = async () => {
        SystemCodeServices.getSystemCodeByPrefixAndInstitutionId("FIELD_PAD", "SYSTEM")
            .then((res) => {
                setFieldPads(res?.data);
            })
            .catch((err) =>           toast.error(err.response.data.errors[0])
            );
    }

    const getAllMappedTemplates = async (id: number, unAssignedTemplates: SystemCodeModel[]) => {
        let assignedTemplates: OutputFileTemplateDetailsModel[] = [];
        await OutputTemplateDetailsService.getOutputFileTemplateDetailsByOutputFileTemplateHdrIdAndFieldSection(id, props.fieldSection).then(res => {
            props.setAssignedTemplateList(res.data);
            assignedTemplates.push(...res.data);

            // Loop through the fetched data and populate the field arrays
            const pads: string[] = [];
            const padsChar: string[] = [];
            const lengths: number[] = [];
            const numericValues: string[] = [];
            const outputAcctingEntryDescs: string[] = [];
            const customSyntaxValues: string[] = [];

            assignedTemplates.forEach((template) => {
                pads.push(template.fieldPad || ''); // Use the fieldFormat value if available, or an empty string otherwise
                padsChar.push(template.fieldPadChar || '');
                lengths.push(template.fieldLength);
                numericValues.push(template.fieldFormat);
                customSyntaxValues.push(template.fieldCsyntax || '');
            });

            // Set the field arrays with the corresponding values
            props.setFieldPadsDtls(pads);
            props.setFieldPadsChar(padsChar);
            props.setFieldLengths(lengths);
            props.setFieldFormatValues(numericValues);
            props.setFieldOutputAcctingEntryDescs(outputAcctingEntryDescs);
            props.setFieldCustomSyntaxValues(customSyntaxValues);
        })
    }

    const popFromAssignedList = (fieldId: number, customIndex: number = -1) => {
        const index = props.assignedTemplateList.findIndex((item: OutputFileTemplateDetailsModel) => item.fieldId === fieldId);
        const isCustomField = props.assignedTemplateList.find((item: OutputFileTemplateDetailsModel) => item.fieldId === fieldId)?.description === "CUSTOM FIELD";
        if(isCustomField && customIndex !== -1){
            props.assignedTemplateList.splice(customIndex, 1);
            props.fieldPadsDtls.splice(customIndex, 1);
            props.fieldPadsChar.splice(customIndex, 1);
            props.fieldLengths.splice(customIndex, 1);
            props.fieldFormatValues.splice(customIndex, 1);
            props.fieldCustomSyntaxValues.splice(customIndex, 1);
            props.setAssignedTemplateList([...props.assignedTemplateList]);
        } else if (index !== -1) {
            props.assignedTemplateList.splice(index, 1);
            props.fieldPadsDtls.splice(index, 1);
            props.fieldPadsChar.splice(index, 1);
            props.fieldLengths.splice(index, 1);
            props.fieldFormatValues.splice(index, 1);
            props.fieldCustomSyntaxValues.splice(index, 1);
            props.setAssignedTemplateList([...props.assignedTemplateList]);
        }
    };

    const pushToAssignedList = (fieldId: number) => {
        const isAvailable = props.unAssignedTemplateList.filter((item: SystemCodeModel) => item.systemCodeId === fieldId);

        if (isAvailable.length > 0) {
            const outputFileTemplateDetails: OutputFileTemplateDetailsModel = new OutputFileTemplateDetailsModel();
            outputFileTemplateDetails.outputTemplateDtlId = 0;
            outputFileTemplateDetails.institutionId = isAvailable[0].institutionId;
            outputFileTemplateDetails.outputTemplateHdrId = id ? id : 0;
            outputFileTemplateDetails.fieldSequence = 1;
            outputFileTemplateDetails.fieldId = fieldId;
            outputFileTemplateDetails.description = isAvailable[0].description;
            outputFileTemplateDetails.codePrefix = isAvailable[0].codePrefix;
            outputFileTemplateDetails.codeSuffix = isAvailable[0].codeSuffix;
            outputFileTemplateDetails.fieldPad = "";
            outputFileTemplateDetails.fieldPadChar = "";
            outputFileTemplateDetails.fieldLength = 0;
            outputFileTemplateDetails.fieldFormat = "";
            outputFileTemplateDetails.fieldCsyntax = "";

            if (props.assignedTemplateList.length === 0) {
                props.setAssignedTemplateList([outputFileTemplateDetails]);
            } else {
                props.assignedTemplateList.push(outputFileTemplateDetails);
                props.setAssignedTemplateList([...props.assignedTemplateList]);
            }
        }
    };


    const handleCheckedState = (fieldId: number, isCustomField: boolean = false) => {
        if(isCustomField){
            pushToAssignedList(fieldId);
        } else {
            if (props.assignedTemplateList.length === 0) {
                pushToAssignedList(fieldId);
            } else {
                const isChecked = props.assignedTemplateList.some((item: OutputFileTemplateDetailsModel) => item.fieldId === fieldId);
    
                if (isChecked) {
                    popFromAssignedList(fieldId);
                } else {
                    pushToAssignedList(fieldId);
                }
            }
        }
    };

    useEffect(() => {
        getFieldPadsByPrefixAndInstitutionId();

    }, [id, reset]);

    useEffect(() => {
        if(props.outputFileType !== "" && props.summaryBy !== "" && props.merchantSubSummary !== "" && props.instSubSummary !== "") {
            getFieldsByPrefixAndInstitutionId();
        }
    }, [props.outputFileType, props.summaryBy, props.merchantSubSummary, props.instSubSummary]);

    /*DRAGGABLE*/
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const dragStart = (e: React.DragEvent<HTMLLIElement>, position: number) => {
        dragItem.current = position;
    };

    const dragEnter = (e: React.DragEvent<HTMLLIElement>, position: number) => {
        dragOverItem.current = position;
    };

    const drop = (e: React.DragEvent<HTMLLIElement>) => {
        const copyListItems = [...props.assignedTemplateList];
        const copyListFieldPads = [...props.fieldPadsDtls];
        const copyListFieldLength = [...props.fieldLengths];
        const copyListFieldNumericValues = [...props.fieldFormatValues];
        const copyListFieldPadsChar = [...props.fieldPadsChar];
        const copyListFieldCustomSyntax = [...props.fieldCustomSyntaxValues];

        const dragItemContent = copyListItems[dragItem.current!];
        const dragItemContent1 = copyListFieldPads[dragItem.current!];
        const dragItemContent2 = copyListFieldLength[dragItem.current!];
        const dragItemContent3 = copyListFieldNumericValues[dragItem.current!];
        const dragItemContent4 = copyListFieldPadsChar[dragItem.current!];
        const dragItemContent5 = copyListFieldCustomSyntax[dragItem.current!];

        copyListItems.splice(dragItem.current!, 1);
        copyListItems.splice(dragOverItem.current!, 0, dragItemContent);

        copyListFieldPads.splice(dragItem.current!, 1);
        copyListFieldLength.splice(dragItem.current!, 1);
        copyListFieldPadsChar.splice(dragItem.current!, 1);
        copyListFieldNumericValues.splice(dragItem.current!, 1);
        copyListFieldCustomSyntax.splice(dragItem.current!, 1);

        copyListFieldPads.splice(dragOverItem.current!, 0, dragItemContent1);
        copyListFieldLength.splice(dragOverItem.current!, 0, dragItemContent2);
        copyListFieldPadsChar.splice(dragOverItem.current!, 0, dragItemContent4);
        copyListFieldNumericValues.splice(dragOverItem.current!, 0, dragItemContent3);
        copyListFieldCustomSyntax.splice(dragOverItem.current!, 0, dragItemContent5);

        dragItem.current = null;
        dragOverItem.current = null;
        props.setAssignedTemplateList(copyListItems);
        props.setFieldLengths(copyListFieldLength);
        props.setFieldFormatValues(copyListFieldNumericValues);
        props.setFieldPadsDtls(copyListFieldPads);
        props.setFieldPadsChar(copyListFieldPadsChar);
        props.setFieldCustomSyntaxValues(copyListFieldCustomSyntax);
    };

    return (
        <>
            <div onClick={handleExpandCollapse} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="title" style={{ flex: 1, fontSize:"18px", marginBottom: '-1rem', backgroundColor: 'rgb(242,242,242)' }}>
                    <p>
                        {intl.formatMessage({
                            id: "OutputFileTemplateDetails.headerDetails",
                            defaultMessage: `File ${props.name} Details`,
                        })}
                    </p>
                </div>
                <div className="icon" style={{ marginLeft: "0.5rem" }}>
                    <span onClick={handleExpandCollapse} style={{ cursor: "pointer" }}>
                        {/* <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} /> */}
                    </span>
                </div>
            </div>
            <p></p>
            {isExpanded && (
                <>
                    <div className="inner-card to-do-block">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <div className="title">
                                    {intl.formatMessage({
                                        id: "OutputFileTemplate.allFields",
                                        defaultMessage: "Select Field",
                                    })}
                                </div>
                                <div className="to-do-card">
                                    <ul>
                                        {
                                            props.unAssignedTemplateList && props.unAssignedTemplateList.length > 0 &&
                                            props.unAssignedTemplateList.map((template: SystemCodeModel, i: number) => (

                                                <li className="to-do-check">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                onClick={() => {
                                                                    if(template.codePrefix === "CUSTOM_FIELD_ID" && template.codeSuffix === "CUSTOM_FIELD"){
                                                                        handleCheckedState(template.systemCodeId, true);
                                                                    } else {
                                                                        handleCheckedState(template.systemCodeId);
                                                                    }
                                                                }}
                                                                icon={ template.codePrefix === "CUSTOM_FIELD_ID" && template.codeSuffix === "CUSTOM_FIELD"? <AddCircleOutlineOutlinedIcon color="primary" sx={{width:"20px", height:"20px"}} /> : <img src={uncheck_rounded} alt="" />}
                                                                checkedIcon={template.codePrefix === "CUSTOM_FIELD_ID" && template.codeSuffix === "CUSTOM_FIELD"? <AddCircleIcon sx={{width:"20px", height:"20px"}} /> : <img src={check_rounded} alt="" />}
                                                            />}
                                                        checked={props.assignedTemplateList && props.assignedTemplateList.filter((item: OutputFileTemplateDetailsModel) => item.fieldId === template.systemCodeId).length > 0}
                                                        label={template.description} labelPlacement="start" />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={8.8}>
                                <div className="title">
                                    {intl.formatMessage({
                                        id: "OutputFileTemplate.editLayout",
                                        defaultMessage: "Edit Layout",
                                    })}
                                </div>
                                <div className="to-do-card right">
                                    <List className="characters" style={{ padding: "0", listStyleType: "none" }}>
                                        {props.assignedTemplateList && props.assignedTemplateList.length > 0 &&
                                            props.assignedTemplateList.map((template: OutputFileTemplateDetailsModel, i: number) => (
                                                <ListItem
                                                    onDragStart={(e) => dragStart(e, i)}
                                                    onDragEnter={(e) => dragEnter(e, i)}
                                                    onDragEnd={drop}
                                                    draggable="true"
                                                    className="to-do-check"
                                                    style={{
                                                        background: "linear-gradient(to top, #F5F5F5, #FFFFFF)",
                                                        marginBottom: "10px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        borderRadius: "4px",
                                                        padding: "10px"
                                                    }}
                                                >
                                                    <label style={{ flexBasis: "30%" }}>
                                                        {intl.formatMessage({
                                                            id: "OutputTemplateDetails.label",
                                                            defaultMessage: template.description,
                                                        })}
                                                    </label>
                                                    <FormControl fullWidth style={{ marginRight: "10px", flexBasis: "23%" }}>
                                                        <Select
                                                            value={props.fieldPadsDtls[i] || ''} // Set the value of the input field
                                                            onChange={(event) => {
                                                                const newFieldPads = [...props.fieldPadsDtls];
                                                                newFieldPads[i] = event.target.value;
                                                                props.setFieldPadsDtls(newFieldPads);
                                                            }}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            IconComponent={() => (
                                                                <img src={down_arrow_icon} alt="" />
                                                            )}
                                                        >
                                                            <MenuItem value="">
                                                                <em>
                                                                    {intl.formatMessage({
                                                                        id: "FieldPad.selecteddropdown",
                                                                        defaultMessage: "Field Pad",
                                                                    })}
                                                                </em>
                                                            </MenuItem>
                                                            {
                                                                fieldPads &&
                                                                fieldPads.length > 0 &&
                                                                fieldPads.map((type) => {
                                                                    return (
                                                                        <MenuItem
                                                                            key={type.codeSuffix}
                                                                            value={type.codeSuffix}
                                                                        >
                                                                            {type.description}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl fullWidth style={{ marginRight: "10px", flexBasis: "23%" }}>
                                                        <InputBase
                                                            placeholder="Pad Char"
                                                            value={props.fieldPadsChar[i] || ''} // Set the value of the input field
                                                            onChange={(event) => {
                                                                const newFieldPadsChar = [...props.fieldPadsChar];
                                                                newFieldPadsChar[i] = event.target.value;
                                                                props.setFieldPadsChar(newFieldPadsChar);
                                                            }}
                                                            error
                                                            fullWidth
                                                            id={`fieldPadChar${template.outputTemplateDtlId}`}
                                                            autoComplete="off"
                                                            aria-describedby="error-helper-text"
                                                            inputProps={{ maxLength: 1 }}
                                                        />
                                                        {/* <FormHelperText id="error-helper-text" error>
                            {errorsDetails.fieldFormat?.message}
                        </FormHelperText> */}
                                                    </FormControl>
                                                    <FormControl fullWidth style={{ marginRight: "10px", flexBasis: "23%" }}>
                                                        <InputBase
                                                            placeholder="Length"
                                                            value={props.fieldLengths[i] || ''} // Set the value of the input field
                                                            onChange={(event) => {
                                                                const newFieldLengths = [...props.fieldLengths];
                                                                newFieldLengths[i] = parseInt(event.target.value);
                                                                props.setFieldLengths(newFieldLengths);
                                                            }}
                                                            error
                                                            fullWidth
                                                            id={`fieldLengths-${template.outputTemplateDtlId}`}
                                                            autoComplete="off"
                                                            aria-describedby="error-helper-text"
                                                            inputProps={{ maxLength: 4 }}
                                                        />
                                                        <FormHelperText id="error-helper-text" error>
                                                            {errorsDetails.fieldLength?.message}
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <FormControl fullWidth style={{ marginRight: "10px", flexBasis: "23%" }}>
                                                        <Tooltip title={template.description === "OUT ACCOUNTING ENTRY DESCRIPTION" ?
                                                            <ul>
                                                                <li>%trans_id%</li>
                                                                <li>%batch%</li>
                                                                <li>%termid%</li>
                                                                <li>%signflag%</li>
                                                                <li>%date%ddMMyyyy%</li>
                                                                <li>%scheme%</li>
                                                                <li>%issuer%</li>
                                                                <li>%amttype%</li>
                                                            </ul>
                                                            : template.description?.toLowerCase().includes("date") ?
                                                                <ul>
                                                                    <li>Ex: DD-MM-YYYY</li>
                                                                </ul>
                                                                : ""} arrow>
                                                            <InputBase
                                                                placeholder={"Format"}
                                                                value={props.fieldFormatValues[i] || ''}
                                                                onChange={(event) => {
                                                                    // const newFieldNumericValues = [...props.fieldNumericValues];
                                                                    // const newFieldOutputAcctingEntryDescs = [...props.fieldOutputAcctingEntryDescs];
                                                                    // if(template.description === "OUT ACCOUNTING ENTRY DESCRIPTION" ||
                                                                    //     template.description?.toLowerCase().includes("date")
                                                                    // ){
                                                                    //     newFieldOutputAcctingEntryDescs[i] = event.target.value;
                                                                    //     props.setFieldOutputAcctingEntryDescs(newFieldOutputAcctingEntryDescs);
                                                                    // } else {
                                                                    //     newFieldNumericValues[i] = parseInt(event.target.value);
                                                                    //     props.setFieldNumericValues(newFieldNumericValues);
                                                                    // }

                                                                    const newFieldFormatValues = [...props.fieldFormatValues];
                                                                    newFieldFormatValues[i] = event.target.value;
                                                                    props.setFieldFormatValues(newFieldFormatValues);

                                                                    setContextDesc(template.description);
                                                                }}
                                                                error
                                                                fullWidth
                                                                id={`fieldNumericValues-${template.outputTemplateDtlId}`}
                                                                autoComplete="off"
                                                                aria-describedby="error-helper-text"
                                                                inputProps={{ maxLength: 
                                                                    template.description === "OUT ACCOUNTING ENTRY DESCRIPTION" || template.description?.toLowerCase().includes("date") ||
                                                                    (template?.codePrefix === "CUSTOM_FIELD_ID" && template?.codeSuffix === "CUSTOM_FIELD") || template.description === "CUSTOM FIELD" ? 100 : 2 }}
                                                                onKeyPress={template.description?.toLowerCase().includes("date") ? allowAlphaNumeric : template.description !== "OUT ACCOUNTING ENTRY DESCRIPTION" && !(template?.codePrefix === "CUSTOM_FIELD_ID" && template?.codeSuffix === "CUSTOM_FIELD") && template.description !== "CUSTOM FIELD" ? allowOnlyNumbers : undefined}
                                                            />
                                                        </Tooltip>
                                                        <FormHelperText id="error-helper-text" error>
                                                            {errorsDetails.fieldFormat?.message}
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <FormControl style={{ marginRight: "10px", flexBasis: "15%" }}>
                                                        {
                                                            (template?.codePrefix === "CUSTOM_FIELD_ID" && template?.codeSuffix === "CUSTOM_FIELD") || template.description === "CUSTOM FIELD" ?
                                                                <Tooltip title="Add Syntax Details" arrow>
                                                                    <InputBase
                                                                        placeholder="Custom Syntax"
                                                                        value={props.fieldCustomSyntaxValues[i] || ''}
                                                                        // onChange={(event) => {
                                                                        //     const newFieldCustomSyntax = [...props.fieldCustomSyntaxValues];
                                                                        //     newFieldCustomSyntax[i] = event.target.value;
                                                                        //     props.setFieldCustomSyntaxValues(newFieldCustomSyntax);
                                                                        // }}
                                                                        onClick={() => { setCustomSyntaxIndex(i); handleClickOpen(); }}
                                                                        fullWidth
                                                                        id={`fieldCustomSyntax${template.outputTemplateDtlId}${i}`}
                                                                        autoComplete="off"
                                                                        aria-describedby="error-helper-text"
                                                                        inputProps={{ maxLength: 999 }}
                                                                    />
                                                                </Tooltip>
                                                                :
                                                                <></>
                                                        }
                                                    <FormHelperText id="error-helper-text" error></FormHelperText>
                                                    </FormControl>
                                                    <Button onClick={() => { popFromAssignedList(template.fieldId, i) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="11" fill="red" />
                                                            <text x="50%" y="50%" textAnchor="middle" fill="#FFF" fontSize="14px" fontWeight="bold" dy=".35em">
                                                                x
                                                            </text>
                                                        </svg>
                                                    </Button>
                                                </ListItem>
                                            ))}
                                    </List>
                                </div>
                            </Grid>
                        </Grid>
                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                            <DialogTitle>Enter Custom Syntax</DialogTitle>
                            <DialogContent>
                                <TextareaAutosize
                                    minRows={4}
                                    placeholder="Enter Custom Syntax here..."
                                    value={props.fieldCustomSyntaxValues[customSyntaxIndex] || ''}
                                    onChange={(event) => {
                                        const newValue = event.target.value;
                                        if (newValue.length <= 999) {
                                          const newFieldCustomSyntax = [...props.fieldCustomSyntaxValues];
                                          newFieldCustomSyntax[customSyntaxIndex] = newValue;
                                          props.setFieldCustomSyntaxValues(newFieldCustomSyntax);
                                        } else {
                                            event.preventDefault();
                                        }
                                      }}
                                    maxLength={999}
                                    style={{ width: '100%' }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </>
            )}
        </>
    );
}

export default OutputFileTemplateDetailsList;