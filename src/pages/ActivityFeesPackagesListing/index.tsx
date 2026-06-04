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
  Switch,
  Table,
  TableBody,
  TableSortLabel,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  InputBase
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
import { ActivityFeesPackage, ActivityFeesPackageSorted } from "../../models/configuration/ActivityFeesPackageModel";
import { Institution } from "../../models/configuration/InstitutionModel";
import { EntityListModel } from "../../models/entityManagement/EntityModel";
import { ActivityFeesPackagesService } from "../../services/configuration/activity-fee-service";
import { InstitutionService } from "../../services/configuration/institution-service";
import { EntityService } from "../../services/entityManagement/entity-service";
import { ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { visuallyHidden } from "@mui/utils";
import { MccModel } from "../../models/configuration/MccModel";
import { MccService } from "../../services/configuration/mcc-services";

const UNASSIGNED_LIST = "UNASSIGNED_LIST";
const ASSIGNED_LIST = "ASSIGNED_LIST";
const SHIFT_TO_ASSIGNED = "SHIFT_TO_ASSIGNED";
const SHIFT_TO_UNASSIGNED = "SHIFT_TO_UNASSIGNED";

function ActivityFeesPackagesListing() {
  const navigate = useNavigate();
  const intl = useIntl();
  const [activityFeesPackageList, setActivityFeesPackageList] = React.useState<
    ActivityFeesPackage[]
  >([]);
  const [institutionList, setInstitutionList] = React.useState<Institution[]>(
    []
  );
  const [unAssignedEntityList, setUnAssignedEntityList] = React.useState<EntityListModel[]>([]);
  const [assignedEntityList, setAssignedEntityList] = React.useState<EntityListModel[]>([]);
  const [unAssignedCheckedEntityList, setUnAssignedCheckedEntityList] = React.useState<EntityListModel[]>([]);
  const [assignedCheckedEntityList, setAssignedCheckedEntityList] = React.useState<EntityListModel[]>([]);
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [selectedPackageId, setSelectedPackageId] = React.useState<number>();
  const [fieldKey, setFieldKey] = React.useState<number>(0);
  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.ACT_FEE_PKG), []);
  const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.ACT_FEE_PKG, 'ACTPKCRT');
  const canUpdate = perms.accessUpdate === "1";
  const canDelete = perms.accessDelete === "1";
  const canView = perms.accessView === "1";
  const canLoadInstitutions = hasApiAccess(ConfigurationActivities.ACT_FEE_PKG, 'GAAINST');
  const canLoadCurrencies = hasApiAccess(ConfigurationActivities.ACT_FEE_PKG, 'GACURRENCY');
  const canLoadCardSchemes = hasApiAccess(ConfigurationActivities.ACT_FEE_PKG, 'GACSSCHEME');

  const [mccList, setMccList] = React.useState<MccModel[]>([]);
  const [selectMcc, setSelectMcc] = React.useState("");
  const [entityId, setEntityId] = React.useState("");
  const [entityName, setEntityName] = React.useState("");
  const [parentId, setParentId] = React.useState("");

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof ActivityFeesPackageSorted>('packageId');

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
    property: keyof ActivityFeesPackageSorted
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /* END (sort table data) */

  const handleChange = (event: SelectChangeEvent) => {
    setSelectInstitutionVal(event.target.value);
    const selectedInstitutionId =
      event.target.value !== ""
        ? event.target.value
        : institutionList[0].institutionId;
    getActivityByInstitutionId(selectedInstitutionId);
  };

  const getActivityByInstitutionId = async (id: string) => {
    await ActivityFeesPackagesService.getActivityByInstitutionId(id)
      .then((res) => {
        setActivityFeesPackageList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  React.useEffect(() => {
    // getAllActivityFeePackagesList();

    const setInstitutefromLocalStorage = async () => {
      const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
      if (instID) {
        setSelectInstitutionVal(instID);
        getActivityByInstitutionId(instID);
        // getActiveEntities(instID)
      }
    };
    getAllInstitutionList();
    setInstitutefromLocalStorage();

  }, []);

  const getAllInstitutionList = async () => {
    if (!canLoadInstitutions) return;
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitutionList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const editHandler = async (id: number) => {
    navigate(`/activity-fees-packages-definition/${id}`, { state: { institutionId: selectInstitutionVal } });
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
        ActivityFeesPackagesService.deleteActivityFeePackage(id).then((res) => {
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
          getActivityByInstitutionId(selectInstitutionVal);
        }).catch(err => {
          if (err && err.response 
          //  && err.response.data === Errors.ReferenceExists
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

  const changeStatus = async (id: number, IdString: string,event: any) => {
    const model = {
      idString: IdString,
      id: id,
      status: event.target.checked === true ? "1" : "0",
    };
    ActivityFeesPackagesService.changeStatus(model)
      .then((res) => {
        // getAllActivityFeePackagesList();
        getActivityByInstitutionId(selectInstitutionVal);
        toast.success(res.data+"")
        
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id: string, recordSeqId: number) => {
    getActiveEntities(selectInstitutionVal, id);
    setAssignedCheckedEntityList([]);
    setUnAssignedCheckedEntityList([]);
    setSelectedPackageId(recordSeqId);
    getAllActiveMccs();
    setOpen(true);
  };

  const getActiveEntities = async (instID: string, packageId: string) => {
    await EntityService.getByInstitutionId(instID)
      .then((res) => {
        setUnAssignedEntityList(res?.data);
        getAllMappedEntities(packageId, res?.data)
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllMappedEntities = async (id: string, unAssignedEntities: EntityListModel[]) => {
    let assignedEntities: EntityListModel[] = [];
    await ActivityFeesPackagesService.getAllMappedEntities(id,selectInstitutionVal).then(res => {
      setAssignedEntityList(res.data);
      assignedEntities.push(...res.data)
    })
    setMappedEntitiesList(assignedEntities, unAssignedEntities)
  }

  const setMappedEntitiesList = (assignedEntities: EntityListModel[], unAssignedEntities: EntityListModel[]) => {
    assignedEntities && assignedEntities.length > 0 && assignedEntities.map((entity) => {
      unAssignedEntities = unAssignedEntities.filter((item) => item.entityId !== entity.entityId);
    })
    setUnAssignedEntityList(unAssignedEntities)
  }

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
  const getEntitiesBySearchCriteriaEmpty= async () => {
    const model = {
        entityId: '',
        entityName: '',
        institutionId: selectInstitutionVal,
        mcc: '',
        parentId: ''
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
      id: selectedPackageId,
      instId:selectInstitutionVal
    }
    ActivityFeesPackagesService.mapPackageWithEntity(model).then(res => {
      if (res.status === StatusCode.Success) {
        toast.success("Entities assignment/unassignment is successful.");
        handleClose()
      }
    }).catch(err =>   toast.error(err.response.data.errors[0]))
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


  return (
    <div className="wrapper">
      <main className="main-content">
        <div className="main-card">
          <div className="title-block">
            <div className="left-block">
              <Typography variant={"h2"}>
                {intl.formatMessage({
                  id: "ActivityFeesPackage.title",
                  defaultMessage: "Activity Fees Packages",
                })}
              </Typography>
              <p className="pb-0">
                {intl.formatMessage({
                  id: "ActivityFeesPackage.subTitle",
                  defaultMessage: "List of defined Activity Fees Packages",
                })}
              </p>
            </div>
            <div className="right-block">
              <Button
                variant="contained"
                disableElevation
                className="btn-light"
                endIcon={<img src={add_rounded} alt="add" />}
                onClick={() => navigate("/activity-fees-packages-definition", { state: { institutionId: selectInstitutionVal } })}
                disabled={!canAdd}
              >
                <FormattedMessage
                  id="ActivityFeesPackage.addPackage"
                  defaultMessage="Add Package"
                />
              </Button>
            </div>
          </div>
          <Grid spacing={3} container>
            <Grid item xs={12} lg={4} sm={6} xl={4}>
              <div className="input-with-label form-group">
                <label>
                  {intl.formatMessage({
                    id: "ActivityFeesPackage.institution",
                    defaultMessage: "Institution",
                  })}
                </label>
                <FormControl fullWidth>
                  <Select
                    value={selectInstitutionVal}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                  >
                    {institutionList &&
                      institutionList.map((ins: Institution, i: number) => (
                        <MenuItem value={ins?.institutionId} key={i}>
                          {ins?.institutionName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </Grid>
          </Grid>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width="30%">
                    <TableSortLabel
                      active={orderBy === 'packageId'}
                      direction={orderBy === 'packageId' ? order : 'asc'}
                      onClick={() => createSortHandler("packageId")}
                    >
                      {
                        intl.formatMessage({
                          id: "ActivityFeesPackageDefinition.packageId",
                          defaultMessage: "Package ID"
                        })
                      }
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell width="30%">
                    <TableSortLabel
                      active={orderBy === 'packageName'}
                      direction={orderBy === 'packageName' ? order : 'asc'}
                      onClick={() => createSortHandler("packageName")}
                    >
                      {
                        intl.formatMessage({
                          id: "ActivityFeesPackageDefinition.packageName",
                          defaultMessage: "Package Name"
                        })
                      }
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" width="190px" className="last-column-border-header">
                    {intl.formatMessage({
                      id: "ActivityFeesPackageDefinition.actions",
                      defaultMessage: "Actions",
                    })}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {activityFeesPackageList.sort(getComparator(order, orderBy)).map((row, i) => (
                  <TableRow key={i}>
                    <TableCell width="30%">{row.packageId}</TableCell>
                    <TableCell width="30%">{row.packageName}</TableCell>
                    <TableCell align="center" width="190px" className="last-column-border">
                      <div className="action btns-block">
                        {
                          row.status === "1" ? (
                            <Button
                              variant="contained"
                              disableElevation
                              disabled={!canUpdate}
                              className="btn-light sm rounded"
                              onClick={() => handleClickOpen(row.packageId, row.recordSeqId)}
                            >
                              {intl.formatMessage({
                                id: "ActivityFeesPackage.assignUnAssign",
                                defaultMessage: "Assign/UnAssign",
                              })}

                            </Button>
                          ) : <span style={{ paddingRight: "46%" }}></span>
                        }

                        <Switch
                          className="custom"
                          checked={row.status === "1" ? true : false}
                          onChange={(e) => changeStatus(row.recordSeqId,row.packageId, e)}
                          disabled={!canUpdate}
                        />
                        <IconButton
                          className="border-icon-btn no-border sm"
                          onClick={() => editHandler(row.recordSeqId)}
                          disabled={!canUpdate}
                        >
                          <img src={edit_ic} alt="edit-btn" />
                        </IconButton>
                        <IconButton
                          className="border-icon-btn no-border sm"
                          onClick={() => onDelete(row.recordSeqId)}
                          disabled={!canDelete}
                        >
                          <img src={delete_ic} alt="delete-btn" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {activityFeesPackageList &&
                  activityFeesPackageList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="last-column-border">
                        <p style={{ textAlign: "center" }}>
                          {intl.formatMessage({
                            id: "ActivityFeesPackageDefinition.noDataFound",
                            defaultMessage: "No Data Found.",
                          })}</p>
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
                  id: "ActivityFeesPackage.assignUnAssign.title",
                  defaultMessage: "Assigning Package to Entities",
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
                    onClick={() => {
                      handleClear();
                      getEntitiesBySearchCriteriaEmpty() 
                    }}
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

export default ActivityFeesPackagesListing;
