import { EmployeeChangeStatusModel, EmployeeModel } from "../../models/configuration/EmployeeModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const EmployeeService = {
    getAll: async (): Promise<AxiosResponse<EmployeeModel[], any>> => {
        return await request.get<EmployeeModel[]>("/employee")
    },
    getById: async (id: number): Promise<AxiosResponse<EmployeeModel>> => {
        return await request.get<EmployeeModel>(`/employee/${id}`)
    },
    deleteById: async (id: number | undefined): Promise<AxiosResponse<EmployeeModel, any>> => {
        return await request.delete<EmployeeModel>(`/employee/${id}`);
    },
    changeStatus: async (model: EmployeeChangeStatusModel): Promise<AxiosResponse<EmployeeModel, any>> => {
        return await request.post<EmployeeModel>(`/employee/status-change`, model);
    },
    saveOrUpdate: async (model: any): Promise<AxiosResponse<EmployeeModel, any>> => {
        return await request.post<EmployeeModel>(`/employee`, model);
    },
    getActive: async (): Promise<AxiosResponse<EmployeeModel[], any>> => {
        return await request.get<EmployeeModel[]>("/employee/active-employee")
    },

    getEmployeesByInstitutionId: async (id: string): Promise<AxiosResponse<EmployeeModel[], any>> => {
        return await request.get<EmployeeModel[]>(`/employee/institution/${id}`)
    },
}