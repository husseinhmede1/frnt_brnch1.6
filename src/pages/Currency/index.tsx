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
  InputBase,
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
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { add_rounded, delete_ic, edit_ic } from "../../assets/images";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { CurrencyService } from "../../services/configuration/currency-service";
import { ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions } from "../../utils/permissionUtils";
import validations from "../../utils/validations";

function Currency() {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyModel>(new CurrencyModel());
    const [currencyGrid, setCurrencyGrid] = useState<CurrencyModel[]>([]);

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.CURNCY), []);
    const canAdd = perms.accessAdd === "1";
    const canUpdate = perms.accessUpdate === "1";
    const canDelete = perms.accessDelete === "1";
    const canView = perms.accessView === "1";

  const handleClickOpen = (isEdited: boolean) => {
    if (!isEdited) {
      handleReset();
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleReset();
  };

  const {
    register,
    reset,
      handleSubmit,
      formState: { errors, isSubmitting },
  } = useForm<CurrencyModel>({
    mode: "onChange",
    resolver: yupResolver(validations.currencyValidation),
  });

  const handleReset = (): void => {
    reset(new CurrencyModel());
    setCurrency(new CurrencyModel());
  };

  useEffect(() => {
    getAllCurrencies();
  }, []);

  const getAllCurrencies = async () => {
    await CurrencyService.getAllCurrencies()
      .then((res) => {
        setCurrencyGrid([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const editCurrency = (currencyId: number) => {
    CurrencyService.getCurrencyById(currencyId).then((res) => {
      reset(res.data);
      setCurrency(res.data);
      // setOpen(true);
      handleClickOpen(true);
    });
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
        CurrencyService.deleteCurrency(id).then((res) => {
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
          getAllCurrencies();
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

  const changeStatus = async (id: number, event: any) => {
    const model = {
      id: id,
      status: event.target.checked === true ? "1" : "0",
    };
    CurrencyService.changeCurrencyStatus(model)
      .then((res) => {
        getAllCurrencies();
        toast.success(res?.data+"")
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const onSubmit = async (values: CurrencyModel) => {
    let data = values;
    if (currency.currencyId !== undefined) {
      data = { ...values, currencyId: currency.currencyId };
    }
    const model = {
      currencyCode: data.currencyCode,
      currencyName: data.currencyName,
      currencyId: Number(data.currencyId),
      currCodeALPHA2: data.currCodeALPHA2,
      currCodeALPHA3: data.currCodeALPHA3,
      currExponent: data.currExponent,
    };
    await CurrencyService.saveOrUpdateCurrency(model).then((res) => {
      if (currency.currencyId) {
        toast.success(`Currency details updated successfully`);
      } else {
        toast.success("Currency record added successfully");
      }
      getAllCurrencies();
    })
      .catch((err) => {
        // if (
        //   err &&
        //   err.response &&
        //   (
        //     err.response.data === Errors.uniqueCurrencyCode || 
        //     err.response.data === Errors.uniqueCurrencyName ||
        //     err.response.data === Errors.uniqueCurrencyNameAndCode
        //   )
        // ) {
        //   toast.error(err.response.data);
        // }
        // else {
          toast.error(err.response.data.errors[0])
      //  }
      });
    handleClose();
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
                    id: "Currency.gridTitle",
                    defaultMessage: "Currency",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "Currency.gridSubTitle",
                    defaultMessage: "List of Currencies",
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
                    id="Currency.addBtn"
                    defaultMessage="Add Currency"
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
                        id: "Currency.code",
                        defaultMessage: "Currency Code",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Currency.name",
                        defaultMessage: "Currency Name",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Currency.codeAlpha2",
                        defaultMessage: "Code ALPHA 2",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Currency.codeAlpha3",
                        defaultMessage: "Code ALPHA 3",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Currency.exponent",
                        defaultMessage: "Exponent",
                      })}
                    </TableCell>
                    <TableCell align="center" width="190px" className="last-column-border-header">
                      {intl.formatMessage({
                        id: "Currency.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currencyGrid && currencyGrid.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.currencyCode}</TableCell>
                      <TableCell>{row.currencyName}</TableCell>
                      <TableCell>{row.currCodeALPHA2}</TableCell>
                      <TableCell>{row.currCodeALPHA3}</TableCell>
                      <TableCell>{row.currExponent}</TableCell>
                      <TableCell align="center" width="190px" className="last-column-border">
                        <div className="action btns-block">
                          <Switch
                            className="custom"
                            checked={row.status === "1" ? true : false}
                                      onChange={(e) => changeStatus(row.currencyId, e)}
                                      disabled={!canUpdate}
                          />
                          <IconButton
                            className="border-icon-btn no-border sm"
                                      onClick={() => editCurrency(row.currencyId)}
                                      disabled={!canUpdate}
                          >
                            <img src={edit_ic} alt="mail" />
                          </IconButton>
                          <IconButton
                            className="border-icon-btn no-border sm"
                                      onClick={() => onDelete(row.currencyId)}
                                      disabled={!canDelete}
                          >
                            <img src={delete_ic} alt="mail" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currencyGrid &&
                    currencyGrid.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={13} className="last-column-border">
                          <p style={{ textAlign: "center" }}>
                            {intl.formatMessage({
                              id: "Currency.noDataFound",
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
                      id: "Currency.definitionTitle",
                      defaultMessage: "Currency Definition",
                    })}
                  </Typography>
                  <p className="pb-0">
                    {intl.formatMessage({
                      id: "Currency.definitionSubTitle",
                      defaultMessage: "Add or Update currency",
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
                          id: "Currency.enterCode",
                          defaultMessage: "Currency Code",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Currency.enterCodePlaceholder",
                            defaultMessage: "Write currency code",
                          })}
                          error
                          fullWidth
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          id="currencyCode"
                          {...register("currencyCode")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.currencyCode?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Currency.enterName",
                          defaultMessage: "Name",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Currency.enterNamePlaceholder",
                            defaultMessage: "Write currency name",
                          })}
                          error
                          fullWidth
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          id="currencyName"
                          {...register("currencyName")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.currencyName?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Currency.enterAlpha2",
                          defaultMessage: "Code ALPHA 2",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Currency.enterAlpha2Placeholder",
                            defaultMessage: "Write currency Alpha2 code",
                          })}
                          error
                          fullWidth
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          id="currCodeALPHA2"
                          {...register("currCodeALPHA2")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.currCodeALPHA2?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Currency.enterAlpha3",
                          defaultMessage: "Code ALPHA 3",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Currency.enterAlpha3Placeholder",
                            defaultMessage: "Write currency Alpha3 code",
                          })}
                          error
                          fullWidth
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          id="currCodeALPHA3"
                          {...register("currCodeALPHA3")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.currCodeALPHA3?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Currency.enterExponent",
                          defaultMessage: "Exponent",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Currency.enterExponentPlaceholder",
                            defaultMessage: "Write currency exponent",
                          })}
                          error
                          fullWidth
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          id="currExponent"
                          {...register("currExponent")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.currExponent?.message}
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
                  id="Currency.cancel"
                  defaultMessage="Cancel"
                />
                </Button>
                <Button disableElevation variant="contained" type="submit" disabled={isSubmitting}>
                <FormattedMessage id="Currency.save" defaultMessage="Save" />
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
}

export default Currency;
