import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  Select,
  SvgIcon,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, {  useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  add_rounded,
  down_arrow_icon,
  ios_arrow_forward,
  date_ic,
  ic_check,
  ic_checked,
  playIcon,
  uncheck_rounded,
  check_rounded,
  saveIconWhite,
  scheduleIcon,
  stopIcon,
} from "../../assets/images";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validations, { addJobValidation } from "../../utils/validations";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  JobDefinition,
  JobModel,
  JobTaskModel,
  ParameterResponseModel,
} from "../../models/jobs/JobModel";
import {
  JobService,
  JobTaskService,
} from "../../services/job-list-service";
import { scheduleDetails, updateJobState } from "../../feature/jobSchedule";
import JobSchedule1 from "../../components/JobSchedule1";
import { FormattedMessage, useIntl } from "react-intl";
import {
  JobTaskParams,
  StatusCode,
  TransactionTypeForJob,

} from "../../utils/constant";
import { RootState } from "../../feature/store";
import {
  CustomeComparator,
  CustomeComparatorNumber,
  getValues as getValuee,
} from "../../utils/commonfunction";
import { BkdService } from "../../services/bkd-service";

import ClearIcon from "@mui/icons-material/Clear";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { BankFilesOutputService } from "../../services/configuration/bank-files-output-service";
import { TaskExecutionService } from "../../services/configuration/task-execution-service";
import { LayoutService } from "../../services/configuration/file-layout-service";
function CheckboxIcon() {
  return <img src={ic_check} alt="checkbox" />;
}
function CheckedboxIcon() {
  return <img src={ic_checked} alt="checkbox" />;
}

function not(a: JobTaskModel[], b: JobTaskModel[]) {
  return a.filter((value) => b[0]?.taskId !== value?.taskId);
}

function intersection(a: JobTaskModel[], b: JobTaskModel[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function ArrowDown() {
  return <img src={down_arrow_icon} alt="arrow" className="select-icon" />;
}

function datepickerIcon() {
  return <img src={date_ic} alt="calendar" />;
}

function notInParameter(
  a: ParameterResponseModel[],
  b: ParameterResponseModel[]
) {
  const parameterNamesInB = new Set(b.map((item) => item.parameterName));
  return a.filter((item) => !parameterNamesInB.has(item.parameterName));
}

const ThickBlueCalendarWithSixSquaresIcon = () => (
  <SvgIcon style={{ color: '#5798FB', width: "95%" }} viewBox="0 0 70 70">
    {/* Thicker outer blue calendar frame */}
    <rect x="6" y="10" width="52" height="46" rx="5" ry="5" fill="#5798FB" />

    {/* Thicker top tabs */}
    <rect x="16" y="4" width="8" height="14" rx="1" fill="#5798FB" />
    <rect x="40" y="4" width="8" height="14" rx="1" fill="#5798FB" />

    {/* Inner white area (shrunk a bit to thicken outer border) */}
    {/* <rect x="18" y="24" width="28" height="26" rx="2" fill="white" /> */}
    {/* <rect x="10" y="24" width="44" height="26" rx="2" fill="white" /> */}
    <rect x="10" y="20" width="44" height="32" rx="2" fill="white" />

    {/* Six inner blue squares (2 rows x 3 columns) */}
    <rect x="20" y="28" width="6" height="6" rx="1" fill="#5798FB" />
    <rect x="29" y="28" width="6" height="6" rx="1" fill="#5798FB" />
    <rect x="38" y="28" width="6" height="6" rx="1" fill="#5798FB" />

    <rect x="20" y="38" width="6" height="6" rx="1" fill="#5798FB" />
    <rect x="29" y="38" width="6" height="6" rx="1" fill="#5798FB" />
    <rect x="38" y="38" width="6" height="6" rx="1" fill="#5798FB" />
  </SvgIcon>
);


// Function to get the union of two arrays of ParameterResponseModel, avoiding duplicates based on `parameterName`
function union(a: ParameterResponseModel[], b: ParameterResponseModel[]) {
  if (!a || a.length === 0) {
    if (!b || b.length === 0) {
      return [];
    } else {
      return b;
    }
  } else {
    if (!b || b.length === 0) {
      return a;
    } else {
      return [...a, ...notInParameter(b, a)];
    }
  }
}

function DesignerJobDefination() {
  const user = localStorage.getItem("user");
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();
  const inst = localStorage.getItem("DEFAULT_INSTITUTE") ?? "1";

  const [activeLink, setActiveLink] = React.useState(false);
  const [jobRun, setJobRun] = React.useState(false);
  const [jobStatusInprogress, setJobStatusInprogress] =    React.useState<boolean>(false);
  const [fileTypesbyFileType, setFileTypesbyFileType] = useState<any[]>([]);

  const [status, setStatus] = React.useState<boolean>(true);
  const handleChangeStatus = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    setStatus(checked);
  };
  const [successAlert, setSuccessAlert] = React.useState(false);
  const handleSuccessAlert = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    setSuccessAlert(checked);
    setValue("alertSuccess", checked ? "1" : "0", { shouldValidate: true });
    if (!checked) {
      setValue("successEmail", undefined, { shouldValidate: true });
    }
  };
  const [failureAlert, setFailureAlert] = React.useState(false);
  const handleFailureAlert = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    setFailureAlert(checked);
    setValue("alertFailure", checked ? "1" : "0", { shouldValidate: true });
    if (!checked) {
      setValue("failEmail", undefined, { shouldValidate: true });
    }
  };
  const [getJob, setGetJob] = React.useState<JobModel>();
  const [parametersData, setParametersData] = React.useState<
    ParameterResponseModel[]
  >([]);
  const [newParametersData, setNewParametersData] = React.useState<
    ParameterResponseModel[]
  >([]);
  const [temp, setTemp] = React.useState<ParameterResponseModel[]>([]);
  const [updateIndex, setUpdateIndex] = React.useState<number>(-1);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectOpenStatus, setSelectOpenStatus] = useState<boolean>(false);


  const [note, setNote] = React.useState<string>("");
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [oldJobTasks, setOldJobTasks] = React.useState<JobTaskModel[]>([]);
  const [job, setJob] = React.useState<JobModel>();
  const [intervalId, setIntervalId] = React.useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [openPicker, setOpenPicker] = React.useState<boolean>(false);
  const handleOpenSchedule = () => {
      getJobById(taskList);
    dispatch(updateJobState({ openSchedule: true }));
  };
  const handleClickOutside = (event: any) => {
    const scrollAreaId = 'scrollable-menu';
    const isClickInsideScrollArea = event.target.closest(`#${scrollAreaId}`);
    if (isClickInsideScrollArea) {
      return;
    }

    if (event.type === 'scroll') {
      return;
    }

    if (event.target?.id !== 'select-option' && event.target.parentElement?.id !== 'select-option') {
      setSelectOpen(false);
    }

    if (event.target?.id !== 'select-status-option' && event.target.parentElement?.id !== 'select-status-option') {
      setSelectOpenStatus(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [checked, setChecked] = React.useState<JobTaskModel[]>([]);
  const [taskList, setTaskList] = React.useState<JobTaskModel[]>([]);

  const [left, setLeft] = React.useState<JobTaskModel[]>([]);
  const [right, setRight] = React.useState<JobTaskModel[]>([]);

  useEffect(() => {
    JobTaskService.findAllJobTasks()
      .then((res) => {
        let newArray = [];
        newArray = [...res.data];
        newArray.forEach((resItem) => {
          resItem.status = true;
        });
        setLeft([...newArray]);
        setTaskList([...newArray]);
       if (id) {
          getJobById(newArray);
        }
      })
      .catch((err) => {
        err.response?.data?.errors?.map((e: any) => toast.error(e));
      });
  }, [id]);

  useEffect(() => {
    if (id && right?.length) {
      setLeft(
        taskList.filter((x) => !right.find((y) => y.taskId === x.taskId))
      );
    }
  }, [taskList]);

  let leftChecked = intersection(checked, left);
  let rightChecked = intersection(checked, right);

  const handleToggle = (value: JobTaskModel) => () => {
    let singleItem: any = [];
    singleItem.push(value);
    setChecked(singleItem);    
    let parameterList = [...taskList];
    if (temp?.length! && updateIndex >= 0) {
      let data = temp;
      parameterList[updateIndex].parameterResponseDto = [...data];
      let presentInRight = right?.findIndex(
        (data) => data?.taskId === checked[0]?.taskId
      );
      if (id === undefined && presentInRight === -1) {
        setLeft(
          parameterList.filter((x) => !right.find((y) => y.taskId === x.taskId))
        );
      } else if (presentInRight >= 0) {
        let parameterRight: any = [...right];
        parameterRight[presentInRight] = parameterList.find(
          (task) => task.taskId === checked[0].taskId
        ) as JobTaskModel;
        setRight(parameterRight);
      }
      setTemp([]);
      setUpdateIndex(-1);
    }
    setParametersData(value?.parameterResponseDto);
    setTemp(value?.parameterResponseDto);
    setTaskList(parameterList);
  };

  const handleCheckedRight = () => {
    leftChecked = checked;
    setRight(
      right.concat(leftChecked).sort(function (a, b) {
        return a.taskId - b.taskId;
      })
    );
    setLeft(not(left, leftChecked));
    setChecked([]);
    setParametersData([]);
    setNewParametersData([]);
    setTaskList(taskList);
  };
  const handleCheckedLeft = () => {
    rightChecked = checked;
    setLeft(
      left.concat(rightChecked).sort(function (a, b) {
        return a.taskId - b.taskId;
      })
    );

    setRight(not(right, rightChecked));
    setChecked([]);
    setParametersData([]);
    setNewParametersData([]);
    setTaskList(taskList);
  };
  const paramValueChange = (event: any, params: any) => {
    let data = [...temp];
    data[params?.node?.rowIndex] = {
      ...params.data,
      parameterValue: event.target.value,
    };
    if (data[params?.node?.rowIndex]?.parameterName === JobTaskParams?.Bin) {
      const cardTypeIndex = data?.findIndex(item => item.parameterName === JobTaskParams?.CardType);
      if (cardTypeIndex !== -1) {
        data[cardTypeIndex] = { ...data[cardTypeIndex], parameterValue: undefined };
      }
    }
    if (data[params?.node?.rowIndex]?.parameterName === JobTaskParams.CardTypeType) {
      const value = event.target.value;
    }

    let getIndex = taskList.findIndex(
      (task) => task.taskId === checked[0].taskId
    );
    if (getIndex !== -1) setUpdateIndex(getIndex);
    setTemp(data);
  };
const filteredParametersData = parametersData?.filter((row) => {
  return true;
});
const renderCell = (row: any, col: any, rowIndex: number) => {
  if (col.renderCell) {
    const params = {
      row,
      id: rowIndex,
      value: row[col.field],
      field: col.field,
      api: {
        getRowIndexRelativeToVisibleRows: () => rowIndex,
      },
    };
    return col.renderCell(params);
  }
  return row[col.field] ?? "";
};  
  const moveUp = () => {
    const index = right.findIndex(
      (task) => task.taskId === checked[0]?.taskId
    );

    if (index <= 0) return;

    const newArray = [...right];
    [newArray[index - 1], newArray[index]] =
      [newArray[index], newArray[index - 1]];

    setRight(newArray);
  };

  const moveDown = () => {
  const index = right.findIndex(
    (task) => task.taskId === checked[0]?.taskId
  );

  if (index === -1 || index >= right.length - 1) return;

  const newArray = [...right];
  [newArray[index], newArray[index + 1]] =
    [newArray[index + 1], newArray[index]];

  setRight(newArray);
  };
function updateAbbrevList(outputFileType:string){
      BankFilesOutputService.getAllBankFilesOutputByInstitutionAndOutputFileType(inst,outputFileType)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setOutputFileTypeAbbrevs(res.data)
        }
      })
      .catch((err) => {
        err?.response?.data?.errors.map((e: string) => toast.error(e));
      });
}
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobModel>({
    mode: "all",
    resolver: yupResolver(
      successAlert && failureAlert
        ? validations.AlertOnSuccessAndFailure
        : successAlert
          ? validations.successAlert
          : failureAlert
            ? validations.failureAlert
            : addJobValidation
    ),
  });

  const submitJobDefinition = () => {
    if (getValues("successEmail") === "") {
      setValue("successEmail", undefined, { shouldValidate: true });
    }
    if (getValues("failEmail") === "") {
      setValue("failEmail", undefined, { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (successAlert || failureAlert) {
      trigger("successEmail");
      trigger("failEmail");
    }
  }, [successAlert, failureAlert, trigger]);

  const [successEmailDefaultValue, setSuccessEmailDefaultValue] = useState<any>(
    []
  );
  const [successEmail, setSuccessEmail] = useState<string>("");
  const [emailData, setEmailData] = useState<string>("");
  const [failEmailDefaultValue, setFailEmailDefaultValue] = useState<any>([]);
  const [failEmail, setFailEmail] = useState<string>("");
  const [failemailData, setFailemailData] = useState<string>("");

  useEffect(() => {
    setSuccessEmailDefaultValue(
      successEmail !== "" ? successEmail?.toString().split(";") : []
    );
  }, [successEmail]);

  const addSuccessEmail = (event: any) => {
    if (
      (event?.type === "click" && emailData) ||
      (event?.key === ";" && emailData)
    ) {
      if (
        successEmail?.toString().split(";")?.length >= 10 ||
        successEmail
          ?.toString()
          .split(";")
          .find((u) => u.toLowerCase() === emailData.toLowerCase()) ||
        emailData?.length > 30 ||
        (emailData?.length > 0 &&
          emailData?.match(
            /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
          ) === null) ||
        emailData.trim()?.length === 0
      ) {
        event.preventDefault();
      } else {
        let data =
          successEmail !== "" ? `${successEmail};${emailData}` : emailData;
        setSuccessEmail(data);
        setValue("successEmail", data, {
          shouldValidate: true,
        });
      }
    }
  };

  useEffect(() => {
    setFailEmailDefaultValue(
      failEmail !== "" ? failEmail?.toString().split(";") : []
    );
  }, [failEmail]);

  const addFailEmail = (event: any) => {
    if (
      (event?.type === "click" && failemailData) ||
      (event?.key === ";" && failemailData)
    ) {
      if (
        failEmail?.toString().split(";")?.length >= 10 ||
        failEmail
          ?.toString()
          .split(";")
          .find((u) => u.toLowerCase() === failemailData.toLowerCase()) ||
        failemailData?.length > 30 ||
        (failemailData?.length > 0 &&
          failemailData.match(
            /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
          ) === null) ||
        failemailData.trim()?.length === 0
      ) {
        event.preventDefault();
      } else {
        let data =
          failEmail !== "" ? `${failEmail};${failemailData}` : failemailData;
        setFailEmail(data);
        setValue("failEmail", data, {
          shouldValidate: true,
        });
      }
    }
  };
  const [bankCodes, setBankCodes] = useState<any[]>([]);
  const [transactionIds, setTransactionIds] = useState<any[]>([]);
  const [outputFileTypes, setOutputFileTypes] = useState<any[]>([]);
  const [outputFileTypeAbbrevs, setOutputFileTypeAbbrevs] = useState<any[]>([]);

  const [fromTime, setFromTime] = React.useState<string>("");
  const [toTime, setToTime] = React.useState<string>("");


  useEffect(() => {
    let layoutType = "Output";
    
    if(checked[0]?.serviceMode === "file2db" 
        || ( (((checked[0] as any)?.service && (checked[0] as any)?.service?.serviceMode === "file2db")
         || ((checked[0] as any)?.serviceMode && (checked[0] as any)?.serviceMode === "file2db")))){
      layoutType = "Input";
    }
    
    LayoutService.getFileTypesbyFileType(layoutType)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          console.log("res>>>>>",res.data);
          setFileTypesbyFileType(res.data)
        }
      })
      .catch((err) => {
      //  err?.response?.data?.errors.map((e: string) => toast.error(e));
      });

  TaskExecutionService.getExportPaymentFiles(inst)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setTransactionIds(res.data)
        }
      })
      .catch((err) => {
        err?.response?.data?.errors.map((e: string) => toast.error(e));
      });
    BankFilesOutputService.getDistinctBankFilesOutputBankCodesByInstitution(inst)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setBankCodes(res.data)
        }
      })
      .catch((err) => {
        err?.response?.data?.errors.map((e: string) => toast.error(e));
      });
      BankFilesOutputService.getDistinctBankFilesOutputByInstitution(inst)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setOutputFileTypes(res.data)
        }
      })
      .catch((err) => {
        err?.response?.data?.errors.map((e: string) => toast.error(e));
      });
  }, [checked]);

  const getJobById = async (taskList: JobTaskModel[], jobId = Number(id)) => {
    await JobService.getJobById(jobId)
      .then((res) => {


        if (res.status === StatusCode.Success) {
          reset(res.data); 
          setActiveLink(true);
          setGetJob(res.data);
          setStatus(res.data.status === "1" ? true : false);
          setSuccessAlert(res.data.alertSuccess === "1" ? true : false);
          setFailureAlert(res.data.alertFailure === "1" ? true : false);
          setJobRun(res.data.enabled === "1" ? true : false);
          setSuccessEmail(res.data?.successEmail ? res.data?.successEmail : "");
          setFailEmail(res.data?.failEmail ? res.data?.failEmail : "");
          // if(res.data.enabled === "0" && jobStatus){
          //   setJobStatus(false);
          // }
          dispatch(scheduleDetails(res.data as JobModel));
          //setLeft([...data.taskList]);
          if (res.data.jobDefinitionTask) {
            let newArray: any = [];
            let newTaskList: JobTaskModel[] = taskList;
            res.data?.jobDefinitionTask.map((task) => {
              let taskIndex = newTaskList.findIndex(
                (newtask) => newtask.taskId === task.task?.taskId
              );
              newTaskList[taskIndex] = {
                ...task?.task,
                status: false,
                parameterResponseDto: union(
                  task?.jobTaskParametersResponseDto,
                  newTaskList[taskIndex].parameterResponseDto
                ),
              } as JobTaskModel;
              newArray.push({
                ...task?.task,
                status: false,
                parameterResponseDto: union(
                  task?.jobTaskParametersResponseDto,
                  newTaskList[taskIndex].parameterResponseDto
                ),
              });
              setRight(newArray);
            });
            setTaskList(newTaskList);
          }
        }
      })
      .catch((err) => {
        err?.response?.data?.errors.map((e: string) => toast.error(e));
      });
  };

  const onSubmit = async (data: JobModel) => {
    let parameterRight: JobTaskModel[] = [...right];
    let layoutItemTemp = temp?.find(t => t.parameterName === "Layout");

    if (layoutItemTemp) {
      for (let index = 0; index < parameterRight.length; index++) {
        const jobTask = parameterRight[index];
    
        if (jobTask && jobTask.parameterResponseDto) {
          const parameter = jobTask.parameterResponseDto.find(p => p.parameterName === "Layout");
          if (parameter) {
            const updatedParameter = { ...parameter, parameterValue: layoutItemTemp?.parameterValue };
            const index = jobTask.parameterResponseDto.findIndex(p => p.parameterName === "Layout");
            if (index !== -1) {
              jobTask.parameterResponseDto[index] = updatedParameter;
            }
          }
        }
      }

    }

    let parameterList = [...taskList];
    if (temp?.length! && updateIndex >= 0) {
      let data = temp;
      parameterList[updateIndex].parameterResponseDto = [...data];
      let presentInRight = right?.findIndex(
        (data) => data?.taskId === checked[0]?.taskId
      );
      if (presentInRight >= 0) {
        parameterRight[presentInRight] = parameterList.find(
          (task) => task.taskId === checked[0].taskId
        ) as JobTaskModel;
      }
    }
    let transferValue = true,
      parameterValueValidation = true;
    let updateJobDefTask: any = [];
    if (
      parameterRight?.length > 0 &&
      transferValue &&
      parameterValueValidation
    ) {

      parameterRight.map((item: any, index: number) => {        
        let taskParameters: any = [];
        if (item?.parameterResponseDto?.length > 0) {
          let selectedFromDate = item?.parameterResponseDto?.find((data: any) => data?.parameterName === JobTaskParams.FromDate)?.parameterValue ?? "";
          let selectedToDate = item?.parameterResponseDto?.find((data: any) => data?.parameterName === JobTaskParams.ToDate)?.parameterValue ?? "";
          item?.parameterResponseDto?.map((parameter: any) => {
                        console.log("parameter>>>>>>",parameter);

            if (
              parameter?.isMandatory === "1" &&
              (parameter?.parameterValue === undefined ||
                parameter?.parameterValue === "" ||
                parameter?.parameterValue === null)
            ) {
              transferValue = false;
            } else if (parameter?.parameterName === JobTaskParams.AckFolder) {
              parameterValueValidation = true;
            } else if (
              (parameter?.parameterValue !== undefined ||
                parameter?.parameterValue !== "") &&
              parameter?.parameterName !== JobTaskParams.FromDate &&
              parameter?.parameterName !== JobTaskParams.ToDate &&
              parameter?.parameterName !== JobTaskParams.ExpiryDate &&
              parameter?.parameterName !== JobTaskParams.fromTime &&
              parameter?.parameterName !== JobTaskParams.toTime &&
              parameter?.parameterName !== JobTaskParams.FileId &&
              parameter?.parameterName !== JobTaskParams.BankCode &&
              parameter?.parameterName !== JobTaskParams.OutputFileType &&
              parameter?.parameterName !== JobTaskParams.OutputFileTypeAbbrev &&
              parameter?.parameterName !== JobTaskParams.TransactionIds &&
              parameter?.parameterName !== JobTaskParams.SourceFolder &&
              parameter?.parameterName !== JobTaskParams.DestinationFolder &&
              parameter?.parameterName !== JobTaskParams.Layout &&

              parameter?.parameterValue
                ?.trim()
                ?.match(/^[a-zA-Z\s0-9,\\-_/:.]+$/) === null
            ) {
              parameterValueValidation = false;
            } else if (
              (parameter?.parameterValue !== undefined ||
                parameter?.parameterValue !== "") &&
              parameter?.parameterName !== JobTaskParams.FromDate &&
              parameter?.parameterName !== JobTaskParams.ToDate &&
              parameter?.parameterName !== JobTaskParams.MonthYear &&
              parameter?.parameterName !== JobTaskParams.fromTime &&
              parameter?.parameterName !== JobTaskParams.toTime &&
              parameter?.parameterName !== JobTaskParams.BankCode &&
              parameter?.parameterName !== JobTaskParams.OutputFileType &&
              parameter?.parameterName !== JobTaskParams.OutputFileTypeAbbrev &&
              parameter?.parameterName !== JobTaskParams.TransactionIds &&
              parameter?.parameterName !== JobTaskParams.FileId &&
                      parameter?.parameterName !== JobTaskParams.SourceFolder &&
              parameter?.parameterName !== JobTaskParams.DestinationFolder &&
                            parameter?.parameterName !== JobTaskParams.Layout &&

              parameter?.parameterValue
                ?.trim()
                ?.match(/^[a-zA-Z\s0-9,\\-_/:.]+$/) === null
            ) {
              parameterValueValidation = false;
            }
             else if (
              (parameter?.parameterName !== JobTaskParams.FromDate && selectedToDate !== "" && selectedFromDate === "") ||
              (parameter?.parameterName !== JobTaskParams.ToDate && selectedToDate === "" && selectedFromDate !== "")
            ) {
              parameterValueValidation = false;
            } else if (parameter?.parameterName === JobTaskParams.MonthYear &&
              (parameter?.parameterValue?.toString() != ""  && String(parameter?.parameterValue) && parameter?.parameterValue) &&    
              parameter?.parameterValue
                    ?.match(/^(0[1-9]|1[0-2])\d{2}$/) === null) {
              parameterValueValidation = false;
            }
            parameter?.parameterValue !== "" &&
              parameter?.parameterValue !== undefined &&
              parameter?.parameterValue !== null &&
              parameter?.parameterValue?.length !== 0 &&
            taskParameters.push({
              parameterValue: Array.isArray(parameter?.parameterValue)
                ? parameter.parameterValue.join(",")
                : parameter?.parameterValue,

              parametersServiceId: parameter.parametersServiceId,
            });
          });
          }
        updateJobDefTask.push({
          taskId: item.taskId,
          priority: index + 1,
          jobTaskParamtersRequestDto: item.parameterResponseDto
            ? taskParameters
            : [],
        });
      });
    }
    let model = {
      alertFailure: failureAlert === true ? "1" : "0",
      alertSuccess: successAlert === true ? "1" : "0",
      successEmail: data?.successEmail
        ? (data?.successEmail as any)?.join(";")
        : "",
      failEmail: data?.failEmail ? (data?.failEmail as any)?.join(";") : "",
      status: status === true ? "1" : "0",
      jobDefinitionTask: updateJobDefTask,
      jobDescription: data?.jobDescription,
      jobId: id ? Number(id) : 0,
      jobName: data?.jobName,
    };
    if (transferValue && parameterValueValidation) {
    
  await JobService.saveJob(model)
        .then((res) => {
          if (res.status === StatusCode.Success && res.data.jobId) {
            if (id) {
              toast.success(`Job details updated successfully`);
              navigate("/jobs");
              clearInterval(intervalId);
            } else {
              setActiveLink(true);
              toast.success(
                "Job record added successfully, now you can schedule the Job"
              );
              navigate(`/job-definition/${res.data?.jobId}`);
            }
          }
        })
        .catch((err) => {
          err?.response?.data?.errors?.map((e: string) => toast.error(e));
        });
    } else {
      toast.error("Invalid Job Task's parameter value");
    }
  };

  const getExecutionStatus = async (jobId: number) => {
    try {
      const intervalId = setInterval(async () => {
        const response = await JobService.getJobExecutionStatusById(jobId);
        const data = response.data;
        if (executionStatusUpdated(data)) {
          setJobStatusInprogress(false);
          setJobRun(data.toString() === "1" ? true : false);
          toast.success("Job has been stopped.");
          clearInterval(intervalId);
        }
      }, 2000);
      setIntervalId(intervalId);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const executionStatusUpdated = (data: any) => {

    return data === 0;
  };

  const StartStopJob = () => {

    if (getJob) {

      if (jobRun) {
        Swal.fire({
          title: intl.formatMessage({
            id: "SwalPopup.areyousure?",
            defaultMessage: "Are you sure?",
          }),
          text: intl.formatMessage({
            id: "SwalPopup.youwanttostopthisjob",
            defaultMessage: "You want to stop this job",
          }),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: intl.formatMessage({
            id: "Dashboard_1_2.cancel",
            defaultMessage: "Cancel",
          }),
          confirmButtonText: intl.formatMessage({
            id: "SwalPopup.yes,stopit!",
            defaultMessage: "Yes, stop it!",
          }),
        }).then((result) => {
          if (result.isConfirmed) {
            JobService.stopJobExecution(Number(id))
              .then((res) => {
                if (res.status === StatusCode.Success) {
                  toast.success("Job has been stopped.");
                  // getJobById(taskList);
                  setJobRun(!jobRun);
                  setJobStatusInprogress(true);
                  getExecutionStatus(Number(id));
                }
              })
              .catch((err) => {
                err?.response?.data?.errors?.map((e: string) => toast.error(e));
              });
          }
        });
      } else {
        JobService.startJobExecution(Number(id))
          .then((res) => {
            if (res.status === StatusCode.Success) {
              toast.success("Job has been started.");
              setJobRun(!jobRun);
              setJobStatusInprogress(true);
              getExecutionStatus(Number(id));
            }
          })
          .catch((err) => {
            err?.response?.data?.errors?.map((e: string) => toast.error(e));
          });
      }
    }
  };
  const Left = useSelector(
    (state: RootState) => state.selectedCard.position.left
  );
  const Top = useSelector(
    (state: RootState) => state.selectedCard.position.top
  );
  const [top, setTop] = React.useState(Top);
  const [leftposition, setLeftposition] = React.useState(Left);
  useEffect(() => {
    setLeftposition(Left);
    setTop(Top);
  }, [Left, Top]);

 const columnDefs = [
  {
    field: "parameterName",
    headerName: intl.formatMessage({
      id: "JobListing_1.parameter",
      defaultMessage: "Parameter",
    }),
    maxWidth: 180,
    minWidth: 100,
    sortable: false,
    filterable: false,
    flex: 1,
  },

  {
    field: "parameterValue",
    headerName: intl.formatMessage({
      id: "NewCardIssueance_1.value",
      defaultMessage: "Value",
    }),
    minWidth: 70,
    sortable: false,
    filterable: false,
    flex: 1,

    renderCell: (params: any) => {
      const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
      const row = params.row;

      if (!temp || temp.length === 0) return null;

      const getTempValue = (key: string) =>
        temp.find((d) => d?.parameterName === key)?.parameterValue ?? "";
        const selectedFromDate = getTempValue(JobTaskParams.FromDate);
        const selectedToDate = getTempValue(JobTaskParams.ToDate);

      return (
        <Box sx={{ display: "flex", flexDirection: "column", p: 0.25, width: "100%" }}>
          {[
            JobTaskParams.Bin,
            JobTaskParams.FileId,
            JobTaskParams.CardTypeType,
            JobTaskParams.StockId,
            JobTaskParams.Merchant,
            JobTaskParams.Outlet,
            JobTaskParams.ProductType,
            JobTaskParams.ReconType,
          ].includes(row?.parameterName) ? (
            <Select
              fullWidth
              value={temp[rowIndex]?.parameterValue ?? ""}
              onChange={(e) => paramValueChange(e, params)}
              onFocus={getValuee}
              size="small"
            >
              <MenuItem value="">
                <em>Select {row?.parameterName}</em>
              </MenuItem>
            </Select>
  ) : row?.parameterName === JobTaskParams.OutputFileTypeAbbrev ? (
  <Select
    value={temp[rowIndex]?.parameterValue ?? ""}
    onChange={(event: any) => {
      const value = event.target.value;
      
      const updated = [...temp];
      updated[rowIndex] = {
        ...row,
        parameterValue: value,
      };
      setTemp(updated);
    }}
    displayEmpty
    renderValue={(selected) => {
      if (!selected || selected === "") {
        return <em>Select Output File Type Abbrev</em>;
      }
      return selected;
    }}
    fullWidth
    size="small"
  >
    <MenuItem value="">
      <em>Select Output File Type Abbrev</em>
    </MenuItem>    
    {outputFileTypeAbbrevs?.map((code: string, index: number) => (
      <MenuItem key={index} value={code}>
        {code}
      </MenuItem>
    ))}
  </Select>
            ) : row?.parameterName === JobTaskParams.BankCode ? (
  <Select
    value={temp[rowIndex]?.parameterValue ?? ""}
    onChange={(event: any) => {
      const value = event.target.value;
      
      const updated = [...temp];
      updated[rowIndex] = {
        ...row,
        parameterValue: value,
      };
      
      setTemp(updated);

          let getIndex = taskList.findIndex(
      (task) => task.taskId === checked[0].taskId
    );
    if (getIndex !== -1) setUpdateIndex(getIndex);
    }}
    displayEmpty
    renderValue={(selected) => {
      if (!selected || selected === "") {
        return <em>Select Bank Code</em>;
      }
      return selected;
    }}
    fullWidth
    size="small"
  >
    <MenuItem value="">
      <em>Select Bank Code</em>
    </MenuItem>
    
    <MenuItem value="*">* (All)</MenuItem>
    
    {bankCodes?.map((code: string, index: number) => (
      <MenuItem key={index} value={code}>
        {code}
      </MenuItem>
    ))}
  </Select>
   ) : row?.parameterName === JobTaskParams.OutputFileType ? (
  <Select
    value={temp[rowIndex]?.parameterValue ?? ""}
    onChange={(event: any) => {
      const value = event.target.value;
      const updated = [...temp];
      updated[rowIndex] = {
        ...row,
        parameterValue: value,
      };
      setTemp(updated);
      updateAbbrevList(value);
      let getIndex = taskList.findIndex(
      (task) => task.taskId === checked[0].taskId
    );
    if (getIndex !== -1) setUpdateIndex(getIndex);
    }}
    displayEmpty
    renderValue={(selected) => {
      if (!selected || selected === "") {
        return <em>Select Output File Type</em>;
      }
      return selected;
    }}
    fullWidth
    size="small"
  >
    <MenuItem value="">
      <em>Select Output File Type</em>
    </MenuItem>    
    {outputFileTypes?.map((code: string, index: number) => (
      <MenuItem key={index} value={code}>
        {code}
      </MenuItem>
    ))}
  </Select>
              ) : row?.parameterName === JobTaskParams.Layout ? (
<Select
  value={String(temp[rowIndex]?.parameterValue ?? "")}
  onChange={(event: any) => {
    const value = String(event.target.value);

    const updated = [...temp];

    updated[rowIndex] = {
      ...row,
      parameterValue: value,
    };

    setTemp(updated);

    let getIndex = taskList.findIndex(
      (task) => task.taskId === checked[0].taskId
    );

    if (getIndex !== -1) setUpdateIndex(getIndex);
  }}
  displayEmpty
  renderValue={(selected) => {
    if (!selected || selected === "") {
      return <em>Select Layout</em>;
    }

    const selectedLayout = fileTypesbyFileType?.find(
      (layout: any) => String(layout.layoutId) === String(selected)
    );

    return selectedLayout?.layoutName ?? "";
  }}
  fullWidth
  size="small"
>
  <MenuItem value="">
    <em>Select Layout</em>
  </MenuItem>

  {fileTypesbyFileType?.map((layout: any, index: number) => (
    <MenuItem
      key={layout.layoutId ?? index}
      value={String(layout.layoutId)}
    >
      {layout.layoutName}
    </MenuItem>
  ))}
</Select>
 ) : row?.parameterName === JobTaskParams.TransactionIds ? (
  <Select
    multiple
    value={
      Array.isArray(temp[rowIndex]?.parameterValue)
        ? temp[rowIndex]?.parameterValue
        : temp[rowIndex]?.parameterValue?.toString()?.split(",").filter(Boolean) ?? []
    }
    onChange={(event: any) => {
      const value = event.target.value;
      let newValue: string[];

      // Handle "Select All" logic
      if (value.includes("SELECT_ALL")) {
        // If "Select All" was just clicked
        const currentValue = Array.isArray(temp[rowIndex]?.parameterValue)
          ? temp[rowIndex]?.parameterValue
          : [];
        
        // If all items are already selected, deselect all
        if (currentValue?.length === transactionIds.length) {
          newValue = [];
        } else {
          // Otherwise, select all
          newValue = [...transactionIds];
        }
      } else {
        newValue = Array.isArray(value) ? value : [value];
      }

      const updated = [...temp];
      updated[rowIndex] = {
        ...row,
        parameterValue: newValue,
      };
          let getIndex = taskList.findIndex(
      (task) => task.taskId === checked[0].taskId
    );
    if (getIndex !== -1) setUpdateIndex(getIndex);
      setTemp(updated);
    }}
    displayEmpty
    renderValue={(selected: any) => {
      if (!selected || selected.length === 0) {
        return <em>Select Transaction IDs</em>;
      }
      if (selected.length === transactionIds.length) {
        return "All Selected";
      }
      return Array.isArray(selected) ? selected.join(", ") : selected;
    }}
    fullWidth
    size="small"
  >
    {/* Select All option */}
    <MenuItem value="SELECT_ALL">
      <Checkbox
        checked={
          Array.isArray(temp[rowIndex]?.parameterValue) &&
          (temp[rowIndex]?.parameterValue?.length ?? 0) === transactionIds.length
        }
        indeterminate={
          Array.isArray(temp[rowIndex]?.parameterValue) &&
          (temp[rowIndex]?.parameterValue?.length ?? 0) > 0 &&
          (temp[rowIndex]?.parameterValue?.length ?? 0) < transactionIds.length
        }
      />
      <ListItemText primary="Select All" />
    </MenuItem>
    
    {transactionIds?.map((txnId: string, index: number) => (
      <MenuItem key={index} value={txnId}>
        <Checkbox
          checked={
            Array.isArray(temp[rowIndex]?.parameterValue)
              ? temp[rowIndex]?.parameterValue?.includes(txnId) ?? false
              : temp[rowIndex]?.parameterValue
                  ?.toString()
                  ?.split(",")
                  ?.includes(txnId) ?? false
          }
        />
        <ListItemText primary={txnId} />
      </MenuItem>
    ))}
  </Select>
          ) : row?.parameterName === JobTaskParams.FromDate ||
            row?.parameterName === JobTaskParams.ToDate ? (
            <TextField
              type="date"
              value={temp[rowIndex]?.parameterValue ?? ""}
              onChange={(e) => {
                const updated = [...temp];
                updated[rowIndex] = {
                  ...row,
                  parameterValue: e.target.value,
                };
                          let getIndex = taskList.findIndex(
      (task) => task.taskId === checked[0].taskId
    );
    if (getIndex !== -1) setUpdateIndex(getIndex);
                setTemp(updated);
              }}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          ) : (
            <TextField
              value={temp[rowIndex]?.parameterValue ?? ""}
              onChange={(e) => {
                const updated = [...temp];
                updated[rowIndex] = {
                  ...row,
                  parameterValue: e.target.value,
                };
                          let getIndex = taskList.findIndex(
      (task) => task.taskId === checked[0].taskId
    );
    if (getIndex !== -1) setUpdateIndex(getIndex);
                setTemp(updated);
              }}
              fullWidth
              size="small"
              variant="standard"
            />
          )}
          {(!temp[rowIndex]?.parameterValue &&
            row?.isMandatory === "1") && (
            <FormHelperText error>
              {`${row?.parameterName} is required`}
            </FormHelperText>
          )}
        </Box>
      );
    },
  },
];

  const customList = (items: JobTaskModel[], type: string) => (    
    <Card>
      <CardHeader
        title={
          type === "left"
            ? intl.formatMessage({
              id: "JobDefinition_2.tasklist",
              defaultMessage: "Task Batch Size",
            })
            : type === "old"
              ? intl.formatMessage({
                id: "JobDefinition_2.rightcontent",
                defaultMessage: "Previous Job Tasks",
              })
              : intl.formatMessage({
                id: "JobDefinition_2.jobtasks",
                defaultMessage: "Job Tasks",
              })
        }
      />
      <Grid container xs={12}>
        <Grid item xs={12}>
          <div className="list-title">
            <label>
              <FormattedMessage
                id="JobDefinition_2.task"
                defaultMessage="Task"
              />
            </label>
          </div>
        </Grid>
      </Grid>
      <List dense component="div" role="list" className="transfer-list">
        {items?.length > 0 &&
          items?.map((value: JobTaskModel) => {
            const labelId = `transfer-list-item-${value}-label`;
            return (
              <ListItem
                key={value.taskId}
                role="listitem"
                button
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Radio
                    checked={value.taskId === checked[0]?.taskId ? true : false}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                    checkedIcon={<img src={check_rounded} alt="radio" />}
                    icon={<img src={uncheck_rounded} alt="radio" />}
                  />
                </ListItemIcon>
                <Grid container xs={12} columnSpacing={8}>
                  <Grid item xs={12}>
                    <ListItemText primary={`${value.taskName}`}></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
      </List>
    </Card>
  );

  const onCancel = () => {
    navigate("/jobs");
    clearInterval(intervalId);
    setIsUpdate(false);
  };

  return (
    <>
          <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
      <Card className="user-card job-card">
        <CardContent>
          <CardHeader
            className="card-title"
            title={
              id
                ? intl.formatMessage({
                  id: "JobDefinition_2.editjob",
                  defaultMessage: "Edit Job",
                })
                : intl.formatMessage({
                  id: "JobDefinition_2.newjob",
                  defaultMessage: "New Job",
                })
            }
            subheader={
              id
                ? intl.formatMessage({
                  id: "JobDefinition_2.editjobdetailshere",
                  defaultMessage: "Edit job details here",
                })
                : intl.formatMessage({
                  id: "JobDefinition_2.addnewjobhere",
                  defaultMessage: "Add New Job here",
                })
            }
            titleTypographyProps={{ variant: "h2", component: "h2" }}
            subheaderTypographyProps={{ variant: "h4", component: "h4" }}
          />
          <Divider />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
              <Grid
                container
                item
                lg={3}
                xs={12}
                className="job-form"
                rowSpacing={6}
              >
                <Grid
                  item
                  lg={12}
                  xs={6}
                  container
                  spacing={{ lg: 3, xs: 1 }}
                  alignItems="center"
                >
                  <Grid item lg={12} xs={4}>
                    <label className="label">
                      <FormattedMessage
                        id="JobDefinition_2.jobname"
                        defaultMessage="Job Name"
                      />{" "}
                      <span className="required">*</span>
                    </label>
                  </Grid>
                  <Grid item lg={12} md={6} xs={8}>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "JobDefinition_2.entername",
                        defaultMessage: "Enter Name",
                      })}
                      id="name"
                      fullWidth
                      {...register("jobName")}
                      inputProps={{ maxLength: 100 }}
                      autoComplete="off"
                    />
                    {
                      <FormHelperText id="error-helper-text" error>
                        {errors.jobName?.message}
                      </FormHelperText>
                    }
                    {isUpdate && (watch("jobName") as any) !== job?.jobName && (
                      <FormHelperText error>
                        Previous value: {job?.jobName}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  item
                  lg={12}
                  xs={6}
                  container
                  spacing={{ lg: 3, xs: 1 }}
                  alignItems="flex-start"
                >
                  <Grid item lg={12} xs={4}>
                    <label className="label align-label">
                      <FormattedMessage
                        id="JobDefinition_2.descriptions"
                        defaultMessage="Descriptions"
                      />{" "}
                      <span className="required">*</span>
                    </label>
                  </Grid>
                  <Grid item lg={12} md={6} xs={8}>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "JobDefinition_2.enterdescriptions",
                        defaultMessage: "Enter Descriptions",
                      })}
                      id="name"
                      fullWidth
                      multiline
                      rows={5}
                      inputProps={{ maxLength: 500 }}
                      {...register("jobDescription")}
                      autoComplete="off"
                    />
                    {
                      <FormHelperText id="error-helper-text" error>
                        {errors.jobDescription?.message}
                      </FormHelperText>
                    }
                    {isUpdate &&
                      (watch("jobDescription") as any) !==
                      job?.jobDescription && (
                        <FormHelperText error>
                          Previous value: {job?.jobDescription}
                        </FormHelperText>
                      )}
                  </Grid>
                </Grid>
                <Grid
                  item
                  lg={12}
                  xs={6}
                  container
                  spacing={{ lg: 3, xs: 1 }}
                  alignItems="center"
                >
                  <Grid item xs={12} alignSelf="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register("alertSuccess")}
                          checked={successAlert}
                          onChange={handleSuccessAlert}
                          icon={<CheckboxIcon />}
                          checkedIcon={<CheckedboxIcon />}
                        />
                      }
                      label={intl.formatMessage({
                        id: "JobDefinition_2.alertonsuccessexecution",
                        defaultMessage: "Alert on success execution",
                      })}
                    />
                    {isUpdate &&
                      (watch("alertSuccess") as any) !== job?.alertSuccess && (
                        <FormHelperText error>
                          Previous value:{" "}
                          {job?.alertSuccess == "1" ? "Checked" : "Unchecked"}
                        </FormHelperText>
                      )}
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl>
                      <Grid container spacing={1} justifyContent="flex-start">
                        <Grid item lg={12} xs={4} className="align-label">
                          <label>
                            <FormattedMessage
                              id="NewCardIssueance_1.successemail"
                              defaultMessage="Success Email"
                            />
                            <span className="required">*</span>
                          </label>
                        </Grid>
                        <Grid item lg={12} md={6} xs={8}>
                          <Autocomplete
                            multiple
                            id="success-email"
                            {...register("successEmail")}
                            className="keyindex-autocomplete"
                            // freeSolo
                            disabled={
                              !successAlert 
                            }
                            open={false}
                            options={[]}
                            onOpen={addSuccessEmail}
                            popupIcon={
                              successEmail?.toString().split(";")?.length >=
                                10 ||
                                successEmail
                                  ?.toString()
                                  .split(";")
                                  .find((u) => u === emailData) ||
                                emailData?.length > 30 ||
                                emailData?.trim()?.length === 0 ? (
                                <></>
                              ) : (
                                <img
                                  src={add_rounded}
                                  alt="add"
                                  style={{ height: "15px" }}
                                />
                              )
                            }
                            clearIcon={
                              <ClearIcon
                                fontSize="small"
                                onClick={() => {
                                  setSuccessEmail("");
                                  setValue("successEmail","", {
                                    shouldValidate: true,
                                  });
                                }}
                              />
                            }
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  label={option}
                                  {...getTagProps({ index })}
                                  onDelete={() => {
                                    let data = successEmail
                                      ?.toString()
                                      .split(";");
                                    data.splice(index, 1);
                                    setSuccessEmail(data?.join(";"));
                                    setValue("successEmail", data?.join(";"), {
                                      shouldValidate: true,
                                    });
                                  }}
                                />
                              ))
                            }
                            onInputChange={(event: any, value: string) =>
                              setEmailData(value)
                            }
                            onKeyDown={addSuccessEmail}
                            getOptionLabel={(option) => option}
                            value={successEmailDefaultValue}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{
                                  "& .css-1dhbgxs-MuiInputBase-root-MuiInput-root:before, & .css-1dhbgxs-MuiInputBase-root-MuiInput-root:after":
                                    { borderBottom: "none !important" },
                                }}
                                variant="standard"
                                placeholder={intl.formatMessage({
                                  id: "NewCardIssueance_1.entersuccessemail",
                                  defaultMessage: "Enter Success Email",
                                })}
                              />
                            )}
                          />
                          {
                            successAlert &&
                              successEmail === "" &&
                              emailData === "" ? (
                              <FormHelperText id="error-helper-text" error>
                                {errors.successEmail?.message}
                              </FormHelperText>
                            ) : emailData?.length > 30 ? (
                              <FormHelperText id="error-helper-text" error>
                                Success Email should not exceed 30 characters
                              </FormHelperText>
                            ) : emailData?.length > 0 &&
                              emailData?.match(
                                /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
                              ) === null ? (
                              <FormHelperText id="error-helper-text" error>
                                Enter valid Success Email
                              </FormHelperText>
                            ) : successEmail?.toString().split(";")?.length >=
                              10 && emailData ? (
                              <FormHelperText id="error-helper-text" error>
                                The number of Success Email should not exceed 10
                              </FormHelperText>
                            ) : successEmail
                              ?.toString()
                              .split(";")
                              .find(
                                (u) =>
                                  u.toLowerCase() === emailData?.toLowerCase()
                              ) ? (
                              <FormHelperText id="error-helper-text" error>
                                The entered Success Email exists in the list.
                              </FormHelperText>
                            ) : (
                              <></>
                            )
                          }
                          {isUpdate &&
                          watch("successEmail") &&
                            (watch("successEmail") as any) !==
                            job?.successEmail && (
                              <FormHelperText error>
                                Previous value: {job?.successEmail}
                              </FormHelperText>
                            )}
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} alignSelf="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register("alertFailure")}
                          checked={failureAlert}
                          onChange={handleFailureAlert}
                          icon={<CheckboxIcon />}
                          checkedIcon={<CheckedboxIcon />}
                        />
                      }
                      label={intl.formatMessage({
                        id: "JobDefinition_2.alertonfailure",
                        defaultMessage: "Alert on failure",
                      })}
                    />
                    {isUpdate &&
                      (watch("alertFailure") as any) !== job?.alertFailure && (
                        <FormHelperText error>
                          Previous value:{" "}
                          {job?.alertFailure == "1" ? "Checked" : "Unchecked"}
                        </FormHelperText>
                      )}
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl>
                      <Grid container spacing={1} justifyContent="flex-start">
                        <Grid item lg={12} xs={4} className="align-label">
                          <label>
                            <FormattedMessage
                              id="NewCardIssueance_1.failureemail"
                              defaultMessage="Failure Email"
                            />
                            <span className="required">*</span>
                          </label>
                        </Grid>
                        <Grid item lg={12} md={6} xs={8}>
                          <Autocomplete
                            multiple
                            id="fail-email"
                            {...register("failEmail")}
                            className="keyindex-autocomplete"
                            // freeSolo
                            disabled={
                              !failureAlert
                            }
                            open={false}
                            options={[]}
                            onOpen={addFailEmail}
                            popupIcon={
                              failEmail?.toString().split(";")?.length >= 10 ||
                                failEmail
                                  ?.toString()
                                  .split(";")
                                  .find((u) => u === failemailData) ||
                                failemailData?.length > 30 ||
                                failemailData?.trim()?.length === 0 ? (
                                <></>
                              ) : (
                                <img
                                  src={add_rounded}
                                  alt="add"
                                  style={{ height: "15px" }}
                                />
                              )
                            }
                            clearIcon={
                              <ClearIcon
                                fontSize="small"
                                onClick={() => {
                                  setFailEmail("");
                                  setValue("failEmail","", {
                                    shouldValidate: true,
                                  });
                                }}
                              />
                            }
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  label={option}
                                  {...getTagProps({ index })}
                                  onDelete={() => {
                                    let data = failEmail?.toString().split(";");
                                    data.splice(index, 1);
                                    setFailEmail(data?.join(";"));
                                    setValue("failEmail", data?.join(";"), {
                                      shouldValidate: true,
                                    });
                                  }}
                                />
                              ))
                            }
                            onInputChange={(event: any, value: string) =>
                              setFailemailData(value)
                            }
                            onKeyDown={addFailEmail}
                            getOptionLabel={(option) => option}
                            value={failEmailDefaultValue}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{
                                  "& .css-1dhbgxs-MuiInputBase-root-MuiInput-root:before, & .css-1dhbgxs-MuiInputBase-root-MuiInput-root:after":
                                    { borderBottom: "none !important" },
                                }}
                                variant="standard"
                                placeholder={intl.formatMessage({
                                  id: "NewCardIssueance_1.enterfailureemail",
                                  defaultMessage: "Enter Failure Email",
                                })}
                              />
                            )}
                          />
                          {
                            failureAlert &&
                              failEmail === "" &&
                              failemailData === "" ? (
                              <FormHelperText id="error-helper-text" error>
                                {errors.failEmail?.message}
                              </FormHelperText>
                            ) : failemailData?.length > 30 ? (
                              <FormHelperText id="error-helper-text" error>
                                Failure Email should not exceed 30 characters
                              </FormHelperText>
                            ) : failemailData?.length > 0 &&
                              failemailData?.match(
                                /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
                              ) === null ? (
                              <FormHelperText id="error-helper-text" error>
                                Enter valid Failure Email
                              </FormHelperText>
                            ) : failEmail?.toString().split(";")?.length >=
                              10 && failemailData ? (
                              <FormHelperText id="error-helper-text" error>
                                The number of Failure Email should not exceed 10
                              </FormHelperText>
                            ) : failEmail
                              ?.toString()
                              .split(";")
                              .find(
                                (u) =>
                                  u.toLowerCase() ===
                                  failemailData?.toLowerCase()
                              ) ? (
                              <FormHelperText id="error-helper-text" error>
                                The entered Failure Email exists in the list.
                              </FormHelperText>
                            ) : (
                              <></>
                            )

                          }
                          {isUpdate &&
                              watch("successEmail") &&
                              (watch("successEmail") as any) !==
                                job?.failEmail && (
                              <FormHelperText error>
                                Previous value: {job?.failEmail}
                              </FormHelperText>
                            )}
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    spacing={{ lg: 3, xs: 1 }}
                    alignItems="center"
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item lg={12} xs={4}>
                        <label className="label">
                          <FormattedMessage
                            id="JobDefinition_2.enabled"
                            defaultMessage="Enabled"
                          />
                        </label>
                      </Grid>
                      <Grid item lg={12} xs={6}>
                        <div className="switch">
                          <Typography className="text-light">
                            <FormattedMessage
                              id="JobDefinition_2.no"
                              defaultMessage="No"
                            />
                          </Typography>
                          <Switch
                            {...register("status")}
                            checked={status}
                            onChange={handleChangeStatus}
                          />
                          <Typography>
                            <FormattedMessage
                              id="JobDefinition_2.yes"
                              defaultMessage="Yes"
                            />
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item xs={9}>
                <Grid
                  item
                  xs={12}
                  className="job-transfer-list"
                  alignItems="flex-start"
                  justifyContent="center"
                >
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    { isUpdate ? (
                      <>
                        <Grid item xs={12} xl={5}>
                          {customList(oldJobTasks, "old")}
                        </Grid>
                      </>
                    ) : (
                      <Grid item xs={12} xl={5}>
                        {customList(left, "left")}
                      </Grid>
                    )}

                    <Grid item xs={8} xl={1} lg={5}>
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        className="transfer-btn"
                      >
                        <Button
                          sx={{ my: 0.5 }}
                          variant="contained"
                          size="small"
                          onClick={handleCheckedRight}
                          disabled={
                            (leftChecked?.length !== 0 ||
                              left?.find(
                                (item) => item.taskId === checked[0]?.taskId
                              ) !== undefined
                              ? false
                              : true)
                          }
                          aria-label="move selected right"
                          className="btn-light forward"
                        >
                        <img
                          src={ios_arrow_forward}
                          alt="arrow"
                          style={{ transform: "rotate(0deg)" }}
                        />                      
                        </Button>
                        <Button
                          sx={{ my: 0.5 }}
                          variant="contained"
                          size="small"
                          className="btn-light previous"
                          onClick={handleCheckedLeft}
                          disabled={
                            (rightChecked?.length !== 0 ||
                              right?.find(
                                (item) => item.taskId === checked[0]?.taskId
                              ) !== undefined
                              ? false
                              : true)
                          }
                          aria-label="move selected left"
                        >
                          <img
                            src={ios_arrow_forward}
                            alt="arrow" 
                            style={{ transform: "rotate(180deg)" }}

                          />
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item xl={5} xs={12}>
                      {customList(right, "right")}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  justifyContent="center"
                  alignItems="center"
                  className="job-transfer-list"
                >
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={12} xl={5}></Grid>
                    <Grid item xs={8} xl={1} lg={5}></Grid>
                    <Grid item xl={5} xs={12} justifyContent="center">
                      {!isUpdate ? (
                        <div className="transfer-btn-grp">
                          <Button
                            className="btn-light move-up"
                            disabled={rightChecked?.length === 0}
                            onClick={() => moveUp()}
                          >
                            <img src={ios_arrow_forward} alt="arrow" />
                          </Button>
                          <span>
                            <FormattedMessage
                              id="JobDefinition_2.up"
                              defaultMessage="Up"
                            />
                          </span>
                          <Button
                            className="btn-light move-down"
                            disabled={rightChecked?.length === 0}
                            onClick={() => moveDown()}
                          >
                            <img src={ios_arrow_forward} alt="arrow" />
                          </Button>
                          <span>
                            <FormattedMessage
                              id="JobDefinition_2.down"
                              defaultMessage="Down"
                            />
                          </span>
                        </div>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} justifyContent="center" alignItems="center">
                  <Grid
                    container
                    spacing={2}
                    justifyContent={
                       isUpdate
                        ? "space-around"
                        : "center"
                    }
                  >
                    {!isUpdate && (
                      <>
                        <Grid item xs={12} xl={5}></Grid>
                        <Grid item xs={8} xl={1} lg={5}></Grid>
                      </>
                    )}
                    
                    { isUpdate ? (
                      <Grid item xl={5} xs={12} sx={{ mt: "10px" }}>
                        <Box sx={{ maxWidth: "100%" }}>
                        </Box>
                      </Grid>
                    ) : null}
                    <Grid item xl={5} xs={12} sx={{ mt: "10px" }}>
                      <Box sx={{ maxWidth: "100%" }}>

                         <TableContainer>
 <Table className="table-component job-parameter">
  <TableHead>
    <TableRow>
      {columnDefs.map((col, index) => (
        <TableCell key={index}>
          {col.headerName}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>

  <TableBody>
    {filteredParametersData?.length > 0 ? (
      filteredParametersData.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {columnDefs.map((col, colIndex) => (
            <TableCell key={colIndex}>
              {renderCell(row, col, rowIndex)}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={columnDefs.length}>
          <p style={{ textAlign: "center" }}>
            {intl.formatMessage({
              id: "NewCardIssueance_1.norowstoshow",
              defaultMessage: "No Rows To Show",
            })}
          </p>
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
  </TableContainer>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
                <div
                  className="save-btn-grp"
                  style={{
                    display: "flex !important",
                        width: "100%"

                  }}
                >
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    gap: "10px",
                    float: "right",
                    marginRight: "70px",
                    marginBottom: "30px",
                    marginTop: "5px",

                  }}
                >
                <Button
                variant="text"
                type="reset"
                className="cancel-maker-checker-btn"
                title="Cancel"
                style={{ marginRight: "0px" }}
                disableElevation
                onClick={onCancel}
              >
                <FormattedMessage
                  id="Dashboard_1_2.cancel"
                  defaultMessage="Cancel"
                />
              </Button>
             {( <Button
                variant="outlined"
                onClick={handleOpenSchedule}
                className="btn-lightblue"
                disabled={activeLink && status ? false : true}
                disableElevation
              >
                <img src={scheduleIcon} alt="schedule" className="tooltip" />
                <FormattedMessage
                  id="JobDefinition_2.schedule"
                  defaultMessage="Schedule"
                />

              </Button>)}
           {( <Button
                variant="outlined"
                
                className={jobRun ? "btn-stop btn-success" : "btn-success"}
                disableElevation
                title={
                  jobRun
                    ? `${intl.formatMessage({
                      id: "Title.stop",
                      defaultMessage: "Stop",
                    })}`
                    : `${intl.formatMessage({
                      id: "JobDefinition_2.run",
                      defaultMessage: "Run",
                    })}`
                }
                
                onClick={(e) => { 
                  StartStopJob()}}
              >
                {jobRun ? (
                  <span style={{ display: "flex" }}>
                    <img src={stopIcon} alt="stop" className="tooltip" />
                    <FormattedMessage
                      id="JobDefinition_2.stop"
                      defaultMessage="Stop"
                    />
                  </span>
                ) : (
                  <span style={{ display: "flex" }}>
                    <img src={playIcon} alt="start" className="tooltip start" />
                    <FormattedMessage
                      id="JobDefinition_2.run"
                      defaultMessage="Run"
                    />
                  </span>
                )}
              </Button>)}
              {(
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting }
                  onClick={submitJobDefinition}
                  className="save-btn"
                  disableElevation
                >
                  {" "}
                  <FormattedMessage
                    id="JobDefinition_2.save"
                    defaultMessage="Save"
                  />
                  <img src={saveIconWhite} width="20px" height="20px" alt="save" style={{ marginLeft: "10px" }}/>{" "}
                </Button>
              )}
            </div>
            </div>
          </form>
          <JobSchedule1
            jobDetails={getJob}
            isEdit={id}
          />
        </CardContent>
      </Card>
      </div>
      </main></div>
    </>
  );
}
export default DesignerJobDefination;
