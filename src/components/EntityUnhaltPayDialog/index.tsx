import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  UnhaltPayModel,
  AcquiringTransactionModel
} from "../../models/entityManagement/AcquiringTransactionModel";
import { AcquiringTransactionServices } from "../../services/entityManagement/acquiring-transaction-service";
import { StatusCode } from "../../utils/constant";

type EntityUnhaltPayDialogProps = {
  openHandler: boolean;
  closeHandler: () => void;
  acquiringTransactionIds: number[];
  institutionId: string;
  setRefresh: (refresh: boolean) => void;
};

function EntityUnhaltPayDialog(props: EntityUnhaltPayDialogProps) {
  const { openHandler, closeHandler, acquiringTransactionIds, institutionId,setRefresh} = props;
  const intl = useIntl();

  const onSubmit = (model: UnhaltPayModel) => {
    AcquiringTransactionServices.unHaltTransaction(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          toast.success("Successfully Updated.");
          closeHandler();
          setRefresh(true)
          console.log(res.data)
        }
      })
      .catch((err) =>          toast.error(err.response.data.errors[0])
      );
  };

  return (
    <Dialog open={openHandler} onClose={closeHandler} className="c-dialog sm">
      <DialogTitle component={"div"}>
        <div className="title-block mb-0">
          <div className="left-block mb-0">
            <Typography variant={"h2"}>
              {intl.formatMessage({
                id: "Entity.label.unhaltPay",
                defaultMessage: "UnHalt"
              })}
            </Typography>
          </div>
        </div>
      </DialogTitle>

      <DialogContent>
        <h3>Are you sure you want to UNHALT selected transactions?</h3>
      </DialogContent>

      <DialogActions className="btns-block right">
        <Button
          disableElevation
          variant="contained"
          color="secondary"
          onClick={closeHandler}
        >
          {intl.formatMessage({
            id: "Entity.button.cancel",
            defaultMessage: "Cancel"
          })}
        </Button>

        <Button
          disableElevation
          variant="contained"
          color="primary"
          onClick={() => {
            const model: UnhaltPayModel = {
              institutionId: institutionId,
              acquiringTransactionIds: acquiringTransactionIds
            };
            onSubmit(model);
          }}
        >
          {intl.formatMessage({
            id: "Entity.button.confirm",
            defaultMessage: "Confirm"
          })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EntityUnhaltPayDialog;
