import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
  Typography,
  TablePagination,
  TableSortLabel,
  Modal,
  TextField,
  FormHelperText,
  Box,
  Checkbox,
  ListItemText,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { down_arrow_icon } from "../../assets/images";
import { Institution } from "../../models/configuration/InstitutionModel";
import { TaskModel } from "../../models/configuration/TaskModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import {
  TaskParameterService,
  TaskService,
} from "../../services/configuration/task-service";
import { TaskExecutionService } from "../../services/configuration/task-execution-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { TaskExecutionModel } from "../../models/configuration/TaskExecutionModel";
import { TaskExecutionLogModel } from "../../models/configuration/TaskExecutionLogModel";
import { TaskParametersModel } from "../../models/configuration/TaskParametersModel";
import { StatusCode, rowsPerPageOptionsConst } from "../../utils/constant";
import { PaginationRequestModel } from "../../models/configuration/PaginationRequestModel";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import {  TaskCmdNbr } from "../../utils/constant";
import { BankFilesOutputModel } from "../../models/configuration/BankFilesOutputModel";
import { BankFilesOutputService } from "../../services/configuration/bank-files-output-service";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  date_ic
} from "../../assets/images";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TransactionCurrentModel } from "../../models/configuration/TransactionCurrentModel";
import { TransactionCurrentService } from "../../services/configuration/transaction-current-service";
import { AccountingLedgerService } from "../../services/configuration/accounting-ledger-service";
import { AccountingLedgerModule } from "../../models/configuration/AccountingLedgerModule";
import { FileDirectoryModel } from "../../models/configuration/FileDirectoryModel";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import { jobService } from "../../services/configuration/job-service";
import { render } from "@testing-library/react";
import { log } from "node:console";

function TaskExecution() {
  const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [selectTaskVal, setSelectTaskVal] = useState("");
  const [rowParamId,setRowParamId]=useState(0);
  const intl = useIntl();
  const [processingEvents, setProcessingEvents] = useState<
    TaskExecutionModel[]
  >([]);
  const [taskParameters, setTaskParameters] = useState<TaskParametersModel[]>(
    []
  );
  const [taskName, setTaskName] = useState<number>(0);
  const [taskId, setTaskId] = useState<number>(0);
  const [params, setParams] = useState<Record<number, string>>({});

  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptionsConst[0]);

  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [currentRemark, setCurrentRemark] = useState("");

  const [taskExecutionLogId, setTaskExecutionLogId] = useState<number>(0);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState("processingEventsId");

  const [objectType, setObjectType] = useState<string>("");

  const [bankFilesOutputs, setBankFilesOutputs] = useState<BankFilesOutputModel[]>(
    []
  );

  const [transactionCurrents, setTransactionCurrents] = useState<TransactionCurrentModel[]>(
    []
  );
  
  const [merchSettleDateRevet, setMerchSettleDateRevet] = useState<TransactionCurrentModel[]>(
    []
  );
  const [merchPaymentDateRevert, setMerchPaymentDateRevert] = useState<AccountingLedgerModule[]>(
    []
  );

  const [fileDirectories, setFileDirectories] = useState<FileDirectoryModel[]>(
    []
  );
  const [processBukholdFiles, setProcessBukholdFiles] = useState<FileDirectoryModel[]>(
    []
  );

  const [revertExportedFiles, setRevertExportedFiles] = useState<FileDirectoryModel[]>(
    []
  );
  const [exportPaymentFiles, setExportPaymentFiles] = useState<string[]>(
    []
  );
  
  const [outPutFileTypeList, setOutPutFileTypeList] = useState<string[]>([]);
  const [outputAbbrList, setOutputAbbrList] = useState<string[]>([]);
  const [bankCodeList, setBankCodeList] = useState<string[]>([]);


  const [fileName, setFileName] = useState<any>([]);
  const [isDateDisabled, setIsDateDisabled] = useState(false);

  const outputFileTypeIndex = taskParameters.findIndex(task => task.parameter === "OUTPUT_FILE_TYPE");
  const outputFileType = fileName[outputFileTypeIndex];

  const [systemSourceFolder, setSystemSourceFolder] = useState<string>("");
  const [systemBackupFolder, setSystemBackupFolder] = useState<string>("");

  const {
    register,
    setValue,
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskExecutionLogModel>({
    mode: "all",
    // resolver: yupResolver(validations.runTaskValidation),
  });

  const {
    register: registerParam,
    setValue: setValueParam,
    reset: resetParam,
    control: controlParam,
    handleSubmit: handleSubmitParam,
    watch: watchParam,
    formState: { errors: errorsParam, isSubmitting: isSubmittingParam },
  } = useForm<TaskModel>({
    mode: "all",
    // resolver: yupResolver(validations.TaskInformation),
  });

  const formatDateToString = (date: Date): string => {
    return format(date, 'dd/MM/yyyy'); // Change the format as needed
  };

  function isKeyOf<T extends object>(obj: T, key: keyof any): key is keyof T {
    return key in obj;
  }

  const requestSort = () => {
    const field = "executionTime";
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedEvents = [...processingEvents].sort((a, b) => {
      let aField: string | Date | number = a[field] ? a[field] : "";
      let bField: string | Date | number = b[field] ? b[field] : "";

      // If the field is a date, convert it to a Date object for accurate comparison
      if (field === "executionTime") {
        aField = new Date(a[field]);
        bField = new Date(b[field]);
      }

      if (aField < bField) return order === "asc" ? -1 : 1;
      if (aField > bField) return order === "asc" ? 1 : -1;
      return 0;
    });

    setProcessingEvents(sortedEvents);
  };

  const pagination: PaginationRequestModel = {
    asc: "true",
    offset: page,
    pageSize: rowsPerPage,
    sortBy: "processingEventsId",
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    pagination.offset = newPage;
    getAllProcessingEventsByInstitutionId(selectInstitutionVal, pagination, taskExecutionLogId);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    pagination.pageSize = newRowsPerPage;
    getAllProcessingEventsByInstitutionId(selectInstitutionVal, pagination, taskExecutionLogId);
  };

  const getAllProcessingEventsByInstitutionId = async (
    id: string | "",
    model: PaginationRequestModel,
    taskExecutionLogId: number
  ) => {
    await TaskExecutionService.getAllProcessingEventsByInstitution(id, model, taskExecutionLogId)
      .then((res: any) => {
        setProcessingEvents([...res.data?.processingEventsResponseDto]);
        setTotalRecords(res.data.paginatedResponseDto.totalNumberOfRecords);
      })
      .catch((err: any) => toast.error(err.message));
  };

  const getFilesFromDirectory = async (
    instId: string | "",
    scope: string | "",
  ) => {
    await TaskExecutionService.getFilesFromDirectory(instId, scope)
      .then((res: any) => {
        setFileDirectories([...res.data]);
      })
      .catch((error: any) => {
        toast.error("No Files Found")
        setFileDirectories([]);
      });
  };

  const getProcessBulkholdFiles = async (
    instId: string | ""
  ) => {
    await TaskExecutionService.getProcessBulkholdFiles(instId)
      .then((res: any) => {
        setProcessBukholdFiles([...res.data]);
      })
      .catch((error: any) => {
        toast.error("No Files Found")
        setProcessBukholdFiles([]);
      });
  };
  const getRevertExportedFiles = async (
    instId: string | ""
  ) => {
    await TaskExecutionService.getRevertExportedFiles(instId)
      .then((res: any) => {
        setRevertExportedFiles([...res.data]);
      })
      .catch((error: any) => {
        toast.error("No Files Found")
        setRevertExportedFiles([]);
      });
  };
  const getExportPaymentFiles = async (
    instId: string | ""
  ) => {
    await TaskExecutionService.getExportPaymentFiles(instId)
      .then((res: any) => {
        setExportPaymentFiles([...res.data]);
      })
      .catch((error: any) => {
        toast.error("No Files Found")
        setExportPaymentFiles([]);
      });
  };

  const getSourceAndBackupFolders = async (codeSuffixSource: string, codeSuffixBackup: string) => {
    const modelSource = {
      codePrefix: 'FILE_PATH',
      codeSuffix: codeSuffixSource,
      institutionId: 'SYSTEM'
    };
    SystemCodeServices.getSystemCodesByUniqueFields(modelSource)
        .then((res) => {
            const data = JSON.parse(JSON.stringify(res.data));
            setSystemSourceFolder(data.codeValue);
        })
        .catch((err) => toast.error(err.message));

    const modelBackup = {
        codePrefix: 'FILE_PATH',
        codeSuffix: codeSuffixBackup,
        institutionId: 'SYSTEM'
    };
    SystemCodeServices.getSystemCodesByUniqueFields(modelBackup)
        .then((res) => {
            const data = JSON.parse(JSON.stringify(res.data));
            setSystemBackupFolder(data.codeValue);
        })
        .catch((err) => toast.error(err.message));
}

  const getAllTasksByInstitutionId = async (instId: string | "") => {
    await TaskService.getAllTasksByInst(instId)
      .then((response: { data: any }) => {
        setTasks(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const getTaskParameters = async (taskId: number) => {
    await TaskParameterService.getTaskParameters(taskId)
      .then((response: { data: any }) => {
        setTaskParameters(response.data);
        let parameter: any = [];
        response.data?.map((item: any) => {
          if (item.parameter === "INSTITUTION") {
            parameter.push("1");
          }
          else if (item.validity !== "M") {
            parameter.push("1");
          }
          else {
            parameter.push("");
          }
        }

        );
        setFileName([...parameter])
      })
      .catch((error: any) => {
        toast.error(error);
      });
  };

  const getAllBankFilesOutputsByInstitutionId = async (instId: string | "") => {
    await BankFilesOutputService.getAllBankFilesOutputByInstitution(instId)
      .then((response: { data: any }) => {
        setBankFilesOutputs(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const getDistinctBankFilesOutputByInstitution = async (instId: string | "") => {
    await BankFilesOutputService.getDistinctBankFilesOutputByInstitution(instId).then((res) => {
      if (res.data?.length > 0) {
        setOutPutFileTypeList([...res.data]);
      } else {
        setOutPutFileTypeList([]);
      }
    }).catch((error: any) => {
      console.log(error);
    });
  }

  const getAllBankFilesOutputByInstitutionAndOutputFileType = async (instId: string, outPutFileType: string) => {
    await BankFilesOutputService.getAllBankFilesOutputByInstitutionAndOutputFileType(instId, outPutFileType).then(res => {
      if (res.data?.length > 0) {
        setOutputAbbrList([...res.data]);
      } else {
        setOutputAbbrList([]);
      }
    }).catch((error: any) => {
      console.log(error);
    });
  }

  const getDistinctBankFilesOutputBankCodesByInstitution = async (instId: string | "") => {
    await BankFilesOutputService.getDistinctBankFilesOutputBankCodesByInstitution(instId).then((res) => {
      if (res.data?.length > 0) {
        setBankCodeList([...res.data]);
      } else {
        setBankCodeList([]);
      }
    }).catch((error: any) => {
      console.log(error);
    });
  } 

  const getMerchSettleDateRevert = async () => {
    await TransactionCurrentService.getMerchSettleDateRevert(selectInstitutionVal)
      .then((response: { data: any }) => {
        setMerchSettleDateRevet(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  
  const getMerchPaymentDateRevert = async () => {
    await AccountingLedgerService.getMerchPaymentDateRevert(selectInstitutionVal)
      .then((response: { data: any }) => {
        setMerchPaymentDateRevert(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const getMerchPaymentDate = async () => {
    await TransactionCurrentService.getMerchPaymentDate(selectInstitutionVal)
      .then((response: { data: any }) => {
        setTransactionCurrents(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
    }
    // getAllProcessingEventsByInstitutionId(instID, pagination,taskExecutionLogId);
    getAllBankFilesOutputsByInstitutionId(instID);
  };

  const handleInstitutionChange = (event: SelectChangeEvent) => {
    setSelectTaskVal("");
    setSelectInstitutionVal(event.target.value);
    setProcessingEvents([]);
  };


  const handleTaskChange = (event: SelectChangeEvent) => {
    setSelectTaskVal(event.target.value);
    getAllBankFilesOutputsByInstitutionId(selectInstitutionVal);
    setProcessingEvents([]);
    getMerchPaymentDate();
    getMerchSettleDateRevert();
    getMerchPaymentDateRevert()
    setIsDateDisabled(false)
    setParams({})
    setFileName([]);
    setParams((prevParams) => {
    const newParams = { ...prevParams }; 
    delete newParams[rowParamId];
    return newParams; 
});

    setSelectAll(false);
  };
  const handleOnClickTask = (type: TaskModel) => {
    setTaskName(type.taskCmdNbr);
    setTaskId(type.taskId);
    if (type.taskCmdNbr === TaskCmdNbr.EF) {
      getDistinctBankFilesOutputByInstitution(selectInstitutionVal);
      getDistinctBankFilesOutputBankCodesByInstitution(selectInstitutionVal);
      getExportPaymentFiles(selectInstitutionVal);
    } else if(type.taskCmdNbr === TaskCmdNbr.IT) {
      getFilesFromDirectory(selectInstitutionVal, "CLEARING");
    } else if(type.taskCmdNbr === TaskCmdNbr.LBF) {
      getFilesFromDirectory(selectInstitutionVal, "BULKHOLD");
    } else if(type.taskCmdNbr === TaskCmdNbr.PBF) {
      getProcessBulkholdFiles(selectInstitutionVal);
    } else if(type.taskCmdNbr === TaskCmdNbr.REF) {
      getRevertExportedFiles(selectInstitutionVal);
    } else if(type.taskCmdNbr === TaskCmdNbr.IM) {
      getSourceAndBackupFolders("FILE_PATH_IMPORT_MERCHANTS_SOURCE", "FILE_PATH_IMPORT_MERCHANTS_BACKUP");
    }  else if(type.taskCmdNbr === TaskCmdNbr.ITER) {
      getSourceAndBackupFolders("FILE_PATH_IMPORT_TERMINALS_SOURCE", "FILE_PATH_IMPORT_TERMINALS_BACKUP");
    }
  }

  const handleFileName = (index: number, event: any, parameter: string) => {
    let fileData = [...fileName];
    fileData[index] = event.target.value;
    // if (parameter === "OUTPUT_FILE_TYPE") {
    //   fileName.find((item: string) => item === "TRANSACTIONS") === "TRANSACTIONS" ? setIsDateDisabled(true) : setIsDateDisabled(false);
    //   setParams((prevParams) => ({
    //     ...prevParams,
    //     [9]: formatDateToString(new Date()),
    //   }));
    // }

    setFileName([...fileData])
  }

  const getProperSelectValue = (parameter: String, bankFilesOutput: BankFilesOutputModel) => {
    if (parameter === "BANK_CODE") {
      return bankFilesOutput.bankCode;
    }
    else if (parameter === "OUTPUT_FILE_TYPE") {
      return bankFilesOutput.outputFileType;
    }
    else if (parameter === "OUTPUT_FILE_TYPE_ABBR") {
      return bankFilesOutput.outputFileTypeAbbr;
    }
    return bankFilesOutput.bankFilesOutputId;
  }

  useEffect(() => {
    taskParameters.forEach((row) => {
      if (row.parameter === "INSTITUTION") {
        // newParams[row.taskParamId] = selectInstitutionVal;
        // setParams(newParams);
        setParams((prevParams) => ({
          ...prevParams,
          [row.taskParamId]: selectInstitutionVal,
        }));
      } else if (row.parameter === "MERCH_SETL_DATE") {
        if (!params.hasOwnProperty(row.taskParamId) && objectType === "TRANSACTIONS") {
          setIsDateDisabled(false);

          setParams((prevParams) => ({
            ...prevParams,
            [row.taskParamId]: formatDateToString(new Date()),
          }));
        } else if (params.hasOwnProperty(row.taskParamId) && objectType !== "TRANSACTIONS") {
          let data = params;
          delete data[row.taskParamId];
          setParams(data);
          setIsDateDisabled(false);
        }
      }
    });

  }, [taskParameters, selectInstitutionVal,objectType]);

  useEffect(() => {
    InstitutionService.getActiveInstitution()
      .then((response: { data: any }) => {
        setInstitutions(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
    setInstitutefromLocalStorage();
  }, []);

  useEffect(() => {
    if (selectInstitutionVal) {
      getAllTasksByInstitutionId(selectInstitutionVal);
    }
  }, [selectInstitutionVal]);

  useEffect(() => {
    if (selectTaskVal) {
      getTaskParameters(parseInt(selectTaskVal));
    }
  }, [selectTaskVal]);

  const onSubmit = () => {
    
    if(taskName === TaskCmdNbr.IM || taskName === TaskCmdNbr.ITER) {
      const model = {
        backupFilePath: systemBackupFolder,
        filePath: systemSourceFolder,
        institutionId: selectInstitutionVal,
      };
      
      if(taskName === TaskCmdNbr.IM) {
        jobService.uploadMerchantFiles(model).then((response) => {

          if (response.status === StatusCode.Success) {
            toast.success("Merchant files uploaded successfully")
            getAllProcessingEventsByInstitutionId(
              selectInstitutionVal,
              pagination,
              response.data.taskExecutionLogId
            );
            setTaskExecutionLogId(response.data.taskExecutionLogId);
          }
        })
        .catch((error: any) => {
          console.log("absoun>>>>>>",error.response.data)
          toast.error(error.response.data.errors[0]);
        });
      } else {
        jobService.uploadTerminalFiles(model).then((response) => {
          if (response.status === StatusCode.Success) {
            toast.success("Terminal files uploaded successfully!");
            getAllProcessingEventsByInstitutionId(
              selectInstitutionVal,
              pagination,
              response.data.taskExecutionLogId
            );
            setTaskExecutionLogId(response.data.taskExecutionLogId);
          } 
        })
         .catch((error: any) => {
          toast.error(error.response.data.errors[0]);
        });
      }
    } else {

      if(selectAll){
        params[selectDataKey]=selectAllData;
      }
      const model = {
        institutionId: selectInstitutionVal,
        taskId: taskId,
        taskParameters: params,
      };
      if (selectInstitutionVal && taskName != 0 && params) {
        TaskExecutionService.saveTaskRun(model)
          .then((response) => {
            if (response.status === StatusCode.Success) {
              getAllProcessingEventsByInstitutionId(
                selectInstitutionVal,
                pagination,
                response.data.taskExecutionLogId
              );
              setTaskExecutionLogId(response.data.taskExecutionLogId);
              getMerchPaymentDate();
            }
          })
          // .then(() => {
          //   setParams({});
          // })
          .catch((error: any) => {
            toast.error(error.message);
          });
      }
    }
    
  };


const [selectDataKey,setSelectDataKey]=useState(-1)
const [selectAll,setSelectAll]=useState(false)
const [btnEnabled,setBtnEnbled] = useState(false)
const [selectAllData,setSelectAllData]=useState("")

function handleSelectAll(taskParamId: any) {
  setRowParamId(taskParamId);
  const newSelectAll = !selectAll; 
  setSelectAll(newSelectAll);
  setSelectDataKey(taskParamId);

  const paymentFiles_SelectAll: string = exportPaymentFiles.join("|");
  if (newSelectAll) {
    setParams((prevParams) => ({
      ...prevParams,
      [taskParamId]: paymentFiles_SelectAll,
    }));
  } else {
    setParams((prevParams) => {
      const updated = { ...prevParams };
      delete updated[taskParamId];
      return updated;
    });
  }
}

useEffect(() => {  
  const isAnyTaskWithValidMNotInParams = taskParameters.some(task => {
    if (task.validity === 'M') {
      return !(task.taskParamId in params);
    }
    return false;
  });
  setBtnEnbled(!isAnyTaskWithValidMNotInParams);
}, [params]); 


function handleRun(e: any,taskId : any): void {
    let paymentFiles_SelectAll: string = exportPaymentFiles.join("|");
    setSelectAllData(paymentFiles_SelectAll);
    TaskExecutionService.getRevertExportedFiles(selectInstitutionVal);
    getMerchPaymentDateRevert();
}

function handleCheckboxClick(
  e: React.ChangeEvent<HTMLInputElement>,
  taskParamId: any,
  typeAbbr: string
) {
  const isChecked = e.target.checked;

  setSelectAll(false); // Always disable select all on manual toggle
  setSelectDataKey(taskParamId);

  setParams(prev => {
    const currentValues = prev[taskParamId]?.split('|') || [];

    let updatedValues: string[];

    if (isChecked) {
      updatedValues = currentValues.includes(typeAbbr)
        ? currentValues
        : [...currentValues, typeAbbr];
    } else {
      updatedValues = currentValues.filter(val => val !== typeAbbr);
    }

    if (updatedValues.length === 0) {
      const { [taskParamId]: _, ...rest } = prev;
      return rest;
    }
    return {
      ...prev,
      [taskParamId]: updatedValues.join('|')
    };
  });
}


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
                      id: "TaskExecution.title",
                      defaultMessage: "Task Execution",
                    })}
                  </Typography>
                </div>
                <div className="right-block">
                  <Button
                    sx={{ mt: 4, width: "100px" }}
                    variant="contained"
                    disableElevation
                    type="submit"
                    onClick={(e)=>{handleRun(e,taskId)}}
                    className="btn-light"
                    disabled={
                      (((fileName.find((item: string) => item === "" || item === '' || !item) !== undefined) && 
                      !(taskName === TaskCmdNbr.IM || taskName === TaskCmdNbr.ITER || taskName === TaskCmdNbr.RLF || taskName === TaskCmdNbr.REMC)) ||
                      ((fileName.find((item: string) => item === "" || item === '' || !item)?.length) > 0 && 
                      (taskName === TaskCmdNbr.EF ))) && !(taskName==TaskCmdNbr.EF && btnEnabled)
                    }
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
                        id: "Institution.label",
                        defaultMessage: "Institution",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={selectInstitutionVal}
                        onChange={handleInstitutionChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      >
                        {institutions &&
                          institutions.length > 0 &&
                          institutions.map((type) => {
                            return (
                              <MenuItem
                                key={type.institutionId}
                                value={type.institutionId}
                              >
                                {type.institutionName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>

              <Grid spacing={3} container>
                <Grid item xs={12} lg={4} sm={6} xl={4}>
                  <div className="input-with-label form-group">
                    <label>
                      {intl.formatMessage({
                        id: "TaskName.label",
                        defaultMessage: "Task Name",
                      })}
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={selectTaskVal}
                        onChange={(e)=>{handleTaskChange(e)}}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      >
                        <MenuItem value="">
                          {intl.formatMessage({
                            id: "InstitutionAccounts.selectTask",
                            defaultMessage: "Select Task",
                          })}
                        </MenuItem>
                        {tasks &&
                          tasks.length > 0 &&
                          tasks.map((type) => {
                            return (
                              <MenuItem
                                key={type.taskId}
                                value={type.taskId}
                                onClick={() => handleOnClickTask(type)}
                              >
                                {type.taskName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>

              {selectTaskVal && selectTaskVal.length !== 0 && taskParameters && !(taskParameters.length === 1 && taskParameters[0].parameter === "INSTITUTION") && (
                <TableContainer sx={{ mt: 4, overflow: 'hidden' }}>
                  <Table
                    sx={{ minWidth: 650, borderCollapse: "collapse" }}
                    aria-label="simple table"
                    stickyHeader
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {intl.formatMessage({
                            id: "TaskExecution.field",
                            defaultMessage: "Parameter",
                          })}
                        </TableCell>
                        <TableCell className="last-column-border-header">
                          {intl.formatMessage({
                            id: "TaskExecution.value",
                            defaultMessage: "Parameter Value",
                          })}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {taskParameters &&
                        taskParameters
                          // .filter((row) => row.parameter !== "INSTITUTION")
                          .filter(row => {
                            if (row.parameter === "MERCH_SETL_DATE") {
                              return outputFileType !== "ACCOUNTING" && outputFileType;
                            }
                            return true;
                          })
                          .map((row, i) => (
                            row.parameter !== "INSTITUTION" &&
                            <TableRow key={i}>
                              <TableCell>
                                {row.parameter}{" "}
                                {row.validity === "M" ? (
                                  <span className="required-field">*</span>
                                ) : (
                                  ""
                                )}
                              </TableCell>
                              <TableCell className="last-column-border">
                                <FormControl fullWidth className="field-space">
                                  {row.parameter === "MERCH_SETL_DATE" && outputFileTypeIndex !== -1 && fileName[outputFileTypeIndex] && fileName[outputFileTypeIndex] !== "ACCOUNTING" ? (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <Controller
                                        control={control}
                                        name="endDatetime"
                                        defaultValue={new Date()}
                                        render={({ field }) => (
                                          <DatePicker
                                            inputFormat="dd/MM/yyyy"
                                            disabled={isDateDisabled}
                                            onChange={(date, keyboardInput) => {
                                              if (keyboardInput) {
                                                field.onChange(
                                                  keyboardInput.length === 10 ? date : new Date()
                                                );
                                              } else {
                                                field.onChange(date);
                                              }
                                              const selectedValue = date ? formatDateToString(date) : formatDateToString(new Date());
                                              setParams((prevParams) => ({
                                                ...prevParams,
                                                [row.taskParamId]: selectedValue,
                                              }));
                                            }}
                                            value={field.value ?? null}
                                            components={{
                                              OpenPickerIcon: () => {
                                                return <img src={date_ic} alt="date" />;
                                              },
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  ): 
                                  row.parameter === "MERCH_SETL_DATE"?
                                  <></>
                                   : taskName === TaskCmdNbr.PAF ||
                                    taskName === TaskCmdNbr.EF ||
                                    taskName === TaskCmdNbr.RAE ||
                                    (taskName === TaskCmdNbr.REMC && row.parameter === "DATE")? (
                                    <> 
                                    <Select
                                        id="select-scopeabbrev"
                                        name={`selectScopeAbbrev[${i}]`}
                                        fullWidth
                                        multiple={row.parameter === "TRANS_ID_LIST" && taskName === TaskCmdNbr.EF}
                                        value={
                                          (row.parameter === "TRANS_ID_LIST" && taskName === TaskCmdNbr.EF)
                                            ? (params[row.taskParamId]?.split('|') ?? [])
                                            : params[row.taskParamId] || ""
                                        }
                                        onChange={(event) => {
                                          if (row.parameter === "TRANS_ID_LIST" && taskName === TaskCmdNbr.EF) {
                                            const selected = event.target.value as string[];
                                            const joined = selected.filter(v => v?.trim() !== '').join('|');
                                            setParams((prevParams) => ({
                                              ...prevParams,
                                              [row.taskParamId]: joined,
                                            }));
                                            handleFileName(i, event, row.parameter);
                                          } else {
                                            const selectedValue = event.target.value as string;
                                            setParams((prevParams) => ({
                                              ...prevParams,
                                              [row.taskParamId]: selectedValue,
                                            }));
                                            handleFileName(i, event, row.parameter);
                                          }
                                        }}
 
                                        MenuProps={{
                                          className: "select-item",
                                          anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "right",
                                          },
                                          transformOrigin: {
                                            vertical: "top",
                                            horizontal: "right",
                                          },
                                          disableAutoFocusItem:true
                                        }}
                                      >
                                        <MenuItem disabled value=" ">
                                          <em>
                                            {taskName === TaskCmdNbr.IT
                                              ? intl.formatMessage({
                                                id: "SettingsUsers_4.selectinstitution",
                                                defaultMessage: "Select " + row.parameter,
                                              })
                                              : taskName === TaskCmdNbr.PAF
                                                ? intl.formatMessage({
                                                  id: "NewCardIssueance_2.selectcardtype",
                                                  defaultMessage: "Select " + row.parameter,
                                                })
                                                : taskName === TaskCmdNbr.EF
                                                ? intl.formatMessage({
                                                  id: "NewCardIssueance_1.selectcompany",
                                                  defaultMessage: "Select " + row.parameter,
                                                }):  taskName === TaskCmdNbr.REMC &&
                                                intl.formatMessage({
                                                  id: "NewCardIssueance_1.selectdate",
                                                  defaultMessage: "Select " + row.parameter,
                                                })
                                                }
                                          </em>
                                        </MenuItem>

                                        { row.parameter === "TRANS_ID_LIST" &&               
                                          <MenuItem key={"select all"} onClick={() => {handleSelectAll(row.taskParamId)}}>
                                          <Checkbox checked={selectAll} />
                                          <ListItemText primary={"Select all"} />
                                         </MenuItem>
                                        }
                                        {
                                          taskName === TaskCmdNbr.PAF ?
                                            transactionCurrents?.length > 0 && transactionCurrents?.map(
                                              (transactionCurrent: TransactionCurrentModel) => (
                                                <MenuItem
                                                  key={transactionCurrent.recordSeqId}
                                                  value={transactionCurrent.merchSettlementDate}
                                                >
                                                  {transactionCurrent.merchSettlementDate}
                                                </MenuItem>
                                              )
                                            ) : taskName === TaskCmdNbr.RAE ? 
                                            merchPaymentDateRevert?.length > 0  && merchPaymentDateRevert?.map(
                                              (accountingLedgerModule: AccountingLedgerModule )=> (
                                              <MenuItem
                                                  key={accountingLedgerModule.recordSeqId}
                                                  value={accountingLedgerModule.merchPaymentDateRevert}
                                                >
                                                  {accountingLedgerModule.merchPaymentDateRevert}
                                                </MenuItem>
                                              )
                                            ): taskName === TaskCmdNbr.REMC && row.parameter === "DATE" ? merchSettleDateRevet?.map(
                                              (merchSettleDate: TransactionCurrentModel)=> (
                                              <MenuItem
                                                  key={merchSettleDate.recordSeqId}
                                                  value={merchSettleDate.merchSettlementDate}
                                                >
                                                  {merchSettleDate.merchSettlementDate}
                                                </MenuItem>
                                              ))
                                            : taskName === TaskCmdNbr.EF &&
                                            (
                                              row.parameter === "BANK_CODE" ?
                                                bankCodeList?.length > 0 && ['*', ...bankCodeList]?.map((bank: string) => (
                                                  <MenuItem
                                                    key={bank}
                                                    value={bank}
                                                  >
                                                    {bank}
                                                  </MenuItem>
                                                ))
                                                : row.parameter === "OUTPUT_FILE_TYPE" ?
                                                  outPutFileTypeList?.length > 0 && outPutFileTypeList?.map((file: string) => (
                                                    <MenuItem
                                                      key={file}
                                                      value={file}
                                                      onClick={() => {
                                                        setObjectType(file);
                                                        getAllBankFilesOutputByInstitutionAndOutputFileType(selectInstitutionVal, file);
                                                      }}
                                                    >
                                                      {file}
                                                    </MenuItem>
                                                  ))
                                                  : row.parameter === "OUTPUT_FILE_TYPE_ABBR" ?
                                                  outputAbbrList?.length > 0 && outputAbbrList?.map((typeAbbr: string) => (

                                                    <MenuItem
                                                      key={typeAbbr}
                                                      value={typeAbbr}
                                                    >
                                                      {typeAbbr}
                                                     
                                                    </MenuItem>
                                                  )) : row.parameter === "TRANS_ID_LIST" &&
                                                  exportPaymentFiles?.length > 0 && exportPaymentFiles?.map((typeAbbr: string) => (
                                                    <MenuItem  key={typeAbbr} value={typeAbbr} onClick={()=>{
                                                      if(selectAll){
                                                        setSelectAll(!selectAll)
                                                      }
                                                    }}>
                                                    <Checkbox
                                                     checked={
                                                      selectAll ||
                                                      (params[row.taskParamId]?.split('|')?.includes(typeAbbr) ?? false)
                                                    }
                                                      onChange={(e) => handleCheckboxClick(e, row.taskParamId,typeAbbr)}
                                                    />
                                                    <ListItemText primary={typeAbbr}/>
                                                  </MenuItem>
                                                  ))
                                            )
                                        }
                                      </Select>
                                      {row.validity === "M" && (fileName[i] === "" || fileName[i] === undefined) &&
                                        <FormHelperText id="error-helper-text" error>
                                          {row.parameter + " is required"}
                                        </FormHelperText>}
                                    </>
                                  ) : (taskName === TaskCmdNbr.IT || taskName === TaskCmdNbr.LBF || taskName === TaskCmdNbr.PBF || taskName === TaskCmdNbr.REF) ? (
                                    <>
                                      <Select
                                        id="select-scopeabbrev"
                                        name={`selectScopeAbbrev[${i}]`} // Use a proper naming convention
                                        fullWidth
                                        onChange={(event) => {
                                          const selectedValue = event.target.value as string;
                                          setParams((prevParams) => ({
                                            ...prevParams,
                                            [row.taskParamId]: selectedValue,
                                          }));
                                          handleFileName(i, event, row.parameter);
                                        }}
                                        MenuProps={{
                                          className: "select-item",
                                          anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "right",
                                          },
                                          transformOrigin: {
                                            vertical: "top",
                                            horizontal: "right",
                                          },
                                          disableAutoFocusItem:true
                                        }}
                                      >
                                        <MenuItem disabled value=" ">
                                          <em>
                                            {
                                              intl.formatMessage({
                                                id: "TaskExecution.fileName",
                                                defaultMessage: "Select " + row.parameter
                                              })
                                            }
                                          </em>
                                        </MenuItem>
                                        {(taskName === TaskCmdNbr.IT || taskName === TaskCmdNbr.LBF)
                                          ? fileDirectories?.length > 0 &&
                                          fileDirectories?.map(
                                            (fileDirectory: FileDirectoryModel) => (
                                              <MenuItem
                                                key={fileDirectory.fileName}
                                                value={fileDirectory.fileName}
                                              >
                                                {fileDirectory.displayFileName}
                                              </MenuItem>
                                            )
                                          )
                                          : (taskName === TaskCmdNbr.PBF)
                                          ? processBukholdFiles?.length > 0 &&
                                          processBukholdFiles?.map(
                                            (processBukholdFile: FileDirectoryModel) => (
                                              <MenuItem
                                                key={processBukholdFile.fileName}
                                                value={processBukholdFile.fileName}
                                              >
                                                {processBukholdFile.displayFileName}
                                              </MenuItem>
                                            )
                                          )
                                          : (taskName === TaskCmdNbr.REF)
                                          ? revertExportedFiles?.length > 0 &&
                                          revertExportedFiles?.map(
                                            (revertExportedFile: FileDirectoryModel) => (
                                              <MenuItem
                                                key={revertExportedFile.fileName}
                                                value={revertExportedFile.fileName}
                                              >
                                                {revertExportedFile.displayFileName}
                                              </MenuItem>
                                            )
                                          ) 
                                          : taskName?.toString() === "TEST" &&
                                          bankFilesOutputs?.length > 0 &&
                                          bankFilesOutputs?.map(
                                            (bank: BankFilesOutputModel) => (
                                              <MenuItem
                                                key={bank.bankFilesOutputId}
                                                value={getProperSelectValue(row.parameter, bank)}
                                              >
                                              </MenuItem>
                                            )
                                          )}
                                        

                                      </Select>
                                      {row.validity === "M" && (fileName[i] === "" || fileName[i] === undefined) &&
                                        <FormHelperText id="error-helper-text" error>
                                          {row.parameter + " is required"}
                                        </FormHelperText>}
                                    </>
                                  ) : taskName === TaskCmdNbr.IM ? (
                                    <>
                                      <InputBase
                                        placeholder={intl.formatMessage({
                                          id: "AddBlackList_8_1.enterobjectcode/name",
                                          defaultMessage: "Enter " + row.parameter,
                                        })}
                                        value={row.parameter === "SOURCE_FOLDER" ? systemSourceFolder : systemBackupFolder}
                                        disabled
                                        id={`codename[${i}]`}
                                        fullWidth
                                        autoComplete="off"
                                      />
                                    </>
                                  ) :
                                  taskName === TaskCmdNbr.ITER ? (
                                    <>
                                      <InputBase
                                        placeholder={intl.formatMessage({
                                          id: "AddBlackList_8_1.enterobjectcode/name",
                                          defaultMessage: "Enter " + row.parameter,
                                        })}
                                        value={row.parameter === "SOURCE_FOLDER" ? systemSourceFolder : systemBackupFolder}
                                        disabled
                                        id={`codename[${i}]`}
                                        fullWidth
                                        autoComplete="off"
                                      />
                                    </>
                                  ) :
                                   (
                                    <>
                                      <InputBase
                                        placeholder={intl.formatMessage({
                                          id: "AddBlackList_8_1.enterobjectcode/name",
                                          defaultMessage: "Enter Object Code/Name",
                                        })}
                                        onChange={(event) => {
                                          const selectedValue = event.target.value as string;
                                          setParams((prevParams) => ({
                                            ...prevParams,
                                            [row.taskParamId]: selectedValue,
                                          }));
                                        }}
                                        id={`codename[${i}]`}
                                        fullWidth
                                        autoComplete="off"
                                      />
                                    </>
                                  )}
                                  <FormHelperText id="error-helper-text" error>
                                    {errorsParam.taskId?.message}
                                  </FormHelperText>
                                </FormControl>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <TableContainer sx={{ mt: 4 }}>
                <Table
                  sx={{ minWidth: 650, borderCollapse: "collapse" }}
                  aria-label="simple table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {intl.formatMessage({
                          id: "TaskExecution.institution",
                          defaultMessage: "Institution",
                        })}
                      </TableCell>
                      <TableCell sx={{ minWidth: 200 }}>
                        {intl.formatMessage({
                          id: "TaskExecution.fileName",
                          defaultMessage: "File Name",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "TaskExecution.executionResult",
                          defaultMessage: "Execution Result",
                        })}
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === "startDatetime"}
                          direction={sortOrder}
                          hideSortIcon={false}
                          onClick={() => requestSort()}
                        >
                          {intl.formatMessage({
                            id: "TaskExecution.executionTime",
                            defaultMessage: "Execution Time",
                          })}
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="last-column-border-header">
                        {intl.formatMessage({
                          id: "TaskExecution.remark",
                          defaultMessage: "Remark",
                        })}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processingEvents &&
                      processingEvents.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.institutionId}</TableCell>
                          <TableCell>{row.fileName}</TableCell>
                          <TableCell>{row.successResult}</TableCell>
                          <TableCell>
                            {format(
                              new Date(row.executionTime),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </TableCell>
                          <TableCell className="last-column-border">
                            {row.remarks ? (
                              row.remarks.length <= 35 ? (
                                row.remarks
                              ) : (
                                <>
                                  {row.remarks.substring(0, 35)}
                                  <Button
                                    sx={{ height: 5, width: 6 }}
                                    size="small"
                                    onClick={() => {
                                      setCurrentRemark(row.remarks);
                                      setRemarkModalOpen(true);
                                    }}
                                  >
                                    ...
                                  </Button>
                                </>
                              )
                            ) : (
                              "No Remarks"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    {processingEvents && processingEvents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={13} className="last-column-border">
                          <p style={{ textAlign: "center" }}>
                            {intl.formatMessage({
                              id: "ProcessingEvents.noDataFound",
                              defaultMessage: "No Data Found.",
                            })}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Modal
                  open={remarkModalOpen}
                  onClose={() => setRemarkModalOpen(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 400,
                      bgcolor: "background.paper",
                      border: "2px solid #000",
                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Remarks
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      {currentRemark}
                    </Typography>
                  </Box>
                </Modal>
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
          </form>
        </main>
      </div>
    </div >
  );
}

export default TaskExecution;