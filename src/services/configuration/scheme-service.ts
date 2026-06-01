import { SchemeType } from "../../models/configuration/CardSchemeModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const SchemeSpecificService = {
    getAllSchemeSpecific: async (): Promise<AxiosResponse<SchemeType[],  any>> => {
        return await request.get<SchemeType[]>("/schemespecific")
    },
    getSchemeSpecificById: async (id: number): Promise<AxiosResponse<SchemeType>> => {
        return await request.get<SchemeType>(`/schemespecific/${id}`)
    },
    deleteSchemeSpecific: async (id: number): Promise<AxiosResponse<SchemeType, any>> => {
        return await request.delete<SchemeType>(`/schemespecific/${id}`);
    },
    saveOrUpdateSchemeSpecific: async (model: any): Promise<AxiosResponse<SchemeType, any>> => {
        return await request.post<SchemeType>(`/schemespecific`, model);
    }
}