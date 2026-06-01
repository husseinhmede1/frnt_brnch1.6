import React, { useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
import {
  add_rounded,
  delete_ic,
  down_arrow_icon,
  edit_ic,
} from "../../assets/images";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
} from "@mui/material";
import { MccService } from "../../services/configuration/mcc-services";
import {
  MccModel,
  MccSearchRequestModel,
} from "../../models/configuration/MccModel";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validations from "../../utils/validations";
import Swal from "sweetalert2";
import { CardSchemeModel } from "../../models/configuration/CardSchemeModel";
import {
  ConfigurationActivities,
  Errors,
  StatusCode,
  rowsPerPageOptionsConst,
  CodePrefix,
} from "../../utils/constant";
import { visuallyHidden } from "@mui/utils";
import { getActivityPermissions } from "../../utils/permissionUtils";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";

const rows = [
  { CardScheme: "", MCC: "", MerchantType: "Medical", Description: "" },
  { CardScheme: "", MCC: "", MerchantType: "Legal", Description: "" },
  { CardScheme: "", MCC: "", MerchantType: "Legal", Description: "" },
];
function Mcc() {
  const [open, setOpen] = React.useState(false);
  const [mccList, setMccList] = React.useState<MccModel[]>([]);
  const [mccDetails, setMccDetails] = React.useState<MccModel>();
  const [editedId, setEditedId] = React.useState<number | undefined>(0);
  const [cardSchemeList, setCardSchemeList] = React.useState<CardSchemeModel[]>(
    []
  );
  const [selectedCardScheme, setSelectedCardScheme] = React.useState<any>("");
  const [merchantTypeList, setMerchantTypeList] = React.useState<
    SystemCodeModel[]
  >([]);
  const [selectedMerchantType, setSelectedMerchantType] =
    React.useState<any>("");
  const [selectedMerchantType1, setSelectedMerchantType1] =
    React.useState<any>("");
  const [merchantTypeId, setMerchantTypeId] = React.useState<number | null>(
    null
  );
  const [merchantTypeId1, setMerchantTypeId1] = React.useState<number | null>(
    null
  );
  const intl = useIntl();

  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.MCC_SCREEN), []);
  const canAdd = perms.accessAdd === "1";
  const canUpdate = perms.accessUpdate === "1";
  const canDelete = perms.accessDelete === "1";
  const canView = perms.accessView === "1";

  const handleClickOpen = (isEdit: boolean) => {
    if (!isEdit) {
      handleReset();
      setEditedId(0);
      setSelectedCardScheme("");
      setSelectedMerchantType("");
    }
    setOpen(true);
    clearErrors();
  };
  const handleClose = () => {
    filterReset({
      cardSchemeId: "",
      merchantTypeId: 0,
      description: "",
      mcc: "",
    });
    setSelectedCardScheme("");
    setSelectedMerchantType("");
    onSearch(
      page,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc"
    );
    setOpen(false);
  };

  const handleReset = () => {
    reset(new MccModel());
    setMccDetails(new MccModel());
    setMerchantTypeId1(null);
    setSelectedMerchantType1("");
  };

  useEffect(() => {
    onSearch(0, rowsPerPage, currentSortColumn, isSortOrderASC ? "asc" : "desc");
    getAllCardScheme();
    getAllMerchantTypes();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<MccModel>({
    mode: "onChange",
    resolver: yupResolver(validations.mccValidations),
  });

  const {
    register: filterRegister,
    handleSubmit: filterHandleSubmit,
    reset: filterReset,
  } = useForm<MccModel>({
    mode: "onChange",
  });

  const getAllMcc = async () => {
    onSearch(
      page,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc"
    );
    await MccService.getAllMcc()
      .then((res) => {
        setMccList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllCardScheme = async () => {
    await MccService.getAllCardScheme()
      .then((res) => {
        setCardSchemeList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getAllMerchantTypes = async () => {
    const model = {
      codePrefix: CodePrefix.MERCHANT_TYPE,
    };

    await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
      .then((res) => {
        setMerchantTypeList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const getMccById = async (id: number | undefined) => {
    MccService.getMccById(Number(id))
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        reset(data);
        setMccDetails(data);
        setSelectedCardScheme(data && data.cardSchemeId);
        setSelectedMerchantType1(data && data.merchantTypeCodeSuffix);
        setMerchantTypeId1(data && data.merchantTypeSystemCodeId);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const editMcc = async (id: number | undefined) => {
    handleClickOpen(true);
    setEditedId(id);
    getMccById(id);
  };

  const onDelete = (id: number | undefined) => {
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
        MccService.deleteMcc(id)
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
            setPage(0);
            onSearch(0, rowsPerPage, "", "");
          })
          .catch((err) => {
            if (
              err &&
              err.response
              // &&
              //err.response.data === Errors.ReferenceExists
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

  const handleChange = (e: any, field: any) => {
    if (field === "cardScheme") {
      setFilterData({...filterData,cardSchemeId: e.target.value})
      setSelectedCardScheme(e.target.value);
    } else if (field === "merchantType") {
      setFilterData({...filterData, merchantTypeId: e.target.value ?? 0})
      setSelectedMerchantType(e.target.value);
    } else if (field === "merchantType1") {
      setSelectedMerchantType1(e.target.value);
    }
  };

  const onSubmit = (values: MccModel) => {
    MccService.saveOrUpdateMcc({
      ...values,
      merchantTypeId: merchantTypeId1 as number,
    })
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if (editedId) {
            toast.success("MCC details updated successfully");
          } else {
            toast.success("MCC record added successfully");
          }
        }
        handleClose();
        //getAllMcc();
        setPage(0);
        onSearch(0, rowsPerPage, "", "");
      })
      .catch((err) => {
        if (err?.response?.data) {
          toast.error(err.response.data.errors[0])
        } else {
            toast.error(err.response.data.errors[0])
        }
      });
  };

  const [page, setPage] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    rowsPerPageOptionsConst[0]
  );

  const [currentSortColumn, setCurrentSortColumn] = React.useState("mcc");
  const [isSortOrderASC, setIsSortOrderASC] = React.useState<boolean>(true);
  const [filterData, setFilterData] = React.useState<any>({
    cardSchemeId: "",
    description: "",
    mcc: "",
    merchantTypeId: 0
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onSearch(
      newPage,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc"
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
      isSortOrderASC ? "asc" : "desc"
    );
  };

  const createSortHandler = async (columnName: string) => {
    let isSortOrderASCL = isSortOrderASC
    if (currentSortColumn === columnName) {
      setIsSortOrderASC(!isSortOrderASC);
      isSortOrderASCL = !isSortOrderASC
    } else {
      setIsSortOrderASC(true);
      isSortOrderASCL = true
    }
    setCurrentSortColumn(columnName);
    onSearch(page, rowsPerPage, columnName, isSortOrderASCL ? "asc" : "desc");
  };

  const onSearch = async (
    pageNo: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) => {
    setPage(pageNo)
    setRowsPerPage(pageSize)
    getDataList(undefined, {pageNo, pageSize, sortColumn, sortOrder})
  };

  const onSearchFromList = (values?: MccModel) => {
    setPage(0);
    setFilterData(values)
    getDataList(values, undefined)
  };

  const getDataList = (values?: MccModel, pageInfo?:any) => {
    let sort;
    const fromFilterSearch = values !== undefined
    if (pageInfo?.sortColumn && pageInfo?.sortOrder) {
      sort = [
        {
          column: pageInfo?.sortColumn,
          sortOrder: pageInfo?.sortOrder.toUpperCase(),
        },
      ];
    } else {
      sort = [{ column: "mcc", sortOrder: "ASC" }];
      setCurrentSortColumn("mcc");
      setIsSortOrderASC(true);
    }
    let filtermodel: any = {
      pageNo: fromFilterSearch ? 0 : (pageInfo?.pageNo ?? page),
      pageSize: pageInfo?.pageSize ?? rowsPerPage,
      sort: sort,
      cardSchemeId: !fromFilterSearch ? filterData?.cardSchemeId : values?.cardSchemeId ? values.cardSchemeId : "" ,
      description: !fromFilterSearch ? filterData?.description : values?.description ? values.description : "" ,
      mcc: !fromFilterSearch ? filterData?.mcc : values?.mcc ? values.mcc : "",
      merchantTypeId: !fromFilterSearch ? filterData?.merchantTypeId : merchantTypeId ? merchantTypeId : 0,
    };
    MccService.filterSearch(filtermodel)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if (res.data.totalRecords > 0) {
            setTotalRecords(res.data.totalRecords);
            setMccList([...res.data.data]);
          } else {
            setMccList([]);
          }
        } else {
          setMccList([]);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  }

  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "Mcc.title",
                    defaultMessage: "MCC List",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "Mcc.subTitle",
                    defaultMessage: "List of defined MCCs",
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
                  <FormattedMessage id="Mcc.addBtn" defaultMessage="Add MCC" />
                </Button>
              </div>
            </div>
            <form onSubmit={filterHandleSubmit(onSearchFromList)}>
              <div className="input-elements">
                <Grid spacing={3} container className="compact-grid">
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label ">
                      <label>
                        {intl.formatMessage({
                          id: "Mcc.cardScheme",
                          defaultMessage: "Card Scheme",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder={intl.formatMessage({
                            id: "Mcc.cardSchemePlaceholder",
                            defaultMessage: "ALL",
                          })}
                          {...filterRegister("cardSchemeId")}
                          onChange={(e) => handleChange(e, "cardScheme")}
                          value={selectedCardScheme}
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "Mcc.cardSchemePlaceholder",
                                defaultMessage: "ALL",
                              })}
                            </em>
                          </MenuItem>
                          {cardSchemeList &&
                            cardSchemeList.length > 0 &&
                            cardSchemeList.map((scheme) => {
                              return (
                                <MenuItem
                                  key={scheme.cardSchemeId}
                                  value={scheme.cardSchemeId}
                                >
                                  {scheme.cardSchemeName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Mcc.mcc",
                          defaultMessage: "MCC",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          error
                          fullWidth
                          placeholder={intl.formatMessage({
                            id: "Mcc.mccPlaceholder",
                            defaultMessage: "Write your MCC",
                          })}
                          {...filterRegister("mcc")}
                          // autoComplete="off"
                          // aria-describedby="error-helper-text"
                          id="mcc"
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label ">
                      <label>
                        {intl.formatMessage({
                          id: "Mcc.merchantType",
                          defaultMessage: "Merchant Type",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder={intl.formatMessage({
                            id: "Mcc.merchantTypePlaceholder",
                            defaultMessage: "Select",
                          })}
                          {...filterRegister("merchantTypeId")}
                          onChange={(e) => handleChange(e, "merchantType")}
                          value={selectedMerchantType}
                        >
                          <MenuItem
                            value=""
                            onClick={() => {
                              setMerchantTypeId(null);
                            }}
                          >
                            <em>
                              {intl.formatMessage({
                                id: "Mcc.merchantTypePlaceholder",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {merchantTypeList &&
                            merchantTypeList.length > 0 &&
                            merchantTypeList.map((type) => {
                              return (
                                <MenuItem
                                  value={type.systemCodeId}
                                  key={type.systemCodeId}
                                  onClick={() => {
                                    setMerchantTypeId(type.systemCodeId);
                                  }}
                                >
                                  {type.description}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Mcc.description",
                          defaultMessage: "Description",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          error
                          fullWidth
                          placeholder={intl.formatMessage({
                            id: "Mcc.descriptionPlaceholder",
                            defaultMessage: "Write your description",
                          })}
                          {...filterRegister("description")}
                          // autoComplete="off"
                          // aria-describedby="error-helper-text"
                          id="description"
                        />
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
                        id: "Mcc.cardScheme",
                        defaultMessage: "Card Scheme",
                      })}
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={currentSortColumn === "mcc"}
                        direction={isSortOrderASC ? "asc" : "desc"}
                        onClick={() => createSortHandler("mcc")}
                      >
                        {intl.formatMessage({
                          id: "Mcc.mcc",
                          defaultMessage: "MCC",
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
                        id: "Mcc.merchantType",
                        defaultMessage: "Merchant Type",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Mcc.description",
                        defaultMessage: "Description",
                      })}
                    </TableCell>
                    <TableCell
                      align="center"
                      width="190px"
                      className="last-column-border-header"
                    >
                      <FormattedMessage
                        id="Mcc.actions"
                        defaultMessage="Actions"
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mccList &&
                    mccList.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.cardSchemeName}</TableCell>
                        <TableCell>{row.mcc}</TableCell>
                        <TableCell>{row.merchantTypeCodeDescription}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell
                          align="center"
                          width="190px"
                          className="last-column-border"
                        >
                          <div className="action btns-block">
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() => editMcc(row.mccId)}
                              disabled={!canUpdate}
                            >
                              <img src={edit_ic} alt="mail" />
                            </IconButton>
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() => onDelete(row.mccId)}
                              disabled={!canDelete}
                            >
                              <img src={delete_ic} alt="mail" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {mccList && mccList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={13} className="last-column-border">
                        <p style={{ textAlign: "center" }}>
                          {intl.formatMessage({
                            id: "Mcc.noDataFound",
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
                      id: "Mcc.definition",
                      defaultMessage: "MCC Defintion",
                    })}
                  </Typography>
                  <p className="pb-0">
                    {intl.formatMessage({
                      id: "Mcc.addUpdateTitle",
                      defaultMessage: "Add or Update MCC",
                    })}
                  </p>
                </div>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="inner-card">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label>
                        {intl.formatMessage({
                          id: "Mcc.cardScheme",
                          defaultMessage: "Card Scheme",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder={intl.formatMessage({
                            id: "Mcc.cardSchemePlaceholder",
                            defaultMessage: "ALL",
                          })}
                          {...register("cardSchemeId")}
                          onChange={(e) => handleChange(e, "cardScheme")}
                          value={selectedCardScheme}
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "Mcc.cardSchemePlaceholder",
                                defaultMessage: "ALL",
                              })}
                            </em>
                          </MenuItem>
                          {cardSchemeList &&
                            cardSchemeList.length > 0 &&
                            cardSchemeList.map((scheme) => {
                              return (
                                <MenuItem
                                  key={scheme.cardSchemeId}
                                  value={scheme.cardSchemeId}
                                >
                                  {scheme.cardSchemeName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {selectedCardScheme === "" &&
                        errors.cardSchemeId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {validations.createMccValidation.cardSCheme}
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label ">
                      <label>
                        {intl.formatMessage({
                          id: "Mcc.merchantType",
                          defaultMessage: "Merchant Type",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                          placeholder={intl.formatMessage({
                            id: "Mcc.merchantTypePlaceholder",
                            defaultMessage: "Select",
                          })}
                          value={selectedMerchantType1}
                          {...register("merchantTypeId")}
                          onChange={(e) => handleChange(e, "merchantType1")}
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "Mcc.merchantTypePlaceholder",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {merchantTypeList &&
                            merchantTypeList.length > 0 &&
                            merchantTypeList.map((type) => {
                              return (
                                <MenuItem
                                  value={type.codeSuffix}
                                  key={type.systemCodeId}
                                  onClick={() => {
                                    setMerchantTypeId1(type.systemCodeId);
                                  }}
                                >
                                  {type.description}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {selectedMerchantType1 === "" &&
                        errors.merchantTypeId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {validations.createMccValidation.merchantType}
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Mcc.mcc",
                          defaultMessage: "MCC",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          error
                          fullWidth
                          placeholder={intl.formatMessage({
                            id: "Mcc.mccPlaceholder",
                            defaultMessage: "Write your MCC",
                          })}
                          {...register("mcc")}
                          // autoComplete="off"
                          // aria-describedby="error-helper-text"
                          id="mcc"
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.mcc?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Mcc.description",
                          defaultMessage: "Description",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          error
                          fullWidth
                          placeholder={intl.formatMessage({
                            id: "Mcc.descriptionPlaceholder",
                            defaultMessage: "Write your description",
                          })}
                          {...register("description")}
                          // autoComplete="off"
                          // aria-describedby="error-helper-text"
                          id="description"
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.description?.message}
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
                <FormattedMessage id="Mcc.cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                disableElevation
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                <FormattedMessage id="Mcc.save" defaultMessage="Save" />
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
}

export default Mcc;
