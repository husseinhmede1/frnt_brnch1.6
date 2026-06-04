import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "@mui/material/Button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  add_rounded,
  date_ic,
  delete_ic,
  down_arrow_icon,
  edit_ic,
} from "../../assets/images";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  FormHelperText,
  FormControl,
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
  TextField,
  Typography,
  TablePagination,
  TableSortLabel,
  Box,
} from "@mui/material";
import { CurrencyRateModel } from "../../models/configuration/CurrencyRateModel";
import { Institution } from "../../models/configuration/InstitutionModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { CurrencyRateService } from "../../services/configuration/currency-rate-service";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { CurrencyRateSearchRequestModel } from "../../models/configuration/CurrencyRateModel";
import { CurrencyService } from "../../services/configuration/currency-service";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { Controller, useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { ConfigurationActivities, Errors, StatusCode, rowsPerPageOptionsConst } from "../../utils/constant";
import Swal from "sweetalert2";
import moment from "moment";
import { visuallyHidden } from "@mui/utils";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";

function CurrencyRate() {
  const [open, setOpen] = React.useState(false);
  const [editedId, setEditedId] = useState<number | undefined>(0);
  const [institution, setInstitution] = useState<Institution[]>([]);
  const [currencyList, setCurrencyList] = useState<CurrencyModel[]>([]);
  //const [currencyRates, setCurrencyRates] = React.useState<CurrencyRateModel[]>([]);
  const [filterCurrencyRates, setFilterCurrencyRates] = React.useState<
    CurrencyRateModel[]
  >([]);
  const [currencyRateDetails, setCurrencyRateDetails] = React.useState<any>({
    currencyRateId: 0,
  });
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [selectCurrencyVal, setSelectCurrencyVal] = React.useState("");
  const [filterFromDateValue, setFilterFromDateValue] =
    React.useState<Date | null>(moment().startOf('week').toDate());
  const [filterToDateValue, setFilterToDateValue] = React.useState<Date | null>(
    moment().endOf('week').toDate()
  );
    const intl = useIntl();

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.CRNCY_RATE), []);
    const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.CRNCY_RATE, 'CVRTCRT');
    const canUpdate = perms.accessUpdate === "1";
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.CRNCY_RATE, 'CVRTDEL');
    const canView = perms.accessView === "1";
    const canLoadInstitutions = hasApiAccess(ConfigurationActivities.CRNCY_RATE, 'GAAINST');
    const canLoadCurrencies = hasApiAccess(ConfigurationActivities.CRNCY_RATE, 'GACURRENCY');
    const canSearchCurrencyRates = hasApiAccess(ConfigurationActivities.CRNCY_RATE, 'CVRTSRCH');

  const firstUpdate = useRef(true);

  const {
    register,
    handleSubmit,
    reset: recordReset,
    clearErrors,
    setValue,
      control,
      formState: { errors, isSubmitting },
  } = useForm<CurrencyRateModel>({
    mode: "onChange",
    resolver: yupResolver(validations.createCurrencyRateValidations),
    defaultValues: {
      isEdit: false
    }
  });

  const {
    register: filterRegister,
    control: filterControl,
    getValues: filterGetValues,
    setValue: filterSetValue,
    formState: { errors: filterErrors },
  } = useForm<{institution:string, startDate: Date,endDate: Date}>({
    mode: "onChange",
    resolver: yupResolver(validations.currencyRateFilterValidation),
  });

  useEffect(() => {
    getCurrentWeekDates();
    getActiveInstitution();
    getActiveCurrencies();
    setInstitutefromLocalStorage();
  }, []);

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
    if (instID) {
      filterSetValue("institution", instID)
      setSelectInstitutionVal(instID);
      onSearch(0, rowsPerPage, "", "", instID);
    }
  };

  const getCurrentWeekDates = () => {
    var startOfWeek = moment().startOf('week').toDate();
    var endOfWeek = moment().endOf('week').toDate();
    filterSetValue("startDate", startOfWeek)
    filterSetValue("endDate", endOfWeek)
    setFilterFromDateValue(startOfWeek);
    setFilterToDateValue(endOfWeek);
  };

  const getActiveCurrencies = async () => {
    if (!canLoadCurrencies) return;
    await CurrencyService.getActiveCurrencies()
      .then((res) => {
        setCurrencyList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getActiveInstitution = async () => {
    if (!canLoadInstitutions) return;
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitution([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  // const getAllCurrencyRate = async () => {
  //   await CurrencyRateService.getAll()
  //     .then((res) => {
  //       setFilterCurrencyRates([...res.data]);
  //     }).catch(err =>   toast.error(err.response.data.errors[0]));
  // }

  // const getCurrencyRateByInstitutionId = async (id: number | undefined) => {
  //   await CurrencyRateService.getByInstitutionId(Number(id))
  //     .then((res) => {
  //       setFilterCurrencyRates([...res.data]);
  //     }).catch(err =>   toast.error(err.response.data.errors[0]));
  // }

  const handleClickOpen = (isEdit: boolean) => {
    if (!isEdit) {
      handleReset();
    }
    setOpen(true);
    clearErrors();
    setValue("isEdit", false)
  };

  const handleReset = (): void => {
    recordReset();
    setSelectCurrencyVal("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    recordReset({
      currencyRateId: 0,
      currencyId: 0,
      buyRate: undefined,
      sellRate: undefined,
      midRate: undefined,
      effectiveDate: undefined,
    });
    setSelectCurrencyVal("");
  };

  const handleInstitutionChange = (event: SelectChangeEvent) => {
    setSelectInstitutionVal(event.target.value);
    onSearch(0, rowsPerPage, "", "", event?.target?.value || "");
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setSelectCurrencyVal(event.target.value);
  };

  const editCurrencyRate = async (id: number | undefined) => {
    setValue("isEdit",true)
    handleClickOpen(true);
    setEditedId(id);
    getCurrencyRateById(id);
  };

  const getCurrencyRateById = async (id: number | undefined) => {
    CurrencyRateService.getById(Number(id))
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        recordReset({
          ...res.data,
          effectiveDate: new Date(
            moment(res?.data?.effectiveDate, "DD/MM/yyyy").toString()
          ),
        });
        setSelectCurrencyVal(data.currencyId.toString());
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const onSearch = async (
    pageNo: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    instId: string
  ) => {
    const model = new CurrencyRateSearchRequestModel();

    const curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day +
    let firstday = new Date(curr.setDate(first));
    let lastday = new Date(curr.setDate(last));

    model.fromDate = filterGetValues("startDate")
      ? moment(filterGetValues("startDate")).format("DD/MM/yyyy")
      : firstUpdate.current
        ? moment(firstday).format("DD/MM/yyyy")
        : "";
    model.toDate = filterGetValues("endDate")
      ? moment(filterGetValues("endDate")).format("DD/MM/yyyy")
      : firstUpdate.current
        ? moment(lastday).format("DD/MM/yyyy")
        : "";
    model.pageNo = pageNo;
    model.pageSize = pageSize;

    if (firstUpdate.current) {
      firstUpdate.current = false;
    }

    const instituteId = instId ? (instId) : "";
    if (sortColumn && sortOrder) {
      model.sort = [{ column: sortColumn, sortOrder: sortOrder.toUpperCase() }];
    } else {
      model.sort = [{ column: currentSortColumn, sortOrder: isSortOrderASC ? "ASC" : "DESC" }];
      setCurrentSortColumn("currencyName");
      setIsSortOrderASC(true);
    }
    if (!canSearchCurrencyRates) return;
    CurrencyRateService.search(instituteId, model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if (res?.data?.totalRecords > 0) {
            setTotalRecords(res.data.totalRecords);
            setFilterCurrencyRates([...res.data.data]);
          } else {
            setFilterCurrencyRates([]);
          }
        } else {
          setFilterCurrencyRates([]);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const onSubmit = async (value: CurrencyRateModel) => {
    const model = {
      ...value,
      currencyId: Number(value.currencyId) || 0,
      institutionId: selectInstitutionVal,
      effectiveDate: moment(value.effectiveDate).format("DD/MM/yyyy"),
    };
    CurrencyRateService.saveOrUpdate(model).then((res) => {
      if (res.status === StatusCode.Success) {
        if (editedId) {
          toast.success(`Currency rate updated successfully`);
        } else {
          toast.success("Currency rate added successfully");
        }
      }
      handleClose();
      setPage(0);
      onSearch(0, rowsPerPage, "", "", selectInstitutionVal);
    }).catch((err)=>{
      if (err?.response?.data) {
  //      if (err.response.data !== Errors.backDatedCurrencyRate) {
           toast.error(err.response.data.errors[0])
    //    }
      } else {
           toast.error(err.response.data.errors[0])
      }
    });
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
        CurrencyRateService.deleteById(id).then((res) => {
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
          setPage(0);
          onSearch(0, rowsPerPage, "", "", selectInstitutionVal);
        }).catch(err => {
          if (err && err.response 
           // && err.response.data === Errors.ReferenceExists
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
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptionsConst[0]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onSearch(
      newPage,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    onSearch(
      page,
      +event.target.value,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal
    );
  };

  type Order = "asc" | "desc";

  const [currentSortColumn, setCurrentSortColumn] = React.useState("currencyName");
  const [isSortOrderASC, setIsSortOrderASC] = React.useState<boolean>(true);

  const createSortHandler = async (columnName: string) => {
    let isSortOrderASCL
    if (currentSortColumn === columnName) {
      setIsSortOrderASC(!isSortOrderASC);
      isSortOrderASCL = !isSortOrderASC
    } else {
      setIsSortOrderASC(true);
      isSortOrderASCL = true
    }
    setCurrentSortColumn(columnName);
    onSearch(
      page,
      rowsPerPage,
      columnName,
      isSortOrderASCL ? "asc" : "desc",
      selectInstitutionVal
    );
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
                    id: "CurrencyRate.title",
                    defaultMessage: "Currency Rate",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "CurrencyRate.subTitle",
                    defaultMessage: "View Currencies Rates",
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
                    id="CurrencyRate.addBtn"
                    defaultMessage="Add Rate"
                  />
                </Button>
              </div>
            </div>
            <Grid spacing={3} container>
              <Grid item xs={12} lg={4} sm={6} xl={4}>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "CurrencyRate.filterInstitution",
                      defaultMessage: "Institution",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      {...filterRegister("institution")}
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
              <Grid item xs={12} lg={4} sm={6} xl={4}>
                <div className="input-with-label date-select-input">
                  <label>
                    {intl.formatMessage({
                      id: "CurrencyRate.filterfromDate",
                      defaultMessage: "From Date",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Controller
                        control={filterControl}
                        name="startDate"
                        render={({ field }) => (
                          <DatePicker
                            value={field.value ?? null}
                            inputFormat="dd/MM/yyyy"
                            onChange={(date, keyboardInput) => {
                              if (keyboardInput) {
                                  field.onChange(keyboardInput.length === 10 ? date : "")
                              } else {
                                  field.onChange(date)
                              }
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            components={{
                              OpenPickerIcon: () => {
                                return <img src={date_ic} alt="date" />;
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <FormHelperText id="error-helper-text" error>
                        {filterErrors?.startDate?.message}
                      </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} lg={4} sm={6} xl={4}>
                <div className="input-with-label date-select-input">
                  <label>
                    {intl.formatMessage({
                      id: "CurrencyRate.filtertoDate",
                      defaultMessage: "To Date",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                          control={filterControl}
                          name="endDate"
                          render={({ field }) => (
                            <DatePicker
                              value={field.value ?? null}
                              inputFormat="dd/MM/yyyy"
                              onChange={(date, keyboardInput) => {
                                if (keyboardInput) {
                                    field.onChange(keyboardInput.length === 10 ? date : "")
                                } else {
                                    field.onChange(date)
                                }
                              }}
                              renderInput={(params) => <TextField {...params} />}
                              components={{
                                OpenPickerIcon: () => {
                                  return <img src={date_ic} alt="date" />;
                                },
                              }}
                            />
                          )}
                        />
                    </LocalizationProvider>
                    <FormHelperText id="error-helper-text" error>
                        {filterErrors.endDate?.message}
                      </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
            <div className="btns-block right form-group">
              <Button
                variant="contained"
                disableElevation
                onClick={() =>
                  onSearch(0, rowsPerPage, "", "", selectInstitutionVal)
                }
              >
                <FormattedMessage
                  id="CurrencyRate.filterSearch"
                  defaultMessage="Search"
                />
              </Button>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={currentSortColumn === "currencyName"}
                        direction={isSortOrderASC ? "asc" : "desc"}
                        onClick={() => createSortHandler("currencyName")}
                      >
                        {intl.formatMessage({
                          id: "CurrencyRate.currency",
                          defaultMessage: "Currency",
                        })}
                        <Box component="span" sx={visuallyHidden}>
                          {isSortOrderASC
                            ? "sorted ascending"
                            : "sorted descending"}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={currentSortColumn === "effectiveDate"}
                        direction={isSortOrderASC ? "asc" : "desc"}
                        onClick={() => createSortHandler("effectiveDate")}
                      >
                        {intl.formatMessage({
                          id: "CurrencyRate.effectiveDate",
                          defaultMessage: "Effective Date",
                        })}
                        <Box component="span" sx={visuallyHidden}>
                          {isSortOrderASC
                            ? "sorted ascending"
                            : "sorted descending"}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "CurrencyRate.buyRate",
                        defaultMessage: "Buy Rate",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "CurrencyRate.sellRate",
                        defaultMessage: "Sell Rate",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "CurrencyRate.midRate",
                        defaultMessage: "MID Rate",
                      })}
                    </TableCell>
                    <TableCell align="center" width="190px" className="last-column-border-header">
                      {intl.formatMessage({
                        id: "CurrencyRate.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterCurrencyRates &&
                    filterCurrencyRates.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.currencyName}</TableCell>
                        <TableCell>{row.effectiveDate?.toString()}</TableCell>
                        <TableCell>{row.buyRate}</TableCell>
                        <TableCell>{row.sellRate}</TableCell>
                        <TableCell>{row.midRate}</TableCell>
                        <TableCell align="center" width="190px" className="last-column-border">
                          <div className="action btns-block">
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() =>
                                editCurrencyRate(row.currencyRateId)
                              }
                                        disabled={!canUpdate}
                            >
                              <img src={edit_ic} alt="mail" />
                            </IconButton>
                            <IconButton
                              className="border-icon-btn no-border sm"
                                        onClick={() => onDelete(row.currencyRateId)}
                                        disabled={!canDelete}
                            >
                              <img src={delete_ic} alt="mail" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filterCurrencyRates && filterCurrencyRates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={13} className="last-column-border">
                        <p style={{ textAlign: "center" }}>
                          {intl.formatMessage({
                            id: "CurrencyRate.noDataFound",
                            defaultMessage: "No Data Found.",
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
              count={totalRecords}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </main>
        <Dialog open={open} onClose={handleClose} className="c-dialog">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle component={"div"}>
              <div className="title-block mb-0">
                <div className="left-block mb-0">
                  <Typography variant={"h2"}>
                    {intl.formatMessage({
                      id: "CurrencyRate.title",
                      defaultMessage: "Currency Rate",
                    })}
                  </Typography>
                  <p className="pb-0">
                    {intl.formatMessage({
                      id: "CurrencyRate.AddUpdate.subTitle",
                      defaultMessage: "Add or update Currency Rate",
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
                      <label>
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
                  <Grid item xs={12} md={6} className="p-0"></Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label>
                        {intl.formatMessage({
                          id: "CurrencyRate.selectCurrency",
                          defaultMessage: "Currency",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("currencyId")}
                          displayEmpty
                          value={selectCurrencyVal}
                          onChange={handleCurrencyChange}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "CurrencyRate.selectCurrencyPlaceholder",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {currencyList &&
                            currencyList.length > 0 &&
                            currencyList.map((type) => {
                              return (
                                <MenuItem
                                  key={type.currencyId}
                                  value={type.currencyId}
                                >
                                  {type.currencyName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {selectCurrencyVal === "" &&
                          errors.currencyId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations.createCurrencyRateValidationError
                                .currencyId
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label date-select-input">
                      <label>
                        {intl.formatMessage({
                          id: "CurrencyRate.enterEffectiveDate",
                          defaultMessage: "Effective Date",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="effectiveDate"
                            render={({ field }) => (
                              <DatePicker
                                // placeholderText="Select date"
                                inputFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                onChange={(date, keyboardInput) => {
                                  if (keyboardInput) {
                                      field.onChange(keyboardInput.length === 10 ? date : "")
                                  } else {
                                      field.onChange(date)
                                  }
                                }}
                                // onChange={(newValue) => {
                                //   setDateValue(newValue);
                                //   setValue(
                                //     "effectiveDate",
                                //     newValue ? newValue : new Date()
                                //   );
                                // }}
                                value={field.value ?? null}
                                components={{
                                  OpenPickerIcon: () => {
                                    return <img src={date_ic} alt="date" />;
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <FormHelperText id="error-helper-text" error>
                          {errors.effectiveDate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label>
                        {intl.formatMessage({
                          id: "CurrencyRate.enterBuyRate",
                          defaultMessage: "Buy Rate",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "CurrencyRate.enterBuyRatePlaceholder",
                            defaultMessage: "Write Buy Rate",
                          })}
                          error
                          type="number"
                          fullWidth
                          id="buyRate"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("buyRate")}
                          componentsProps={{
                            input: {
                                step: ".00000001",
                            },
                          }}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.buyRate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label>
                        {intl.formatMessage({
                          id: "CurrencyRate.enterSellRate",
                          defaultMessage: "Sell Rate",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "CurrencyRate.enterSellRatePlaceholder",
                            defaultMessage: "Write Sell Rate",
                          })}
                          error
                          type="number"
                          fullWidth
                          id="sellRate"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("sellRate")}
                          componentsProps={{
                            input: {
                                step: ".00000001",
                            },
                          }}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.sellRate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label>
                        {intl.formatMessage({
                          id: "CurrencyRate.enterMIDRate",
                          defaultMessage: "MID Rate",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "CurrencyRate.enterMIDRatePlaceholder",
                            defaultMessage: "Write MID Rate",
                          })}
                          error
                          type="number"
                          fullWidth
                          id="midRate"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("midRate")}
                          componentsProps={{
                            input: {
                                step: ".00000001",
                            },
                          }}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.midRate?.message}
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
                  id="CurrencyRate.cancel"
                  defaultMessage="Cancel"
                />
                </Button>
                <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                <FormattedMessage
                  id="CurrencyRate.save"
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

export default CurrencyRate;
