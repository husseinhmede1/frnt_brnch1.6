import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, Grid, InputBase, MenuItem, Radio, RadioGroup, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { down_arrow_icon } from "../../assets/images";
import { AcquiringTransactionModel, HaltPayModel } from "../../models/entityManagement/AcquiringTransactionModel";
import { AcquiringTransactionServices } from "../../services/entityManagement/acquiring-transaction-service";
import { StatusCode } from "../../utils/constant";
import validations from "../../utils/validations";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { SystemHeaderCodeResponse } from "../../models/entityManagement/SystemCodeModel";
import { SolarPower } from "@mui/icons-material";

function EntityHaltPayDialog(props: any) {
  const { openHandler, closeHandler,  acquiringTransactionIds, institutionId,setRefresh } = props;
  const [acquiringTransactionDetails, setAcquiringTransactionDetails] = React.useState<AcquiringTransactionModel>(new AcquiringTransactionModel());
  const [confirmStoppingPayment, setConfirmStoppingPayment] = React.useState('');
   const [payHaltStatus, setPayHaltStatus] = useState('');
  const [haltTypeList, setHaltTypeList] = useState<SystemHeaderCodeResponse[]>([])
  const intl = useIntl();


  const {
    register,
    handleSubmit,
    reset: recordReset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<HaltPayModel>({
    mode: "onChange",
    resolver: yupResolver(validations.haltPayValidation),
  });

  useEffect(() => {
    handleReset();
    getAcquiringTransactionDetails(acquiringTransactionIds);
  }, [acquiringTransactionIds]);

  const handleChange = (event: any) => {
    setPayHaltStatus(event.target.value);
    if (event.target.name === 'payHaltStatus') {
      setAcquiringTransactionDetails((prev) => ({
        ...prev,
        payHaltStatus: event.target.value
      }));
    } else {
      setAcquiringTransactionDetails((prev) => ({
        ...prev,
        [event.target.name]: event.target.value
      }));
    }
  };

  const onSubmit = (values: HaltPayModel) => {
    const model = {
      ...values,
      institutionId: institutionId,
      acquiringTransactionIds: acquiringTransactionIds,
    };

    
    AcquiringTransactionServices.haltPay(model)
      .then(res => {
          // Check for errorMessages and display them
          if (res.data.errorMessages.length >0) {
            res.data.errorMessages.forEach((message) => {
              toast.error(message); 
            });
          } else {
            if (res.status === StatusCode.Success) {
              setRefresh(true);
              toast.success("Data Updated successfully");
            }             
            else{
               toast.error("An unknown error occurred.");
            }
          }
          closeHandler();
      })
      .catch(err =>           toast.error(err.response.data.errors[0])
      );
  };
  
  const handleResetComment= () :void=>{
    recordReset({
      payHaltComment : ""
    })
  }

  const handleReset = (): void => {
    recordReset({
      payHaltStatus: "",
      payHaltComment: "",
    });
    setPayHaltStatus("");
    setConfirmStoppingPayment("");
  };
  

  const getAcquiringTransactionDetails = async (id: number) => {
    AcquiringTransactionServices.getById(id)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          setAcquiringTransactionDetails(res.data);
          setConfirmStoppingPayment(res.data.confirmStoppingPayment);
          setPayHaltStatus(res?.data?.payHaltStatus);
        }
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  }

  useEffect(() => {
    if (openHandler) {
      handleResetComment();
      SystemCodeServices.getSystemCodesHoldType()
      .then((res) => {
        setHaltTypeList(res.data);
      })
      .catch((err) =>          toast.error(err.response.data.errors[0])
      );
    }
  }, [openHandler]);

  return (
    <>
      <Dialog
        open={openHandler}
        onClose={closeHandler}
        className="c-dialog sm"
      >
        <DialogTitle component={"div"}>
          <div className="title-block mb-0">
            <div className="left-block mb-0">
              <Typography variant={"h2"}>
                {
                  intl.formatMessage({
                    id: "Entity.label.haltPay",
                    defaultMessage: "Halt/Pay"
                  })
                }
              </Typography>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="inner-card mb-0">
            <Grid spacing={3} container>
              <Grid item xs={12}>
                <div className="input-with-label">
                  <label className="lg">
                    {
                      intl.formatMessage({
                        id: "Entity.label.haltPayStatus",
                        defaultMessage: "Halt/Pay Status"
                      })
                    }
                    <span className="required-field">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      {...register("payHaltStatus")}
                      value={payHaltStatus}
                      onChange={handleChange}
                      displayEmpty
                      defaultValue=''
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
                        <em>
                          {
                            intl.formatMessage({
                              id: "Entity.selectstatus",
                              defaultMessage: "Select Status"
                            })
                          }
                        </em>
                      </MenuItem>
                      {haltTypeList &&
                        haltTypeList.length > 0 &&
                        haltTypeList.map((item) => (
                          <MenuItem value={item.codeValue} key={item.codeValue}>
                            {item.description}
                          </MenuItem>
                        ))}
                    </Select>
                    {(acquiringTransactionDetails.payHaltStatus
                      ? acquiringTransactionDetails.payHaltStatus.toString()
                      : "") === "" && errors?.payHaltStatus?.message ? (
                      <FormHelperText id="error-helper-text" error>
                        {validations.haltPayValidationMessage.payHaltStatus}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="input-with-label">
                  <label className="lg">
                    {
                      intl.formatMessage({
                        id: "Entity.label.comment",
                        defaultMessage: "Comment"
                      })
                    }
                    <span className="required-field">*</span>
                  </label>
                  <FormControl fullWidth>
                    <InputBase placeholder={
                      intl.formatMessage({
                        id: "Entity.placeholder.payHaltComment",
                        defaultMessage: "Write your comment"
                      })
                    } fullWidth
                      error
                      id="payHaltComment"
                      autoComplete="off"
                      aria-describedby="error-helper-text"
                      {...register("payHaltComment")}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.payHaltComment?.message}
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
            onClick={closeHandler}
          >
            {
              intl.formatMessage({
                id: "Entity.button.cancel",
                defaultMessage: "Cancel"
              })
            }
          </Button>
          <Button disableElevation variant="contained" onClick={handleSubmit(onSubmit)}>
            {
              intl.formatMessage({
                id: "Entity.button.save",
                defaultMessage: "Save"
              })
            }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EntityHaltPayDialog;