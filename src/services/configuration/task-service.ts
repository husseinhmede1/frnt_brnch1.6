import {
    TaskModel,
} from "../../models/configuration/TaskModel";
import { AxiosResponse } from "axios";
import request from "../request";
import { TaskParametersModel } from "../../models/configuration/TaskParametersModel";

export const TaskService = {
    getAllTasks: async (): Promise<AxiosResponse<TaskModel[], any>> => {
        return await request.get<TaskModel[]>("/task");
    },
    getAllTasksByInst: async (instId: string | undefined): Promise<AxiosResponse<TaskModel[], any>> => {
        return await request.get<TaskModel[]>(`/task/inst/${instId}`);
    },
}

export const TaskParameterService ={
    getTaskParameters: async (taskId: number): Promise<AxiosResponse<TaskParametersModel[], any>> =>{
        return await request.get<TaskParametersModel[]>(`/task-parameter/task/${taskId}`);
    }
}