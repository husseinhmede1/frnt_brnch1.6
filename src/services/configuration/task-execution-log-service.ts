import {
    TaskExecutionLogModel,
} from "../../models/configuration/TaskExecutionLogModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const TaskExecutionLogService = {
    getTaskExecutionLogs: async (
        model: any
    ): Promise<AxiosResponse<TaskExecutionLogModel[], any>> => {
        return await request.post<TaskExecutionLogModel[]>(`/task-execution-log/filter`, model);
    },
}