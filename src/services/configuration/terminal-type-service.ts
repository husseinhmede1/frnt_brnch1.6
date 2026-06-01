import { TerminalTypeChangeStatusModel, TerminalTypeModel } from "../../models/configuration/TerminalTypeModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const TerminalTypeService = {
    getAll: async (): Promise<AxiosResponse<TerminalTypeModel[], any>> => {
        return await request.get<TerminalTypeModel[]>("/terminaltype")
    },
    getById: async (id: number): Promise<AxiosResponse<TerminalTypeModel>> => {
        return await request.get<TerminalTypeModel>(`/terminaltype/${id}`)
    },
    deleteById: async (id: number | undefined): Promise<AxiosResponse<TerminalTypeModel, any>> => {
        return await request.delete<TerminalTypeModel>(`/terminaltype/${id}`);
    },
    changeStatus: async (model: TerminalTypeChangeStatusModel): Promise<AxiosResponse<TerminalTypeModel, any>> => {
        return await request.post<TerminalTypeModel>(`/terminaltype/status-change`, model);
    },
    saveOrUpdate: async (model: any): Promise<AxiosResponse<TerminalTypeModel, any>> => {
        return await request.post<TerminalTypeModel>(`/terminaltype`, model);
    },
    getActive: async (): Promise<AxiosResponse<TerminalTypeModel[], any>> => {
        return await request.get<TerminalTypeModel[]>("/terminaltype/active-terminaltype")
    },
}