import { Box, Button, FormControl, IconButton, InputAdornment, InputBase, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { add_rounded, delete_ic, edit_ic, search_ic } from '../../assets/images';
import { RoleMainModel, RoleModel } from '../../models/security/RoleModel';
import { RoleService } from '../../services/security/role-service';
import { Errors, ROLE_ACTIVITY, rowsPerPageOptionsConst, StatusCode } from '../../utils/constant';
import { visuallyHidden } from "@mui/utils";
import { AssignRoles, selectedInst } from '../../services/request';
import { getLocalStorage, LOCALSTORAGE_KEYS } from '../../utils/helper';

const Roles = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const [roleList, setRoleList] = React.useState<RoleMainModel[]>([]);
    const [filteredRoleList, setFilteredRoleList] = React.useState<RoleMainModel[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [roleActivity, setRoleActivity] = React.useState<RoleMainModel>();

    const userStr = getLocalStorage(LOCALSTORAGE_KEYS.USER);
    const userdata = JSON.parse(
        userStr as string
    );

    useEffect(() => {
        const assignRole = AssignRoles.find((role: RoleMainModel) => role.instId === selectedInst);
        if (assignRole !== undefined) {
            setRoleActivity(assignRole);
        }
    }, [selectedInst]);


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
        a: { [key in Key]: any },
        b: { [key in Key]: any },
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const createSortHandler = (
        property: keyof RoleMainModel
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */


    useEffect(() => {
        getRoles();
    }, [])

    const getRoles = async () => {
        await RoleService.getAllRoles()
            .then((res) => {
                setRoleList([...res.data]);
                setFilteredRoleList([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const editRole = async (id: number) => {
        navigate(`/roles-definition/${id}`)
    }

    const changeStatus = async (id: number, event: any) => {
        const model = {
            id: id,
            idString: id.toString(),
            status: event.target.checked === true ? "1" : "0",
        };
        RoleService.changeRoleStatus(model).then(res => {
            getRoles();
            toast.success(res?.data+"")
        }).catch((err) =>   toast.error(err.response.data.errors[0]));
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
                RoleService.deleteRole(id).then((res) => {
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
                    getRoles();
                    setPage(0);
                }).catch(err => {
                    if (err && err.response 
      //                  && err.response.data === Errors.ReferenceExists
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

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptionsConst[0]);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof RoleMainModel>('roleName');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    useEffect(() => {
        if (searchTerm === "") {
            onSearch();
        }
    }, [searchTerm])

    const onSearch = async () => {
        setFilteredRoleList(roleList.filter((data: RoleMainModel) =>
            data.roleName.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    }


    return (
        <>
            <div className="wrapper">
                <main className="main-content" >
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block">
                                <Typography variant={"h2"} className="pb-0">
                                    {intl.formatMessage({
                                        id: "Roles.roles",
                                        defaultMessage: "Roles",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "Roles.manageroles",
                                        defaultMessage:
                                            "Manage Roles",
                                    })}
                                </p>
                            </div>
                            <div className="right-block">
                                <FormControl>
                                    <InputBase placeholder={
                                        intl.formatMessage({
                                            id: "Entity.button.search",
                                            defaultMessage: "Search"
                                        })
                                    }
                                        onChange={handleSearchTermChange}
                                        fullWidth
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={onSearch}>
                                                    <img src={search_ic} alt="lock" />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    className="btn-light"
                                    endIcon={<img src={add_rounded} alt="add" />}
                                    onClick={() => navigate("/roles-definition")}
                                    disabled={!(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles)?.accessAdd === "1")}
                                >
                                    <FormattedMessage
                                        id="Roles.addrole"
                                        defaultMessage="Add Role"
                                    />
                                </Button>
                            </div>
                        </div>

                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'roleName'}
                                                direction={orderBy === 'roleName' ? order : 'asc'}
                                                onClick={() => createSortHandler("roleName")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "Roles.rolename",
                                                        defaultMessage: "Role Name"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border-header">
                                            {
                                                intl.formatMessage({
                                                    id: "Entity.label.actions",
                                                    defaultMessage: "Actions",
                                                })
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRoleList.sort(getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                            <TableRow
                                                key={i}
                                            >
                                                <TableCell>{row.roleName}</TableCell>
                                                <TableCell align="center" width="190px" className="last-column-border">
                                                    <div className="action btns-block">
                                                        <Switch
                                                            className="custom"
                                                            checked={row.status === "1" ? true : false}
                                                            onChange={(e) =>
                                                                changeStatus(row.roleId, e)
                                                            }
                                                            disabled={row.isSystemAdminRole|| !(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles)?.accessUpdate === "1")}
                                                        />
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => editRole(row.roleId)}
                                                            disabled={row.isSystemAdminRole || !(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles)?.accessUpdate === "1")}
                                                        >
                                                            <img src={edit_ic} alt="edit" />
                                                        </IconButton>
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => onDelete(row.roleId)}
                                                            disabled={row.isSystemAdminRole || !(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles)?.accessDelete === "1")}
                                                        >
                                                            <img src={delete_ic} alt="delete" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {filteredRoleList &&
                                        filteredRoleList.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="last-column-border">
                                                    <p style={{ textAlign: "center" }}>
                                                        {intl.formatMessage({
                                                            id: "Entity.noDataFound",
                                                            defaultMessage: "No Data Found",
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
                            count={filteredRoleList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className='pagination'
                            backIconButtonProps={{
                                classes: {
                                    root: "prev-arrow",
                                },
                            }}
                            nextIconButtonProps={{
                                classes: {
                                    root: "next-arrow",
                                },
                            }}
                        />
                    </div>
                </main >
            </div >
        </>
    )
}

export default Roles