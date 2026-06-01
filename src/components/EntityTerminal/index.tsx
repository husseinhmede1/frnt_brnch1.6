import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputBase, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { add_rounded, date_ic, delete_ic, down_arrow_icon, edit_ic } from "../../assets/images";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import { MccModel } from "../../models/configuration/MccModel";
import { TerminalTypeModel } from "../../models/configuration/TerminalTypeModel";
import { TerminalModel, TerminalSearchModel } from "../../models/entityManagement/EntityModel";
import { CurrencyService } from "../../services/configuration/currency-service";
import { MccService } from "../../services/configuration/mcc-services";
import { TerminalTypeService } from "../../services/configuration/terminal-type-service";
import { TerminalService } from "../../services/entityManagement/terminal-service";
import { Errors, rowsPerPageOptionsConst, StatusCode } from "../../utils/constant";
import validations from "../../utils/validations";
import ReactSelect, { createFilter } from "react-select";


function EntityTerminal(props: any) {
  const { value, TabPanel, institutionId, checkIsEmptyModules } = props;
  const { id } = useParams<{ id?: any }>();

  const [open, setOpen] = React.useState(false);
  const [terminalList, setTerminalList] = React.useState<TerminalModel[]>([]);
  const [terminalDetails, setTerminalDetails] = React.useState<TerminalModel>(new TerminalModel());
  const [editedId, setEditedId] = useState<string | undefined>("0");
  const [enable, setEnable] = useState(true);
  const [currencyList, setCurrencyList] = useState<CurrencyModel[]>([]);
  const [terminalTypeList, setTerminalTypeList] = React.useState<TerminalTypeModel[]>([]);
  //const [mccList, setMccList] = React.useState<MccModel[]>([]);
  const [mccList, setMccList] = React.useState<{ label: string, value: string }[]>([]);
  const [mccId, setMccId] = useState<{ label: string, value: string }>();
  const [isLoading, setIsLoading] = React.useState(false);

  const [selectTypeVal, setSelectTypeVal] = React.useState<any>("");
  const [selectMccVal, setSelectMccVal] = React.useState<any>("");
  const [selectCurrencyVal, setSelectCurrencyVal] = React.useState<any>("");
  const [eCommerceValue, setECommerceValue] = React.useState<any>("Y");
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset: recordReset,
    clearErrors,
    control,
      formState: { errors, isSubmitting },
  } = useForm<TerminalModel>({
    mode: "onChange",
    resolver: yupResolver(validations.createTerminal),
  });

  useEffect(() => {
    if (id) {
      searchTerminal(0, rowsPerPage);
    }
    getAllCurrencies();
    getAllTerminalType();
    getAllMcc();
  }, []);

  const getAllCurrencies = async () => {
    await CurrencyService.getActiveCurrencies()
      .then((res) => {
        setCurrencyList([...res.data]);
      })
      .catch((err) =>          toast.error(err.response.data.errors[0])
      );
  };

  // const getAllMcc = async () => {
  //   await MccService.getAllMcc()
  //     .then((res) => {
  //       setMccList([...res.data]);
  //     })
  //     .catch((err) =>   toast.error(err.response.data.errors[0]));
  // };

  const getAllMcc = async () => {
    setIsLoading(true);
    let option: any = []
    await MccService.getAllMcc()
      .then((res) => {
        if (res.data) {
          option = res?.data?.map((data) => {
            const label = `${data.mcc} - ${data.description}`;
            const value = (data.mccId).toString();
            return { label, value }
          })
        }
        setMccList(option);
        setIsLoading(false)
      })
      .catch((err) =>          toast.error(err.response.data.errors[0])
      );
  };

  const mccIdRequired = "MCC is required";
  const [mccErr, setMccErr] = React.useState("");

  const getAllTerminalType = async () => {
    await TerminalTypeService.getActive()
      .then((res) => {
        setTerminalTypeList([...res.data]);
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setSelectTypeVal(event.target.value);
  };

  const eComValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setECommerceValue(event.target.value);
  };

  const handleMccChange = (e: any) => {
    //setSelectMccVal(event.target.value);
    setValue("mccId", e?.value);
    setMccId({ value: e?.value!, label: e?.label! });
    setMccErr("")
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setSelectCurrencyVal(event.target.value);
  };

  const handleClickOpen = (isEdit: boolean) => {
    if (!isEdit) {
      handleReset();
    }
    setOpen(true);
    clearErrors();
  };

  const handleReset = (): void => {
    //reset(new TerminalModel());
    recordReset();
    setSelectCurrencyVal("");
    setSelectTypeVal("");
    setEnable(true);
    setECommerceValue("Y");
    setEditedId(undefined);
    setTerminalDetails(new TerminalModel());
  };

  const handleClose = () => {
    setOpen(false);
    recordReset({
      actualStartDate: undefined,
      terminationDate: undefined,
      terminalId: undefined,
      terminalTypeId: 0,
      eCommerceFlag: undefined,
      serialNumber: undefined,
      institutionId: undefined,
      currencyId: 0,
      mccId: '0',
      status: undefined,
      entityId: undefined,
      terminalTypesId: 0,
      terminalTypes: undefined,
      institutionName: undefined,
      currencyCode: undefined,
      currencyName: undefined,
      mcc: undefined,
      entityName: undefined,
    });
  };

  const handleEnableDisableChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEnable(event.target.checked === true);
  }



  const getTerminalById = async (id: string) => {
    TerminalService.getById(id, institutionId).then((res) => {
      const data = JSON.parse(JSON.stringify(res.data));
      recordReset({
        ...res.data,
        actualStartDate: new Date(moment(res?.data?.actualStartDate, "DD/MM/yyyy").toString()),
        terminationDate: new Date(moment(res?.data?.terminationDate, "DD/MM/yyyy").toString()),
      });
      setTerminalDetails(data);
      setSelectCurrencyVal(data.currencyId?.toString());
      setSelectMccVal(data.mccId?.toString());
      setSelectTypeVal(data.terminalTypesId?.toString());
      setEnable(data.status === "1" ? true : false);
      setECommerceValue(data.eCommerceFlag && data.eCommerceFlag === 'Y' ? "Y" : "N");
      setMccId({ label: `${data?.mcc} - ${data?.mccDescription}`, value: data?.mccId })

    }).catch(err =>          toast.error(err.response.data.errors[0])
    );
  }

  const editTerminal = async (id: string) => {
    handleClickOpen(true);
    setEditedId(id);
    getTerminalById(id);
  }

  const onDelete = (id: string | undefined) => {
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
        TerminalService.deleteById(id, institutionId).then(res => {
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
          searchTerminal(0, rowsPerPage);
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

  const onSubmit = async (value: TerminalModel) => {
    const model = {
      ...value,
      status: enable ? "1" : "0",
      institutionId: institutionId,
      entityId: id,
      eCommerceFlag: eCommerceValue === 'Y' ? "Y" : "N",
      actualStartDate: moment(value.actualStartDate).format("DD/MM/yyyy"),
      terminationDate: moment(value.terminationDate).format("DD/MM/yyyy"),
      mccId: mccId?.value,
      updateFlag: editedId ? '1' : '0'
    };
    TerminalService.saveOrUpdate(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if (editedId) {
            toast.success(`Terminal Type details updated successfully`);
          } else {
            toast.success("Terminal Type record added successfully");
          }
        }
        handleClose();
        setPage(0);
        searchTerminal(0, rowsPerPage);
      })
      .catch((err) => {
        if (
          err &&
          err.response
          //&&
          //err.response.data === Errors.IdAlreadyExists
        ) {
          toast.error(err.response.data.errors[0])
        }
        else {
                    toast.error(err.response.data.errors[0])
          
        }
      });
  };

  const [page, setPage] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptionsConst[0]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    searchTerminal(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    searchTerminal(page, +event.target.value);
  };

  const searchTerminal = async (pageNo: number, pageSize: number) => {
    const model = new TerminalSearchModel();
    model.entityId = id;
    model.pageNo = pageNo;
    model.pageSize = pageSize;
    TerminalService.search(model)
      .then((res) => {
        if(res?.data?.data){
        setTotalRecords(res.data.totalRecords);
        setTerminalList([...res.data.data]);
        if (res && res.data && res.data.data && res.data.data.length === 0) {
          checkIsEmptyModules("terminal", true)
        }
        else {
          checkIsEmptyModules("terminal", false)
        }
    }}).catch((err) =>          toast.error(err.response.data.errors[0])
    );
  }

  return (
    <>
      <TabPanel value={value} index={2}>
        <div className="panel-body">
          <div className="title-block">
            <div className="left-block mb-0">
            </div>
            <div className="right-block">
              <Button
                variant="contained"
                disableElevation
                className="btn-light"
                endIcon={<img src={add_rounded} alt="add" />}
                onClick={() => handleClickOpen(false)}
              >
                <FormattedMessage
                  id="Entity.Terminal.addBtn"
                  defaultMessage="Add Terminal"
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
                      id: "Entity.Terminal.terminalId",
                      defaultMessage: "Terminal ID",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "Entity.Terminal.serialNumber",
                      defaultMessage: "Serial Number",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "Entity.Terminal.startDate",
                      defaultMessage: "Start Date",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "Entity.Terminal.terminationDate",
                      defaultMessage: "Termination Date",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "Entity.Terminal.ecommerce",
                      defaultMessage: "Ecommerce",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "Entity.Terminal.type",
                      defaultMessage: "Type",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "Entity.Terminal.currency",
                      defaultMessage: "Currency",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "Entity.Terminal.mCC",
                      defaultMessage: "MCC",
                    })}
                  </TableCell>
                  <TableCell align="center" width="190px" className="last-column-border-header">
                    {intl.formatMessage({
                      id: "Entity.Terminal.actions",
                      defaultMessage: "Actions",
                    })}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {terminalList.map((row, i) => (
                  <TableRow
                    key={i}
                  >
                    <TableCell>{row.terminalId}</TableCell>
                    <TableCell>{row.serialNumber}</TableCell>
                    <TableCell>{row.actualStartDate ? `${row.actualStartDate}` : ""}</TableCell>
                    <TableCell>{row.terminationDate ? `${row.terminationDate}` : ""}</TableCell>
                    <TableCell>{row.eCommerceFlag?.toUpperCase()}</TableCell>
                    <TableCell>{row.terminalTypes}</TableCell>
                    <TableCell>{row.currencyName}</TableCell>
                    <TableCell>{row.mcc}</TableCell>
                    <TableCell align="center" width="190px" className="last-column-border">
                      <div className="action btns-block">
                        <IconButton className="border-icon-btn no-border sm" onClick={() => editTerminal(row.terminalId)}>
                          <img src={edit_ic} alt="edit" />
                        </IconButton>
                        <IconButton className="border-icon-btn no-border sm" onClick={() => onDelete(row.terminalId)}>
                          <img src={delete_ic} alt="delete" />
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
      </TabPanel>
      <Dialog open={open} onClose={handleClose} className="c-dialog">
        <form>
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "Entity.Terminal.definitionTitle",
                    defaultMessage: "Terminal Definition",
                  })}
                </Typography>
                <p>{intl.formatMessage({
                  id: "Entity.Terminal.definitionSubTitle",
                  defaultMessage: "Add or Update a Terminal",
                })}</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card">
              <Grid spacing={5} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.Terminal.terminalId",
                        defaultMessage: "Terminal ID",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>

                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.Terminal.enterTerminalId",
                          defaultMessage: "Terminal ID",
                        })}
                        error
                        fullWidth
                        id="terminalId"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("terminalId")}
                        disabled={editedId ? true : false}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.terminalId?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.Terminal.enterSerialNo",
                        defaultMessage: "Serial No",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>

                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.Terminal.enterSerialNoPlaceholder",
                          defaultMessage: "Serial No",
                        })}
                        error
                        fullWidth
                        id="terminalType"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("serialNumber")}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.serialNumber?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.Terminal.selectTerminalTypeId",
                        defaultMessage: "Type",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        {...register("terminalTypeId")}
                        displayEmpty
                        value={selectTypeVal}
                        onChange={handleTypeChange}
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.select",
                            defaultMessage: "Select"
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>{intl.formatMessage({
                            id: "Entity.Terminal.selectTerminalTypeIdPlaceholder",
                            defaultMessage: "Select",
                          })}</em>
                        </MenuItem>
                        {terminalTypeList &&
                          terminalTypeList.length > 0 &&
                          terminalTypeList.map((type) => {
                            return (
                              <MenuItem value={type.terminalTypesId} key={type.terminalTypesId}>
                                {type.terminalType}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {selectTypeVal === "" && errors.terminalTypeId?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {
                            validations.createTerminalValidationError
                              .terminalTypeId
                          }
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.Terminal.selectMccId",
                        defaultMessage: "Mcc",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    {/* <FormControl fullWidth>
                      <Select
                        {...register("mccId")}
                        value={selectMccVal}
                        onChange={handleMccChange}
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.select",
                            defaultMessage: "Select"
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>{intl.formatMessage({
                            id: "Entity.Terminal.selectMccIdPlaceholder",
                            defaultMessage: "Select",
                          })}</em>
                        </MenuItem>
                        {mccList &&
                          mccList.length > 0 &&
                          mccList.map((type) => {
                            return (
                              <MenuItem value={type.mccId} key={type.mccId}>
                                {type.mcc} - {type.description}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {selectMccVal === "" && errors.mccId?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {
                            validations.createTerminalValidationError
                              .mccId
                          }
                        </FormHelperText>
                      ) : null}
                    </FormControl> */}
                    <FormControl fullWidth>
                      <ReactSelect
                        filterOption={createFilter({
                          matchFrom: 'any',
                          stringify: option => `${option.label}`,
                        })}
                        {...register("mccId")}
                        value={mccId ? mccId : (selectMccVal?.mccId && mccList && mccList.length > 0 && mccList.filter(item => item.value === (selectMccVal.mccId).toString())[0])}
                        onChange={(e) => handleMccChange(e!)}
                        // isClearable
                        options={mccList}
                        isLoading={isLoading}
                        placeholder="Select..."
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.mccId?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="form-group input-with-label mb-0 center">
                    <label className="lg center">
                      {intl.formatMessage({
                        id: "Entity.Terminal.enableDisable",
                          defaultMessage: "Disable/Enable",
                      })}</label>
                    <Switch
                      className="custom"
                      checked={enable}
                      onChange={(e) =>
                        handleEnableDisableChange(e)
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.Terminal.selectCurrencyId",
                        defaultMessage: "Currency",
                      })}
                      <span style={{ color: "red" }}>*</span></label>
                    <FormControl fullWidth>
                      <Select
                        {...register("currencyId")}
                        value={selectCurrencyVal}
                        onChange={handleCurrencyChange}
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.select",
                            defaultMessage: "Select"
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>
                            {intl.formatMessage({
                              id: "Entity.Terminal.selectCurrencyPlaceholder",
                              defaultMessage: "Select",
                            })}
                          </em>
                        </MenuItem>
                        {currencyList &&
                          currencyList.length > 0 &&
                          currencyList.map((type) => {
                            return (
                              <MenuItem value={type.currencyId} key={type.currencyId}>
                                {type.currencyName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {selectCurrencyVal === "" && errors.currencyId?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {
                            validations.createTerminalValidationError
                              .currencyId
                          }
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.Terminal.eCommerce",
                        defaultMessage: "E-Commerce",
                      })}</label>
                    <FormControl fullWidth>
                      <RadioGroup
                        row
                        {...register("eCommerceFlag")}
                        value={eCommerceValue}
                        onChange={(e) => eComValueChange(e)}
                      >
                        <FormControlLabel
                          value="Y"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="N"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="input-with-label  date-select-input form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.Terminal.startDate",
                        defaultMessage: "Start Date",
                      })}
                      <span style={{ color: "red" }}>*</span></label>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                          control={control}
                          name="actualStartDate"
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
                              //value={startDateValue}
                              // onChange={(newValue) => {
                              //   setStartDateValue(newValue);
                              //   setValue("actualStartDate", newValue)
                              // }}
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
                        {errors.actualStartDate?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="input-with-label  date-select-input form-group">
                    <label className="lg">
                      {intl.formatMessage({
                        id: "Entity.Terminal.terminationDate",
                        defaultMessage: "Termination Date",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                          control={control}
                          name="terminationDate"
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
                        {errors.terminationDate?.message}
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
                id="Entity.Terminal.cancel"
                defaultMessage="Cancel"
              />
            </Button>
                      <Button disableElevation variant="contained" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
              <FormattedMessage
                id="Entity.Terminal.save"
                defaultMessage="Save"
              />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default EntityTerminal;