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
  Select, Switch,
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
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  add_rounded,
  delete_ic,
  down_arrow_icon,
  edit_ic
} from "../../assets/images";
import { TransactionGroupModel, TransactionsModel } from "../../models/configuration/TransactionGroupModel";
import { TransactionGroupService } from "../../services/configuration/transaction-group-service";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { CodePrefix, ConfigurationActivities, Errors, StatusCode, TRANS_USAGE } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";

function TransactionGroupsListing() {
  const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
  const defaultTransaction = {
    TransactionId: "",
    Description: "",
    InstitutionId: "",
    TransactionChargeDetailsId: 0,
  };
  const [open, setOpen] = React.useState(false);
  const [disableNameField, setDisableNameField] = React.useState(false);

  const [transactionGroups, setTransactionGroups] = React.useState<
    TransactionGroupModel[]
  >([]);
  const [transactionGroupDetails, setTransactionGroupDetails] =
    React.useState<TransactionGroupModel>(new TransactionGroupModel());
  const [transactionsList, setTransactionsList] = useState([
    defaultTransaction,
  ]);
  const [transactionChargeDetails, setTransactionChargeDetails] = useState<
    TransactionsModel[]
  >([]);
  const [selectedChargeDetails, setSelectedChargeDetails] = useState({
    selectedIndex: 0,
    selectedId: 0,
  });
  const [editedId, setEditedId] = useState<number | undefined>(0);
  const [enable, setEnable] = useState(true);
  const [addNew, setAddNew] = useState(true);
  const intl = useIntl();

  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.TXN_GROUP), []);
  const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.TXN_GROUP, 'TXGRPCRT');
  const canUpdate = perms.accessUpdate === "1";
  const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.TXN_GROUP, 'TXGRPDEL');
  const canView = perms.accessView === "1";
  const canLoadAllTransactionGroups = hasApiAccess(ConfigurationActivities.TXN_GROUP, 'TXGRPGET');

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TransactionGroupModel>({
    mode: "onChange",
    resolver: yupResolver(validations.createTransactionGroupValidations),
  });

  const handleClickOpen = (isEdit: boolean) => {
    if (!isEdit) {
      handleReset();
      setTransactionsList([defaultTransaction]);
      setSelectVal("");
      getAllTransactionsByUsage();
      setDisableNameField(false);
    }else{
      setDisableNameField(true);
    }
    setSelectedChargeDetails({ selectedIndex: 0, selectedId: 0 });
    setOpen(true);
    setAddNew(true)
    clearErrors();
  };

  const handleReset = (): void => {
    reset(new TransactionGroupModel());
    setTransactionGroupDetails(new TransactionGroupModel());
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectVal, setSelectVal] = React.useState("");

  const handleChange = (event: any, index: any) => {
    setSelectVal(event.target.value);
    let data = transactionsList;
    const selectedObj = transactionChargeDetails.find(
      (x) => x.transactionId === event.target.value
    );
    data[index].Description = selectedObj ? selectedObj.description : "";
    setSelectedChargeDetails({
      selectedIndex: index,
      selectedId: event.target.value,
    });
  };

  useEffect(() => {
    setInstitutefromLocalStorage();
  }, []);

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
      getAllTransactionGroup();
    }
  };

  const getAllTransactionGroup = async () => {
    if (!canLoadAllTransactionGroups) return;
    await TransactionGroupService.getAllTransactionGroup()
      .then((res) => {
        setTransactionGroups([...res.data]);
      })
      .catch((err) => {
        // if (err?.response?.data === Errors.institutionNotFound) {
                    toast.error(err.response.data.errors[0])
    //    }
        // else {
        //     toast.error(err.response.data.errors[0])
        // }
      });
  };

  const getAllTransactionsByUsage = () => {
    // let UsageSysId = 0;
    // SystemCodeServices.getAllSystemCodes().then(res => {
    //   UsageSysId = res.data.find(data => data.codePrefix === CodePrefix.TRANS_USAGE && data.description === TRANS_USAGE.TRANS)?.systemCodeId ?? 0;

    //   if (UsageSysId !== 0) {
    //     TransactionGroupService.getAllTransactionsByUsage(UsageSysId, "").then(res => {
    //       setTransactionChargeDetails([...res.data]);
    //     }).catch(err =>   toast.error(err.response.data.errors[0]))
    //   }

    // });
    TransactionGroupService.getAllTransactionsByUsage(TRANS_USAGE.TRANS, "").then(res => {
      setTransactionChargeDetails([...res.data]);
    }).catch(err =>   toast.error(err.response.data.errors[0]))
  }

  const onSubmit = async (value: TransactionGroupModel) => {
    const chargesDetails: any = [];
    let isValid = true;
    transactionsList &&
      transactionsList.length > 0 &&
      transactionsList.map((item) => {
        if (item.TransactionId) {
          const filterData = chargesDetails.filter(
            (ch: any) => ch.defaultTransactionId === item.TransactionId
          );
          if (filterData && filterData.length > 0) {
            isValid = false;
          }


          chargesDetails.push({
            defaultTransactionId: item.TransactionId,
            description: item.Description,
            institutionId: selectInstitutionVal,
            transactionChargeDetailsId: item.TransactionChargeDetailsId,
          });
        } else {
          if (item.Description) {
            const filterData = chargesDetails.filter(
              (ch: any) =>
                ch.defaultTransactionId === selectedChargeDetails.selectedId
            );

            if (filterData && filterData.length > 0) {
              isValid = false;
            }

            chargesDetails.push({
              defaultTransactionId: selectedChargeDetails.selectedId,
              description: item.Description,
              institutionId: selectInstitutionVal,
              transactionChargeDetailsId: item.TransactionChargeDetailsId,
            });
          }
        }
      });

    if (isValid) {
      const model = {
        ...value,
        status: enable ? "1" : "0",
        institutionId: selectInstitutionVal,
        chargesDetailDtos: chargesDetails,
      };
      TransactionGroupService.saveOrUpdateTransactionGroup(model)
        .then((res) => {
          if (res.status === StatusCode.Success) {
            if (editedId) {
              toast.success(`Transaction Group details updated successfully`);
            } else {
              toast.success("Transaction Group record added successfully");
            }
          }
          handleClose();
          getAllTransactionGroup();
        })
        .catch((err) => {
          if (err?.response?.data) {
            toast.error(err.response.data.errors[0])
          } else {
            toast.error(err.response.data.errors[0])
          }
        });
    } else {
      toast.error("Blank or Duplicate entry already exists");
    }
  };

  const editTransactionGroup = async (id: number | undefined) => {
    handleClickOpen(true);
    setAddNew(false);
    setEditedId(id);
    getTransactionGroupById(id);
    setTransactionsList([]);
  };

  const getTransactionGroupById = async (id: number | undefined) => {
    TransactionGroupService.getTransactionGroupById(Number(id))
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data));
        reset(data);
        setTransactionGroupDetails(data);
        let transactions: any = [];
        data.chargesDetailDtos &&
          data.chargesDetailDtos.length > 0 &&
          data.chargesDetailDtos.map((item: any) => {
            transactions.push({
              TransactionId: item.defaultTransactionId,
              Description: item.description,
              InstitutionId: item.institutionId,
              TransactionChargeDetailsId: item.transactionChargeDetailsId,
            });
            setTransactionsList(transactions);
          });
        setEnable(data.status === "1" ? true : false);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const changeStatus = async (id: number | undefined, event: any) => {
    const model = {
      id: id as number,
      status: event.target.checked === true ? "1" : "0",
    };
    TransactionGroupService.changeTransactionGroupStatus(model)
      .then((res) => {
        getAllTransactionGroup();
        toast.success(res.data+"")
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
        TransactionGroupService.deleteTransactionGroup(id).then((res) => {
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
          getAllTransactionGroup();
        }).catch(err => {
          if (err && err.response
   //          && err.response.data === Errors.ReferenceExists
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


  const addSelectedRecord = () => {
    const record = selectedChargeDetails;
    let isDuplicated = false;
    transactionsList &&
      transactionsList.length > 0 &&
      transactionsList.map((transaction) => {
        if (Number(transaction.TransactionId) === Number(record.selectedId)) {
          isDuplicated = true;
        }
      });
    if (isDuplicated) {
      toast.error("Blank or Duplicate entry already exists");
      return false;
    } else {
      let index = record.selectedIndex;
      let list = transactionsList;
      if (selectedChargeDetails.selectedId !== 0) {
        list[index].TransactionId = record.selectedId.toString();
      }
      setTransactionsList(list);
      return true;
    }
  };
  const addRow = () => {
    const validRecords = addSelectedRecord();
    if (validRecords) {
      let isValidTransactions = true;
      transactionsList &&
        transactionsList.length > 0 &&
        transactionsList.map((transaction) => {
          if (transaction.TransactionId === "") {
            isValidTransactions = false;
          }
        });
      if (isValidTransactions) {
        let list = transactionsList;
        list.push(defaultTransaction);
        setSelectVal("");
        setTransactionsList(list);
        getAllTransactionsByUsage();
      } else {
        toast.error("Please select the Transaction ID");
      }
    }
  };

  const onDeleteTransaction = (index: number, id: number) => {
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
        let isRemoved = false;
        if (id === 0) {
          transactionsList.splice(index, 1);
          setTransactionsList(transactionsList);
          setSelectedChargeDetails({ selectedIndex: 0, selectedId: 0 });
          isRemoved = true;
        } else {
          TransactionGroupService.deleteTransactionChargeDetail(id).then(
            (res) => {
              if (res.status === StatusCode.Success) {
                transactionsList.splice(index, 1);
                setTransactionsList(transactionsList);
                setSelectedChargeDetails({ selectedIndex: 0, selectedId: 0 });
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
        });        }
      
      }
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
                    id: "TransactionGroup.title",
                    defaultMessage: "Transaction Groups",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "TransactionGroup.subTitle",
                    defaultMessage: "List of transaction groups",
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
                    id="TransactionGroup.addBtn"
                    defaultMessage="Add Group"
                  />
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell width="30%">
                      {intl.formatMessage({
                        id: "TransactionGroup.id",
                        defaultMessage: "ID",
                      })}
                    </TableCell>
                    <TableCell width="70%">
                      {intl.formatMessage({
                        id: "TransactionGroup.name",
                        defaultMessage: "Name",
                      })}
                    </TableCell>
                    <TableCell align="center" width="190px" className="last-column-border-header">
                      {intl.formatMessage({
                        id: "TransactionGroup.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionGroups &&
                    transactionGroups.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.transactionGroupId}</TableCell>
                        <TableCell>{row.transactionGroupName}</TableCell>
                        <TableCell align="center" width="190px" className="last-column-border">
                          <div className="action btns-block">
                            <Switch
                              className="custom"
                              checked={row.status === "1" ? true : false}
                              onChange={(e) =>
                                changeStatus(row.transactionGroupId, e)
                              }
                              disabled={!canUpdate}
                            />
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() =>
                                editTransactionGroup(row.transactionGroupId)
                              }
                              disabled={!canUpdate}
                            >
                              <img src={edit_ic} alt="mail" />
                            </IconButton>
                            <IconButton
                              className="border-icon-btn no-border sm"
                              onClick={() => onDelete(row.transactionGroupId)}
                              disabled={!canDelete}
                            >
                              <img src={delete_ic} alt="mail" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {transactionGroups && transactionGroups.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={13} className="last-column-border">
                        <p style={{ textAlign: "center" }}>
                          {intl.formatMessage({
                            id: "TransactionGroup.noDataFound",
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
        <Dialog open={open} onClose={handleClose} className="c-dialog md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle component={"div"}>
              <div className="title-block mb-0">
                <div className="left-block mb-0">
                  <Typography variant={"h2"}>
                    {intl.formatMessage({
                      id: "TransactionGroup.defination",
                      defaultMessage: "Transaction Group Definition",
                    })}
                  </Typography>
                  <p className="pb-0">
                    {intl.formatMessage({
                      id: "TransactionGroup.appUpdateTitle",
                      defaultMessage: "Add or Update Transaction group",
                    })}
                  </p>
                </div>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="inner-card">
                <Grid spacing={3} container>
                  <Grid item xs={12} lg={7}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "TransactionGroup.name",
                          defaultMessage: "Name",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "TransactionGroup.namePlaceholder",
                            defaultMessage: "Write Transaction Group Name",
                          })}
                          error
                          fullWidth
                          id="transactionGroupName"
                          autoComplete="off"
                          disabled={disableNameField}
                          aria-describedby="error-helper-text"
                          {...register("transactionGroupName")}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.transactionGroupName?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={5}>
                    <div className="input-with-label mb-0 center">
                      <label className="center">
                        {intl.formatMessage({
                          id: "TransactionGroup.enableDisable",
                          defaultMessage: "Disable/Enable",
                        })}
                      </label>
                      <Switch
                        className="custom"
                        checked={addNew ? true : enable}
                        onChange={() => setEnable(enable ? false : true)}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "TransactionGroup.transactionDescription",
                          defaultMessage: "Description",
                        })}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "TransactionGroup.descriptionPlaceholder",
                            defaultMessage:
                              "Write TransactionGroup Description",
                          })}
                          error
                          fullWidth
                          id="transactionGroupDescription"
                          autoComplete="off"
                          aria-describedby="error-helper-text"
                          {...register("transactionGroupDescription")}
                          multiline
                          rows={2}
                        />
                        <FormHelperText id="error-helper-text" error>
                          {errors.transactionGroupDescription?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="title-block">
                <div className="left-block">
                  <Typography variant={"h2"} className="pb-0">
                    {intl.formatMessage({
                      id: "TransactionGroup.transactions",
                      defaultMessage: "Transactions",
                    })}
                  </Typography>
                </div>
                <div className="right-block mb-0">
                  <Button
                    endIcon={<img src={add_rounded} alt="add" />}
                    className="link"
                    onClick={() => addRow()}
                  >
                    {intl.formatMessage({
                      id: "TransactionGroup.addTransaction",
                      defaultMessage: "Add Transaction",
                    })}
                  </Button>
                </div>
              </div>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width="30%">
                        {intl.formatMessage({
                          id: "TransactionGroup.transactionId",
                          defaultMessage: "Transaction Id",
                        })}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactionsList.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          {row.TransactionId === "" ? (
                            <FormControl fullWidth>
                              <Select
                                value={selectVal}
                                onChange={(e) => handleChange(e, i)}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                IconComponent={() => (
                                  <img src={down_arrow_icon} alt="" />
                                )}
                              >
                                <MenuItem value="">
                                  <em>
                                    {intl.formatMessage({
                                      id: "TransactionGroup.transactionIdSelect",
                                      defaultMessage: "Select",
                                    })}
                                  </em>
                                </MenuItem>
                                {transactionChargeDetails &&
                                  transactionChargeDetails.length > 0 &&
                                  transactionChargeDetails.map((item) => (
                                    <MenuItem value={item.transactionId}>
                                      {item.transactionId}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          ) : (
                            row.TransactionId
                          )}
                        </TableCell>
                        <TableCell>{row.Description}</TableCell>
                        <TableCell style={{ width: "5%" }}>
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() =>
                              onDeleteTransaction(
                                i,
                                row.TransactionChargeDetailsId
                              )
                            }
                          >
                            <img src={delete_ic} alt="mail" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions className="btns-block right">
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                onClick={handleClose}
              >
                <FormattedMessage
                  id="TransactionGroup.cancel"
                  defaultMessage="Cancel"
                />
              </Button>
              <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                <FormattedMessage
                  id="TransactionGroup.save"
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

export default TransactionGroupsListing;
