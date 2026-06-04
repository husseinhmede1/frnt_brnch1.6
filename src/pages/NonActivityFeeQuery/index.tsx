import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { date_ic, down_arrow_icon } from "../../assets/images";
import {
  FormControl,
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
import {
  EntityListModel,
  TerminalModel,
} from "../../models/entityManagement/EntityModel";
import { Institution } from "../../models/configuration/InstitutionModel";
import { useIntl } from "react-intl";
import moment from "moment";
import { toast } from "react-toastify";
import {
  Errors,
  StatusCode,
  rowsPerPageOptionsConst,
  TRANS_USAGE,
  OptionType,
  ENTITY_LEVEL,
  CodePrefix,
} from "../../utils/constant";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validations from "../../utils/validations";
import { TransactionGroupService } from "../../services/configuration/transaction-group-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { ConfigurationActivities } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import { InstitutionService } from "../../services/configuration/institution-service";
import { TransactionUsageModel } from "../../models/configuration/TransactionGroupModel";
import { EntityService } from "../../services/entityManagement/entity-service";
import { visuallyHidden } from "@mui/utils";
import {
  NonActivityFeeQueryFilterModel,
  NonActivityFeeQueryModel,
} from "../../models/entityManagement/NonActivityFeeQueryModel";
import { NonActivityFeeQueryServices } from "../../services/entityManagement/non-activity-fee-query-services";
import ReactSelect from "react-select";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";

function NonActivityFeeQuery() {
  const navigate = useNavigate();
  const intl = useIntl();

  const perms = React.useMemo(() => getActivityPermissions(ConfigurationActivities.NONACFEEINQ), []);
  const canSearch = perms.accessView === "1" && hasApiAccess(ConfigurationActivities.NONACFEEINQ, 'SNAFQSRCH');
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
  const [nonActivityFeeQueries, setNonActivityFeeQueries] = React.useState<
    NonActivityFeeQueryModel[]
  >([]);
  const [
    nonActivityFeeQueryFilterDetails,
    setNonActivityFeeQueryFilterDetails,
  ] = React.useState<NonActivityFeeQueryFilterModel>(
    new NonActivityFeeQueryFilterModel()
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

  const outLetIdRequired = "Entity/OutletId is required.";

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getAllNonActivityFeeQueries(
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
    getAllNonActivityFeeQueries(
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
    getAllNonActivityFeeQueries(
      page,
      rowsPerPage,
      columnName,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal
    );
  };

  const onSubmit = async (values: NonActivityFeeQueryFilterModel) => {
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
        fromProcessingDate: moment(values?.fromProcessingDate).format(
          "DD/MM/yyyy"
        ),
        toProcessingDate: moment(values?.toProcessingDate).format("DD/MM/yyyy"),
        sort: sort,
        transactionId: values.transactionId,
        entityId: outletId?.value,
      };
      setFilterState(model);
      getValuesBySearch(model);
    }
  };

  const getValuesBySearch = (model: any) => {
    NonActivityFeeQueryServices.getBySearch(model)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          if (res?.data?.totalRecords > 0) {
            setTotalRecords(res?.data?.totalRecords);
            setNonActivityFeeQueries([...res.data.data]);
            setFilterApplied(true);
          } else {
            setNonActivityFeeQueries([]);
            setTotalRecords(0);
          }
        } else {
          setNonActivityFeeQueries([]);
          setTotalRecords(0);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllNonActivityFeeQueries = (
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
      fromProcessingDate: moment(new Date()).format("DD/MM/yyyy"),
      toProessingDate: moment(new Date()).format("DD/MM/yyyy"),
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
      NonActivityFeeQueryServices.getBySearch(model)
        .then((res) => {
          if (res.status === StatusCode.Success) {
            if (res.data.totalRecords > 0) {
              setTotalRecords(res.data.totalRecords);
              setNonActivityFeeQueries([...res.data.data]);
            } else {
              setNonActivityFeeQueries([]);
              setTotalRecords(0);
            }
          } else {
            setNonActivityFeeQueries([]);
            setTotalRecords(0);
          }
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    setNonActivityFeeQueryFilterDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (event.target.name === "entityId") {
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
      setNonActivityFeeQueryFilterDetails({
        ...nonActivityFeeQueryFilterDetails,
        entityId: "",
      });
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
      setNonActivityFeeQueryFilterDetails({
        ...nonActivityFeeQueryFilterDetails,
        institutionId: instID,
      });
    }
    getAllNonActivityFeeQueries(
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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<NonActivityFeeQueryFilterModel>({
    mode: "onChange",
    resolver: yupResolver(validations.filterNonActivityFeeQueryValidation),
  });

  const handleOutletChange = (e: OptionType) => {
    if (e) {
      setNonActivityFeeQueryFilterDetails((prev) => ({
        ...prev,
        outletId: e.value!.toString(),
      }));
      setOutletErr("");
      setEntityDesc(e.desc ? e.desc : "");
      setOutletId({ value: e?.value!, label: e?.label! });
    } else {
      setNonActivityFeeQueryFilterDetails((prev) => ({
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
                    id: "Entity.nonActivityFeeQuery",
                    defaultMessage: "Non Activity Fee Query",
                  })}
                </Typography>
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
                          name="entityId"
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
                          value={entityDesc}
                          disabled
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label>
                        {intl.formatMessage({
                          id: "Entity.label.fromProcessingDate",
                          defaultMessage: "From Processing Date",
                        })}

                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="fromProcessingDate"
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
                                    setNonActivityFeeQueryFilterDetails(
                                      (prev) => ({
                                        ...prev,
                                        fromProcessingDate: date,
                                      })
                                    );
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
                          {errors.fromProcessingDate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label>
                        {intl.formatMessage({
                          id: "Entity.label.toProcessingDate",
                          defaultMessage: "To Processing Date",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="toProcessingDate"
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
                                    setNonActivityFeeQueryFilterDetails(
                                      (prev) => ({
                                        ...prev,
                                        toProcessingDate: date,
                                      })
                                    );
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
                          {errors.toProcessingDate?.message}
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
                            nonActivityFeeQueryFilterDetails.transactionId
                              ? nonActivityFeeQueryFilterDetails.transactionId
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
                            <em>
                              {intl.formatMessage({
                                id: "Entity.select",
                                defaultMessage: "Select",
                              })}
                            </em>
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
                <Button
                  disableElevation
                  variant="contained"
                  type="submit"
                  disabled={!canSearch}
                  onClick={() => {
                    console.log("errors", errors);
                  }}
                >
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
                      {" "}
                      {intl.formatMessage({
                        id: "Entity.label.transactionCode",
                        defaultMessage: "Transaction Code",
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
                      {" "}
                      {intl.formatMessage({
                        id: "Entity.label.transactionAmount",
                        defaultMessage: "Transaction Amount",
                      })}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {intl.formatMessage({
                        id: "Entity.label.processingDate",
                        defaultMessage: "Processing Date",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.transactionCurrency",
                        defaultMessage: "Transaction Currency",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.reverseFlag",
                        defaultMessage: "Reverse Flag",
                      })}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {intl.formatMessage({
                        id: "Entity.label.manualFlag",
                        defaultMessage: "Manual Flag",
                      })}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {intl.formatMessage({
                        id: "Entity.label.comment",
                        defaultMessage: "Comment",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nonActivityFeeQueries.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.entityId}</TableCell>
                      <TableCell>{row.entityName}</TableCell>
                      <TableCell>{row.transactionDescription}</TableCell>
                      <TableCell>{`${row.transactionDate}`}</TableCell>
                      <TableCell>{row.transactionAmount}</TableCell>
                      <TableCell>{`${row.processingDate}`}</TableCell>
                      <TableCell>{row.transactionCurrencyName}</TableCell>
                      <TableCell>{row.reversalReason}</TableCell>
                      <TableCell>{row.manualEntry}</TableCell>
                      <TableCell>{row.description}</TableCell>
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

export default NonActivityFeeQuery;
