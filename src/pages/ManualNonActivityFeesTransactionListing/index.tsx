import React, { useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
import {
  add_rounded,
  date_ic,
  delete_ic,
  down_arrow_icon,
  edit_ic,
} from "../../assets/images";
import {
  FormControl,
  Grid,
  IconButton,
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
  TextField,
  Typography,
  FormHelperText,
  TablePagination,
  TableSortLabel,
  Box,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router";
import { EntityListModel } from "../../models/entityManagement/EntityModel";
import { Institution } from "../../models/configuration/InstitutionModel";
import {
  ManualNonActivityTransactionModel,
  ManualNonActivityTransactionResponseModel,
} from "../../models/entityManagement/ManualNonActivityTransactions";
import { useIntl } from "react-intl";
import moment from "moment";
import { ManualNonActivityTransactionServices } from "../../services/entityManagement/manual-non-activity-transaction-services";
import { toast } from "react-toastify";
import {
  ConfigurationActivities,
  Errors,
  StatusCode,
  rowsPerPageOptionsConst,
  TRANS_USAGE,
  OptionType,
  ENTITY_LEVEL,
  CodePrefix,
} from "../../utils/constant";
import { getActivityPermissions } from "../../utils/permissionUtils";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validations from "../../utils/validations";
import { TransactionGroupService } from "../../services/configuration/transaction-group-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { InstitutionService } from "../../services/configuration/institution-service";
import { TransactionUsageModel } from "../../models/configuration/TransactionGroupModel";
import { EntityService } from "../../services/entityManagement/entity-service";
import Swal from "sweetalert2";
import { visuallyHidden } from "@mui/utils";
import ReactSelect from "react-select";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";

function ManualNonActivityFeesListing() {
  const navigate = useNavigate();
  const intl = useIntl();
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [entityDesc, setEntityDesc] = React.useState("");
  const [entityList, setEntityList] = React.useState<
    { label: string; value: string; desc: string }[]
  >([]);
  const [transactionList, setTransactionList] = React.useState<
    TransactionUsageModel[]
  >([]);
  const [institutionList, setInstitutionList] = React.useState<Institution[]>(
    []
  );
  const [manualNonActivityTransactions, setManualNonActivityTransactions] =
    React.useState<ManualNonActivityTransactionResponseModel[]>([]);
  const [transactionFilterDetails, setTransactionFilterDetails] =
    React.useState<ManualNonActivityTransactionModel>(
      new ManualNonActivityTransactionModel()
    );
  const [filterApplied, setFilterApplied] = React.useState<boolean>(false);
  const [filterState, setFilterState] = React.useState<any>(null);

  const [page, setPage] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    rowsPerPageOptionsConst[0]
  );
  const [currentSortColumn, setCurrentSortColumn] = React.useState("");
  const [isSortOrderASC, setIsSortOrderASC] = React.useState<boolean>(true);
  const [outletId, setOutletId] = React.useState<{
    label: string;
    value: string;
  }>();
  const [outletErr, setOutletErr] = React.useState("");

  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.MNNONACTFEE), []);
  const canAdd = perms.accessAdd === "1";
  const canUpdate = perms.accessUpdate === "1";
  const canDelete = perms.accessDelete === "1";
  const canView = perms.accessView === "1";

  const outLetIdRequired = "Entity/OutletId is required.";
  useEffect(() => {
    getActiveInstitution();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getAllManualNonActivityTransactions(
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
    getAllManualNonActivityTransactions(
      page,
      +event.target.value,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal
    );
  };

  const createSortHandler = async (columnName: string) => {
    if (currentSortColumn === columnName) {
      setIsSortOrderASC(!isSortOrderASC);
    } else {
      setIsSortOrderASC(true);
    }
    setCurrentSortColumn(columnName);
    getAllManualNonActivityTransactions(
      page,
      rowsPerPage,
      columnName,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal
    );
  };

  const onSubmit = async (values: ManualNonActivityTransactionModel) => {
    if (
      outletId?.value === "" ||
      outletId?.value === undefined ||
      outletId?.value === null
    ) {
      setOutletErr(outLetIdRequired);
    } else {
      let sort;
      if (currentSortColumn && isSortOrderASC) {
        sort = [
          {
            column: currentSortColumn,
            sortOrder: isSortOrderASC ? "ASC" : "DESC",
          },
        ];
      } else {
        setCurrentSortColumn("OUTLETNAME");
        setIsSortOrderASC(true);
        sort = [{ column: "OUTLETNAME", sortOrder: "ASC" }];
      }
      let model = {
        institutionId: selectInstitutionVal,
        pageNo: page,
        pageSize: rowsPerPage,
        fromTransactionDate: moment(values?.fromTransactionDate).format(
          "DD/MM/yyyy"
        ),
        toTransactionDate: moment(values?.toTransactionDate).format(
          "DD/MM/yyyy"
        ),
        sort: sort,
        transactionId: (values.transactionId?.trim() === "" || !values.transactionId)? 0: values.transactionId,
        outletId: outletId?.value,
      };
      setFilterState(model);
      getValuesBySearch(model);
    }
  };

  const getValuesBySearch = (model: any) => {
    ManualNonActivityTransactionServices.getBySearch(model)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          if (res?.data?.totalRecords > 0) {
            setTotalRecords(res?.data?.totalRecords);
            setManualNonActivityTransactions([...res.data.data]);
            setFilterApplied(true);
          } else {
            setManualNonActivityTransactions([]);
            setTotalRecords(0);
          }
        } else {
          setManualNonActivityTransactions([]);
          setTotalRecords(0);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllManualNonActivityTransactions = (
    pageNo: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    instId: string
  ) => {
    let sort;
    if (sortColumn && sortOrder) {
      sort = [{ column: sortColumn, sortOrder: sortOrder.toUpperCase() }];
    } else {
      setCurrentSortColumn("OUTLETNAME");
      setIsSortOrderASC(true);
      sort = [{ column: "OUTLETNAME", sortOrder: "ASC" }];
    }
    let model = {
      institutionId: instId,
      fromTransactionDate: moment(new Date()).format("DD/MM/yyyy"),
      toTransactionDate: moment(new Date()).format("DD/MM/yyyy"),
      pageNo,
      pageSize,
      sort,
    };
    if (filterApplied) {
      getValuesBySearch({
        ...filterState,
        pageNo,
        pageSize,
        sort,
      });
      setPage(pageNo);
      setRowsPerPage(pageSize);
      setCurrentSortColumn(sortColumn);
      setIsSortOrderASC(sortOrder.toUpperCase() === "ASC" ? true : false);
      setSelectInstitutionVal(instId);
    } else {
      ManualNonActivityTransactionServices.getBySearch(model)
        .then((res) => {
          if (res.status === StatusCode.Success) {
            if (res.data.totalRecords > 0) {
              setTotalRecords(res.data.totalRecords);
              setManualNonActivityTransactions([...res.data.data]);
            } else {
              setManualNonActivityTransactions([]);
              setTotalRecords(0);
            }
          } else {
            setManualNonActivityTransactions([]);
            setTotalRecords(0);
          }
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    setTransactionFilterDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (event.target.name === "outletId") {
      const selectedObj =
        entityList &&
        entityList.length > 0 &&
        entityList.find((x) => x.value === event.target.value);
      setEntityDesc(selectedObj ? selectedObj.desc : "");
    }
    if (event.target.name === "institutionId") {
      setSelectInstitutionVal(event.target.value);
      setEntityDesc("");
      setEntityList([]);
      setOutletId({ label: "", value: "" });
      setTransactionFilterDetails({
        ...transactionFilterDetails,
        outletId: "",
      });
      TransactionGroupService.getAllTransactionsByUsage(TRANS_USAGE.NACT,event.target.value )
      .then((res) => {
        setTransactionList(res?.data.filter(t => t.institutionId === event.target.value));
      })
    }
  };

  useEffect(() => {
    setInstitutefromLocalStorage();
    getAllTransactionsByUsage();
    getActiveInstitution();
  }, []);

  useEffect(() => {
    if (selectInstitutionVal) {
      getEntitiesByEntityLevelNameAndInstitution(selectInstitutionVal);
    }
  }, [selectInstitutionVal]);

  const getAllTransactionsByUsage = () => {
    // let UsageSysId = 0;
    // SystemCodeServices.getAllSystemCodes().then(res => {
    //     UsageSysId = res.data.find(data => data.codePrefix === CodePrefix.TRANS_USAGE && data.description === TRANS_USAGE.NACT)?.systemCodeId ?? 0;

    //     if(UsageSysId !== 0){
    //       TransactionGroupService.getAllTransactionsByUsage(UsageSysId, "").then(res => {
    //         setTransactionList(res?.data);
    //       }).catch(err =>   toast.error(err.response.data.errors[0]))
    //     }

    // });
    TransactionGroupService.getAllTransactionsByUsage(TRANS_USAGE.NACT, "")
      .then((res) => {
        setTransactionList(res?.data);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
      getEntitiesByEntityLevelNameAndInstitution(instID);
      setValue("institutionId", instID);
      setTransactionFilterDetails({
        ...transactionFilterDetails,
        institutionId: instID,
      });
    }
    getAllManualNonActivityTransactions(
      0,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      instID
    );
  };

  const getActiveInstitution = async () => {
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitutionList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getEntitiesByEntityLevelNameAndInstitution = async (instID: string) => {
    const model = {
      institutionId: instID,
      entityLevel: ENTITY_LEVEL.OUTLET,
    };
    await EntityService.getEntitiesByEntityLevelNameAndInstitution(model)
      .then((res) => {
        let option: any = [];
        if (res.data) {
          option = res.data.map((data) => {
            const label = data.entityId;
            const value = data.entityId;
            const desc = data.entityName;
            return { label, value, desc };
          });
        }
        setEntityList(option);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const editTransaction = (id: number) => {
    navigate(`/manual-non-activity-fees-transaction-definition/${id}`, { state: { institutionId: selectInstitutionVal ,isEdit:true }} );
  };

  const onDelete = (id: number) => {
    Swal.fire({
      title: intl.formatMessage({
        id: "DeleteAlert.title",
        defaultMessage: "Are you sure?",
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
        ManualNonActivityTransactionServices.deleteById(id)
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
            getAllManualNonActivityTransactions(
              0,
              rowsPerPage,
              currentSortColumn,
              isSortOrderASC ? "asc" : "desc",
              selectInstitutionVal
            );
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
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ManualNonActivityTransactionModel>({
    mode: "onChange",
    resolver: yupResolver(
      validations.filterManualNonActivityTransactionValidation
    ),
  });

  const handleOutletChange = (e: OptionType) => {
    if (e) {
      setTransactionFilterDetails((prev) => ({
        ...prev,
        outletId: e.value!.toString(),
      }));
      setOutletErr("");
      setEntityDesc(e.desc ? e.desc : "");
      setOutletId({ value: e?.value!, label: e?.label! });
    } else {
      setTransactionFilterDetails((prev) => ({
        ...prev,
        outletId: "",
      }));
      setOutletErr(outLetIdRequired);
      setEntityDesc("");
      setOutletId({ label: "", value: "" });
    }
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
                    id: "Entity.manualNonActivityFeesTransactions",
                    defaultMessage: "Manual Non Activity Fees Transactions",
                  })}
                </Typography>
              </div>
              <div className="right-block">
                <Button
                  variant="contained"
                  disableElevation
                  className="btn-light"
                  endIcon={<img src={add_rounded} alt="add" />}
                  onClick={() =>
                    navigate(
                      "/manual-non-activity-fees-transaction-definition",
                      { state: { institutionId: selectInstitutionVal , isEdit:false } }
                    )
                  }
                  disabled={!canAdd}
                >
                  {intl.formatMessage({
                    id: "Entity.button.addTransaction",
                    defaultMessage: "Add Transaction",
                  })}
                </Button>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-elements">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Entity.label.institution",
                          defaultMessage: "Institution",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("institutionId")}
                          value={
                            selectInstitutionVal
                              ? selectInstitutionVal.toString()
                              : ""
                          }
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                        >
                          {institutionList &&
                            institutionList.length > 0 &&
                            institutionList.map((item) => (
                              <MenuItem
                                value={item.institutionId}
                                key={item.institutionId}
                              >
                                {item.institutionName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Entity.label.entityOutletId",
                          defaultMessage: "Entity/Outlet ID",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="outletId"
                          render={() => (
                            <ReactSelect
                              value={outletId}
                              onChange={(e) => handleOutletChange(e!)}
                              isClearable={
                                outletId?.value === "" ? false : true
                              }
                              options={entityList}
                              // placeholder="select..."
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                    <FormHelperText id="error-helper-text" error>
                      {outletErr !== "" ? outletErr : ""}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <FormControl fullWidth className="field-space">
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.description",
                            defaultMessage: "Enter Description",
                          })}
                          fullWidth
                          disabled
                          value={entityDesc}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label>
                        {intl.formatMessage({
                          id: "Entity.label.fromTransactionDate",
                          defaultMessage: "From Transaction Date",
                        })}

                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="fromTransactionDate"
                            defaultValue={new Date()}
                            render={({ field }) => {
                              return (
                                <DatePicker
                                  inputFormat="dd/MM/yyyy"
                                  onChange={(date, keyboardInput) => {
                                    if (keyboardInput) {
                                      field.onChange(
                                        keyboardInput.length === 10 ? date : ""
                                      );
                                    } else {
                                      field.onChange(date);
                                    }
                                    setTransactionFilterDetails((prev) => ({
                                      ...prev,
                                      fromTransactionDate: date,
                                    }));
                                  }}
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
                              );
                            }}
                          />
                        </LocalizationProvider>
                        <FormHelperText id="error-helper-text" error>
                          {errors.fromTransactionDate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label>
                        {intl.formatMessage({
                          id: "Entity.label.toTransactionDate",
                          defaultMessage: "To Transaction Date",
                        })}

                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="toTransactionDate"
                            defaultValue={new Date()}
                            render={({ field }) => {
                              return (
                                <DatePicker
                                  inputFormat="dd/MM/yyyy"
                                  onChange={(date, keyboardInput) => {
                                    if (keyboardInput) {
                                      field.onChange(
                                        keyboardInput.length === 10 ? date : ""
                                      );
                                    } else {
                                      field.onChange(date);
                                    }
                                    setTransactionFilterDetails((prev) => ({
                                      ...prev,
                                      toTransactionDate: date,
                                    }));
                                  }}
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
                              );
                            }}
                          />
                        </LocalizationProvider>
                        <FormHelperText id="error-helper-text" error>
                          {errors.toTransactionDate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Entity.label.transactionId",
                          defaultMessage: "Transaction ID",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("transactionId")}
                          value={
                            transactionFilterDetails.transactionId
                              ? transactionFilterDetails.transactionId.toString()
                              : ""
                          }
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          {transactionList &&
                            transactionList.length > 0 &&
                            transactionList.map((item) => (
                              <MenuItem
                                value={item.transactionId}
                                key={item.transactionId}
                              >
                                {item.description}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="btns-block right has-border form-group">
                <Button disableElevation variant="contained" type="submit">
                  {intl.formatMessage({
                    id: "Entity.button.search",
                    defaultMessage: "Search",
                  })}
                </Button>
              </div>
            </form>

            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.outlet",
                        defaultMessage: "Outlet",
                      })}
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={currentSortColumn === "OUTLETNAME"}
                        direction={isSortOrderASC ? "asc" : "desc"}
                        onClick={() => createSortHandler("OUTLETNAME")}
                      >
                        {intl.formatMessage({
                          id: "Entity.label.name",
                          defaultMessage: "Name",
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
                        id: "Entity.label.transactionId",
                        defaultMessage: "Transaction ID",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.transaction",
                        defaultMessage: "Transaction",
                      })}
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={currentSortColumn === "TRANSACTIONDATE"}
                        direction={isSortOrderASC ? "asc" : "desc"}
                        onClick={() => createSortHandler("TRANSACTIONDATE")}
                      >
                        {intl.formatMessage({
                          id: "Entity.label.transDate",
                          defaultMessage: "Trans. Date",
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
                        id: "Entity.label.amount",
                        defaultMessage: "Amount",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.currency",
                        defaultMessage: "Currency",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.reverseFlag",
                        defaultMessage: "Reverse Flag",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.reason",
                        defaultMessage: "Reason",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.comment",
                        defaultMessage: "Comment",
                      })}
                    </TableCell>
                    <TableCell
                      align="center"
                      width="190px"
                      className="sticky-table head last-column-border-header"
                    >
                      {intl.formatMessage({
                        id: "Entity.label.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {manualNonActivityTransactions &&
                    manualNonActivityTransactions.length > 0 &&
                    manualNonActivityTransactions.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.entityId}</TableCell>
                        <TableCell>{row.entityName}</TableCell>
                        <TableCell>{row.transactionId}</TableCell>
                        <TableCell>{row.transactionDescription}</TableCell>
                        <TableCell>{`${row.transactionDate}`}</TableCell>
                        <TableCell>{row.transactionAmount}</TableCell>
                        <TableCell>{row.transactionCurrencyName}</TableCell>
                        <TableCell>
                          {row.reversalFlag === "Y" ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>{row.codeDescription}</TableCell>
                        <TableCell>{row.comments}</TableCell>
                        <TableCell
                          align="center"
                          width="190px"
                          className="sticky-table column last-column-border"
                        >
                          <div className="action btns-block">
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() =>
                                editTransaction(
                                  row.manualNonActivityTransactionId
                                )
                              }
                              disabled={!canUpdate}
                            >
                              <img src={edit_ic} alt="mail" />
                            </IconButton>
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() =>
                                onDelete(row.manualNonActivityTransactionId)
                              }
                              disabled={!canDelete}
                            >
                              <img src={delete_ic} alt="mail" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
      </div>
    </>
  );
}

export default ManualNonActivityFeesListing;
