import { BusinessTypeModel } from "../../models/configuration/BusinessTypeModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const BusinessTypeService = {
    getAll: async (): Promise<AxiosResponse<BusinessTypeModel[], any>> => {
        return await request.get<BusinessTypeModel[]>("/businesstype")
    },
    saveOrUpdate: async (model: any): Promise<AxiosResponse<BusinessTypeModel, any>> => {
        return await request.post<BusinessTypeModel>(`/businesstype`, model);
    }
}