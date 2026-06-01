/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FormControl,
  Grid,
  InputBase,
  Typography,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Institution } from "../../models/configuration/InstitutionModel";
import { TaskModel } from "../../models/configuration/TaskModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { TaskService } from "../../services/configuration/task-service";
import { TaskExecutionService } from "../../services/configuration/task-execution-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { TaskExecutionModel } from "../../models/configuration/TaskExecutionModel";
import { TaskParametersModel } from "../../models/configuration/TaskParametersModel";
import { StatusCode } from "../../utils/constant";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validations from "../../utils/validations";
import { ImportMerchantsModel } from "../../models/configuration/ImportMerchantsModel";
import { jobService } from "../../services/configuration/job-service";
import { down_arrow_icon } from "../../assets/images";

function ImportMerchants() {
  const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
  const intl = useIntl();
  const [processingEvents, setProcessingEvents] = useState<
    TaskExecutionModel[]
  >([]);
  const [taskParameters, setTaskParameters] = useState<TaskParametersModel[]>(
    []
  );
  const [taskName, setTaskName] = useState<string>("");
  const [taskId, setTaskId] = useState<number>(0);
  const [params, setParams] = useState<Record<number, string>>({});
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [jobSelectionList, setJobSelectionList] = useState<string[]>(["Import Merchant", "Import Terminal"]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ImportMerchantsModel>({
    mode: "all",
    resolver: yupResolver(validations.importMerchantsValidations),
  });

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
    }
  };

  useEffect(() => {
    setInstitutefromLocalStorage();
  }, []);

  const onSubmit = (values: ImportMerchantsModel) => {
    const model = {
      backupFilePath: values.backupFile,
      filePath: values.filepath,
      institutionId: selectInstitutionVal,
    };
    if (selectInstitutionVal && values.backupFile && values.filepath && selectedJob === "Import Merchant") {
      jobService
        .uploadMerchantFiles(model)
        .then((response) => {
          if (response.status === StatusCode.Success) {
            toast.success("Merchant files uploaded successfully!");
            // reset();
            // setSelectedJob("");
          }
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
    } else if(selectInstitutionVal && values.backupFile && values.filepath && selectedJob === "Import Terminal"){
      jobService
        .uploadTerminalFiles(model)
        .then((response) => {
          if (response.status === StatusCode.Success) {
            toast.success("Terminal files uploaded successfully!");
            // reset();
            // setSelectedJob("");
          }
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
    }
  };
  return (
    <div>
      <div className="wrapper">
        <main className="main-content">
          <form onSubmitCapture={handleSubmit(onSubmit)}>
            <div className="main-card">
              <div className="title-block">
                <div className="left-block">
                  <Typography variant={"h2"}>
                    {intl.formatMessage({
                      id: "ImportJobs.title",
                      defaultMessage: "Import Jobs",
                    })}
                  </Typography>
                </div>
                <div className="right-block">
                  <Button
                    sx={{ mt: 4, width: "100px" }}
                    variant="contained"
                    disableElevation
                    type="submit"
                    className="btn-light"
                  >
                    <FormattedMessage
                      id="TaskExecution.runBtn"
                      defaultMessage="Run"
                    />
                  </Button>
                </div>
              </div>
              <Grid spacing={3} container>
              <Grid item xs={12} lg={4} sm={6} xl={4}>
                  <div className="input-with-label form-group">
                    <label>
                      {intl.formatMessage({
                        id: "ImportJobs.job",
                        defaultMessage: "Job",
                      })}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        {...register("job")}
                        value={selectedJob}
                        onChange={(event) => setSelectedJob(event.target.value)}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      >
                        <MenuItem value="" disabled>
                          {intl.formatMessage({
                            id: "ImportJobs.selectJob",
                            defaultMessage: "Select Job",
                          })}
                        </MenuItem>
                        {jobSelectionList &&
                          jobSelectionList.length > 0 &&
                          jobSelectionList.map((type) => {
                            return (
                              <MenuItem
                                key={type}
                                value={type}
                              >
                                {type}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText id="error-helper-text" error>
                        {errors.job?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={4} sm={6} xl={4}>
                  <div className="input-with-label form-group">
                    <label>
                      {intl.formatMessage({
                        id: "FilePath.label",
                        defaultMessage: "File Path",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.contact.placeholder.filepath",
                          defaultMessage: "Enter File Path",
                        })}
                        fullWidth
                        {...register("filepath")}
                        inputProps={{ maxLength: 200 }}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.filepath?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} lg={4} sm={6} xl={4}>
                  <div className="input-with-label form-group">
                    <label>
                      {intl.formatMessage({
                        id: "BackupFile.label",
                        defaultMessage: "Backup File",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "Entity.contact.placeholder.enterbackupfile",
                          defaultMessage: "Enter Backup File",
                        })}
                        fullWidth
                        {...register("backupFile")}
                        inputProps={{ maxLength: 200 }}
                      />
                      <FormHelperText id="error-helper-text" error>
                        {errors.backupFile?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default ImportMerchants;
