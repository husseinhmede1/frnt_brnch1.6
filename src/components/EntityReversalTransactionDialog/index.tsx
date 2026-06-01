import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputBase, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { down_arrow_icon } from "../../assets/images";
import { AcquiringTransactionModel, ReversalTransactionModel } from "../../models/entityManagement/AcquiringTransactionModel";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { AcquiringTransactionServices } from "../../services/entityManagement/acquiring-transaction-service";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { CodePrefix, StatusCode } from "../../utils/constant";
import validations from "../../utils/validations";

function EntityReversalTransactionDialog(props: any) {
  const { openHandler, closeHandler, acquiringTransactionId, institutionId, merchantPaymentDate } = props;
  const [acquiringTransactionDetails, setAcquiringTransactionDetails] = React.useState<AcquiringTransactionModel>(new AcquiringTransactionModel());
  const [reversalReasonList, setReversalReasonList] = React.useState<SystemCodeModel[]>([]);
  const [reversal, setReversal] = React.useState<boolean>(true);

  const intl = useIntl();

  const {
    register,
    handleSubmit,
    reset: recordReset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<ReversalTransactionModel>({
    mode: "onChange",
    resolver: yupResolver(validations.acquiringTransactionReversalValidation),
  });

  useEffect(() => {
    //getAcquiringTransactionDetails(acquiringTransactionId);
    getAllReversalReasonCodes(institutionId);
  }, []);

  const handleChange = (event: any) => {
    if (event.target.name === 'systemCodeId') {
      setAcquiringTransactionDetails((prev) => ({
        ...prev,
        reversalReason: event.target.value
      }));
    } else {
      setAcquiringTransactionDetails((prev) => ({
        ...prev,
        [event.target.name]: event.target.value
      }));
    }
  };

  const onSubmit = (values: ReversalTransactionModel) => {
    const model = {
      ...values,
      institutionId: institutionId,
      accquierRecordToAppear: reversal ? "Y" : "N",
      acquiringTransactionId: acquiringTransactionId,
    }
    AcquiringTransactionServices.reversalTransaction(model).then(res => {
      if (res.status === StatusCode.Success) {
        toast.success("Successfully Updated.");
        handleReset();
        closeHandler();
      }
    }).catch(err =>           toast.error(err.response.data.errors[0])
    );
  }
  const handleReset = (): void => {
    recordReset(
      {
        systemCodeId: undefined,
        reversalComment: "",
      }
    );
    setReversal(false);
  }

  const getAcquiringTransactionDetails = async (id: number) => {
    AcquiringTransactionServices.getById(id)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          //setInstituteId(res.data.institutionId);
          setAcquiringTransactionDetails(res.data);
          getAllReversalReasonCodes(res.data.institutionId);
          setReversal(res.data.accquierRecordToAppear === "1" || res.data.accquierRecordToAppear?.toUpperCase() === "Y" ? true : false)

          if (res.data?.reversalReason && typeof res.data?.reversalReason === 'number') {
            setValue("systemCodeId", Number(res.data?.reversalReason));
          } else {
            setValue("systemCodeId", 0);
          }
          setValue("reversalComment", res.data?.reversalComment?.toString());
        }
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  }

  const getAllReversalReasonCodes = (instID: string) => {
    const model = {
      institutionId: instID,
      codePrefix: CodePrefix.REVERSAL_RSN,
    }
    SystemCodeServices.getSystemCodesByPrefixSuffix(model).then(res => {
      setReversalReasonList(res?.data);
    }).catch(err =>           toast.error(err.response.data.errors[0])
    )
  }

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
                    id: "Entity.label.reverseTransaction",
                    defaultMessage: "Reverse Transaction"
                  })
                }</Typography>
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
                        id: "Entity.label.reversalReason",
                        defaultMessage: "Reversal Reason"
                      })
                    }
                    <span className="required-field">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      {...register("systemCodeId")}
                      //value={acquiringTransactionDetails.reversalReason && typeof acquiringTransactionDetails.reversalReason === 'number' ? acquiringTransactionDetails.reversalReason : ""}
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
                        <em>
                          {
                            intl.formatMessage({
                              id: "Entity.select",
                              defaultMessage: "Select"
                            })
                          }
                        </em>
                      </MenuItem>
                      {
                        reversalReasonList && reversalReasonList.length > 0 &&
                        reversalReasonList.map(item => (
                          <MenuItem value={item.systemCodeId} key={item.systemCodeId}>{item.description}</MenuItem>
                        ))
                      }
                    </Select>
                    {(typeof acquiringTransactionDetails.reversalReason === 'number'
                      ? ""
                      : acquiringTransactionDetails.reversalReason) === "" && errors?.systemCodeId?.message ? (
                      <FormHelperText id="error-helper-text" error>
                        {validations.acquiringTransactionReversalMessage.systemCodeId}
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
                        id: "Entity.label.reversalComment",
                        defaultMessage: "Reversal Comment"
                      })
                    }
                    <span className="required-field">*</span>
                  </label>
                  <FormControl fullWidth>
                    <InputBase placeholder={
                      intl.formatMessage({
                        id: "Entity.placeholder.reversalComment",
                        defaultMessage: "Write your comment"
                      })
                    } fullWidth
                      error
                      id="reversalComment"
                      autoComplete="off"
                      aria-describedby="error-helper-text"
                      {...register("reversalComment")}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.reversalComment?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="input-with-label">
                  <label className="lg">
                    {
                      intl.formatMessage({
                        id: "Entity.label.originalReversal",
                        defaultMessage: "Original/Reversal"
                      })
                    }</label>
                  <Checkbox
                    checked={reversal}
                    disabled={merchantPaymentDate.toString() != ""}
                    onChange={(e) => setReversal(e.target.checked)}
                  />
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

export default EntityReversalTransactionDialog;