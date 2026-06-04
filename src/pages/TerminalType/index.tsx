import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputBase, SelectChangeEvent,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  add_rounded,
  delete_ic, edit_ic
} from "../../assets/images";
import { TerminalTypeModel } from "../../models/configuration/TerminalTypeModel";
import { TerminalTypeService } from "../../services/configuration/terminal-type-service";
import { ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import validations from "../../utils/validations";

function TerminalType() {
  const [open, setOpen] = React.useState(false);
  const [terminalTypes, setTerminalTypes] = React.useState<TerminalTypeModel[]>(
    []
  );
  const [terminalTypeDetails, setTerminalTypeDetails] =
    React.useState<TerminalTypeModel>(new TerminalTypeModel());
  const [editedId, setEditedId] = useState<number | undefined>(0);
  const [enable, setEnable] = useState(true);
  // const [addNew, setAddNew] = useState(true);
    const intl = useIntl();

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.TERM_TYPE), []);
    const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.TERM_TYPE, 'TRMTPCRT');
    const canUpdate = perms.accessUpdate === "1";
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.TERM_TYPE, 'TRMTPDEL');
    const canView = perms.accessView === "1";
    const canLoadAllTerminalTypes = hasApiAccess(ConfigurationActivities.TERM_TYPE, 'TRMTPGET');

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<TerminalTypeModel>({
    mode: "onChange",
    resolver: yupResolver(validations.createTerminalTypeValidations),
  });

  const handleClickOpen = (isEdit: boolean) => {
    if (!isEdit) {
      setEnable(true);
      handleReset();
    }
    setOpen(true);
    clearErrors();
  };

  const handleReset = (): void => {
    reset(new TerminalTypeModel());
    setTerminalTypeDetails(new TerminalTypeModel());
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectVal, setSelectVal] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectVal(event.target.value);
  };

  useEffect(() => {
    getAllTerminalType();
  }, []);

  const getAllTerminalType = async () => {
    if (!canLoadAllTerminalTypes) return;
    await TerminalTypeService.getAll()
      .then((res) => {
        setTerminalTypes([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const onSubmit = async (value: TerminalTypeModel) => {
    const model = {
      ...value,
      status: enable ? "1" : "0",
    };
    TerminalTypeService.saveOrUpdate(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if (editedId) {
            toast.success(`Terminal Type details updated successfully`);
          } else {
            toast.success("Terminal Type record added successfully");
          }
        }
        handleClose();
        getAllTerminalType();
      })
      .catch((err) => {
        if (
          err &&
          err.response
          //  &&
          // err.response.data === Errors.ReferenceExists
      ) {
          Swal.fire({
              title: intl.formatMessage({
                  id: "EditAlert.EditError.title",
                  defaultMessage: "Cannot be updated!",
              }),
              text: intl.formatMessage({
                  id: "DeleteAlert.DeleteError.referenceExist",
                  defaultMessage:err.response.data.errors[0],
              }),
              icon: "error",
              confirmButtonText: intl.formatMessage({
                  id: "DeleteAlert.okButtonText",
                  defaultMessage: "OK",
              }),
          });
        }
        else if (err?.response.data) {
          toast.error(err.response.data.errors[0])
        } else {
            toast.error(err.response.data.errors[0])
        }
      });
  };

  const editTerminalType = async (id: number | undefined) => {
    handleClickOpen(true);
    //setAddNew(false);
    setEditedId(id);
    getTerminalTypeById(id);
  };

  const getTerminalTypeById = async (id: number | undefined) => {
    TerminalTypeService.getById(Number(id))
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        reset(data);
        setTerminalTypeDetails(data);
        setEnable(data.status === "1" ? true : false);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const changeStatus = async (id: number, event: any) => {
    const model = {
      id: id,
      status: event.target.checked === true ? "1" : "0",
    };
    TerminalTypeService.changeStatus(model)
      .then((res) => {
        getAllTerminalType();
        toast.success(res.data+"")
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
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
        TerminalTypeService.deleteById(id).then((res) => {
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
          getAllTerminalType();
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

  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "TerminalTypes.title",
                    defaultMessage: "Terminal Type",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "TerminalTypes.subTitle",
                    defaultMessage: "List of all Terminal types",
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
                    id="TerminalTypes.addBtn"
                    defaultMessage="Add Type"
                  />
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {intl.formatMessage({
                        id: "TerminalType.terminalType",
                        defaultMessage: "Terminal Type",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "TerminalType.makeName",
                        defaultMessage: "Make Name",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "TerminalType.makeModel",
                        defaultMessage: "Make Model",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "TerminalType.capabilities",
                        defaultMessage: "Capabilities",
                      })}
                    </TableCell>
                    <TableCell align="center" width="190px" className="last-column-border-header">
                      {intl.formatMessage({
                        id: "TerminalType.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {terminalTypes && terminalTypes.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.terminalType}</TableCell>
                      <TableCell>{row.makeName}</TableCell>
                      <TableCell>{row.makeModel}</TableCell>
                      <TableCell>{row.posCapability}</TableCell>
                      <TableCell align="center" width="190px" className="last-column-border">
                        <div className="action btns-block">
                                  <Switch
                                      className="custom"
                                      checked={row.status === "1" ? true : false}
                                      onChange={(e) =>
                                          changeStatus(row.terminalTypesId, e)
                                      }
                                      disabled={!canUpdate}
                                  />
                                  <IconButton
                                      className="border-icon-btn no-border sm"
                                      onClick={() =>
                                          editTerminalType(row.terminalTypesId)
                                      }
                                      disabled={!canUpdate}
                                  >
                                      <img src={edit_ic} alt="mail" />
                                  </IconButton>
                                  <IconButton
                                      className="border-icon-btn no-border sm"
                                      onClick={() => onDelete(row.terminalTypesId)}
                                      disabled={!canDelete}
                                  >
                                      <img src={delete_ic} alt="mail" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {terminalTypes &&
                    terminalTypes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={13} className="last-column-border">
                          <p style={{ textAlign: "center" }}>
                            {intl.formatMessage({
                              id: "TerminalType.noDataFound",
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle component={"div"}>
              <div className="title-block mb-0">
                <div className="left-block mb-0">
                  <Typography variant={"h2"}>
                    {intl.formatMessage({
                      id: "TerminalType.definitionTitle",
                      defaultMessage: "Terminal Type Definition",
                    })}
                  </Typography>
                  <p className="pb-0">
                    {intl.formatMessage({
                      id: "TerminalType.definitionSubTitle",
                      defaultMessage: "Add or Update Terminal Type",
                    })}
                  </p>
                </div>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="inner-card">
                <Grid spacing={3} container>
                  <Grid item xs={12} lg={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "TerminalType.enterTerminalType",
                          defaultMessage: "Terminal Type",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "TerminalType.enterTerminalTypePlaceholder",
                            defaultMessage: "Write Terminal Type Name",
                          })}
                          error
                          fullWidth
                          id="terminalType"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("terminalType")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.terminalType?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "TerminalType.enterMakeModel",
                          defaultMessage: "Make Model",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "TerminalType.enterMakeModelPlaceholder",
                            defaultMessage: "Write Make Model",
                          })}
                          error
                          fullWidth
                          id="makeModel"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("makeModel")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.makeModel?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "TerminalType.enterMakeName",
                          defaultMessage: "Make Name",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "TerminalType.enterMakeNamePlaceholder",
                            defaultMessage: "Write Make Name",
                          })}
                          error
                          fullWidth
                          id="makeName"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("makeName")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.makeName?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className="input-with-label mb-0 center">
                      <label className="center">
                        {intl.formatMessage({
                          id: "TerminalType.enabledisable",
                            defaultMessage: "Disable/Enable",
                        })}
                      </label>
                      <Switch
                        className="custom"
                        checked={enable}
                        onChange={() => setEnable(!enable)}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "TerminalType.enterCapabilities",
                          defaultMessage: "Capabilities",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "TerminalType.enterCapabilitiesPlaceholder",
                            defaultMessage: "Write Capabilities",
                          })}
                          error
                          fullWidth
                          id="posCapability"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("posCapability")}
                          multiline
                          rows={2}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.posCapability?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "TerminalType.enterDescription",
                          defaultMessage: "Description",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "TerminalType.enterDescriptionPlaceholder",
                            defaultMessage: "Write Description",
                          })}
                          error
                          fullWidth
                          id="freeText"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("freeText")}
                          multiline
                          rows={2}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.freeText?.message}
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
                  id="TerminalType.cancel"
                  defaultMessage="Cancel"
                />
              </Button>
              <Button type="submit" disableElevation variant="contained">
                <FormattedMessage
                  id="TerminalType.save"
                  defaultMessage="Save"
                />
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
}

export default TerminalType;
