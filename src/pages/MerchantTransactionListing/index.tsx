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
  Box,
  FormControl,
  FormHelperText,
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
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  MerchantTransactionFilterModel,
  MerchantTransactionListingModel,
} from "../../models/entityManagement/MerchantTransactionModel";
import { MerchantTransactionServices } from "../../services/entityManagement/merchant-transaction-services";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validations from "../../utils/validations";
import { EntityService } from "../../services/entityManagement/entity-service";
import {
  EntityListModel,
  TerminalModel,
} from "../../models/entityManagement/EntityModel";
import { TerminalService } from "../../services/entityManagement/terminal-service";
import { Institution } from "../../models/configuration/InstitutionModel";
import moment from "moment";
import { TransactionUsageModel } from "../../models/configuration/TransactionGroupModel";
import { TransactionGroupService } from "../../services/configuration/transaction-group-service";
import { visuallyHidden } from "@mui/utils";
import ReactSelect from "react-select";
import { InstitutionService } from "../../services/configuration/institution-service";

function MerchantTransactionListing() {
  const navigate = useNavigate();
  const intl = useIntl();
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [entityDesc, setEntityDesc] = React.useState("");
  const [entityList, setEntityList] = React.useState<
    { label: string; value: string; desc: string }[]
  >([]);
  const [terminalList, setTerminalList] = React.useState<TerminalModel[]>([]);
  const [institutionList, setInstitutionList] = React.useState<Institution[]>(
    []
  );
  const [transactionList, setTransactionList] = React.useState<
    TransactionUsageModel[]
  >([]);
    const [transactionListWithIsFiltered, setTransactionListWithIsFiltered] = React.useState<
    TransactionUsageModel[]
  >([]);
  const [merchantTransactions, setMerchantTransactions] = React.useState<
    MerchantTransactionListingModel[]
  >([]);
  const [transactionFilterDetails, setTransactionFilterDetails] =
    React.useState<MerchantTransactionFilterModel>(
      new MerchantTransactionFilterModel()
    );
  const [filterApplied, setFilterApplied] = React.useState<boolean>(false);
  const [filterState, setFilterState] = React.useState<any>(null);
  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.MANTRANS), []);
  const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.MANTRANS, 'SMMTX');
  const canUpdate = perms.accessUpdate === "1";
  const canDelete = perms.accessDelete === "1";
  const canView = perms.accessView === "1";

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
    getAllMerchantTransactions(
      newPage,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal,
      true
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    getAllMerchantTransactions(
      page,
      +event.target.value,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal,
      true
    );
  };

  const createSortHandler = async (columnName: string) => {
    if (currentSortColumn === columnName) {
      setIsSortOrderASC(!isSortOrderASC);
    } else {
      setIsSortOrderASC(true);
    }
    setCurrentSortColumn(columnName);
    getAllMerchantTransactions(
      page,
      rowsPerPage,
      columnName,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal,
      true
    );
  };

  const onSubmit = async (values: MerchantTransactionFilterModel) => {
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
        cardNumber: values.cardNumber ? values.cardNumber : "",
        sort: sort,
        terminalId: values.terminalId,
        transactionId: values.transactionId,
        outletId: outletId?.value,
      };
      setFilterState(model);
      getValuesBySearch(model);
    }
  };

  const getValuesBySearch = (model: any) => {
    MerchantTransactionServices.getBySearch(model)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          if (res?.data?.totalRecords > 0) {
            setTotalRecords(res?.data?.totalRecords);
            setMerchantTransactions([...res.data.data]);
            setFilterApplied(true);
          } else {
            setMerchantTransactions([]);
            setTotalRecords(0);
          }
        } else {
          setMerchantTransactions([]);
          setTotalRecords(0);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllMerchantTransactions = (
    pageNo: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    instId: string,
    isBySearch: boolean
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
      if (isBySearch) {        
        getValuesBySearch({
          ...filterState,
          pageNo,
          pageSize,
          sort,
        });
      }
      setPage(pageNo);
      setRowsPerPage(pageSize);
      setCurrentSortColumn(sortColumn);
      setIsSortOrderASC(sortOrder.toUpperCase() === "ASC" ? true : false);
      setSelectInstitutionVal(instId.toString());
    } else {
      if (isBySearch) {        
        MerchantTransactionServices.getBySearch(model)
          .then((res) => {
            if (res.status === StatusCode.Success) {
              if (res.data.totalRecords > 0) {
                setTotalRecords(res.data.totalRecords);
                setMerchantTransactions([...res.data.data]);
              } else {
                setMerchantTransactions([]);
                setTotalRecords(0);
              }
            } else {
              setMerchantTransactions([]);
              setTotalRecords(0);
            }
          })
          .catch((err) =>   toast.error(err.response.data.errors[0]));
      }
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
        institutionId: event.target.value,
      });
      TransactionGroupService.getAllTransactionsByUsage(TRANS_USAGE.TRANS,event.target.value )
      .then((res) => {
        setTransactionList(res?.data.filter(t => t.institutionId === event.target.value));
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<MerchantTransactionFilterModel>({
    mode: "onChange",
    resolver: yupResolver(validations.filterMerchantTransactionValidation),
  });

  useEffect(() => {
    setInstitutefromLocalStorage();
    getAllTransactionsByUsage();
  }, []);

  useEffect(() => {
    if (transactionFilterDetails?.outletId) {
      getTerminalsByEntityId(transactionFilterDetails?.outletId);
    }
  }, [transactionFilterDetails?.outletId]);

  useEffect(() => {
    if (selectInstitutionVal) {
      getEntitiesByEntityLevelNameAndInstitution(selectInstitutionVal);
    }
  }, [selectInstitutionVal]);

  const getTerminalsByEntityId = (id: string) => {
    TerminalService.getAllByEntityId(id)
      .then((res) => {
        setTerminalList(res?.data);
      })
      .catch((err) => {
          toast.error(err.response.data.errors[0]);
        setTerminalList([]);
      });
  };

  const getAllTransactionsByUsage = () => {
    //     let UsageSysId = 0;
    // SystemCodeServices.getAllSystemCodes().then(res => {
    //     UsageSysId = res.data.find(data => data.codePrefix === CodePrefix.TRANS_USAGE && data.description === TRANS_USAGE.TRANS)?.systemCodeId ?? 0;

    //     if(UsageSysId !== 0){
    //       TransactionGroupService.getAllTransactionsByUsage(UsageSysId, "").then(res => {
    //         setTransactionList(res?.data);
    //       }).catch(err =>   toast.error(err.response.data.errors[0]))
    //     }

    // });
    TransactionGroupService.getAllTransactionsByUsage(TRANS_USAGE.TRANS, "")
      .then((res) => {
        setTransactionList(res?.data);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
    const institutions = JSON.parse(
      getLocalStorage(LOCALSTORAGE_KEYS.INSTITUTES) as string
    );
    if (institutions) {
      await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitutionList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
    if (instID) {
      setSelectInstitutionVal(instID);
      getEntitiesByEntityLevelNameAndInstitution(instID);
      setValue("institutionId", instID);
      setTransactionFilterDetails({
        ...transactionFilterDetails,
        institutionId: instID,
      });
    }
    getAllMerchantTransactions(
      0,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      instID,
      false,
    );
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
    navigate(`/merchant-transaction-definition/${id}`,{ state: { institutionId: selectInstitutionVal , isEdit:true }});
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
        MerchantTransactionServices.deleteById(id)
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
            getAllMerchantTransactions(
              0,
              rowsPerPage,
              currentSortColumn,
              isSortOrderASC ? "asc" : "desc",
              selectInstitutionVal,
              true

            );
          })
          .catch((err) => {
            if (
              err &&
              err.response
              // &&
        //      err.response.data === Errors.ReferenceExists
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
                    id: "Entity.merchantTransactions",
                    defaultMessage: "Manual Transactions",
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
                    navigate("/merchant-transaction-definition", {
                       state: { institutionId: selectInstitutionVal , isEdit:false } 
                    })
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
                <Grid spacing={5} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
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
                        {(transactionFilterDetails.institutionId
                          ? transactionFilterDetails.institutionId.toString()
                          : "") === "" && errors?.institutionId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations
                                .filterMerchantTransactionValidationMessage
                                .institutionId
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
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
                          value={entityDesc}
                          disabled
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label date-select-input">
                      <label className="lg">
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
                            render={({ field }) => (
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
                            )}
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
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.toTransactionDate",
                          defaultMessage: "To Transaction Date",
                        })}

                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            defaultValue={new Date()}
                            control={control}
                            name="toTransactionDate"
                            render={({ field }) => (
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
                            )}
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
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.cardNumber",
                          defaultMessage: "Card Number",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.number",
                            defaultMessage: "Enter Number",
                          })}
                          fullWidth
                          {...register("cardNumber")}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
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
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.termialId",
                          defaultMessage: "Terminal ID",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("terminalId")}
                          value={
                            transactionFilterDetails.terminalId
                              ? transactionFilterDetails.terminalId.toString()
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
                          {terminalList &&
                            terminalList.length > 0 &&
                            terminalList.map((item) => (
                              <MenuItem
                                value={item.terminalId}
                                key={item.terminalId}
                              >
                                {item.terminalId}
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
                        id: "Entity.label.terminal",
                        defaultMessage: "Terminal",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.card",
                        defaultMessage: "Card",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.cardSequence",
                        defaultMessage: "Card Sequence",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.cardExpDate",
                        defaultMessage: "Card Expiry date",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.transCode",
                        defaultMessage: "Trans. Code",
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
                        id: "Entity.label.transAmount",
                        defaultMessage: "Trans. Amount",
                      })}
                    </TableCell>

                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.authNumber",
                        defaultMessage: "Auth. Number",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.tipsAmount",
                        defaultMessage: "Tips Amount",
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
                  {merchantTransactions &&
                    merchantTransactions.length > 0 &&
                    merchantTransactions.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.entityId}</TableCell>
                        <TableCell>{row.entityName}</TableCell>
                        <TableCell>{row.terminalId}</TableCell>
                        <TableCell>{row.cardNumber}</TableCell>
                        <TableCell>{row.cardSeqNbr}</TableCell>
                        <TableCell>{row.expiryDate}</TableCell>
                        <TableCell>{row.transactionId}</TableCell>
                        <TableCell>{row.transactionDate}</TableCell>
                        <TableCell>{row.transactionAmount}</TableCell>
                        <TableCell>{row.authorizationNumber}</TableCell>
                        <TableCell>{row.tipsAmount}</TableCell>
                        <TableCell
                          align="center"
                          width="190px"
                          className="sticky-table column last-column-border"
                        >
                          <div className="action btns-block">
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() =>
                                editTransaction(row.merchantTransactionId)
                              }
                              disabled={!canUpdate}
                            >
                              <img src={edit_ic} alt="mail" />
                            </IconButton>
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() =>
                                onDelete(row.merchantTransactionId)
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

export default MerchantTransactionListing;
