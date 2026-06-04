import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, Divider, FormControl, FormHelperText, Grid, InputBase, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import {useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { ic_check, ic_checked } from '../../assets/images';
import { Activity, ActivityAPI, RoleMainModel, RoleModel } from '../../models/security/RoleModel';
import { ActivityService, RoleService } from '../../services/security/role-service';
import { allowAlphaNumeric, allowOnlyCharacters } from '../../utils/commonfunction';
import { ConfigurationActivities, StatusCode } from '../../utils/constant';
import { getActivityPermissions, hasApiAccess } from '../../utils/permissionUtils';
import validations from '../../utils/validations';

const RoleDefinition = () => {
    const { id } = useParams<{ id?: string }>();
    const intl = useIntl();
    const navigate = useNavigate();
    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.MNGROLES), []);
    const canAdd    = perms.accessAdd    === "1" && hasApiAccess(ConfigurationActivities.MNGROLES, 'SAVEROLE');
    const canUpdate = perms.accessUpdate === "1" && hasApiAccess(ConfigurationActivities.MNGROLES, 'SAVEROLE');
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.MNGROLES, 'DELETEROLE');
    const canView = perms.accessView === "1";

    const [enabled, setEnabled] = useState<boolean>(true);
    const [assignprivilege, setAssignprivilege] = useState<Activity[]>([]);
    const [isSystemAdminRole, setIsSystemAdminRole] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RoleMainModel>(
        {
            mode: "onChange",
            resolver: yupResolver(validations.createRoleValidations)
        }
    );

    useEffect(() => {
        if (id === undefined) {
            getActivityList();
        }
    }, []);

    useEffect(() => {
        if (id) {
            getRoleById();
        }
    }, [id, reset]);
    

    const getRoleById = () => {
        RoleService.getRoleById(Number(id)).then(res => {
            reset(res.data);
            setEnabled(res.data?.status === "1" ? true : false);
            setIsSystemAdminRole(res.data?.isSystemAdminRole);
            let privilege: Activity[] = [];
            res.data?.roleActivities.forEach(act => privilege.push({
                accessAdd: act.accessAdd as string,
                accessDelete: act.accessDelete as string,
                accessChecker: act.accessChecker as string,
                accessUpdate: act.accessUpdate as string,
                accessView: act.accessView as string,
                activityApi: act.activity?.activityApi as ActivityAPI[],
                activityCode: act.activity?.activityCode as string,
                activityDesc: act.activity?.activityDesc as string,
                activityId: act.activity?.activityId as number,
                activityMode: act.activity?.activityMode as string,
                activityType: act.activity?.activityType as string,
                hasScreen: act.activity?.hasScreen as string,
                instId: act.activity?.instId as number,
                instName: act.activity?.instName as string,
                isMenu: act.activity?.isMenu as string
            }));
            setAssignprivilege([...privilege]);
        })
    }

    const getActivityList = () => {
        ActivityService.getAllActivities().then(res => {
            const withChecker = res.data.map((act: any) => ({ ...act, accessChecker: act.accessChecker ?? "0" }));
            setAssignprivilege([...withChecker]);
        })
    }

    const changeAssignPrivilege = (activityId: number, accessType: string) => {
        let Privilege = [...assignprivilege];
        let index = Privilege.findIndex(data => data.activityId === activityId);
        if (accessType === 'accessView') {
            Privilege[index].accessView = Privilege[index].accessView === '1' ? '0' : '1';
            if(Privilege[index].accessView === '0'){
                Privilege[index].accessAdd = "0";
                Privilege[index].accessUpdate = "0";
                Privilege[index].accessDelete = "0";
                Privilege[index].accessChecker = "0";
            }
        } else if (accessType === 'accessAdd') {
            Privilege[index].accessAdd = Privilege[index].accessAdd === '1' ? '0' : '1';
            if(Privilege[index].accessAdd === '1'){
                Privilege[index].accessView = "1";
            }
        } else if (accessType === 'accessUpdate') {
            Privilege[index].accessUpdate = Privilege[index].accessUpdate === '1' ? '0' : '1';
            if(Privilege[index].accessUpdate === '1'){
                Privilege[index].accessView = "1";
            }
            
        } else if (accessType === 'accessDelete') {
            Privilege[index].accessDelete = Privilege[index].accessDelete === '1' ? '0' : '1';
            if(Privilege[index].accessDelete === '1'){
                Privilege[index].accessView = "1";
            }
        } else if (accessType === 'accessChecker') {
            Privilege[index].accessChecker = Privilege[index].accessChecker === '1' ? '0' : '1';
            if (Privilege[index].accessChecker === '1') {
                Privilege[index].accessView = "1";
            }
        }

        setAssignprivilege([...Privilege]);
    }

    const onSubmit = (values: RoleMainModel) => {
        if(!isSystemAdminRole){
            let model: RoleMainModel = { ...values, status: enabled === true ? '1' : '0', roleActivities: assignprivilege };

            RoleService.saveRole(model).then(res => {
                if (res.status === StatusCode.Success) {
                    if (id) {
                        toast.success('Role details updated successfully');
                    } else {
                        toast.success("Role record added successfully");
                    }
                    navigate(-1);
                }
            }).catch(err =>toast.error(err.response.data.errors[0]));
        }
    }

    return (
        <>
            <div className="wrapper">
                <main className="main-content">
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>
                                    {id ?
                                        intl.formatMessage({
                                            id: "Roles.updaterole",
                                            defaultMessage: "Update Role",
                                        })
                                        :
                                        intl.formatMessage({
                                            id: "Roles.createrole",
                                            defaultMessage: "Create Role",
                                        })
                                    }
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "Roles.add/edituserroleeasyhere",
                                        defaultMessage: "Add/Edit User Role easy here",
                                    })}
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className="inner-card user-subtitles">

                                <Typography variant="h6">{intl.formatMessage({ id: "SettingsSecurityCreateRole_4.roledetails", defaultMessage: "Role Details" })}</Typography>
                                <Divider />
                                <Grid container spacing={3}>
                                    <Grid item lg={4} md={6} sm={12} justifyContent="flex-start" >
                                        <FormControl>
                                            <Grid container spacing={3} alignItems="center">
                                                <Grid item xs={5}><label className="label align-label">{intl.formatMessage({ id: "Roles.rolename", defaultMessage: "Role Name" })} <span className="required">*</span></label></Grid>
                                                <Grid item xs={7}> <InputBase placeholder={intl.formatMessage({ id: "SettingsSecurityCreateRole_4.enterrolename", defaultMessage: "Enter Role Name" })}
                                                    id="rolename"
                                                    fullWidth
                                                    disabled = {isSystemAdminRole}
                                                    {...register("roleName")}
                                                    onKeyPress={allowOnlyCharacters}
                                                    autoComplete="off" />
                                                    <FormHelperText id="error-helper-text" error>
                                                        {errors.roleName?.message}
                                                    </FormHelperText>
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={12} justifyContent="flex-start" >
                                        <FormControl >
                                            <Grid container spacing={3} alignItems="baseline">
                                                <Grid item xs={5} > <label>{intl.formatMessage({ id: "SettingsSecurityCreateRole_4.roledescriptions", defaultMessage: "Role Description" })}</label><span className="required">*</span></Grid>
                                                <Grid item xs={7}>  <InputBase placeholder={intl.formatMessage({ id: "SettingsSecurityCreateRole_4.yourdescription", defaultMessage: "Your Description" })}
                                                    id="roledescription"
                                                    disabled = {isSystemAdminRole}
                                                    rows={3}
                                                    multiline
                                                    fullWidth
                                                    {...register("roleDesc")}
                                                    onKeyPress={allowAlphaNumeric}
                                                    className="textarea"
                                                    autoComplete="off" />
                                                    <FormHelperText id="error-helper-text" error>
                                                                {errors.roleDesc?.message}
                                                     </FormHelperText> 
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={12} justifyContent="flex-start" alignSelf="baseline">
                                        <FormControl>
                                            <Grid container spacing={3} alignItems="baseline">
                                                <Grid item xs={5} > <label>{intl.formatMessage({ id: "SettingsSecurityCreateRole_4.enabled", defaultMessage: "Enabled" })}</label></Grid>
                                                <Grid item xs={7}> <div className="switch" style={{ display: 'flex' }}>
                                                    <Typography>{intl.formatMessage({ id: "SettingsSecurityCreateRole_4.no", defaultMessage: "No" })}</Typography>
                                                    <Switch className="custom" {...register("status")} checked={enabled} disabled = {isSystemAdminRole} onChange={(e) => setEnabled(e.target.checked)} />
                                                    <Typography>{intl.formatMessage({ id: "SettingsSecurityCreateRole_4.yes", defaultMessage: "Yes" })}</Typography>
                                                </div>
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">{intl.formatMessage({ id: "SettingsSecurityCreateRole_4.assignprivilege", defaultMessage: "Assign Privilege" })}</Typography>
                                        <Divider />
                                    </Grid>

                                    {/* <Grid container columnSpacing={{ xl: 15, lg: 6, xs: 5 }} rowSpacing={5} className="privilage-table" style={{ paddingBottom: "0" }}> */}
                                    <Grid item lg={3} md={6} xs={12} justifyContent="flex-start">
                                        <Box>
                                            <TableContainer className='role-table' sx={{ width: "88%", margin: "0 auto", height: "280px" }}>
                                                <Table stickyHeader sx={{ minWidth: "312px" }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell width="165px" className='header-main' align="left">
                                                                {intl.formatMessage({
                                                                    id: "Sidemenu.systemConfiguration",
                                                                    defaultMessage: "System Configuration",
                                                                })}
                                                            </TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.view",
                                                                defaultMessage: "View",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.add",
                                                                defaultMessage: "Add",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.edit",
                                                                defaultMessage: "Edit",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.delete",
                                                                defaultMessage: "Delete",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.checker",
                                                                defaultMessage: "Checker",
                                                            })}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {assignprivilege.filter(row => row.activityType === '1').map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className='col-1' align='left'>{row.activityDesc}</TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessView === '1'}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessView')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessAdd === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessAdd')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessUpdate === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessUpdate')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessDelete === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessDelete')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled={isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessChecker === '1'}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessChecker')}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={3} md={6} xs={12} justifyContent="flex-start">
                                        <Box>
                                            <TableContainer className='role-table' sx={{ width: "88%", margin: "0 auto", height: "280px" }}>
                                                <Table stickyHeader sx={{ minWidth: "312px" }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell width="165px" className='header-main' align="left">
                                                                {intl.formatMessage({
                                                                    id: "Sidemenu.institutionConfiguration",
                                                                    defaultMessage: "Instituion Configuration",
                                                                })}
                                                            </TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.view",
                                                                defaultMessage: "View",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.add",
                                                                defaultMessage: "Add",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.edit",
                                                                defaultMessage: "Edit",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.delete",
                                                                defaultMessage: "Delete",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.checker",
                                                                defaultMessage: "Checker",
                                                            })}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {assignprivilege.filter(row => row.activityType === '2').map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className='col-1' align='left'>{row.activityDesc}</TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessView === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessView')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessAdd === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessAdd')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessUpdate === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessUpdate')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessDelete === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessDelete')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled={isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessChecker === '1'}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessChecker')}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={3} md={6} xs={12} justifyContent="flex-start">
                                        <Box>
                                            <TableContainer className='role-table' sx={{ width: "88%", margin: "0 auto", height: "280px" }}>
                                                <Table stickyHeader sx={{ minWidth: "312px" }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell width="165px" className='header-main' align="left">
                                                                {intl.formatMessage({
                                                                    id: "Sidemenu.transactionManagement",
                                                                    defaultMessage: "Transaction Management",
                                                                })}
                                                            </TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.view",
                                                                defaultMessage: "View",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.add",
                                                                defaultMessage: "Add",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.edit",
                                                                defaultMessage: "Edit",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.delete",
                                                                defaultMessage: "Delete",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.checker",
                                                                defaultMessage: "Checker",
                                                            })}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {assignprivilege.filter(row => row.activityType === '3').map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className='col-1' align='left'>{row.activityDesc}</TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessView === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessView')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessAdd === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessAdd')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessUpdate === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessUpdate')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessDelete === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessDelete')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled={isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessChecker === '1'}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessChecker')}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={3} md={6} xs={12} justifyContent="flex-start">
                                        <Box>
                                            <TableContainer className='role-table' sx={{ width: "88%", margin: "0 auto", height: "280px" }}>
                                                <Table stickyHeader sx={{ minWidth: "312px" }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell width="165px" className='header-main' align="left">
                                                                {intl.formatMessage({
                                                                    id: "Sidemenu.security",
                                                                    defaultMessage: "Security",
                                                                })}
                                                            </TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.view",
                                                                defaultMessage: "View",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.add",
                                                                defaultMessage: "Add",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.edit",
                                                                defaultMessage: "Edit",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.delete",
                                                                defaultMessage: "Delete",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.checker",
                                                                defaultMessage: "Checker",
                                                            })}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {assignprivilege.filter(row => row.activityType === '4').map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className='col-1' align='left'>{row.activityDesc}</TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessView === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessView')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessAdd === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessAdd')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessUpdate === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessUpdate')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessDelete === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessDelete')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled={isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessChecker === '1'}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessChecker')}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={3} md={6} xs={12} justifyContent="flex-start">
                                        <Box>
                                            <TableContainer className='role-table' sx={{ width: "88%", margin: "0 auto", height: "280px" }}>
                                                <Table stickyHeader sx={{ minWidth: "312px" }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell width="165px" className='header-main' align="left">
                                                                {intl.formatMessage({
                                                                    id: "Sidemenu.accountingTemplate",
                                                                    defaultMessage: "Accounting Template",
                                                                })}
                                                            </TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.view",
                                                                defaultMessage: "View",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.add",
                                                                defaultMessage: "Add",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.edit",
                                                                defaultMessage: "Edit",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.delete",
                                                                defaultMessage: "Delete",
                                                            })}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {assignprivilege.filter(row => row.activityType === '5').map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className='col-1' align='left'>{row.activityDesc}</TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessView === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessView')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessAdd === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessAdd')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessUpdate === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessUpdate')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessDelete === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessDelete')}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={3} md={6} xs={12} justifyContent="flex-start">
                                        <Box>
                                            <TableContainer className='role-table' sx={{ width: "88%", margin: "0 auto", height: "280px" }}>
                                                <Table stickyHeader sx={{ minWidth: "312px" }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell width="165px" className='header-main' align="left">
                                                                {intl.formatMessage({
                                                                    id: "Sidemenu.jobs",
                                                                    defaultMessage: "Jobs",
                                                                })}
                                                            </TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.view",
                                                                defaultMessage: "View",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.add",
                                                                defaultMessage: "Add",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.edit",
                                                                defaultMessage: "Edit",
                                                            })}</TableCell>
                                                            <TableCell align="center" width="40px">{intl.formatMessage({
                                                                id: "Roles.delete",
                                                                defaultMessage: "Delete",
                                                            })}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {assignprivilege.filter(row => row.activityType === '6').map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className='col-1' align='left'>{row.activityDesc}</TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessView === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessView')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessAdd === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessAdd')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessUpdate === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessUpdate')}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='role-cell'>
                                                                    <Checkbox
                                                                        icon={<img src={ic_check} alt="" />}
                                                                        disabled = {isSystemAdminRole}
                                                                        checkedIcon={<img src={ic_checked} alt="" />}
                                                                        checked={row.accessDelete === '1' ? true : false}
                                                                        onChange={() => changeAssignPrivilege(row.activityId, 'accessDelete')}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {/* </Grid> */}
                            </div>
                            <div className="btns-block right">
                                <Button
                                    disableElevation
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    <FormattedMessage
                                        id="Institution.cancel"
                                        defaultMessage="Cancel"
                                    />
                                </Button>
                                <Button type="submit" disableElevation variant="contained" disabled={isSubmitting || isSystemAdminRole}>
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
    )
}

export default RoleDefinition