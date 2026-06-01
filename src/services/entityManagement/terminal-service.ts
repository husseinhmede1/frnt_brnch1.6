import { AxiosResponse } from "axios";
import request from "../request";
import { TerminalModel, TerminalChangeStatus, TerminalSearchModel } from "../../models/entityManagement/EntityModel";
import { PageResponseModel } from "../../models/configuration/PageResponseModel";

export const TerminalService = {
  getAll: async (): Promise<AxiosResponse<TerminalModel[], any>> => {
    return await request.get<TerminalModel[]>("/terminal");
  },
  getAllByEntityId: async (entityId: string): Promise<AxiosResponse<TerminalModel[], any>> => {
    return await request.get<TerminalModel[]>(`/terminal/entities/${entityId}`);
  },
  getById: async (id: string, instId: string): Promise<AxiosResponse<TerminalModel>> => {
    return await request.get<TerminalModel>(`/terminal/get-terminal/${id}/${instId}`)
  },
  deleteById: async (id: string | undefined, instId: string): Promise<AxiosResponse<TerminalModel, any>> => {
    return await request.delete<TerminalModel>(`/terminal/${id}/${instId}`);
  },
  changeStatus: async (model: TerminalChangeStatus): Promise<AxiosResponse<TerminalModel, any>> => {
    return await request.post<TerminalModel>(`/terminal/status-change`, model);
  },
  saveOrUpdate: async (model: any): Promise<AxiosResponse<TerminalModel, any>> => {
    return await request.post<TerminalModel>(`/terminal`, model);
  },
  search: async (model: TerminalSearchModel): Promise<AxiosResponse<PageResponseModel<TerminalModel>, any>> => {
    return await request.post<PageResponseModel<TerminalModel>>(`/terminal/getAllTerminal`, model);
  },
}