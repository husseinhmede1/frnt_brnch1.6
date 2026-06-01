import {
    Box,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
    FormHelperText,
    InputBase
} from "@mui/material";
import {
    add_rounded,
    check_rounded,
    delete_ic,
    down_arrow_icon,
    edit_ic,
    ic_check,
    ic_checked,
    ios_arrow_backward,
    ios_arrow_forward,
    uncheck_rounded,
} from "../../assets/images";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { AccountingTemplateHDRService } from "../../services/configuration/accounting-template-hdr-service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import { AccountingTemplateHDRModel } from "../../models/configuration/AccountingTemplateHDRModel";
import Swal from "sweetalert2";
import { Errors, StatusCode } from "../../utils/constant";
import { toast } from "react-toastify";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { EntityListModel } from "../../models/entityManagement/EntityModel";
import { EntityService } from "../../services/entityManagement/entity-service";
import { visuallyHidden } from "@mui/utils";
import { MccModel } from "../../models/configuration/MccModel";
import { MccService } from "../../services/configuration/mcc-services";

const UNASSIGNED_LIST = "UNASSIGNED_LIST";
const ASSIGNED_LIST = "ASSIGNED_LIST";
const SHIFT_TO_ASSIGNED = "SHIFT_TO_ASSIGNED";
const SHIFT_TO_UNASSIGNED = "SHIFT_TO_UNASSIGNED";

function AccountingTemplatesHDR() {
    const intl = useIntl();
    const [institution, setInstitution] = useState<Institution[]>([]);
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [accountingTemplates, setAccountingTemplates] = useState<AccountingTemplateHDRModel[]>([]);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [fieldKey, setFieldKey] = useState<number>(0);
    const [unAssignedEntityList, setUnAssignedEntityList] = useState<EntityListModel[]>([]);
    const [assignedEntityList, setAssignedEntityList] = useState<EntityListModel[]>([]);
    const [unAssignedCheckedEntityList, setUnAssignedCheckedEntityList] = useState<EntityListModel[]>([]);
    const [assignedCheckedEntityList, setAssignedCheckedEntityList] = useState<EntityListModel[]>([]);
    const [selectedAcctTemplateHdrId, setSelectedAcctTemplateHdrId] = useState<number>();
    const [mccList, setMccList] = useState<MccModel[]>([]);
    const [selectMcc, setSelectMcc] = useState("");
    const [entityId, setEntityId] = useState("");
    const [entityName, setEntityName] = useState("");
    const [parentId, setParentId] = useState("");

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof AccountingTemplateHDRModel>('accountTemplate');

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
        property: keyof AccountingTemplateHDRModel
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */

    const handleClose = () => {
        setOpen(false);
        setEntityId("");
        setEntityName("");
        setParentId("");
        setSelectMcc("");
    };

    const handleClear = () => {
        setEntityId("");
        setEntityName("");
        setParentId("");
        setSelectMcc("");
    };

    const handleClickOpen = (id: number) => {
        getActiveEntities(selectInstitutionVal, id);
        setAssignedCheckedEntityList([]);
        setUnAssignedCheckedEntityList([]);
        setSelectedAcctTemplateHdrId(id);
        getAllActiveMccs();
        setOpen(true);
    };

    const getActiveEntities = async (instID: string, acctTemplateHdrId: number) => {
        await EntityService.getByInstitutionId(instID)
            .then((res) => {
                setUnAssignedEntityList(res?.data);
                getAllMappedEntities(acctTemplateHdrId, res?.data)
            })
            .catch((err) =>           toast.error(err.response.data.errors[0])
            );
    };

    const getAllMappedEntities = async (id: number, unAssignedEntities: EntityListModel[]) => {
        let assignedEntities: EntityListModel[] = [];
        await AccountingTemplateHDRService.getAllMappedEntities(id).then(res => {
            setAssignedEntityList(res.data);
            assignedEntities.push(...res.data)
            }).catch((error: any) => {
            toast.error(error.response.data.errors[0])
        });
        setMappedEntitiesList(assignedEntities, unAssignedEntities)
    }

    const setMappedEntitiesList = (assignedEntities: EntityListModel[], unAssignedEntities: EntityListModel[]) => {
        assignedEntities && assignedEntities.length > 0 && assignedEntities.map((entity) => {
            unAssignedEntities = unAssignedEntities.filter((item) => item.entityId !== entity.entityId);
        })
        setUnAssignedEntityList(unAssignedEntities)
    }

    const handleToggleStatus = (e: any, entity: EntityListModel, type: string) => {
        if (type === UNASSIGNED_LIST) {
            if (e.target.checked) {
                const isAvaliable = unAssignedCheckedEntityList && unAssignedCheckedEntityList.filter(item => item.entityId === entity.entityId);
                if (isAvaliable && isAvaliable.length === 0) {
                    unAssignedCheckedEntityList.push(entity);
                }
                setUnAssignedCheckedEntityList(unAssignedCheckedEntityList);
            }
            else {
                let unAssignedCheckedEntities = unAssignedCheckedEntityList;
                unAssignedCheckedEntities = unAssignedCheckedEntities.filter((item) => item.entityId !== entity.entityId);
                setUnAssignedCheckedEntityList(unAssignedCheckedEntities);
            }
        }
        else {
            if (e.target.checked) {
                const isAvaliable = assignedCheckedEntityList && assignedCheckedEntityList.filter(item => item.entityId === entity.entityId);
                if (isAvaliable && isAvaliable.length === 0) {
                    assignedCheckedEntityList.push(entity);
                }
                setAssignedCheckedEntityList(assignedCheckedEntityList);
            }
            else {
                let assignedCheckedEntities = assignedCheckedEntityList;
                assignedCheckedEntities = assignedCheckedEntities.filter((item) => item.entityId !== entity.entityId);
                setAssignedCheckedEntityList(assignedCheckedEntities);
            }
        }
        setFieldKey(Math.random())
    }

    const mapPackageWithEntity = () => {
        const assignedEntityIds = assignedEntityList && assignedEntityList.length > 0 && assignedEntityList.map(item => item.entityId);
        const model = {
            entities: assignedEntityIds ? assignedEntityIds : [],
            id: selectedAcctTemplateHdrId
        }
        AccountingTemplateHDRService.mapAccountingTemplateWithEntity(model).then(res => {
            if (res.status === StatusCode.Success) {
                toast.success("Entities assignment/unassignment is successfull");
                handleClose()
            }
        }).catch(err =>           toast.error(err.response.data.errors[0])
)
    }

    const handleSelectAll = (e: any, type: string) => {
        if (e.target.checked) {
            if (type === UNASSIGNED_LIST) {
                setUnAssignedCheckedEntityList(unAssignedEntityList)
            }
            else {
                setAssignedCheckedEntityList(assignedEntityList)
            }
        }
        else {
            type === UNASSIGNED_LIST ? setUnAssignedCheckedEntityList([]) : setAssignedCheckedEntityList([])
        }
    }

    const handleShifting = (type: string) => {
        if (type === SHIFT_TO_ASSIGNED) {
            let unAssignedEntities = unAssignedEntityList;
            assignedEntityList.push(...unAssignedCheckedEntityList)
            unAssignedCheckedEntityList && unAssignedCheckedEntityList.length > 0 && unAssignedCheckedEntityList.map((entity) => {
                unAssignedEntities = unAssignedEntities.filter((item) => item.entityId !== entity.entityId);
            })
            setUnAssignedEntityList(unAssignedEntities);
            setAssignedEntityList(assignedEntityList);
            setUnAssignedCheckedEntityList([]);
        }
        else {
            unAssignedEntityList.push(...assignedCheckedEntityList)
            let assignedEntities = assignedEntityList;
            assignedCheckedEntityList && assignedCheckedEntityList.length > 0 && assignedCheckedEntityList.map((entity) => {
                assignedEntities = assignedEntities.filter((item) => item.entityId !== entity.entityId);
            })
            setAssignedCheckedEntityList([]);
            setAssignedEntityList(assignedEntities);
            setUnAssignedEntityList(unAssignedEntityList);
        }
    };

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
        getAccountingTemplatesByInstitutionId(instID);
    };

    const editAccountingTemplateHDR = async (id: number) => {
        navigate(`/accounting-details/${id}`);
    };

    const getAccountingTemplatesByInstitutionId = async (id: string | "") => {
        await AccountingTemplateHDRService.getAllAccountingTemplateHDRsByInstitution(id)
            .then((res) => {
                setAccountingTemplates([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getAllActiveMccs = async () => {
        await MccService.getAllMcc()
            .then((res) => {
                setMccList([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getEntitiesBySearchCriteria = async () => {
        const model = {
            entityId: entityId,
            entityName: entityName,
            institutionId: selectInstitutionVal,
            mcc: selectMcc,
            parentId: parentId
        };
        await EntityService.getEntitiesBySearchCriteria(model)
            .then((res) => {
                const filteredEntities = res.data.filter(
                    (entity) => !assignedEntityList.some(
                        (assignedEntity) => assignedEntity.entityId === entity.entityId
                    )
                );
                setUnAssignedEntityList([...filteredEntities]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };    

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
        const selectedInstitutionId =
            event.target.value !== ""
                ? event.target.value
                : institution[0].institutionId;
        getAccountingTemplatesByInstitutionId(selectedInstitutionId);
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
                AccountingTemplateHDRService.deleteAccountingTemplateHDR(id).then((res) => {
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
                    getAccountingTemplatesByInstitutionId(selectInstitutionVal);
                }).catch(err => {
                    // if (err && err.response && err.response.data === Errors.ReferenceExists) {
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
                    //}
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
  toast.error(error.response.data.errors[0])            });
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
                                    id: "AccountingTemplate.title",
                                    defaultMessage: "Accounting Templates",
                                })}
                            </Typography>
                            <p className="pb-0">
                                {intl.formatMessage({
                                    id: "AccountingTemplate.subTitle",
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
                                onClick={() => navigate(`/accounting-details/add/${selectInstitutionVal}`)}
                            >
                                <FormattedMessage
                                    id="AccountingTemplate.addBtn"
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
                                            active={orderBy === 'accountTemplate'}
                                            direction={orderBy === 'accountTemplate' ? order : 'asc'}
                                            onClick={() => createSortHandler("accountTemplate")}
                                        >
                                            {
                                                intl.formatMessage({
                                                    id: "AccountingTemplate.accountTemplate",
                                                    defaultMessage: "Code"
                                                })
                                            }
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'templateDescription'}
                                            direction={orderBy === 'templateDescription' ? order : 'asc'}
                                            onClick={() => createSortHandler("templateDescription")}
                                        >
                                            {
                                                intl.formatMessage({
                                                    id: "AccountingTemplate.templateDescription",
                                                    defaultMessage: "Description"
                                                })
                                            }
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        </TableSortLabel>
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
                                {accountingTemplates.sort(getComparator(order, orderBy)).map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.accountTemplate}</TableCell>
                                        <TableCell>{row.templateDescription}</TableCell>
                                        <TableCell align="center" width="190px" className="sticky-table column last-column-border">
                                            <div className="action btns-block">
                                                { <Button
                                                    variant="contained"
                                                    disableElevation
                                                    className="btn-light sm rounded"
                                                    onClick={() => handleClickOpen(row.acctTemplateHdrId)}
                                                >
                                                    {intl.formatMessage({
                                                        id: "ActivityFeesPackage.assignUnAssign",
                                                        defaultMessage: "Assign/UnAssign",
                                                    })}

                                                </Button> }
                                                <IconButton
                                                    className="border-icon-btn no-border sm"
                                                    onClick={() => editAccountingTemplateHDR(row.acctTemplateHdrId)}
                                                >
                                                    <img src={edit_ic} alt="mail" />
                                                </IconButton>
                                                <IconButton
                                                    className="border-icon-btn no-border sm"
                                                    onClick={() => onDelete(row.acctTemplateHdrId)}
                                                >
                                                    <img src={delete_ic} alt="mail" />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {accountingTemplates &&
                                    accountingTemplates.length === 0 && (
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
            <Dialog open={open} onClose={handleClose} className="c-dialog md">
                <DialogTitle component={"div"}>
                    <div className="title-block mb-0">
                        <div className="left-block mb-0">
                            <Typography variant={"h2"}>
                                {intl.formatMessage({
                                    id: "ActivityFeesPackage.assignUnAssign.tittle",
                                    defaultMessage: "Assigning Accounting Template to Entities",
                                })}</Typography>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="inner-card to-do-block">
                    <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <div className="input-with-label">
                                    <label>
                                        {intl.formatMessage({
                                            id: "AccountingTemplateHDR.entityId",
                                            defaultMessage: "Entity Id",
                                        })}
                                    </label>
                            <FormControl fullWidth style={{marginRight: "15px"}}>
                                        <InputBase
                                            placeholder={intl.formatMessage({
                                                id: "AccountingTemplateHDR.enterEntityIdPlaceholder",
                                                defaultMessage: "Write entity id",
                                            })}
                                            error
                                            fullWidth
                                            id="entityId"
                                            value={entityId}
                                            onChange={(event) => setEntityId(event.target.value)}
                                            autoComplete="off"
                                            aria-describedby="error-helper-text"
                                            inputProps={{ maxLength: 30 }}
                                            style={{
                                                height: "40px",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <div className="input-with-label">
                                    <label>
                                        {intl.formatMessage({
                                            id: "AccountingTemplateHDR.entityName",
                                            defaultMessage: "Entity Name",
                                        })}
                                    </label>
                                    <FormControl fullWidth>
                                        <InputBase
                                            placeholder={intl.formatMessage({
                                                id: "AccountingTemplateHDR.enterEntityNamePlaceholder",
                                                defaultMessage: "Write entity name",
                                            })}
                                            error
                                            fullWidth
                                            id="entityName"
                                            value={entityName}
                                            onChange={(event) => setEntityName(event.target.value)}
                                            autoComplete="off"
                                            aria-describedby="error-helper-text"
                                            inputProps={{ maxLength: 50 }}
                                            style={{
                                                height: "40px",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <div className="input-with-label">
                                    <label>
                                        {intl.formatMessage({
                                            id: "AccountingTemplateHDR.parentId",
                                            defaultMessage: "Parent Id",
                                        })}
                                    </label>
                                    <FormControl fullWidth style={{marginRight: "15px"}}>
                                        <InputBase
                                            placeholder={intl.formatMessage({
                                                id: "AccountingTemplateHDR.enterParentIdPlaceholder",
                                                defaultMessage: "Write parent id",
                                            })}
                                            error
                                            fullWidth
                                            id="parentId"
                                            value={parentId}
                                            onChange={(event) => setParentId(event.target.value)}
                                            autoComplete="off"
                                            aria-describedby="error-helper-text"
                                            inputProps={{ maxLength: 30 }}
                                            style={{
                                                height: "40px",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <div className="input-with-label">
                                    <label>
                                        {intl.formatMessage({
                                            id: "AccountingTemplateHDR.label",
                                            defaultMessage: "MCC",
                                        })}
                                    </label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={selectMcc}
                                            onChange={(event) => setSelectMcc(event.target.value)}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                            IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                            style={{
                                                height: "40px",
                                                boxSizing: "border-box",
                                            }}
                                        >
                                            <MenuItem value="">
                                                {intl.formatMessage({
                                                    id: "AccountingTemplateHDR.selectMCC",
                                                    defaultMessage: "Select MCC",
                                                })}
                                            </MenuItem>
                                            {mccList &&
                                                mccList.length > 0 &&
                                                mccList.map((type) => (
                                                    <MenuItem key={type.mccId} value={type.mcc}>
                                                        {type.mcc} - {type.description}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}></Grid>
                        </Grid>
                        <Grid container spacing={2}></Grid>
                        <div style={{ marginBottom: '20px', marginTop: '20px'}} className="btns-block right">
                            <Button
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={handleClear}
                            >
                                <FormattedMessage
                                    id="CardScheme.clear"
                                    defaultMessage="Clear"
                                />
                            </Button>
                            <Button type="button" onClick={getEntitiesBySearchCriteria} disableElevation variant="contained">
                                <FormattedMessage
                                    id="CardScheme.search"
                                    defaultMessage="Search"
                                />
                            </Button>
                        </div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={5}>
                                <div className="title">
                                    {intl.formatMessage({
                                        id: "ActivityFeesPackage.assignUnAssign.allEntities",
                                        defaultMessage: "All Entities",
                                    })}
                                    <FormGroup row className="checbox-grp">
                                        <FormControlLabel
                                            key={fieldKey}
                                            control={
                                                <Checkbox
                                                    icon={<img src={ic_check} alt="" />}
                                                    checkedIcon={<img src={ic_checked} alt="" />}
                                                    checked={(unAssignedCheckedEntityList && unAssignedCheckedEntityList.length) === (unAssignedEntityList && unAssignedEntityList.length) && unAssignedEntityList.length > 0}
                                                />}
                                            label={intl.formatMessage({
                                                id: "ActivityFeesPackage.assignUnAssign.selectAll",
                                                defaultMessage: "Select All",
                                            })} labelPlacement="start" onClick={(e) => handleSelectAll(e, UNASSIGNED_LIST)} />
                                    </FormGroup>
                                </div>
                                <div className="to-do-card">
                                    <ul>
                                        {
                                            unAssignedEntityList && unAssignedEntityList.length > 0 &&
                                            unAssignedEntityList.map((entity, i) => (
                                                <li className="to-do-check" onChange={(e) => handleToggleStatus(e, entity, UNASSIGNED_LIST)}>
                                                    <FormControlLabel
                                                        key={fieldKey}
                                                        control={
                                                            <Checkbox
                                                                icon={<img src={uncheck_rounded} alt="" />}
                                                                checkedIcon={<img src={check_rounded} alt="" />}
                                                            />}
                                                        checked={unAssignedCheckedEntityList && unAssignedCheckedEntityList.filter(item => item.entityId === entity.entityId).length > 0}
                                                        label={entity.entityName} labelPlacement="start" />
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
                                        id: "ActivityFeesPackage.assignUnAssign.assignedEntities",
                                        defaultMessage: "Assigned Entities",
                                    })}
                                    <FormGroup row className="checbox-grp">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    key={fieldKey}
                                                    icon={<img src={ic_check} alt="" />}
                                                    checkedIcon={<img src={ic_checked} alt="" />}
                                                    checked={(assignedCheckedEntityList && assignedCheckedEntityList.length) === (assignedEntityList && assignedEntityList.length) && assignedEntityList.length > 0}
                                                />}
                                            label={intl.formatMessage({
                                                id: "ActivityFeesPackage.assignUnAssign.selectAll",
                                                defaultMessage: "Select All",
                                            })} labelPlacement="start" onClick={(e) => handleSelectAll(e, ASSIGNED_LIST)} />
                                    </FormGroup>
                                </div>
                                <div className="to-do-card right">
                                    <ul>
                                        {
                                            assignedEntityList && assignedEntityList.length > 0 &&
                                            assignedEntityList.map((entity, i) => (
                                                <li className="to-do-check">
                                                    <FormControlLabel
                                                        key={fieldKey}
                                                        control={
                                                            <Checkbox
                                                                icon={<img src={uncheck_rounded} alt="" />}
                                                                checkedIcon={<img src={check_rounded} alt="" />}
                                                            />}
                                                        checked={assignedCheckedEntityList && assignedCheckedEntityList.filter(item => item.entityId === entity.entityId).length > 0}
                                                        label={entity.entityName} labelPlacement="start" onClick={(e) => handleToggleStatus(e, entity, ASSIGNED_LIST)} />
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
                    <Button disableElevation variant="contained" onClick={mapPackageWithEntity}>
                        {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.save",
                            defaultMessage: "Save",
                        })}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AccountingTemplatesHDR;