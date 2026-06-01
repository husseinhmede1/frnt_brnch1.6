import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputBase, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { down_arrow_icon } from "../../assets/images";
import { AcquiringTransactionModel, RepresentmentModel } from "../../models/entityManagement/AcquiringTransactionModel";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { AcquiringTransactionServices } from "../../services/entityManagement/acquiring-transaction-service";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { CodePrefix, StatusCode } from "../../utils/constant";
import validations from "../../utils/validations";

function EntityRepresenmentDialog(props: any) {
  const { openHandler, closeHandler, acquiringTransactionId, institutionId } = props;
  const [acquiringTransactionDetails, setAcquiringTransactionDetails] = React.useState<AcquiringTransactionModel>(new AcquiringTransactionModel());
  const [representmentReasonList, setRepresentmentReasonList] = React.useState<SystemCodeModel[]>([]);
  const [toBePaidToMerchant, setToBePaidToMerchant] = React.useState<boolean>(false);
  const [toAppearOnStatement, setToAppearOnStatement] = React.useState<boolean>(false);


  const intl = useIntl();

  const {
    register,
    handleSubmit,
    reset: recordReset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<RepresentmentModel>({
    mode: "onChange",
    resolver: yupResolver(validations.acquiringTransactionRepresenmentValidation),
  });

  useEffect(() => {
    //getAcquiringTransactionDetails(acquiringTransactionId);
    getAllRepresentmentReasonCodes(institutionId);
  }, []);

  const handleChange = (event: any) => {
    if (event.target.name === 'systemCodeId') {
      setAcquiringTransactionDetails((prev) => ({
        ...prev,
        representmentReason: event.target.value
      }));
    } else {
      setAcquiringTransactionDetails((prev) => ({
        ...prev,
        [event.target.name]: event.target.value
      }));
    }
  };

  const onSubmit = (values: RepresentmentModel) => {
    const model = {
      ...values,
      institutionId: institutionId,
      accquierRecordToAppear: toAppearOnStatement ? "Y" : "N",
      acquiringTransactionId: acquiringTransactionId,
      settlMerchHalt: toBePaidToMerchant ? "Y" : "N",
    }
    AcquiringTransactionServices.representment(model).then(res => {
      if (res.status === StatusCode.Success) {
        toast.success("Successfully Updated.");
        handleReset();
        closeHandler();
      }
    }).catch(err =>   toast.error(err.response.data.errors[0]));
  }

  const handleReset = (): void => {
    recordReset(
      {
        systemCodeId: undefined,
        chargebackComment: "",
      }
    );
    setToBePaidToMerchant(false);
    setToAppearOnStatement(false);
  }


  const getAcquiringTransactionDetails = async (id: number) => {
    AcquiringTransactionServices.getById(id)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          //setInstituteId(res.data.institutionId);
          getAllRepresentmentReasonCodes(res.data.institutionId);
          setToBePaidToMerchant(res.data.settlMerchHalt === "1" || res.data.settlMerchHalt?.toUpperCase() === "Y" ? true : false)
          setToAppearOnStatement(res.data.accquierRecordToAppear === "1" || res.data.accquierRecordToAppear?.toUpperCase() === "Y" ? true : false)

          setAcquiringTransactionDetails(res.data);
          setValue("systemCodeId", Number(res.data?.representmentReason));
          setValue("chargebackComment", res.data?.representmentComment?.toString());
        }
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
      );
  }

  const getAllRepresentmentReasonCodes = (instID: string) => {
    const model = {
      institutionId: instID,
      codePrefix: CodePrefix.REPRESENT_RSN,
    }
    SystemCodeServices.getSystemCodesByPrefixSuffix(model).then(res => {
      setRepresentmentReasonList(res?.data);
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
        <form>
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  {
                    intl.formatMessage({
                      id: "Entity.label.rePresentment",
                      defaultMessage: "Re Presentment"
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
                          id: "Entity.label.presentmentReason",
                          defaultMessage: "Presentment Reason"
                        })
                      }
                      <span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        {...register("systemCodeId")}
                        //value={acquiringTransactionDetails.representmentReason ? acquiringTransactionDetails.representmentReason.toString() : ""}
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
                          representmentReasonList && representmentReasonList.length > 0 &&
                          representmentReasonList.map(item => (
                            <MenuItem value={item.systemCodeId} key={item.systemCodeId}>{item.description}</MenuItem>
                          ))
                        }
                      </Select>
                      {(acquiringTransactionDetails.representmentReason
                        ? acquiringTransactionDetails.representmentReason.toString()
                        : "") === "" && errors?.systemCodeId?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {validations.acquiringTransactionRepresenmentValidationMessage.systemCodeId}
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
                          id: "Entity.placeholder.chargebackComment",
                          defaultMessage: "Write your comment"
                        })
                      } fullWidth
                        error
                        id="chargebackComment"
                        autoComplete="off"
                        aria-describedby="error-helper-text"
                        {...register("chargebackComment")}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.chargebackComment?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">
                      {
                        intl.formatMessage({
                          id: "Entity.label.toBePaidToMerchant",
                          defaultMessage: "To be paid to merchant"
                        })
                      }
                    </label>
                    <Checkbox checked={toBePaidToMerchant} onChange={(e) => setToBePaidToMerchant(e.target.checked)} />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">
                      {
                        intl.formatMessage({
                          id: "Entity.label.toAppearOnStatement",
                          defaultMessage: "To Appear on Statement"
                        })
                      }
                    </label>
                    <Checkbox checked={toAppearOnStatement} onChange={(e) => setToAppearOnStatement(e.target.checked)} />
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
              onClick={(
                setValue("chargebackComment", ""),
                closeHandler
              )}
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
        </form>
      </Dialog>
    </>
  );
}

export default EntityRepresenmentDialog;