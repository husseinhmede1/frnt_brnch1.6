import {
  TaskExecutionModel,
} from "../../models/configuration/TaskExecutionModel";
import { AxiosResponse } from "axios";
import request from "../request";
import { PaginationRequestModel } from "../../models/configuration/PaginationRequestModel";
import { FileDirectoryModel } from "../../models/configuration/FileDirectoryModel";

export const TaskExecutionService = {
  getFilesFromDirectory: async (
    institutionId: string,
    scope: string
  ): Promise<AxiosResponse<FileDirectoryModel[], any>> => {
    return await request.get<FileDirectoryModel[]>(`/processing-events/inst/${institutionId}/${scope}`);
  },
  getAllProcessingEventsByInstitution: async (
    id: String,
    model: PaginationRequestModel,
    taskExecutionLogId: number
  ): Promise<AxiosResponse<TaskExecutionModel[], any>> => {
    return await request.post<TaskExecutionModel[]>(`/processing-events/task/${id}/${taskExecutionLogId}`, model);
  },
  saveTaskRun: async (model: any): Promise<AxiosResponse<any>> => {
    return await request.post<any>(`/processing-events`, model);
  },
  getProcessBulkholdFiles: async (
    institutionId: string
  ): Promise<AxiosResponse<FileDirectoryModel[], any>> => {
    return await request.get<FileDirectoryModel[]>(`/bulk-hold/get-file-names/${institutionId}`);
  },
  getRevertExportedFiles: async (
    institutionId: string
  ): Promise<AxiosResponse<FileDirectoryModel[], any>> => {
    return await request.get<FileDirectoryModel[]>(`/accounting-ledger/file-names/${institutionId}`);
  },
  getExportPaymentFiles: async (
    institutionId: string
  ): Promise<AxiosResponse<string[], any>> => {
    return await request.get<string[]>(`/defaulttransactionid/get-all/${institutionId}`);
  },
}