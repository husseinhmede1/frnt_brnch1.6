import {
    Box,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableSortLabel,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {
    add_rounded,
    delete_ic,
    down_arrow_icon,
    edit_ic,
} from "../../assets/images";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { OutputTemplateHdrService } from "../../services/configuration/output-template-hdr-service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import { OutputFileTemplateHdrModel, OutputFileTemplateHdrModelSorted } from "../../models/configuration/OutputFileTemplateHdrModel";
import Swal from "sweetalert2";
import { Errors, StatusCode } from "../../utils/constant";
import { toast } from "react-toastify";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { visuallyHidden } from "@mui/utils";

function OutputFileTemplateHdr() {
    const intl = useIntl();
    const [institution, setInstitution] = useState<Institution[]>([]);
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [outputTemplates, setOutputTemplates] = useState<OutputFileTemplateHdrModel[]>([]);
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof OutputFileTemplateHdrModelSorted>('outputDescription');

    /* START (sort table data) */
    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    type Order = 'asc' | 'desc';

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key,
    ): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const createSortHandler = (
        property: keyof OutputFileTemplateHdrModelSorted
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */


    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
        getOutputTemplatesByInstitutionId(instID);
    };

    const editAccountingTemplateHDR = async (id: number, sumPerAccount: String, merchantSubSummary: String, outputFormat: String, outputFileType: String, institutionId: String, instSubSummary: String) => {
        await OutputTemplateHdrService.getOutputFileTemplateById(id)
            .then((res) => {
                navigate(`/output-details/${id}/${sumPerAccount}/${merchantSubSummary}/${outputFormat}/${outputFileType}/${institutionId}/${instSubSummary}/`);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getOutputTemplatesByInstitutionId = async (id: string | "") => {
        await OutputTemplateHdrService.getOutputFileTemplateByInstitution(id)
            .then((res) => {
                setOutputTemplates([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
        const selectedInstitutionId =
            event.target.value !== ""
                ? event.target.value
                : institution[0].institutionId;
        getOutputTemplatesByInstitutionId(selectedInstitutionId);
        console.log(outputTemplates);
    };

    const onDelete = (id: number) => {
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
                OutputTemplateHdrService.deleteOutputFileTemplate(id).then((res) => {
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
                        })
                    }
                    getOutputTemplatesByInstitutionId(selectInstitutionVal);
                }).catch(err => {
                    if (err && err?.response?.status === 400) {
                        if (err.response.data.errors[0] === 'CFG-0228') {
                            toast.error("The output template header is already in use, it cannot be deleted");
                        }
                    }
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
                });
            }
        });
    };

    useEffect(() => {
        InstitutionService.getActiveInstitution()
            .then((response: { data: any }) => {
                setInstitutions(response.data);
            })
            .catch((error: any) => {
                console.log(error);
            });
        setInstitutefromLocalStorage();
    }, []);
    return (
        <div className="wrapper">
            <main className="main-content">
                <div className="main-card">
                    <div className="title-block">
                        <div className="left-block">
                            <Typography variant={"h2"}>
                                {intl.formatMessage({
                                    id: "OutputFileTemplates.title",
                                    defaultMessage: "Output File Templates",
                                })}
                            </Typography>
                            <p className="pb-0">
                                {intl.formatMessage({
                                    id: "OutputFileTemplateDetails.subTitle",
                                    defaultMessage: "List of defined Templates",
                                })}
                            </p>
                        </div>

                        <div className="right-block">
                            <Button
                                sx={{ mt: 4 }}
                                variant="contained"
                                disableElevation
                                className="btn-light"
                                endIcon={<img src={add_rounded} alt="add" />}
                                onClick={() => navigate(`/output-details/${selectInstitutionVal}`)}
                            >
                                <FormattedMessage
                                    id="OutputFileTemplates.addBtn"
                                    defaultMessage="Add Template"
                                />
                            </Button>
                        </div>
                    </div>
                    <div className="input-elements">
                        <Grid spacing={3} container className="compact-grid">
                            <Grid item xs={12} lg={4} sm={6} xl={4}>
                                <div className="input-with-label form-group">
                                    <label>
                                        {intl.formatMessage({
                                            id: "Institution.label",
                                            defaultMessage: "Institution",
                                        })}
                                    </label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={selectInstitutionVal}
                                            onChange={handleInstitutionChange}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                            IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                        >

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
                        </Grid>
                    </div>

                    <TableContainer className="has-vertical-scroll">
                        <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="simple table" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'outputDescription'}
                                            direction={orderBy === 'outputDescription' ? order : 'asc'}
                                            onClick={() => createSortHandler("outputDescription")}
                                        >
                                            {
                                                intl.formatMessage({
                                                    id: "OutputFileTemplates.outputDescription",
                                                    defaultMessage: "Description"
                                                })
                                            }
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'outputFileType'}
                                            direction={orderBy === 'outputFileType' ? order : 'asc'}
                                            onClick={() => createSortHandler("outputFileType")}
                                        >
                                            {
                                                intl.formatMessage({
                                                    id: "OutputFileTemplates.outputFileType",
                                                    defaultMessage: "Type"
                                                })
                                            }
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "OutputFileTemplates.sumPerAccount",
                                            defaultMessage: "Sum Per Account",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "OutputFileTemplates.merchantSubSummary",
                                            defaultMessage: "Merchant Sub Summary",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "OutputFileTemplates.instSubSummary",
                                            defaultMessage: "Institution Sub Summary",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "OutputFileTemplates.outputFormat",
                                            defaultMessage: "Format",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "OutputFileTemplates.separator",
                                            defaultMessage: "Separator",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "OutputFileTemplates.abbreviation",
                                            defaultMessage: "Abbreviation",
                                        })}
                                    </TableCell>
                                    <TableCell align="center" width="190px" className="sticky-table head last-column-border-header">
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.actions",
                                            defaultMessage: "Actions",
                                        })}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {outputTemplates.sort(getComparator(order, orderBy)).map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.outputDescription}</TableCell>
                                        <TableCell>{row.outputFileType}</TableCell>
                                        <TableCell>{row.sumPerAccount}</TableCell>
                                        <TableCell>{row.merchantSubSummary}</TableCell>
                                        <TableCell>{row.instSubSummary}</TableCell>
                                        <TableCell>{row.outputFormat}</TableCell>
                                        <TableCell align="center">{row.separator}</TableCell>
                                        <TableCell align="center">{row.outputFileTypeAbbr}</TableCell>
                                        <TableCell align="center" width="190px" className="sticky-table column last-column-border">
                                            <div className="action btns-block">
                                                <IconButton
                                                    className="border-icon-btn no-border sm"
                                                    onClick={() => editAccountingTemplateHDR(row.outputTemplateHdrId, row.sumPerAccount, row.merchantSubSummary, row.outputFormat, row.outputFileType, row.institutionId, row.instSubSummary)}
                                                >
                                                    <img src={edit_ic} alt="mail" />
                                                </IconButton>
                                                <IconButton
                                                    className="border-icon-btn no-border sm"
                                                    onClick={() => onDelete(row.outputTemplateHdrId)}
                                                >
                                                    <img src={delete_ic} alt="mail" />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {outputTemplates &&
                                    outputTemplates.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={13} className="last-column-border">
                                                <p style={{ textAlign: "center" }}>
                                                    {intl.formatMessage({
                                                        id: "AccountingTemplateHdr.noDataFound",
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
            </main>
        </div>
    );
}

export default OutputFileTemplateHdr;