import {
    JobModel,
    JobMonitoringModel,
    JobTaskModel,
    ChangeStatusModel
} from "../models/jobs/JobModel";

import request from "../services/request";
import { getType1, getVersion } from "../utils/constant";
import { AxiosResponse } from "axios";


const jobUrl: string = `${getType1()}/jobs`;
const jobTaskUrl: string = `${getType1()}/job-tasks`;
const jobExecutionUrl: string = `${getType1()}/job-execution-logs/job`;

export const JobService = {
    getAllJobs: async (): Promise<AxiosResponse<JobModel[], any>> => {
        return await request.get<JobModel[]>(`/${jobUrl}`);
    },
    getJobById: async (id: number): Promise<AxiosResponse<JobModel, any>> => {
        return await request.get<JobModel>(`/${jobUrl}/${id}`);
    },
    saveJob: async (model: any): Promise<AxiosResponse<JobModel, any>> => {
        return await request.post<JobModel>(`/${jobUrl}`, model);
    },
    deleteJob: async (id: number): Promise<AxiosResponse<JobModel, any>> => {
        return await request.delete<JobModel>(`/${jobUrl}/${id}`);
    },
    enableDisableJob: async (model: ChangeStatusModel): Promise<AxiosResponse<any>> => {
        return await request.post(`/${jobUrl}/status-change`, model);
    },
    getJobMonitoring: async (): Promise<AxiosResponse<JobMonitoringModel[], any>> => {
        return await request.get<JobMonitoringModel[]>(`/${jobUrl}/job-monitoring`);
    },
    getAllActiveJobs: async (): Promise<AxiosResponse<JobModel[], any>> => {
        return await request.get<JobModel[]>(`/${jobUrl}/active`);
    },
    scheduleJob: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${jobUrl}/schedule`, model);
    },
    startJobExecution: async (jobId: number): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${jobUrl}/start/${jobId}`);
    },
    stopJobExecution: async (jobId: number): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${jobUrl}/stop/${jobId}`);
    },
    getJobExecutionStatusById: async (jobId: number): Promise<AxiosResponse<any>> => {
        return await request.get<any>(`/${jobUrl}/execution-status/${jobId}`);
    }
};

export const JobTaskService = {
    findAllJobTasks: async (): Promise<AxiosResponse<JobTaskModel[], any>> => {
        return await request.get<JobTaskModel[]>(`/${jobTaskUrl}`);
    },

    findJobTaskById: async (id: number): Promise<AxiosResponse<JobTaskModel[], any>> => {
        return await request.get<JobTaskModel[]>(`/${jobTaskUrl}/${id}`);
    },
};

export const JobExecutionLogService = {
    getAllLogsByJobId: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${jobExecutionUrl}`, model);
    },
};
