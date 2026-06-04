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
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  cancelIcon,
  delete_ic,
  down_arrow_icon,
  edit_ic,
  saveIcon,
} from "../../assets/images";
import { CountryModel } from "../../models/configuration/CountryModel";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { CountryService } from "../../services/configuration/country-service";
import { CurrencyService } from "../../services/configuration/currency-service";
import { ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import validations from "../../utils/validations";

function CountriesListing() {
  const [open, setOpen] = React.useState(false);
  const [countries, setCountries] = React.useState<CountryModel[]>([]);
  const [countriesData, setCountriesData] = React.useState<CountryModel>({
    cntryId: 0,
    cntryCode: "",
    cntryCodeAlpha2: "",
    cntryCodeAlpha3: "",
    cntryName: "",
    cntryNameAlt: "",
    cntryStatus: "",
    currCode: "",
    currPattern: "",
    datePattern: "",
    economicAreaInd: "",
    currencyId: 0,
    currencyName: "",
  });
  const [currencyList, setCurrencyList] = React.useState<CurrencyModel[]>([]);
    const intl = useIntl();

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.CNTRY), []);
    const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.CNTRY, 'SCOUNTRY');
    const canUpdate = perms.accessUpdate === "1" && hasApiAccess(ConfigurationActivities.CNTRY, 'SCOUNTRYSC');
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.CNTRY, 'DCOUNTRY');
    const canView = perms.accessView === "1";
    const canLoadCountries  = hasApiAccess(ConfigurationActivities.CNTRY, 'GACOUNTRY');
    const canLoadCurrencies = hasApiAccess(ConfigurationActivities.CNTRY, 'GACURRENCY');

    const handleClose = () => {
        setOpen(false);
    };

  useEffect(() => {
    getAllCountry();
    getAllCurrency();
  }, []);

  const getAllCurrency = async () => {
    if (!canLoadCurrencies) return;
    await CurrencyService.getActiveCurrencies()
      .then((res) => {
        setCurrencyList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllCountry = async () => {
    if (!canLoadCountries) return;
    await CountryService.getAllCountry()
      .then((res) => {
        setCountries([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const changeStatus = async (id: number, event: any) => {
    const model = {
      id: id,
      status: event.target.checked === true ? "1" : "0",
    };
    CountryService.changeStatus(model)
      .then((res) => {
        getAllCountry();
        toast.success(res?.data+"")
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
        CountryService.deleteById(id).then((res) => {
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
          getAllCountry();
        }).catch(err => {
          if (err && err.response
         //    && err.response.data === Errors.ReferenceExists
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

  const {
    register,
    handleSubmit: recordHandleSubmit,
      reset: recordReset,
      formState: { isSubmitting, errors }
  } = useForm<CountryModel>({
    mode: "onChange",
    resolver: yupResolver(validations.updateCountriesListing),
  });

  const onSave = async (data: CountryModel) => {
    //data.datePattern = moment(data.datePattern).format("DD/MM/yyyy");
    await CountryService.saveOrUpdateCountry(data).then((res) => {
          if (res.status === StatusCode.Success) {
            toast.success(`Country details updated successfully`);
            handleClear();
            getAllCountry();
          }
          }).catch((error: any) => {
              toast.error(error.response.data.errors[0])
          });
  };

  const onEdit = (data: CountryModel) => {
    // data.datePattern = moment(data.datePattern, "DD/MM/yyyy").format(
    //   "MM/DD/yyyy"
    // );
    setCountriesData(data);
    recordReset(data);
  };

  const handleClear = () => {
    setCountriesData({
      cntryId: 0,
      cntryCode: "",
      cntryCodeAlpha2: "",
      cntryCodeAlpha3: "",
      cntryName: "",
      cntryNameAlt: "",
      cntryStatus: "",
      currCode: "",
      currPattern: "",
      datePattern: "",
      economicAreaInd: "",
      currencyId: 0,
      currencyName: "",
    });
  };

  const handleSelectChange = (e: any) => {
    setCountriesData({ ...countriesData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "Country.title",
                    defaultMessage: "Countries",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "Country.subTitle",
                    defaultMessage: "List of Countries",
                  })}
                </p>
              </div>
            </div>
            <form onSubmitCapture={recordHandleSubmit(onSave)}>
              <TableContainer className="has-vertical-scroll">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {intl.formatMessage({
                          id: "Country.code",
                          defaultMessage: "Code",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "Country.name",
                          defaultMessage: "Name",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "Country.altName",
                          defaultMessage: "Alternate Name",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "Country.codeAlpha2",
                          defaultMessage: "Code ALPHA 2",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "Country.codelpha3",
                          defaultMessage: "Code ALPHA 3",
                        })}
                      </TableCell>
                      <TableCell width="190px">
                        {intl.formatMessage({
                          id: "Country.currency",
                          defaultMessage: "Currency",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "Country.currencyPattern",
                          defaultMessage: "Currency Pattern",
                        })}
                      </TableCell>
                      <TableCell width="190px">
                        {intl.formatMessage({
                          id: "Country.datePattern",
                          defaultMessage: "Date Pattern",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "Country.economicAreaInd",
                          defaultMessage: "Economic Area IND",
                        })}
                      </TableCell>
                      <TableCell align="center" width="190px" className="sticky-table head last-column-border-header">
                        {intl.formatMessage({
                          id: "Country.actions",
                          defaultMessage: "Actions",
                        })}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {countries &&
                      countries.map((row, i) => (
                        <TableRow key={i}>
                          {countriesData?.cntryId !== row?.cntryId && (
                            <>
                              <TableCell>{row.cntryCode}</TableCell>
                              <TableCell>{row.cntryName}</TableCell>
                              <TableCell>{row.cntryNameAlt}</TableCell>
                              <TableCell>{row.cntryCodeAlpha2}</TableCell>
                              <TableCell>{row.cntryCodeAlpha3}</TableCell>
                              <TableCell>{row.currencyName}</TableCell>
                              <TableCell>{row.currPattern}</TableCell>
                              <TableCell>{row.datePattern}</TableCell>
                              <TableCell>{row.economicAreaInd}</TableCell>
                              <TableCell align="center" width="190px" className="sticky-table column last-column-border">
                                <div className="action btns-block">
                                  <Switch
                                    className="custom"
                                    checked={
                                      row.cntryStatus === "1" ? true : false
                                    }
                                    onChange={(e) =>
                                      changeStatus(row.cntryId, e)
                                    }
                                    disabled={!canUpdate}
                                  />
                                  <IconButton
                                    className="border-icon-btn no-border sm"
                                    onClick={() => onEdit(row)}
                                    disabled={!canUpdate}
                                  >
                                    <img src={edit_ic} alt="mail" />
                                  </IconButton>
                                  <IconButton
                                    className="border-icon-btn no-border sm"
                                    onClick={() => onDelete(row.cntryId)}
                                    disabled={!canDelete}
                                  >
                                    <img src={delete_ic} alt="mail" />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </>
                          )}

                          {countriesData?.cntryId === row?.cntryId && (
                            <>
                              <TableCell>{row.cntryCode}</TableCell>

                              <TableCell>
                                <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write"
                                    error
                                    fullWidth
                                    {...register("cntryName")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.cntryName?.message}
                                              </FormHelperText>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write"
                                    fullWidth
                                    {...register("cntryNameAlt")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.cntryNameAlt?.message}
                                              </FormHelperText>

                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write"
                                    error
                                    fullWidth
                                    {...register("cntryCodeAlpha2")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.cntryCodeAlpha2?.message}
                                              </FormHelperText>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write"
                                    error
                                                  fullWidth
                                                  aria-describedby="error-helper-text"
                                    {...register("cntryCodeAlpha3")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.cntryCodeAlpha3?.message}
                                              </FormHelperText>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl fullWidth>
                                  <Select
                                    IconComponent={() => (
                                      <img src={down_arrow_icon} alt="" />
                                    )}
                                    placeholder="Select"
                                    {...register("currencyId")}
                                    value={
                                      countriesData.currencyId
                                        ? countriesData.currencyId.toString()
                                        : ""
                                    }
                                    onChange={handleSelectChange}
                                  >
                                    <MenuItem value="">
                                      <em>Select</em>
                                    </MenuItem>
                                    {currencyList &&
                                      currencyList.length > 0 &&
                                      currencyList.map((item: any) => (
                                        <MenuItem
                                          value={item.currencyId}
                                          key={item.currencyId}
                                        >
                                          {item.currencyName}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write"
                                    error
                                    fullWidth
                                    {...register("currPattern")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.currPattern?.message}
                                              </FormHelperText>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write"
                                    error
                                    fullWidth
                                    {...register("datePattern")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.datePattern?.message}
                                              </FormHelperText>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write"
                                    error
                                    fullWidth
                                    {...register("economicAreaInd")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.economicAreaInd?.message}
                                              </FormHelperText>
                                </FormControl>
                              </TableCell>

                                      <TableCell align="center" width="190px" className="sticky-table column last-column-border">
                                <div className="action btns-block">
                                  <IconButton
                                    className="border-icon-btn no-border sm"
                                    type="submit"
                                  >
                                    <img src={saveIcon} alt="mail" />
                                  </IconButton>
                                  <IconButton
                                    className="border-icon-btn no-border sm"
                                    onClick={() => handleClear()}
                                  >
                                    <img src={cancelIcon} alt="mail" />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    {countries && countries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={13} className="last-column-border">
                          <p style={{ textAlign: "center" }}>
                            {intl.formatMessage({
                              id: "Country.noDataFound",
                              defaultMessage: "No Data Found.",
                            })}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </form>
          </div>
        </main>
        <Dialog open={open} onClose={handleClose} className="c-dialog">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>MCC Defintion</Typography>
                <p className="pb-0">Add or Update MCC</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label ">
                    <label>Card Scheme</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label ">
                    <label>Merchant Type</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label>MCC</label>
                    <FormControl fullWidth>
                      <InputBase error fullWidth placeholder="Write your MCC" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label>Description</label>
                    <FormControl fullWidth>
                      <InputBase
                        error
                        fullWidth
                        placeholder="Write your description"
                      />
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
              Cancel
            </Button>
            <Button disableElevation variant="contained" disabled={isSubmitting}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default CountriesListing;
