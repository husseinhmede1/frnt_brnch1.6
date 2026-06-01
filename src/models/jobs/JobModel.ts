export class JobModel {
    alertFailure!: string|boolean;
    alertSuccess!: string|boolean;
    enabled!: string|boolean;
    endDate?: string|null;
    frequency?: number;
    instId!: number;
    instName!: string;
    jobDefinitionTask!: JobDefinition[];
    jobDescription!: string;
    jobId?: number;
    jobName!: string;
    lastExecId!: number;
    lastRunResult!: string;
    maxExceTime?: string;
    monthDay?: number;
    recurring?: string;
    recurringFreq?: string;
    startDate?: string;  
    status!: string|boolean;
    startTime?: string;
    
    successEmail?: string;
    failEmail?: string;
    stopHrs?: string;
    stopMins?: string;
    stopTaskFlag?: string;
    expireFlag?: string;
    expireTime?: string| null;
    repeatHrs?: string;
    repeatMins?: string; 
    repeatSecs?: string;
}
export class JobDefinition {
    jobId?: number;
    jobTaskId?: number;
    priority?: string;
    task?: JobTaskModel;
    jobTaskParametersResponseDto!: JobTaskParametersResponseDto[];
}
export class JobTaskParametersResponseDto{
    jobTaskId!: number;
    jobTaskParamId!: number;
    parameterId!: number;
    parameterValue!: string;
    parametersServiceId!: number;
    isMandatory!: string;
    parameterName!: string;      
    serviceMode!: string;  
}
export class TaskList {
    JobTasks!: JobTaskModel;
    status: boolean = true;
}
export class JobTaskModel {
    serviceId?: number;
    taskDescription!: string;
    taskId!: number;
    taskName!: string;
    status: boolean = true;
    serviceMode!: string;
    parameterResponseDto!: ParameterResponseModel[]
}
export class ParameterResponseModel {
    parameterId!: number;
    parameterName!: string;
    isMandatory!: string;
    parameterValue?: string;
    parametersServiceId?: number;
}
export class JobMonitoringModel {
    jobExecutionDetails!: string;
    jobId!: number;
    jobName!: string;
    lastRunEnd!: string;
    lastRunStart!: string;
    lastRunStatus!: string;
    startTime!: string;
    status!: string
  }

  export class ChangeStatusModel {
    id!: number;
    status!: string;
}