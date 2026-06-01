import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  MenuItem, Select, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  add_rounded, delete_ic,
  down_arrow_icon,
  edit_ic, ic_per
} from "../../assets/images";
import { CurrencyModel } from "../../models/configuration/CurrencyModel";
import {
  BankCodeModel,
  PaymentAccountModel
} from "../../models/entityManagement/EntityModel";
import { CurrencyService } from "../../services/configuration/currency-service";
import { PaymentAccountService } from "../../services/entityManagement/payment-account";
import { Errors, StatusCode } from "../../utils/constant";
import validations from "../../utils/validations";
import { FormattedMessage, useIntl } from "react-intl";

function EntityPaymentAccounts(props: any) {
  const { value, TabPanel, institutionId, checkIsEmptyModules } = props;
  const { id } = useParams<{ id?: any }>();
  const intl = useIntl();
  const [openAccModal, setAccModalOpen] = React.useState(false);
  const [paymentAccounts, setPaymentAccounts] = React.useState<
    PaymentAccountModel[]
  >([]);
  const [bankCodes, setBankCodes] = React.useState<BankCodeModel[]>([]);
  const [currencyList, setCurrencyList] = React.useState<CurrencyModel[]>([]);
  const [paymentAccountDetails, setPaymentAccountDetails] =
    React.useState<PaymentAccountModel>(new PaymentAccountModel());
  const [editedId, setEditedId] = React.useState<number | undefined>(0);

  const accModalOpen = (isEdit: boolean) => {
    if (!isEdit) {
      reset(new PaymentAccountModel());
      setPaymentAccountDetails(new PaymentAccountModel());
    }
    setAccModalOpen(true);
    getAllBankCode(institutionId);
    getAllCurrency();
    clearErrors();
  };
  const accModalClose = () => {
    setAccModalOpen(false);
  };

  useEffect(() => {
    if (id) {
      getAllPaymentAccounts();
    }
  }, []);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setPaymentAccountDetails({
      ...paymentAccountDetails,
      [name]: value,
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
      formState: { errors, isSubmitting },
  } = useForm<PaymentAccountModel>({
    mode: "onChange",
    resolver: yupResolver(validations.paymentAccountValidation),
  });

  const getAllPaymentAccounts = async () => {
    await PaymentAccountService.getPaymentAccountsByEntityId(id)
      .then((res) => {
        setPaymentAccounts([...res.data]);
        if (res && res.data && res.data.length === 0) {
          checkIsEmptyModules("paymentAccounts", true)
        }
        else {
          checkIsEmptyModules("paymentAccounts", false)
        }
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  };

  const getAllBankCode = async (instId: string) => {
    await PaymentAccountService.getBankCodeByInstitutionId(instId)
      .then((res) => {
        setBankCodes([...res.data]);
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  };

  const getAllCurrency = async () => {
    await CurrencyService.getActiveCurrencies()
      .then((res) => {
        setCurrencyList([...res.data]);
      })
      .catch((err) =>          toast.error(err.response.data.errors[0])
      );
  };

  const getPaymentAccountById = async (id: number | undefined) => {
    PaymentAccountService.getPaymentAccountById(Number(id))
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        reset(data);
        setPaymentAccountDetails(data);
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  };

  const editPaymentAccount = async (id: number | undefined) => {
    accModalOpen(true);
    setEditedId(id);
    getPaymentAccountById(id);
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
        PaymentAccountService.deletePaymentAccount(id).then((res) => {
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
          getAllPaymentAccounts();
        }).catch(err => {
          if (err && err.response 
         //   && err.response.data === Errors.ReferenceExists
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

  const onSubmit = async (value: PaymentAccountModel) => {
    PaymentAccountService.saveOrUpdatePaymentAccount({
      ...value,
      entityId: id,
      institutionId: institutionId,
    })
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if (editedId) {
            toast.success(`Payment Account details updated successfully`);
          } else {
            toast.success("New Payment Account is added successfully");
          }
        }
        accModalClose();
        getAllPaymentAccounts();
      })
      .catch((err) =>          toast.error(err.response.data.errors[0])
      );
  };

  return (
    <>
      <TabPanel value={value} index={1}>
        <div className="panel-body">
          <div className="title-block">
            <div className="left-block mb-0"></div>
            <div className="right-block">
              <Button
                variant="contained"
                disableElevation
                className="btn-light"
                endIcon={<img src={add_rounded} alt="add" />}
                onClick={() => accModalOpen(false)}
              >
                {
                  intl.formatMessage({
                    id: "Entity.paymentAccounts.button.add",
                    defaultMessage: "Add Account"
                  })
                }
              </Button>
            </div>
          </div>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {
                      intl.formatMessage({
                        id: "Entity.paymentAccounts.label.accNumber",
                        defaultMessage: "Account Number"
                      })
                    }
                  </TableCell>
                  <TableCell>  {
                    intl.formatMessage({
                      id: "Entity.paymentAccounts.label.bankCode",
                      defaultMessage: "Bank Code"
                    })
                  }</TableCell>
                  <TableCell>
                    {
                      intl.formatMessage({
                        id: "Entity.paymentAccounts.label.iban",
                        defaultMessage: "IBAN"
                      })
                    }</TableCell>
                  <TableCell>
                    {
                      intl.formatMessage({
                        id: "Entity.paymentAccounts.label.transactionCurrency",
                        defaultMessage: "Transaction Currency"
                      })
                    } </TableCell>
                  <TableCell>
                    {
                      intl.formatMessage({
                        id: "Entity.paymentAccounts.label.settlementCurrency",
                        defaultMessage: "Settlement Currency"
                      })
                    }
                  </TableCell>
                  <TableCell>
                    {
                      intl.formatMessage({
                        id: "Entity.paymentAccounts.label.currencyMarkup",
                        defaultMessage: "Currency Markup"
                      })
                    } </TableCell>
                    <TableCell>
                    {
                      intl.formatMessage({
                        id: "Entity.paymentAccounts.label.branch",
                        defaultMessage: "Branch"
                      })
                    } </TableCell>
                    <TableCell>
                    {
                      intl.formatMessage({
                        id: "Entity.paymentAccounts.label.beneficiaryName",
                        defaultMessage: "Beneficiary Name"
                      })
                    } </TableCell>
                  <TableCell align="center" width="190px" className="last-column-border-header">
                    {
                      intl.formatMessage({
                        id: "Entity.label.actions",
                        defaultMessage: "Actions"
                      })
                    }
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentAccounts.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.accountNumber}</TableCell>
                    <TableCell>{row.bankCode}</TableCell>
                    <TableCell>{row.iban}</TableCell>
                    <TableCell>{row.transferCurrencyName}</TableCell>
                    <TableCell>{row.settlementCurrencyName}</TableCell>
                    <TableCell>{row.currencyMarkup}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.beneficiaryName}</TableCell>
                    <TableCell align="center" width="190px" className="last-column-border">
                      <div className="action btns-block">
                        <IconButton
                          className="border-icon-btn no-border sm"
                          onClick={() =>
                            editPaymentAccount(row.paymentAccountId)
                          }
                        >
                          <img src={edit_ic} alt="edit" />
                        </IconButton>
                        <IconButton
                          className="border-icon-btn no-border sm"
                          onClick={() => onDelete(row.paymentAccountId)}
                        >
                          <img src={delete_ic} alt="delete" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </TabPanel>

      <Dialog open={openAccModal} onClose={accModalClose} className="c-dialog">
        <form>
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  {
                    intl.formatMessage({
                      id: "Entity.paymentAccounts.add.title",
                      defaultMessage: "Add Account Number"
                    })
                  }</Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card">
              <Grid spacing={5} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">

                      {
                        intl.formatMessage({
                          id: "Entity.paymentAccounts.label.accNbr",
                          defaultMessage: "Account Nbr"
                        })
                      }
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.paymentAccounts.placeholder.accNbr",
                            defaultMessage: "Enter Account Nbr"
                          })
                        }
                        error
                        fullWidth
                        id="accountNumber"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("accountNumber")}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.accountNumber?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {
                        intl.formatMessage({
                          id: "Entity.paymentAccounts.label.lban",
                          defaultMessage: "IBAN"
                        })
                      }
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.paymentAccounts.placeholder.iban",
                            defaultMessage: "Enter Account Nbr"
                          })
                        }
                        error
                        fullWidth
                        id="iban"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("iban")}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.iban?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {
                        intl.formatMessage({
                          id: "Entity.paymentAccounts.label.bankCode",
                          defaultMessage: "Bank Code"
                        })
                      }

                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={
                          paymentAccountDetails.bankCodeId
                            ? paymentAccountDetails.bankCodeId.toString()
                            : ""
                        }
                        {...register("bankCodeId")}
                        onChange={handleChange}
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.select",
                            defaultMessage: "Select"
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>{
                            intl.formatMessage({
                              id: "Entity.select",
                              defaultMessage: "Select"
                            })
                          }</em>
                        </MenuItem>
                        {bankCodes &&
                          bankCodes.length > 0 &&
                          bankCodes.map((code) => (
                            <MenuItem value={code.bankCodeId}>
                              {code.bankCode}
                            </MenuItem>
                          ))}
                      </Select>
                      {(paymentAccountDetails.bankCodeId
                        ? paymentAccountDetails.bankCodeId.toString()
                        : "") === "" && errors.bankCodeId?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {validations.createPaymentAccountValidation.bankCode}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {
                        intl.formatMessage({
                          id: "Entity.paymentAccounts.label.settlementCurrency",
                          defaultMessage: "Settlement Currency"
                        })
                      }</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.select",
                            defaultMessage: "Select"
                          })
                        }
                        id="settlementCurrencyId"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("settlementCurrencyId")}
                        value={
                          paymentAccountDetails.settlementCurrencyId
                            ? paymentAccountDetails.settlementCurrencyId.toString()
                            : ""
                        }
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>{
                            intl.formatMessage({
                              id: "Entity.select",
                              defaultMessage: "Select"
                            })
                          }</em>
                        </MenuItem>
                        {currencyList &&
                          currencyList.length > 0 &&
                          currencyList.map((item) => (
                            <MenuItem value={item.currencyId}>
                              {item.currencyName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg"> {
                      intl.formatMessage({
                        id: "Entity.paymentAccounts.label.transactionCurrency",
                        defaultMessage: "Transaction Currency"
                      })
                    }</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.select",
                            defaultMessage: "Select"
                          })
                        }
                        id="transferCurrencyId"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("transferCurrencyId")}
                        value={
                          paymentAccountDetails.transferCurrencyId
                            ? paymentAccountDetails.transferCurrencyId.toString()
                            : ""
                        }
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>{
                            intl.formatMessage({
                              id: "Entity.select",
                              defaultMessage: "Select"
                            })
                          }</em>
                        </MenuItem>
                        {currencyList &&
                          currencyList.length > 0 &&
                          currencyList.map((item) => (
                            <MenuItem value={item.currencyId}>
                              {item.currencyName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {
                        intl.formatMessage({
                          id: "Entity.paymentAccounts.label.branch",
                          defaultMessage: "Branch"
                        })
                      }
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.paymentAccounts.placeholder.branch",
                            defaultMessage: "Enter Branch"
                          })
                        }
                        error
                        fullWidth
                        id="branch"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("branch")}
                        inputProps={{ maxLength: 10 }}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.branch?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {
                        intl.formatMessage({
                          id: "Entity.paymentAccounts.label.currencyMarkup",
                          defaultMessage: "Currency Markup"
                        })
                      }</label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.paymentAccounts.placeholder.percentage",
                            defaultMessage: "Enter Percentage",
                          })
                        }
                        error
                        fullWidth
                        id="currencyMarkup"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("currencyMarkup")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton>
                              <img src={ic_per} alt="lock" />
                            </IconButton>
                          </InputAdornment>
                        }
                        type="number"
                      />
                      {(
                        <FormHelperText id="error-helper-text" error>
                          {errors.currencyMarkup?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">
                      {
                        intl.formatMessage({
                          id: "Entity.paymentAccounts.label.beneficiaryName",
                          defaultMessage: "Beneficiary Name"
                        })
                      }
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={
                          intl.formatMessage({
                            id: "Entity.paymentAccounts.placeholder.beneficiaryName",
                            defaultMessage: "Enter Beneficiary Name"
                          })
                        }
                        error
                        fullWidth
                        id="beneficiaryName"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("beneficiaryName")}
                        inputProps={{ maxLength: 50 }}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.beneficiaryName?.message}
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
              onClick={accModalClose}
            >
              {
                intl.formatMessage({
                  id: "Entity.button.cancel",
                  defaultMessage: "Cancel"
                })
              }
            </Button>
                      <Button
                          disabled={isSubmitting}
              disableElevation
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              {
                intl.formatMessage({
                  id: "Entity.button.save",
                  defaultMessage: "Save"
                })
              }
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default EntityPaymentAccounts;
