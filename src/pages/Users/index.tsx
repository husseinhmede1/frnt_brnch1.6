import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import {
  add_rounded,
  delete_ic,
  down_arrow_icon,
  edit_ic,
  resetIcon,
  search_ic,
  unblockUserIcon,
} from "../../assets/images";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  ConfigurationActivities,
  Errors,
  StatusCode,
  rowsPerPageOptionsConst,
} from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import { visuallyHidden } from "@mui/utils";
import { Institution } from "../../models/configuration/InstitutionModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { UserModel } from "../../models/security/UserModel";
import { UserService } from "../../services/security/user-service";
import { userStr } from "../../services/request";

function Users() {
  const navigate = useNavigate();
  const [userList, setUserList] = React.useState<UserModel[]>([]);
  const [filteredUserList, setFilteredUserList] = React.useState<UserModel[]>(
    []
  );
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [institution, setInstitution] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  //const [loginUser, setLoginUser] = React.useState<any>();
  const intl = useIntl();

  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.MNGUSERS), []);
  const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.MNGUSERS, 'SAVEUSER');
  const canUpdate = perms.accessUpdate === "1" && hasApiAccess(ConfigurationActivities.MNGUSERS, 'USERCHNGSTTS');
  const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.MNGUSERS, 'DELETEUSER');
  const canView = perms.accessView === "1";
  const canLoadInstitutions = hasApiAccess(ConfigurationActivities.MNGUSERS, 'GAAINST');
  const canLoadRoles = hasApiAccess(ConfigurationActivities.MNGUSERS, 'GETALLROLES');

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

  type Order = "asc" | "desc";

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const createSortHandler = (property: keyof UserModel) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /* END (sort table data) */

  useEffect(() => {
    getActiveInstitution();
    //setLoginUser();
    setInstitutefromLocalStorage();
    //getUsers();
  }, []);

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;

    if (instID) {
      setSelectInstitutionVal(instID);
      getUsersByInst(instID);
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

  const getUsersByInst = (id: string) => {
    const loginUserss = JSON.parse(userStr as string);
    UserService.getUsersByInstitution(id)
      .then((res) => {
        if (res.data) {

          let userlist = res.data.filter(
            (user) => user.userId !== loginUserss?.user.userId
          );
          setFilteredUserList([...userlist]);
          setUserList([...userlist]);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
      
  };

  // const getUsers = async () => {
  //     await UserService.getAllUsers()
  //         .then((res) => {
  //             setUserList([...res.data]);
  //             setFilteredUserList([...res.data]);
  //         })
  //         .catch((err) =>   toast.error(err.response.data.errors[0]));
  // };

  const editUser = async (id: number) => {
    navigate(`/users-definition/${id}`);
  };

  const changeStatus = async (id: number, event: any) => {
    const model = {
      id: id,
      idString: id.toString(),
      status: event.target.checked === true ? "1" : "0",
    };
    UserService.changeUserStatus(model)
      .then((res) => {
        getUsersByInst(selectInstitutionVal);
        setPage(0);
        toast.success(res?.data)
      })
      .catch((err) => {
          toast.error(err.response.data.errors[0]);
      });
  };

  const unblockUser = async (id: number) => {
    const model = {
      userId: id,
    };

    UserService.unblockUser(model)
      .then((res) => {
        getUsersByInst(selectInstitutionVal);
        setPage(0);
        toast.success(res?.data);
      })
      .catch((err) => {
        toast.error(err.response.data.errors[0]);
      });
  };
  


  const onDelete = (id: number) => {
    Swal.fire({
      title: intl.formatMessage({
        id: "DeleteAlert.title",
        defaultMessage: "Are you sure?",
      }),
      text: intl.formatMessage({
        id: "DeleteAlert.textUser",
        defaultMessage: "You shouldn’t be able to login with the deleted user!",
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
        UserService.deleteUser(id)
          .then((res) => {
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
              });
            }
            getUsersByInst(selectInstitutionVal);
            setPage(0);
          })
          .catch((err) => {
            if (
              err &&
              err.response 
              //&&
              // (err.response.data === Errors.ReferenceExists ||
              //   err.response.data === Errors.dataIntegrity)
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

  const handleInstitutionChange = (event: SelectChangeEvent) => {
    setSelectInstitutionVal(event.target.value);
    getUsersByInst(event.target.value);
    setPage(0);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    rowsPerPageOptionsConst[0]
  );
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof UserModel>("username");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const resetPassword = (userName: string, event: any) => {
    event.currentTarget.disabled = true;
    UserService.resetPassword({ userName: userName })
      .then((res) => {
        toast.success("Reset Password Email Sent");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    if (searchTerm === "") {
      onSearch();
    }
  }, [searchTerm]);

  useEffect(() => {
    onSearch();
  }, [selectInstitutionVal, userList]);

  const onSearch = async () => {
    setFilteredUserList(
      userList.filter(
        (data: UserModel) =>
          data.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
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
                    id: "Users.users",
                    defaultMessage: "Users",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "Users.manageusers",
                    defaultMessage: "Manage Users",
                  })}
                </p>
              </div>
              <div className="right-block">
                <FormControl>
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "Entity.button.search",
                      defaultMessage: "Search",
                    })}
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
                  onClick={() =>
                    navigate("/users-definition", {
                      state: { institutionId: selectInstitutionVal },
                    })
                  }
                  disabled={!canAdd}
                >
                  <FormattedMessage
                    id="Users.adduser"
                    defaultMessage="Add User"
                  />
                </Button>
              </div>
            </div>
            <Grid spacing={3} container>
              <Grid item xs={12} lg={4} sm={6} xl={4}>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.label.institution",
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
                        active={orderBy === "username"}
                        direction={orderBy === "username" ? order : "asc"}
                        onClick={() => createSortHandler("username")}
                      >
                        {intl.formatMessage({
                          id: "Users.username",
                          defaultMessage: "Username",
                        })}
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "firstName"}
                        direction={orderBy === "firstName" ? order : "asc"}
                        onClick={() => createSortHandler("firstName")}
                      >
                        {" "}
                        {intl.formatMessage({
                          id: "Users.firstname",
                          defaultMessage: "First Name",
                        })}
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "lastName"}
                        direction={orderBy === "lastName" ? order : "asc"}
                        onClick={() => createSortHandler("lastName")}
                      >
                        {" "}
                        {intl.formatMessage({
                          id: "Users.lastname",
                          defaultMessage: "Last Name",
                        })}
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="center"
                      width="190px"
                      className="last-column-border-header"
                    >
                      {intl.formatMessage({
                        id: "Entity.label.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUserList
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>{row.firstName}</TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell
                          align="center"
                          width="220px"
                          className="last-column-border"
                        >
                          <div className="action btns-block">
                            <Switch
                              title="change status"
                              className="custom"
                              checked={row.status === "1" ? true : false}
                              onChange={(e) =>
                                changeStatus(row.userId as number, e)
                              }
                              disabled={row?.status === "3" || !canUpdate}
                            />
                            <IconButton
                              title="edit"
                              className={`border-icon-btn no-border sm ${row.status==="3"?"darker":""}`}
                              onClick={() => editUser(row.userId as number)}
                              disabled={row?.status === "3" || !canUpdate}
                            >
                              <img src={edit_ic} alt="edit" />
                            </IconButton>
                            <IconButton
                              title="reset password"
                              className={`border-icon-btn no-border sm ${row.status==="3"?"darker":""}`}
                              onClick={(e) =>
                                resetPassword(row.username as string, e)
                              }
                              disabled={row?.status === "3" || !canUpdate}
                            >
                              <img src={resetIcon} alt="edit" />
                            </IconButton>
                              <IconButton
                              className={`border-icon-btn no-border sm ${row.status!=="3"?'darker':''}` }
                              title="unblock"
                              onClick={() => unblockUser(row.userId as number)}
                              disabled={!(canUpdate && row.status === "3")}
                            >
                            <img src={unblockUserIcon} alt="unblock" />
                            </IconButton>
                            <IconButton
                              title="delete"
                              className="border-icon-btn no-border sm"
                              onClick={() => onDelete(row.userId as number)}
                              disabled={!canDelete}
                            >
                              <img src={delete_ic} alt="delete" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredUserList && filteredUserList.length === 0 && (
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
              count={filteredUserList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="pagination"
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
        </main>
      </div>
    </>
  );
}

export default Users;
