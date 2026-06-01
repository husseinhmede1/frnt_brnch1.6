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
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  add_rounded,
  delete_ic,
  down_arrow_icon,
  edit_ic
} from "../../assets/images";
import {
  CurrencyConversionGridModel, CurrencyConversionModel
} from "../../models/configuration/CurrencyConversionModels";
import { Institution } from "../../models/configuration/InstitutionModel";
import { CurrencyConversionService } from "../../services/configuration/currency-conversion-service";
import { CurrencyService } from "../../services/configuration/currency-service";
import { InstitutionService } from "../../services/configuration/institution-service";

import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";
import { getActivityPermissions } from "../../utils/permissionUtils";

function CurrencyConversion() {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const [institution, setInstitution] = useState<Institution[]>([]);
  const [currencyConversion, setCurrencyConversion] =
    useState<CurrencyConversionModel>(new CurrencyConversionModel());
  const [currencyConversionGrid, setcurrencyConversionGrid] = useState<
    CurrencyConversionGridModel[]
  >([]);
  const [currencies, setCurrencies] = useState<CurrencyModel[]>([]);
    const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.CRNCY_CONV), []);
    const canAdd = perms.accessAdd === "1";
    const canUpdate = perms.accessUpdate === "1";
    const canDelete = perms.accessDelete === "1";
    const canView = perms.accessView === "1";

  const handleClickOpen = (isEdited: boolean) => {
    if (!isEdited) {
      handleReset();
    }
    setOpen(true);
    clearErrors();
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getActiveInstitution();
    getActiveCurrencies();
    setInstitutefromLocalStorage();
  }, []);

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
      getCurrencyConversionByInstitutionId(instID);
    }
  }

  const {
    register,
    reset,
    handleSubmit,
      clearErrors,
      formState: { errors, isSubmitting },
  } = useForm<CurrencyConversionModel>({
    mode: "onChange",
    resolver: yupResolver(validations.currencyConversionValidation),
  });

  const handleReset = (): void => {
    reset(new CurrencyConversionModel());
    setCurrencyConversion(new CurrencyConversionModel());
  };

  const getActiveInstitution = async () => {
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitution([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getActiveCurrencies = async () => {
    await CurrencyService.getActiveCurrencies()
      .then((res) => {
        setCurrencies([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };


  const getCurrencyConversionByInstitutionId = async (id: string) => {
    await CurrencyConversionService.getCurrencyConversionByInstitutionId(id)
      .then((res) => {
        setcurrencyConversionGrid([...res.data]);
      }).catch(err =>   toast.error(err.response.data.errors[0]));
  }

  const editCurrencyConversion = (currencyConversionId: number) => {
    CurrencyConversionService.getCurrencyConversionById(
      currencyConversionId
    ).then((res) => {
      reset(res.data);
      setCurrencyConversion(res.data);
      // setOpen(true);
      handleClickOpen(true);
    });
  };

  const onDelete = (value: CurrencyConversionGridModel) => {
    const model = {
      ...value,
      currencyConversionId: Number(value.currencyConversionId),
      institutionId: selectInstitutionVal,
    }
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
        CurrencyConversionService.deleteCurrencyConversion(model.currencyConversionId).then((res) => {
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
          getCurrencyConversionByInstitutionId(model.institutionId);
        }).catch(err => {
          if (err && err.response
             //&& err.response.data === Errors.ReferenceExists
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

  const onSubmit = async (values: CurrencyConversionModel) => {
    let model = {
      ...values,
      currencyConversionId: currencyConversion.currencyConversionId,
      institutionId: selectInstitutionVal,
    };
    await CurrencyConversionService.saveOrUpdateCurrencyConversion(model).then(
      (res) => {
        if (currencyConversion.currencyConversionId) {
          toast.success(`Currency Conversion details updated successfully`);
        } else {
          toast.success("Currency Conversion record added successfully");
        }
        getCurrencyConversionByInstitutionId(model.institutionId);
            handleClose();
      },
      (err) =>{
          toast.error(err.response.data.errors[0])
      }
    );
  };

  const handleInstitutionChange = (event: SelectChangeEvent) => {
    setSelectInstitutionVal(event.target.value);
    const selectedInstitutionId = event.target.value !== "" ? event.target.value : institution[0].institutionId;;
    getCurrencyConversionByInstitutionId(selectedInstitutionId);
  };

  const changeFieldValues = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrencyConversion({
      ...currencyConversion,
      [name]: value,
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
                    id: "CurrencyConversion.gridTitle",
                    defaultMessage: "Currency Conversion",
                  })}
                </Typography>
                {/* <p className="pb-0">
                  {intl.formatMessage({
                    id: "CurrencyConversion.gridSubTitle",
                    defaultMessage: " List of Conversions",
                  })}
                </p> */}
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
                    id="CurrencyConversion.addBtn"
                    defaultMessage="Add Currency Conversion"
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
                            <MenuItem key={type.institutionId} value={type.institutionId}>
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
                      {intl.formatMessage({
                        id: "CurrencyConversion.currency",
                        defaultMessage: "Currency",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "CurrencyConversion.basecurrency",
                        defaultMessage: "Base Currency",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "CurrencyConversion.rule",
                        defaultMessage: "Rounding Rule",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "CurrencyConversion.rate",
                        defaultMessage: "Rate Expression",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "CurrencyConversion.mid",
                        defaultMessage: "MID Rate Used",
                      })}
                    </TableCell>
                    <TableCell align="center" width="190px" className="last-column-border-header">
                      {intl.formatMessage({
                        id: "CurrencyConversion.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currencyConversionGrid && currencyConversionGrid.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.currencyName}</TableCell>
                      <TableCell>{row.baseCurrencyName}</TableCell>
                      <TableCell>{row.roundingRule}</TableCell>
                      <TableCell>{row.rateExpression}</TableCell>
                      <TableCell>{row.midRateUsed}</TableCell>
                      <TableCell align="center" width="190px" className="last-column-border">
                        <div className="action btns-block">
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() =>
                              editCurrencyConversion(row.currencyConversionId)
                            }
                                      disabled={!canUpdate}
                          >
                            <img src={edit_ic} alt="mail" />
                          </IconButton>
                          <IconButton
                            className="border-icon-btn no-border sm"
                                      onClick={() => onDelete(row)}
                                      disabled={!canDelete}
                          >
                            <img src={delete_ic} alt="mail" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currencyConversionGrid &&
                    currencyConversionGrid.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={13} className="last-column-border">
                          <p style={{ textAlign: "center" }}>
                            {intl.formatMessage({
                              id: "CurrencyConversion.noDataFound",
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
                      id: "CurrencyConversion.definitionTitle",
                      defaultMessage: "Currency Conversion Definition",
                    })}
                  </Typography>
                  <p className="pb-0">
                    {intl.formatMessage({
                      id: "CurrencyConversion.definitionSubTitle",
                      defaultMessage: "Add Currency Conversion",
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
                      </label>
                      <FormControl fullWidth>
                        <Select
                          disabled
                          value={selectInstitutionVal}
                          {...register("institutionId")}
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
                                <MenuItem key={type.institutionId} value={type.institutionId}>
                                  {type.institutionName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} className="p-0"></Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "CurrencyConversion.enterCurrency",
                          defaultMessage: "Currency",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={
                            currencyConversion.currencyId
                              ? currencyConversion.currencyId.toString()
                              : ""
                          }
                          {...register("currencyId")}
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder="Select"
                          onChange={changeFieldValues}
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "CurrencyConversion.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {currencies &&
                            currencies.length > 0 &&
                            currencies.map((currency) => {
                              return (
                                <MenuItem key={currency.currencyId} value={currency.currencyId}>
                                  {currency.currencyName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {(currencyConversion.currencyId
                          ? currencyConversion.currencyId.toString()
                          : "") === "" && errors.currencyId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.currencyConversionValidationError
                                .currencyId
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "CurrencyConversion.rate",
                          defaultMessage: "Rate Expression",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={currencyConversion.rateExpression}
                          {...register("rateExpression")}
                          onChange={changeFieldValues}
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "CurrencyConversion.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          <MenuItem key={"D"} value={"D"}>D</MenuItem>
                          <MenuItem key={"M"} value={"M"}>M</MenuItem>
                        </Select>
                        {(currencyConversion.rateExpression
                          ? currencyConversion.rateExpression
                          : "") === "" && errors.rateExpression?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.currencyConversionValidationError
                                .rateExpression
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "CurrencyConversion.enterBaseCurrency",
                          defaultMessage: "Base Currency",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={
                            currencyConversion.baseCurrencyId
                              ? currencyConversion.baseCurrencyId.toString()
                              : ""
                          }
                          {...register("baseCurrencyId")}
                          onChange={changeFieldValues}
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "CurrencyConversion.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {currencies &&
                            currencies.length > 0 &&
                            currencies.map((currency) => {
                              return (
                                <MenuItem key={currency.currencyId} value={currency.currencyId}>
                                  {currency.currencyName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {(currencyConversion.baseCurrencyId
                          ? currencyConversion.baseCurrencyId.toString()
                          : "") === "" && errors.baseCurrencyId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.currencyConversionValidationError
                                .baseCurrencyId
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "CurrencyConversion.entermid",
                          defaultMessage: "MID Rate Used",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={currencyConversion.midRateUsed}
                          {...register("midRateUsed")}
                          onChange={changeFieldValues}
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "CurrencyConversion.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          <MenuItem key={"Y"} value={"Y"}>Y</MenuItem>
                          <MenuItem key={"N"} value={"N"}>N</MenuItem>
                        </Select>
                        {(currencyConversion.midRateUsed
                          ? currencyConversion.midRateUsed
                          : "") === "" && errors.midRateUsed?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.currencyConversionValidationError
                                .midRateUsed
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "CurrencyConversion.rule",
                          defaultMessage: "Rounding Rule",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={currencyConversion.roundingRule}
                          {...register("roundingRule")}
                          onChange={changeFieldValues}
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "CurrencyConversion.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          <MenuItem key={"NO"} value={"NO"}>NO</MenuItem>
                          <MenuItem key={"TRUN"} value={"TRUN"}>TRUN</MenuItem>
                          <MenuItem key={"DOWN"} value={"DOWN"}>DOWN</MenuItem>
                          <MenuItem key={"UP"} value={"UP"}>UP</MenuItem>
                        </Select>
                        {(currencyConversion.roundingRule
                          ? currencyConversion.roundingRule
                          : "") === "" && errors.roundingRule?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.currencyConversionValidationError
                                .roundingRule
                            }
                          </FormHelperText>
                        ) : null}
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
                  id="CurrencyConversion.cancel"
                  defaultMessage="Cancel"
                />
                          </Button>
                          <Button disableElevation variant="contained" type="submit" disabled={isSubmitting}>
                <FormattedMessage
                  id="CurrencyConversion.save"
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

export default CurrencyConversion;
