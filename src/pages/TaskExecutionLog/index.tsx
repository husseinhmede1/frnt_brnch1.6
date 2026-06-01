import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    FormControl,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Grid,
    IconButton,
    TableSortLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    Checkbox,
    InputBase,
} from "@mui/material";
import Button from "@mui/material/Button";
import { DatePicker, LocalizationProvider, DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
    date_ic,
    down_arrow_icon,
    clockIcon,
    ic_hand,
    ic_info_orange,
    ic_reload,
    ic_check,
    ic_checked,
} from "../../assets/images";
import { TaskModel } from "../../models/configuration/TaskModel";
import { TaskExecutionModel } from "../../models/configuration/TaskExecutionModel";
import { TaskExecutionLogModel } from "../../models/configuration/TaskExecutionLogModel";
import { TaskExecutionLogService } from "../../services/configuration/task-execution-log-service";
import { TaskService } from "../../services/configuration/task-service";
import {
    rowsPerPageOptionsConst,
} from "../../utils/constant";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";
import { visuallyHidden } from "@mui/utils";
import { parse, format } from 'date-fns';
import { Institution } from "../../models/configuration/InstitutionModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { PaginationRequestModel } from "../../models/configuration/PaginationRequestModel";
import { TaskExecutionService } from "../../services/configuration/task-execution-service";
import AccessTimeIcon from '@mui/icons-material/AccessTime';


function TaskExecutionLog() {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        getValues,
        formState: { errors },
    } = useForm<TaskExecutionLogModel>({
        mode: "onChange",
        resolver: yupResolver(validations.filterTaskExecutionLogValidation),
    });
    const [taskExecutionLogs, setTaskExecutionLogs] = useState<TaskExecutionLogModel[]>([]);
    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [selectTaskVal, setSelectTaskVal] = useState("");
    const [startDatetimeVal, setStartDatetimeVal] = useState("");
    const [endDatetimeVal, setEndDatetimeVal] = useState("");
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [open, setOpen] = useState(false);
    const [selectTaskExecutionLogId, setSelectTaskExecutionLogId] = React.useState(0);
    const [starttime, setStartTime] = React.useState<string | null>(null);
    const [endtime, setEndTime] = React.useState<string | null>(null);

    const [page, setPage] = React.useState(0);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(
        rowsPerPageOptionsConst[0]
    );

    const [pageProcessingEvents, setPageProcessingEvents] = React.useState(0);
    const [totalRecordsProcessingEvents, setTotalRecordsProcessingEvents] = React.useState(0);
    const [rowsPerPageProcessingEvents, setRowsPerPageProcessingEvents] = React.useState(
        rowsPerPageOptionsConst[0]
    );

    const intl = useIntl();

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof TaskExecutionLogModel>('taskExecutionLogId');

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [sortField, setSortField] = useState("processingEventsId");
    const [processingEvents, setProcessingEvents] = useState<
        TaskExecutionModel[]
    >([]);
    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [currentRemark, setCurrentRemark] = useState("");

    function timepickerIcon() {
        return <AccessTimeIcon sx={{ color: "#F08557" }} />;
    }

    const requestSort = () => {
        const field = "executionTime";
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);

        const sortedEvents = [...processingEvents].sort((a, b) => {
            let aField: string | Date | number = a[field] ? a[field] : "";
            let bField: string | Date | number = b[field] ? b[field] : "";

            // If the field is a date, convert it to a Date object for accurate comparison
            if (field === "executionTime") {
                aField = new Date(a[field]);
                bField = new Date(b[field]);
            }

            if (aField < bField) return order === "asc" ? -1 : 1;
            if (aField > bField) return order === "asc" ? 1 : -1;
            return 0;
        });

        setProcessingEvents(sortedEvents);
    };

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
        a: { [key in Key]: number | string | Date },
        b: { [key in Key]: number | string | Date },
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const createSortHandler = (
        property: keyof TaskExecutionLogModel
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClear = () => {
        setStartTime("");
        setEndTime("");
    };

    const handleCloseRemark = () => {
        setRemarkModalOpen(false);
    };

    const pagination: PaginationRequestModel = {
        asc: "true",
        offset: page,
        pageSize: rowsPerPage,
        sortBy: "processingEventsId",
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPageProcessingEvents(newPage);
        pagination.offset = newPage;
        getAllProcessingEventsByInstitutionId(selectInstitutionVal, pagination, selectTaskExecutionLogId);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPageProcessingEvents(newRowsPerPage);
        pagination.pageSize = newRowsPerPage;
        getAllProcessingEventsByInstitutionId(selectInstitutionVal, pagination, selectTaskExecutionLogId);
    };


    const getAllProcessingEventsByInstitutionId = async (
        id: string | "",
        model: PaginationRequestModel,
        taskExecutionLogId: number
    ) => {
        await TaskExecutionService.getAllProcessingEventsByInstitution(id, model, taskExecutionLogId)
            .then((res: any) => {
                setProcessingEvents([...res.data.processingEventsResponseDto]);
                setTotalRecordsProcessingEvents(res.data.paginatedResponseDto.totalNumberOfRecords);
            })
            .catch((err: any) => toast.error(err.message));
    };

    const getTaskExecutionLogs = async (endDatetime: string, startDatetime: string, taskId: string, offset: number, pageSize: number) => {
        const model = {
            endDatetime: endtime ? `${moment(endDatetime, 'DD/MM/YYYY').format('YYYY-MM-DD')}T${endtime}:00.000` : moment(endDatetime, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            institutionId: selectInstitutionVal,
            paginationRequestDto: {
                asc: "true",
                offset: offset,
                pageSize: pageSize,
                sortBy: "taskExecutionLogId"
            },
            startDatetime: starttime ? `${moment(startDatetime, 'DD/MM/YYYY').format('YYYY-MM-DD')}T${starttime}:00.000` : moment(startDatetime, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            taskId: taskId ? taskId : 0
        };

        await TaskExecutionLogService.getTaskExecutionLogs(model)
            .then((res: any) => {
                setTaskExecutionLogs([...res.data.taskExecutionLogResponseDto]);
                setTotalRecords(res.data.paginatedResponseDto.totalNumberOfRecords);
            })
            .catch((err) => toast.error(err.message));
    };


    const getAllTasksByInstitutionId = async (instId: string | "") => {
        await TaskService.getAllTasksByInst(instId)
            .then((response: { data: any }) => {
                setTasks(response.data);
            })
            .catch((error: any) => {
                console.log(error);
            });
    };

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(
            LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
        ) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
        getAllTasksByInstitutionId(instID);
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectTaskVal("");
        setSelectInstitutionVal(event.target.value);
        getAllTasksByInstitutionId(event.target.value);
    };

    const onSubmit = async (value: TaskExecutionLogModel) => {
        getTaskExecutionLogs(endDatetimeVal, startDatetimeVal, selectTaskVal, page, rowsPerPage);
    };

    const formatDateToString = (date: Date | null): string => {
        return date instanceof Date ? date.toLocaleDateString('en-GB') : '';
    };

    const showLogInfo = async (id: number) => {
        handleClickOpen();
        getAllProcessingEventsByInstitutionId(selectInstitutionVal, pagination, id);
    };

    useEffect(() => {
        setStartDatetimeVal(
            formatDateToString(new Date())
        );
        setEndDatetimeVal(
            formatDateToString(new Date())
        );

        InstitutionService.getAllInstitution()
            .then((response: { data: any }) => {
                setInstitutions(response.data);
            })
            .catch((error: any) => {
                console.log(error);
            });

        setInstitutefromLocalStorage();
    }, []);

    return (
        <>
            <div className="wrapper">
                <main className="main-content">
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block">
                                <Typography variant={"h2"} className="pb-0">
                                    {intl.formatMessage({
                                        id: "TaskExecutionLog.title",
                                        defaultMessage: "Task Execution Log",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {
                                        intl.formatMessage({
                                            id: "TaskExecutionLog.subTitle",
                                            defaultMessage: "Task Execution Log Listing"
                                        })
                                    }
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-elements">
                                <Grid spacing={3} container className="compact-grid">
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <div className="input-with-label">
                                            <label className="lg">
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
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "TaskExecutionLog.label.taskName",
                                                    defaultMessage: "Task",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={selectTaskVal}
                                                    onChange={(event) => setSelectTaskVal(event.target.value)}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                >
                                                    <MenuItem value="">
                                                        {intl.formatMessage({
                                                            id: "TaskExecutionLog.selectTask",
                                                            defaultMessage: "Select Task",
                                                        })}
                                                    </MenuItem>
                                                    {tasks &&
                                                        tasks.length > 0 &&
                                                        tasks.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.taskId}
                                                                    value={type.taskId}
                                                                >
                                                                    {type.taskName}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.taskId?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <div className="input-with-label date-select-input">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "TaskExecutionLog.label.startDatetime",
                                                    defaultMessage: "From Date",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Controller
                                                        control={control}
                                                        name="startDatetime"
                                                        defaultValue={new Date()}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                inputFormat="dd/MM/yyyy"
                                                                onChange={(date, keyboardInput) => {
                                                                    if (keyboardInput) {
                                                                        field.onChange(
                                                                            keyboardInput.length === 10 ? date : ''
                                                                        );
                                                                    } else {
                                                                        field.onChange(date);
                                                                    }
                                                                    setStartDatetimeVal(
                                                                        date ? formatDateToString(date) : '' // Handle null values
                                                                    );
                                                                }}
                                                                value={field.value ?? null}
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
                                                    {errors.startDatetime?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <div className="input-with-label date-select-input">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "TaskExecutionLog.label.endDatetime",
                                                    defaultMessage: "To Date",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Controller
                                                        control={control}
                                                        name="endDatetime"
                                                        defaultValue={new Date()}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                inputFormat="dd/MM/yyyy"
                                                                onChange={(date, keyboardInput) => {
                                                                    if (keyboardInput) {
                                                                        field.onChange(
                                                                            keyboardInput.length === 10 ? date : ''
                                                                        );
                                                                    } else {
                                                                        field.onChange(date);
                                                                    }
                                                                    setEndDatetimeVal(
                                                                        date ? formatDateToString(date) : '' // Handle null values
                                                                    );
                                                                }}
                                                                value={field.value ?? null}
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
                                                    {errors.endDatetime?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} lg={6} sm={4} xl={3}>
                                        <div className="input-with-label date-select-input">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "TaskExecutionLog.label.fromTime",
                                                    defaultMessage: "From Time",
                                                })}
                                            </label>
                                            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                <InputBase
                                                    value={starttime}
                                                    type="time"
                                                    error
                                                    fullWidth
                                                    onChange={(event: any) => {
                                                        setStartTime(event.target.value);
                                                    }}
                                                />

                                                {(starttime === null || starttime === "") && endtime ? (
                                                    <FormHelperText id="error-helper-text" error>
                                                        Please select From Time.
                                                    </FormHelperText>
                                                ) : null}
                                            </div>

                                        </div>
                                    </Grid>
                                    <Grid item xs={12} lg={6} sm={4} xl={3}>
                                        <div className="input-with-label date-select-input">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "TaskExecutionLog.label.toTime",
                                                    defaultMessage: "To Time",
                                                })}
                                            </label>
                                            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                <InputBase
                                                    type="time"
                                                    error
                                                    fullWidth
                                                    value={endtime}
                                                    onChange={(event: any) => {
                                                        setEndTime(event.target.value)
                                                    }}
                                                    id="expiretime"
                                                />
                                                {(endtime === null || endtime === "") && starttime ? (
                                                    <FormHelperText id="error-helper-text" error>
                                                        Please select To Time.
                                                    </FormHelperText>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="btns-block right has-border form-group">
                                <Button
                                    disableElevation
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleClear}>
                                    {intl.formatMessage({
                                        id: "Entity.button.clear",
                                        defaultMessage: "Clear Time",
                                    })}
                                </Button>
                                <Button
                                    disabled={
                                        ((endtime === null || endtime === "") && starttime) ||
                                            ((starttime === null || starttime === "") && endtime) ? true : false
                                    }
                                    disableElevation
                                    variant="contained"
                                    type="submit">
                                    {intl.formatMessage({
                                        id: "Entity.button.search",
                                        defaultMessage: "Search",
                                    })}
                                </Button>
                            </div>
                        </form>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "TaskExecutionLog.label.taskDetails",
                                                defaultMessage: "Task Name",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'startDatetime'}
                                                direction={orderBy === 'startDatetime' ? order : 'asc'}
                                                onClick={() => createSortHandler("startDatetime")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "TaskExecutionLog.label.startDatetime",
                                                        defaultMessage: "Start Datetime",
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'endDatetime'}
                                                direction={orderBy === 'endDatetime' ? order : 'asc'}
                                                onClick={() => createSortHandler("endDatetime")}
                                            >
                                                {intl.formatMessage({
                                                    id: "TaskExecutionLog.label.endDatetime",
                                                    defaultMessage: "End Datetime",
                                                })}
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "TaskExecutionLog.label.createdBy",
                                                defaultMessage: "User",
                                            })}
                                        </TableCell>
                                        <TableCell className="last-column-border">
                                            {intl.formatMessage({
                                                id: "TaskExecutionLog.label.details",
                                                defaultMessage: "Details",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taskExecutionLogs.sort(getComparator(order, orderBy)).map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.taskDetails}</TableCell>
                                            <TableCell>{row.startDatetime.toLocaleString()}</TableCell>
                                            <TableCell>{row.endDatetime.toLocaleString()}</TableCell>
                                            <TableCell>{row.userName}</TableCell>
                                            <TableCell align="center" width="190px" className="sticky-table column last-column-border">
                                                <div className="action btns-block">
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => {
                                                            showLogInfo(row.taskExecutionLogId);
                                                            setSelectTaskExecutionLogId(row.taskExecutionLogId);
                                                        }}
                                                    >
                                                        <img src={ic_info_orange} alt="mail" />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {taskExecutionLogs &&
                                        taskExecutionLogs.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="last-column-border">
                                                    <p style={{ textAlign: "center" }}>
                                                        {intl.formatMessage({
                                                            id: "TaskExecutionLogs.noDataFound",
                                                            defaultMessage: "No Data Found.",
                                                        })}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={rowsPerPageOptionsConst}
                            component="div"
                            count={totalRecords}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(event, newPage) => {
                                setPage(newPage);
                                getTaskExecutionLogs(endDatetimeVal, startDatetimeVal, selectTaskVal, newPage, rowsPerPage);
                            }}
                            onRowsPerPageChange={(event) => {
                                const newRowsPerPage = parseInt(event.target.value, 10);
                                setRowsPerPage(newRowsPerPage);
                                setPage(0);
                                getTaskExecutionLogs(endDatetimeVal, startDatetimeVal, selectTaskVal, 0, newRowsPerPage);
                            }}
                        />
                    </div>
                </main>
                <Dialog open={open} onClose={handleClose} className="c-dialog">
                    <DialogTitle component={"div"}>
                        <div className="title-block mb-0">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "TaskExecutionLog.definitionTitle",
                                        defaultMessage: "Task Execution Log Details",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "TaskExecutionLog.definitionSubTitle",
                                        defaultMessage: "Processing Events",
                                    })}
                                </p>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="inner-card">
                            <TableContainer sx={{ mt: 4 }}>
                                <Table
                                    sx={{ minWidth: 650, borderCollapse: "collapse" }}
                                    aria-label="simple table"
                                    stickyHeader
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "TaskExecution.institution",
                                                    defaultMessage: "Institution",
                                                })}
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 200 }}>
                                                {intl.formatMessage({
                                                    id: "TaskExecution.fileName",
                                                    defaultMessage: "File Name",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "TaskExecution.executionResult",
                                                    defaultMessage: "Execution Result",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortField === "startDatetime"}
                                                    direction={sortOrder}
                                                    hideSortIcon={false}
                                                    onClick={() => requestSort()}
                                                >
                                                    {intl.formatMessage({
                                                        id: "TaskExecution.executionTime",
                                                        defaultMessage: "Execution Time",
                                                    })}
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell className="last-column-border-header">
                                                {intl.formatMessage({
                                                    id: "TaskExecution.remark",
                                                    defaultMessage: "Remark",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {processingEvents &&
                                            processingEvents.map((row, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{row.institutionId}</TableCell>
                                                    <TableCell>{row.fileName}</TableCell>
                                                    <TableCell>{row.successResult}</TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(row.executionTime),
                                                            "dd/MM/yyyy HH:mm:ss"
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="last-column-border">
                                                        {row.remarks ? (
                                                            row.remarks.length <= 35 ? (
                                                                row.remarks
                                                            ) : (
                                                                <>
                                                                    {row.remarks.substring(0, 35)}
                                                                    <Button
                                                                        sx={{ height: 5, width: 6 }}
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setCurrentRemark(row.remarks);
                                                                            setRemarkModalOpen(true);
                                                                        }}
                                                                    >
                                                                        ...
                                                                    </Button>
                                                                </>
                                                            )
                                                        ) : (
                                                            "No Remarks"
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {processingEvents && processingEvents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="last-column-border">
                                                    <p style={{ textAlign: "center" }}>
                                                        {intl.formatMessage({
                                                            id: "ProcessingEvents.noDataFound",
                                                            defaultMessage: "No Data Found.",
                                                        })}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={rowsPerPageOptionsConst}
                                component="div"
                                count={totalRecordsProcessingEvents}
                                rowsPerPage={rowsPerPageProcessingEvents}
                                page={pageProcessingEvents}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions className="btns-block right">
                        <Button
                            disableElevation
                            variant="contained"
                            color="secondary"
                            onClick={handleClose}
                        >
                            <FormattedMessage
                                id="TaskExecutionLog.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={remarkModalOpen} onClose={handleCloseRemark} className="c-dialog">
                    <DialogTitle component={"div"}>
                        <div className="title-block mb-0">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "TaskExecutionLog.remark",
                                        defaultMessage: "Remark",
                                    })}
                                </Typography>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="inner-card">
                            <TableContainer sx={{ mt: 4 }}>
                                <Table
                                    sx={{ minWidth: 650, borderCollapse: "collapse" }}
                                    aria-label="simple table"
                                    stickyHeader
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="last-column-border-header">
                                                {intl.formatMessage({
                                                    id: "TaskExecution.remark",
                                                    defaultMessage: "Remark",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="last-column-border">
                                                {currentRemark}
                                            </TableCell>
                                        </TableRow>
                                        {currentRemark === "" && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="last-column-border">
                                                    <p style={{ textAlign: "center" }}>
                                                        {intl.formatMessage({
                                                            id: "ProcessingEvents.noRemark",
                                                            defaultMessage: "No Remark.",
                                                        })}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </DialogContent>
                    <DialogActions className="btns-block right">
                        <Button
                            disableElevation
                            variant="contained"
                            color="secondary"
                            onClick={handleCloseRemark}
                        >
                            <FormattedMessage
                                id="TaskExecutionLog.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        </>
    );
}

export default TaskExecutionLog;