import { yupResolver } from "@hookform/resolvers/yup";
import {
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { down_arrow_icon, ic_check, ic_checked } from "../../assets/images";
import { Institution } from "../../models/configuration/InstitutionModel";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { RoleMainModel } from "../../models/security/RoleModel";
import { GetUserById, RoleInst, UserMainModel, UserModel } from "../../models/security/UserModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { AssignRoles, InstitutionList, selectedInst, userStr } from "../../services/request";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import { RoleService } from "../../services/security/role-service";
import { UserService } from "../../services/security/user-service";
import { allowOnlyCharacters, allowOnlyNumbers, avoidSpace } from "../../utils/commonfunction";
import { CodePrefix, ConfigurationActivities, ROLE_ACTIVITY, StatusCode } from "../../utils/constant";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { IInstitution } from "../../models/login/LoginModel";

function ArrowDown() {
  return (
    <img src={down_arrow_icon} alt="arrow" className="select-icon" />
  );
}

function UserDefinition() {
  const { id } = useParams<{ id?: string }>();
  const { pathname, state } = useLocation() as {
    pathname: string;
    state: {
      isUserProfile?: boolean;
    };
  };
  const intl = useIntl();
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [institution, setInstitution] = React.useState<Institution[]>([]);
  const [lang, setLang] = React.useState(" ");
  const [status, setStatus] = React.useState(" ");
  const [selectRole, setSelectRole] = React.useState(" ");
  const [roleList, setRoleList] = React.useState<RoleMainModel[]>([]);
  const [roleId, setRoleId] = React.useState<number | null>(null);
  const [assignRoles, setAssignRoles] = React.useState<RoleInst[]>([]);
  //const [userRole, setUserRole] = React.useState<string>("");
  const [prefLanguage, setPrefLanguage] = React.useState<SystemCodeModel[]>([]);
  const [prefSystemCodeId, setSystemCodeId] = React.useState<number | null>(null);
  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.MNGUSERS), []);
  const canAdd    = perms.accessAdd    === "1" && hasApiAccess(ConfigurationActivities.MNGUSERS, 'SAVEUSER');
  const canUpdate = perms.accessUpdate === "1" && hasApiAccess(ConfigurationActivities.MNGUSERS, 'SAVEUSER');
  const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.MNGUSERS, 'DELETEUSER');
  const canView = perms.accessView === "1";

  const [loginUser, setLoginUser] = React.useState<any>();
  const [editUserData, setEditUserData] = React.useState<UserMainModel>();
  const [userInst, setUserInst] = React.useState<IInstitution[]>([]);
  const [userRoles, setUserRoles] = React.useState<RoleMainModel[]>([]);
  const [isUserProfile,setIsUserProfile] = React.useState(false)

  useEffect(() => {
    // roleActivity replaced by getActivityPermissions
  }, [selectedInst]);

  const handleChangeRole = (event: SelectChangeEvent, instId: string) => {
    //setSelectRole(event.target.value);
    let accessLevel: RoleInst[] = [...assignRoles];
    let index = assignRoles.findIndex(d => d.institutionId === instId);
    if (accessLevel[index].status) {
      accessLevel[index].roleName = event.target.value;
      accessLevel[index].roleId = Number(event.target.value);
    } else {
      toast.warning("Please mark institute before assigning role.");
    }
    setAssignRoles([...accessLevel]);
  }

  const handleChangeAction = (event: any, instId: string) => {
    let accessLevel: RoleInst[] = [...assignRoles];
    let index = assignRoles.findIndex(d => d.institutionId === instId);
    let action = !accessLevel[index].status;
    accessLevel[index].status = action;
    if (!action) {
      accessLevel[index].roleName = " ";
      accessLevel[index].roleId = 0;
    }
    setAssignRoles([...accessLevel]);
  }

  const handleStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleInstitutionChange = (event: SelectChangeEvent) => {
    setSelectInstitutionVal(event.target.value);
    getAllPreferredLanguage(event.target.value);
  };
  const handleLang = (event: SelectChangeEvent) => {
    setLang(event.target.value);
  };

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserMainModel>({
    mode: "onChange",
    resolver: yupResolver(validations.createUserValidations),
  });


  useEffect(() => {
    getActiveInstitution();
    setInstitutefromLocalStorage();
    getRoleList();
    setLoginUser(JSON.parse(userStr as string));
  }, []);


  useEffect(() => {
    if (id) {
      getUserById();
      // setLoginUser(JSON.parse(userStr as string));
    }
  }, [id, reset])

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string

    if (instID) {
      setSelectInstitutionVal(instID);
      getAllPreferredLanguage(instID);
    }
  };

  const getAllPreferredLanguage = (inst: string) => {
    const model = {
      codePrefix: CodePrefix.PREFERRED_LANGUAGE,
      institutionId: inst
    }
    SystemCodeServices.getSystemCodesByPrefixSuffix(model).then(res => {
      setPrefLanguage(res?.data);
    }).catch(err =>   toast.error(err.response.data.errors[0]))
  }

  const getActiveInstitution = async () => {
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitution([...res.data]);
        if (id === undefined) {
          let accessLevel: any[] = res.data ?? [];
          accessLevel.forEach(element => {
            element.roleId = 0;
            element.roleName = " ";
            element.status = false;
          });
          setAssignRoles([...accessLevel]);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };


  const getRoleList = async () => {
    await RoleService.getAllRoles().then(res => {
      setRoleList([...res.data]);
    }).catch(err =>   toast.error(err.response.data.errors[0]));
  }

  const getUserById = () => {
  
  const modal: GetUserById = {
    userId: Number(id),
    isUserProfile:state?.isUserProfile ?? false 
  };

  UserService.getUserById(modal)
    .then((res) => {
      if (res.status === StatusCode.Success) {
        reset(res.data);
        setEditUserData(res.data);
        setLang(res.data?.preferedLanguageCodeSuffix);
        setSystemCodeId(res.data?.preferedLanguageSystemCodeId);
        setSelectInstitutionVal(res.data?.defaultInstitutionId);
        setStatus(res.data?.status);
        setUserInst(res.data?.institution as IInstitution[]);
        setUserRoles(res.data?.userRoles as RoleMainModel[]);

        let accessLevel: any[] = InstitutionList;

        accessLevel.forEach((element) => {
          let ele = res.data?.userRoles?.find(
            (value) => value.instId === element.institutionId
          );

          if (ele !== undefined) {
            element.roleId = ele.roleId;
            element.roleName = ele.roleName;
            element.status = true;
          } else {
            element.roleId = 0;
            element.roleName = " ";
            element.status = false;
          }
        });

        setAssignRoles([...accessLevel]);
        setIsUserProfile((state?.isUserProfile ?? false) && res?.data?.isSystemAdmin);  

      }
    })
    .catch((error: any) => {

      const message =
        error?.response?.data?.errors?.[0] ||error?.response?.data?.message ||error?.message ||
        "Something went wrong";

      toast.error(message);
      let isUserDefinitionPage = /^\/users-definition\/\d+$/.test(pathname);
      if(isUserDefinitionPage){
        navigate("/users-listing")
      }
      let ifUserProfile = /^\/user-profile\/\d+$/.test(pathname);
      if(ifUserProfile){
        navigate("/dashboard")
      }

    });
};

  const onSubmit = async (value: UserMainModel) => {
    let instId: string[] = [];
    
    assignRoles.map(data => {
      if (data.roleName !== " ") {
        instId.push(data.institutionId);
      }
    });

    let roleID: RoleInst[] = [];
    assignRoles.map(data => {
      if (data.status === true) {
        roleID.push(data);
      }
    });

    if (id) {
      userInst.map(data => {
        const newData = instId.find(item => item === data.institutionId);
        if ( newData === undefined && data.institutionId !== "") {
          instId.push(data.institutionId);
        }
      });

      
      userRoles.map(data => {
        
        const newData = roleID.find(item => item.institutionId === data.instId)
  
        if (newData === undefined && data.instId !== "") {
          // role = data as RoleMainModel;
          roleID.push({
            institutionId: data.instId as string,
            institutionName: data.instName as string,
            roleId: data.roleId,
            instName: data.instName as string,
            roleName: data.roleName,
            status: data.status as boolean,
          });
        }
      })

    }

    const model = {
      ...value,
      roleIds: roleID,
      institutionId: instId,
      defaultInstitutionId: selectInstitutionVal,
      preferedLanguage: prefSystemCodeId as number
    };
    let getInst = assignRoles.find(inst => inst.institutionId === selectInstitutionVal)
    let defaultInstRole = assignRoles.find(data => data.status === false && data.institutionId === selectInstitutionVal);
    let unassignedRole = assignRoles.find(data => data.status === true && (data.roleName === " " || data.roleId === 0));
    let unassignedRoleStatus = assignRoles.find(data => data.status === true);
    if (unassignedRoleStatus !== undefined && unassignedRole === undefined && defaultInstRole === undefined && getInst !== undefined) {
      await UserService.saveUser(model)
        .then((res) => {
          if (res.status === StatusCode.Success) {
            if (id) {
              toast.success("User details updated successfully");
            } else {
              toast.success("User has been added successfully.");
              toast.success("Password has been sent on entered mail address.");
            }
            if(pathname.startsWith('/user-profile')){
              navigate("/dashboard");
            }
            navigate(-1);
          }
        }).catch((err: any) => {
          toast.error(err.response.data.errors[0])
      });
    } else if (defaultInstRole !== undefined || getInst  === undefined) {
      toast.error("Please assign role to default institution")
    } else if (unassignedRole !== undefined) {
      toast.error("Select role for marked institution")
    } else {
      toast.error("Assign atleast one role to user")
    }
  };


  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  {pathname.startsWith("/user-profile") ?
                    intl.formatMessage({
                      id: "Users.userprofile",
                      defaultMessage: "User Profile",
                    })
                    :
                    id ?
                      intl.formatMessage({
                        id: "Users.updateuser",
                        defaultMessage: "Update User",
                      })
                      :
                      intl.formatMessage({
                        id: "Users.createuser",
                        defaultMessage: "Create User",
                      })
                  }
                </Typography>
                <p className="pb-0">
                  {pathname.startsWith("/user-profile") ?
                    intl.formatMessage({
                      id: "Users.manageuserprofile",
                      defaultMessage: "Manage User Profile",
                    })
                    :
                    id ?
                      intl.formatMessage({
                        id: "Users.updateuserhere",
                        defaultMessage: "Update User here",
                      })
                      :
                      intl.formatMessage({
                        id: "Users.createanewuserhere",
                        defaultMessage: "Create a new User here",
                      })
                  }
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="inner-card user-subtitles user-definition">

                <Typography variant="h6">{intl.formatMessage({ id: "SettingsCreateUser_4.personaldetails", defaultMessage: "Personal Details" })}</Typography>
                <Divider />
                <Grid spacing={3} container>

                  <Grid item xs={12} lg={6} justifyContent="flex-start">
                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "SettingsCreateUser_4.firstname", defaultMessage: "First Name" })} <span className="required">*</span></label></Grid>
                        <Grid item xs={7}>
                          <InputBase fullWidth placeholder={intl.formatMessage({ id: "SettingsCreateUser_4.enterfirstname", defaultMessage: "Enter First Name" })}
                            id="firstname"
                            autoComplete="off"
                            disabled={isUserProfile}
                            onKeyPress={allowOnlyCharacters}
                            {...register("firstName")}
                          />
                          <FormHelperText id="error-helper-text" error>
                            {errors.firstName?.message}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6} justifyContent="flex-start">
                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "SettingsCreateUser_4.lastname", defaultMessage: "Last Name" })}<span className="required">*</span></label></Grid>
                        <Grid item xs={7}>
                          <InputBase placeholder={intl.formatMessage({ id: "SettingsCreateUser_4.enterlastname", defaultMessage: "Enter Last Name" })}
                            id="lastname"
                            autoComplete="off"
                            onKeyPress={allowOnlyCharacters}
                            disabled={isUserProfile}
                            fullWidth
                            {...register("lastName")}
                          />
                          <FormHelperText id="error-helper-text" error>
                            {errors.lastName?.message}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6} justifyContent="flex-start">
                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "SettingsCreateUser_4.username", defaultMessage: "User Name" })}<span className="required">*</span></label></Grid>
                        <Grid item xs={7}>
                          <InputBase placeholder={intl.formatMessage({ id: "SettingsCreateUser_4.enterusername", defaultMessage: "Enter User Name" })}
                            id="username"
                            autoComplete="off"
                            disabled={isUserProfile}
                            fullWidth
                            onKeyPress={avoidSpace}
                            {...register("username")}
                          />
                          <FormHelperText id="error-helper-text" error>
                            {errors.username?.message}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6} justifyContent="flex-start">
                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "SettingsCreateUser_4.mobilenumber", defaultMessage: "Mobile Number" })} <span className="required">*</span></label>
                        </Grid>
                        <Grid item xs={7}>
                          <InputBase placeholder={intl.formatMessage({ id: "SettingsCreateUser_4.entermobilenumber", defaultMessage: "Enter Mobile Number" })}
                            id="mobilenumber"
                            autoComplete="off"
                            onKeyPress={allowOnlyNumbers}
                            disabled={isUserProfile}
                            fullWidth
                            {...register("mobile")}
                          />
                          <FormHelperText id="error-helper-text" error>
                            {errors.mobile?.message}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6} justifyContent="flex-start">
                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "SettingsCreateUser_4.email", defaultMessage: "Email" })} <span className="required">*</span></label>
                        </Grid>
                        <Grid item xs={7}>
                          <InputBase placeholder={intl.formatMessage({ id: "SettingsCreateUser_4.email", defaultMessage: "Enter Email Address" })}
                            id="emailinput"
                            disabled={isUserProfile}
                            autoComplete="off"
                            fullWidth
                            {...register("email")}
                          />
                          <FormHelperText id="error-helper-text" error>
                            {errors.email?.message}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6} justifyContent="flex-start">
                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "SettingsCreateUser_4.preferredinterfacelanguage", defaultMessage: "Preferred Interface Language" })} <span className="required">*</span></label>
                        </Grid>
                        <Grid item xs={7}>
                          <Select
                            id="select-institute-language"
                            {...register("preferedLanguageCodeValue")}
                            value={lang}
                            disabled={isUserProfile}
                            placeholder={intl.formatMessage({ id: "SettingsCreateUser_4.selectlanguage", defaultMessage: "Select Language" })}
                            onChange={handleLang}
                            IconComponent={ArrowDown}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            fullWidth
                          >
                            <MenuItem disabled value=" ">
                              <em>{intl.formatMessage({ id: "SettingsCreateUser_4.selectlanguage", defaultMessage: "Select Language" })}</em>
                            </MenuItem>
                            {
                              prefLanguage.map(data => (
                                  <MenuItem value={data.codeSuffix} key={data.systemCodeId} onClick={() => setSystemCodeId(data.systemCodeId)}>{data.description}</MenuItem>
                              ))
                            }
                          </Select>
                          {(lang === " " && errors.preferedLanguageCodeValue?.message) ?
                            <FormHelperText id="error-helper-text" error>
                              {validations.createUser.language}
                            </FormHelperText>
                            :
                            null
                          }
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6">{intl.formatMessage({ id: "SettingsCreateUser_4.workdetails", defaultMessage: "Work Details" })}</Typography>
                    <Divider />
                  </Grid>


                  <Grid item xs={12} lg={6} justifyContent="flex-start">
                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "SettingsCreateUser_4.defaultinstitution", defaultMessage: "Default Institution" })} <span className="required">*</span></label>
                        </Grid>
                        <Grid item xs={7}>
                          <Select
                            {...register('defaultInstitutionId')}
                            value={selectInstitutionVal}
                            onChange={handleInstitutionChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            IconComponent={() => <img src={down_arrow_icon} alt="" />}
                            fullWidth
                            disabled={isUserProfile || (!canUpdate && pathname.startsWith('/user-profile'))}
                          >
                            <MenuItem disabled value=" ">
                              <em>{intl.formatMessage({ id: "SettingsCreateUser_4.selectinstitution", defaultMessage: "Select Institution" })}</em>
                            </MenuItem>
                            {institution.map(type => (
                              <MenuItem
                                key={type.institutionId}
                                value={type.institutionId}
                              >
                                {type.institutionName}
                              </MenuItem>
                            ))}
                          </Select>
                          {/* {((!defaultInstitution || defaultInstitution === " ") && errors.instName?.message) ?
                                                    <FormHelperText id="error-helper-text" error>
                                                        {validations.createUser.institution}
                                                    </FormHelperText>
                                                    :
                                                    null
                                                } */}
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6} justifyContent="flex-start">
                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "SettingsCreateUser_4.initialstatus", defaultMessage: "Initial Status" })} <span className="required">*</span></label>
                        </Grid>
                        <Grid item xs={7}>
                          <Select
                            id="select-status"
                            {...register("status")}
                            value={status}
                            disabled={isUserProfile}
                            onChange={handleStatus}
                            IconComponent={ArrowDown}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            fullWidth
                          >
                            <MenuItem disabled value=" ">
                              <em>{intl.formatMessage({ id: "SettingsCreateUser_4.selectinitialstatus", defaultMessage: "Select Initial Status" })}</em>
                            </MenuItem>
                            <MenuItem value="0">Disable</MenuItem>
                            <MenuItem value="1">Enable</MenuItem>
                          </Select>
                          {(status === " " && errors.status?.message) ?
                            <FormHelperText id="error-helper-text" error>
                              {validations.createUser.status}
                            </FormHelperText>
                            :
                            null
                          }
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} justifyContent="flex-start">
                    <div>
                      <label>{intl.formatMessage({ id: "SettingsCreateUser_4.accesslevel", defaultMessage: "Access Level" })} </label>
                      <TableContainer sx={{ marginTop: "20px" }}>
                        <Table sx={{ minWidth: 650, maxWidth: "40%" }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell width="40%">
                                {intl.formatMessage({
                                  id: "Users.institutions",
                                  defaultMessage: "Institutions",
                                })}
                              </TableCell>
                              <TableCell align="center" width="80px">
                                {
                                  intl.formatMessage({
                                    id: "Entity.label.actions",
                                    defaultMessage: "Actions",
                                  })
                                }
                              </TableCell>
                              <TableCell className="last-column-border-header">{intl.formatMessage({
                                id: "Roles.roles",
                                defaultMessage: "Roles",
                              })}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {assignRoles.map((row, i) => (
                              pathname.startsWith('/user-profile') || id !== undefined ?
                                <TableRow key={i} >
                                  <TableCell>{row.institutionName}</TableCell>
                                  <TableCell className='role-cell'>
                                    <Checkbox
                                      icon={(
                                          pathname.startsWith('/user-profile') ?
                                            !(
                                              canUpdate &&
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "1"
                                            ) :
                                            (
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "0"
                                            )) ?
                                        <CheckBoxOutlineBlankIcon />
                                        : <img src={ic_check} alt="" />}
                                      checkedIcon={(
                                          pathname.startsWith('/user-profile') ?
                                            !(
                                              canUpdate &&
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "1"
                                            ) :
                                            (
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "0"
                                            )) ?
                                        <CheckBoxIcon />
                                        :
                                        <img src={ic_checked} alt="" />}
                                      checked={row.status ?? false}
                                      onChange={(e) => handleChangeAction(e, row.institutionId)}
                                      className={`${isUserProfile?'darker':''}`}
                                      disabled={(
                                          isUserProfile ||(
                                          pathname.startsWith('/user-profile') ?
                                            !(
                                              canUpdate &&
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "1"
                                            ) :
                                            (
                                              // loginUser?.user.userRoles.find((role: any) => role.roleName === SystemAdmin.ROLE_NAME &&
                                              //   role.instName === row.institutionName) !== undefined
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "0"
                                            )))}
                                    />
                                  </TableCell>
                                  <TableCell className="last-column-border">
                                    <FormControl fullWidth>
                                      <Select
                                        value={row.roleId ? row.roleId.toString() : selectRole}
                                        onChange={(e) => handleChangeRole(e, row.institutionId)}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Without label" }}
                                        IconComponent={ArrowDown}
                                        fullWidth
                                        disabled={(
                                          isUserProfile || (
                                            pathname.startsWith('/user-profile') ?
                                              !(
                                                canUpdate &&
                                                loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "1"
                                              ) :
                                              (
                                                // loginUser?.user.userRoles.find((role: any) => role.roleName === SystemAdmin.ROLE_NAME &&
                                                //   role.instName === row.institutionName) !== undefined
                                                // loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName) && 
                                                // loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions) &&
                                                loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "0"
                                          )))}
                                      >
                                        <MenuItem value=" ">
                                          <em>
                                            {intl.formatMessage({
                                              id: "Users.selectrole",
                                              defaultMessage: "Select Role",
                                            })}
                                          </em>
                                        </MenuItem>
                                        {roleList.map(role => (
                                          <MenuItem value={role.roleId}>{role.roleName}</MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                </TableRow>
                                :
                                loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessUpdate === "1" &&
                                <TableRow key={i}>
                                  <TableCell>{row.institutionName}</TableCell>
                                  <TableCell className='role-cell'>
                                    <Checkbox
                                      icon={(
                                          pathname.startsWith('/user-profile') ?
                                            !(
                                              canUpdate &&
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions).accessUpdate === "1"
                                            ) :
                                            (
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions).accessUpdate === "0"
                                            )) ?
                                        <CheckBoxOutlineBlankIcon />
                                        : <img src={ic_check} alt="" />}
                                      checkedIcon={(
                                          pathname.startsWith('/user-profile') ?
                                            !(
                                              canUpdate &&
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions).accessUpdate === "1"
                                            ) :
                                            (
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions).accessUpdate === "0"
                                            )) ?
                                        <CheckBoxIcon />
                                        :
                                        <img src={ic_checked} alt="" />}
                                      checked={row.status ?? false}
                                      onChange={(e) => handleChangeAction(e, row.institutionId)}
                                      disabled={(
                                          pathname.startsWith('/user-profile') ?
                                            !(
                                              canUpdate &&
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions).accessUpdate === "1"
                                            ) :
                                            (
                                              // loginUser?.user.userRoles.find((role: any) => role.roleName === SystemAdmin.ROLE_NAME &&
                                              //   role.instName === row.institutionName) !== undefined
                                              loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions).accessUpdate === "0"
                                            ))}
                                    />
                                  </TableCell>
                                  <TableCell className="last-column-border">
                                    <FormControl fullWidth>
                                      <Select
                                        value={row.roleId ? row.roleId.toString() : selectRole}
                                        onChange={(e) => handleChangeRole(e, row.institutionId)}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Without label" }}
                                        IconComponent={ArrowDown}
                                        fullWidth
                                        disabled={(
                                            pathname.startsWith('/user-profile') ?
                                              !(
                                                canUpdate &&
                                                loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions).accessUpdate === "1"
                                              ) :
                                              (
                                                // loginUser?.user.userRoles.find((role: any) => role.roleName === SystemAdmin.ROLE_NAME &&
                                                //   role.instName === row.institutionName) !== undefined
                                                // loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName) && 
                                                // loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions) &&
                                                loginUser?.user.userRoles.find((role: any) => role.instName === row.institutionName)?.roleActivities.find((act: any) => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions).accessUpdate === "0"
                                              ))}
                                      >
                                        <MenuItem value=" ">
                                          <em>
                                            {intl.formatMessage({
                                              id: "Users.selectrole",
                                              defaultMessage: "Select Role",
                                            })}
                                          </em>
                                        </MenuItem>
                                        {roleList.map(role => (
                                          <MenuItem value={role.roleId}>{role.roleName}</MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                  onClick={() => pathname.startsWith('/user-profile') ? navigate("/dashboard") : navigate(-1)}
                >
                  <FormattedMessage
                    id="Institution.cancel"
                    defaultMessage="Cancel"
                  />
                </Button>
                <Button type="submit" disableElevation variant="contained" disabled={isUserProfile || isSubmitting} >
                  <FormattedMessage
                    id="Institution.save"
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

export default UserDefinition;