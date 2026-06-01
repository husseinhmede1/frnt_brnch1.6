import { AxiosResponse } from "axios";
import { SystemCodeModel, SystemHeaderCode, SystemHeaderCodeResponse } from "../../models/entityManagement/SystemCodeModel";
import { UserChangeStatus } from "../../models/security/UserModel";
import request from "../request";

export const SystemCodeServices = {
    getSystemCodesByPrefixSuffix: async (model: any): Promise<AxiosResponse<SystemCodeModel[], any>> => {
        return await request.post<SystemCodeModel[]>("/system-code/prefix-suffix", model);
    },
    getAllSystemCodes: async (): Promise<AxiosResponse<SystemCodeModel[], any>> => {
        return await request.get<SystemCodeModel[]>("/system-code");
    },
    getAllSystemCodesByInstitution: async (instId: string): Promise<AxiosResponse<SystemCodeModel[], any>> => {
        return await request.get<SystemCodeModel[]>(`/system-code/inst/${instId}`);
    },
    saveOrUpdateSystemCode: async (model: SystemCodeModel): Promise<AxiosResponse<SystemCodeModel, any>> => {
        return await request.post<any>('/system-code', model);
    },
    getSystemCodeById: async (id: number): Promise<AxiosResponse<SystemCodeModel, any>> => {
        return await request.get<SystemCodeModel>(`/system-code/${id}`);
    },
    deleteSystemCode: async (id: number): Promise<AxiosResponse<any>> => {
        return await request.delete<any>(`/system-code/${id}`);
    },
    changeSystemCodeStatus: async (model: UserChangeStatus): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/system-code/status-change`, model);
    },
    getAllSystemCodesHeader: async (): Promise<AxiosResponse<SystemHeaderCode[], any>> => {
        return await request.get<SystemHeaderCode[]>(`/system-header-code`);
    },
    getSystemCodeByPrefixAndInstitutionId: async (prefix:String, instId:String): Promise<AxiosResponse<any>> => {
        return await request.get<any>(`/system-code/${prefix}/${instId}`);
    },
    getSystemCodesByPrefixAndValue: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/system-code/details`, model);
    },
    getSystemCodesByUniqueFields: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/system-code/unique`, model);
    },
    getSystemCodesHoldType: async (): Promise<AxiosResponse<SystemHeaderCodeResponse[]>> => {
        return await request.get<SystemHeaderCodeResponse[]>(`/system-code/hold-type`);
    }
}