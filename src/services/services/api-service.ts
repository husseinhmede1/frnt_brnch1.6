import { AxiosResponse } from "axios";
import { ApiModel } from "../../models/configuration/ScopeModel";
import { UserPaginationModel } from "../../models/security/UserModel";
import request from "../../services/request";
import { getVersion } from "../../utils/constant";

export const apiUrl: string = `${getVersion()}/api/list`;
export const APiService = {
    updateStpFlag: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${apiUrl}`, model);
    },
    getApiObjects: async (): Promise<AxiosResponse<ApiModel[], any>> => {
        return await request.get<ApiModel[]>(`/${apiUrl}/objects`);
    },
    getAllApiList: async (model: UserPaginationModel): Promise<AxiosResponse<any, any>> => {
        return await request.post<any>(`/${apiUrl}/objects-list`, model);
    },
    getApiList: async (model: UserPaginationModel, object: string): Promise<AxiosResponse<any, any>> => {
        return await request.post<any>(`/${apiUrl}/objects/${object}`, model);
    }
}