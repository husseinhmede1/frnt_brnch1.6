import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputBase,
    MenuItem,
    Select,
    SelectChangeEvent,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableSortLabel,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import { getRoles } from "@testing-library/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
    add_rounded,
    delete_ic,
    down_arrow_icon,
    edit_ic
} from "../../assets/images";
import { EmployeeModel } from "../../models/configuration/EmployeeModel";
import { Institution } from "../../models/configuration/InstitutionModel";
import { RoleMasterModel } from "../../models/configuration/RoleMasterModel";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { EmployeeService } from "../../services/configuration/employee-service";
import { InstitutionService } from "../../services/configuration/institution-service";
import { RoleMasterService } from "../../services/configuration/role-master-service";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { CodePrefix, ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";
import { visuallyHidden } from "@mui/utils";

function Employees() {
    const [open, setOpen] = useState(false);
    const [employeeList, setEmployeeList] = useState<EmployeeModel[]>([]);
    const [roleList, setRoleList] = useState<SystemCodeModel[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeModel>(
        new EmployeeModel()
    );
    const [editedId, setEditedId] = useState<number | undefined>(0);
    const [institution, setInstitution] = useState<Institution[]>([]);
    const [selectVal, setSelectVal] = useState<any>("");
    const [roleId, setRoleId] = useState<number | null>(null);
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [enable, setEnable] = useState(false);
    const intl = useIntl();

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.EMPLOYEES), []);
    const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.EMPLOYEES, 'EMPCRT');
    const canUpdate = perms.accessUpdate === "1";
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.EMPLOYEES, 'EMPDEL');
    const canView = perms.accessView === "1";
    const canLoadInstitutions = hasApiAccess(ConfigurationActivities.EMPLOYEES, 'GAAINST');

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof EmployeeModel>('employeeId');

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
        property: keyof EmployeeModel
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */


    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<EmployeeModel>({
        mode: "onChange",
        resolver: yupResolver(validations.createEmployeeValidations),
    });

    const handleClickOpen = (isEdit: boolean) => {
        if (!isEdit) {
            handleReset();
        }
        setOpen(true);
        clearErrors();
    };

    const handleReset = (): void => {
        reset(new EmployeeModel());
        setSelectVal("");
        setRoleId(null);
        setEmployeeDetails(new EmployeeModel());
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getActiveInstitution();
        setInstitutefromLocalStorage();
    }, []);

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
            getEmployeesByInstitutionId(instID);
            getAllRole(instID);
        }
    };

    const getActiveInstitution = async () => {
        if (!canLoadInstitutions) return;
        await InstitutionService.getActiveInstitution()
            .then((res) => {
                setInstitution([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getEmployeesByInstitutionId = async (id: string | "") => {
        await EmployeeService.getEmployeesByInstitutionId(id)
            .then((res) => {
                setEmployeeList([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getAllRole = async (instId: string) => {
        const model = {
            codePrefix: CodePrefix.ROLE_MASTER,
            institutionId: instId
        }
        await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
            .then((res) => {
                setRoleList([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const changeStatus = async (id: number, event: any) => {
        const model = {
            id: id,
            status: event.target.checked === true ? "1" : "0",
        };
        EmployeeService.changeStatus(model)
            .then((res) => {
                getEmployeesByInstitutionId(selectInstitutionVal);
                toast.success(res.data+"")
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const handleChange = (event: SelectChangeEvent) => {
        setSelectVal(event.target.value);
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
        const selectedInstitutionId =
            event.target.value !== ""
                ? event.target.value
                : institution[0].institutionId;
        getEmployeesByInstitutionId(selectedInstitutionId);
        getAllRole(selectedInstitutionId as string);
    };

    const editEmployee = async (id: number | undefined) => {
        handleClickOpen(true);
        setEditedId(id);
        getEmployeeById(id);
    };

    const getEmployeeById = async (id: number | undefined) => {
        EmployeeService.getById(Number(id))
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                reset(data);
                setEmployeeDetails(data);
                setSelectVal(data.employeeRoleSystemCodeId);
                setRoleId(data.employeeRoleSystemCodeId);
                setEnable(data.status === "1" ? true : false);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const onDelete = (id: number | undefined) => {
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
                EmployeeService.deleteById(id).then((res) => {
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
                    getEmployeesByInstitutionId(selectInstitutionVal);
                }).catch(err => {
                    if (err && err.response
                    //     && err.response.data === Errors.ReferenceExists
                        ) {
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
                    }
                });
            }
        });
    };

    const onSubmit = async (value: EmployeeModel) => {
        const model = {
            ...value,
            status: enable ? "1" : "0",
            institutionId: selectInstitutionVal,
            employeeRoleId: roleId,
            employeePhone: value.employeePhone
        };
        EmployeeService.saveOrUpdate(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    if (editedId) {
                        toast.success(`Employee updated successfully`);
                    } else {
                        toast.success("Employee added successfully");
                    }
                }
                handleClose();
                getEmployeesByInstitutionId(model.institutionId);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    return (
        <>
            <div className="wrapper">
                <main className="main-content">
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "Employees.title",
                                        defaultMessage: "Employees",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "Employees.subTitle",
                                        defaultMessage: "List of Institution Employees",
                                    })}
                                </p>
                            </div>
                            <div className="right-block">
                                <Button
                                    variant="contained"
                                    disableElevation
                                    className="btn-light"
                                    endIcon={<img src={add_rounded} alt="add" />}
                                    onClick={() => handleClickOpen(false)}
                                    disabled={!canAdd}
                                >
                                    <FormattedMessage
                                        id="Employees.addBtn"
                                        defaultMessage="Add Employee"
                                    />
                                </Button>
                            </div>
                        </div>
                        <Grid spacing={3} container>
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
                                            {institution &&
                                                institution.length > 0 &&
                                                institution.map((type) => {
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
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'employeeId'}
                                                direction={orderBy === 'employeeId' ? order : 'asc'}
                                                onClick={() => createSortHandler("employeeId")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "Employees.employeeId",
                                                        defaultMessage: "Employee ID"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'employeeName'}
                                                direction={orderBy === 'employeeName' ? order : 'asc'}
                                                onClick={() => createSortHandler("employeeName")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "Employees.employeeName",
                                                        defaultMessage: "Employee Name"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'employeeRoleCodeDescription'}
                                                direction={orderBy === 'employeeRoleCodeDescription' ? order : 'asc'}
                                                onClick={() => createSortHandler("employeeRoleCodeDescription")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "Employees.role",
                                                        defaultMessage: "Role"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "Employees.phone",
                                                defaultMessage: "Phone",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "Employees.extension",
                                                defaultMessage: "Extension",
                                            })}
                                        </TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border-header">
                                            {intl.formatMessage({
                                                id: "Employees.actions",
                                                defaultMessage: "Actions",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {employeeList.sort(getComparator(order, orderBy)).map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{row.employeeId}</TableCell>
                                                <TableCell>{row.employeeName}</TableCell>
                                                <TableCell>{row.employeeRoleCodeDescription}</TableCell>
                                                <TableCell>{row.employeePhone}</TableCell>
                                                <TableCell>{row.employeeExt}</TableCell>
                                                <TableCell align="center" width="190px" className="last-column-border">
                                                    <div className="action btns-block">
                                                        <Switch
                                                            className="custom"
                                                            checked={row.status === "1" ? true : false}
                                                            onChange={(e) => changeStatus(row.employeeId, e)}
                                                            disabled={!canUpdate}
                                                        />
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => editEmployee(row.employeeId)}
                                                            disabled={!canUpdate}
                                                        >
                                                            <img src={edit_ic} alt="mail" />
                                                        </IconButton>
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => onDelete(row.employeeId)}
                                                            disabled={!canDelete}
                                                        >
                                                            <img src={delete_ic} alt="mail" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {employeeList && employeeList.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={13} className="last-column-border">
                                                <p style={{ textAlign: "center" }}>
                                                    {intl.formatMessage({
                                                        id: "Employees.noDataFound",
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
                <Dialog open={open} onClose={handleClose} className="c-dialog">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogTitle component={"div"}>
                            <div className="title-block mb-0">
                                <div className="left-block mb-0">
                                    <Typography variant={"h2"}>
                                        {intl.formatMessage({
                                            id: "Employees.definitionTitle",
                                            defaultMessage: "Employee Definition",
                                        })}
                                    </Typography>
                                    <p className="pb-0">
                                        {intl.formatMessage({
                                            id: "Employees.definitionSubTitle",
                                            defaultMessage: "Add or Update an Employee",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent>
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
                                                    disabled
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
                                                    {institution &&
                                                        institution.length > 0 &&
                                                        institution.map((type) => {
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
                                                {selectInstitutionVal === "" &&
                                                    errors.institutionId?.message ? (
                                                    <FormHelperText id="error-helper-text" error>
                                                        {
                                                            validations.createCurrencyRateValidationError
                                                                .institutionId
                                                        }
                                                    </FormHelperText>
                                                ) : null}
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}></Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "Employees.selectRole",
                                                    defaultMessage: "Role",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...register("employeeRoleId")}
                                                    value={selectVal}
                                                    onChange={handleChange}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                >
                                                    {selectVal === "" ? (
                                                        <MenuItem value="" disabled>
                                                            <em>
                                                                {intl.formatMessage({
                                                                    id: "Employees.selectedRolePlaceholder",
                                                                    defaultMessage: "Select Role",
                                                                })}
                                                            </em>
                                                        </MenuItem>
                                                    ) : null}
                                                    {roleList &&
                                                        roleList.length > 0 &&
                                                        roleList.map((type) => {
                                                            return (
                                                                <MenuItem
                                                                    key={type.systemCodeId}
                                                                    value={type.systemCodeId}
                                                                    onClick={() => setRoleId(type.systemCodeId)}
                                                                >
                                                                    {type.description}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                                {selectVal === "" && errors.employeeRoleId?.message ? (
                                                    <FormHelperText id="error-helper-text" error>
                                                        {validations.createEmployeeValidationError.employeeRoleId}
                                                    </FormHelperText>
                                                ) : null}
                                            </FormControl>

                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "Employees.enterPhone",
                                                    defaultMessage: "Phone",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "Employees.enterPhoneePlaceholder",
                                                        defaultMessage: "Insert Phone Number",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="employeePhone"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    {...register("employeePhone")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.employeePhone?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "Employees.enterName",
                                                    defaultMessage: "Employee Name",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "Employees.enterNameePlaceholder",
                                                        defaultMessage: "Insert Employee Name",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="employeeName"
                                                    autoComplete="off"
                                                    aria-describedby="error-helper-text"
                                                    {...register("employeeName")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.employeeName?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "Employees.enterExtention",
                                                    defaultMessage: "Extension",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "Employees.enterExtensionPlaceholder",
                                                        defaultMessage: "Insert Extension",
                                                    })}
                                                    error
                                                    fullWidth
                                                    type="text"
                                                    id="employeeExt"
                                                    autoComplete="off"
                                                    inputProps={{ maxLength: 10 }}
                                                    aria-describedby="error-helper-text"
                                                    {...register("employeeExt")}
                                                    onKeyDown={(event) => {
                                                        if (
                                                            !(
                                                                event.key === "Backspace" ||
                                                                event.key === "Delete" ||
                                                                event.key === "Tab" ||
                                                                event.key === "Enter" ||
                                                                (event.key >= "0" && event.key <= "9")
                                                            )
                                                        ) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.employeeExt?.message}
                                                </FormHelperText>
                                            </FormControl>



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
                                <FormattedMessage
                                    id="Employees.cancel"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                            <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                                <FormattedMessage id="Employees.save" defaultMessage="Save" />
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        </>
    );
}

export default Employees;
