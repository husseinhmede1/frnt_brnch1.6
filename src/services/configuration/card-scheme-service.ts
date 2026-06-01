import { CardSchemeChangeStatus, CardSchemeModel } from "../../models/configuration/CardSchemeModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const CardSchemeService = {
    getAllCardScheme: async (): Promise<AxiosResponse<CardSchemeModel[], any>> => {
        return await request.get<CardSchemeModel[]>("/cardscheme")
    },
    getCardSchemeById: async (id: string): Promise<AxiosResponse<CardSchemeModel>> => {
        return await request.get<CardSchemeModel>(`/cardscheme/${id}`)
    },
    deleteCardScheme: async (id: string): Promise<AxiosResponse<CardSchemeModel, any>> => {
        return await request.delete<CardSchemeModel>(`/cardscheme/${id}`);
    },
    changeCardSchemeStatus: async (model: CardSchemeChangeStatus): Promise<AxiosResponse<CardSchemeModel, any>> => {
        return await request.post<CardSchemeModel>(`/cardscheme/status-change`, model);
    },
    saveOrUpdateCardScheme: async (model: any): Promise<AxiosResponse<CardSchemeModel, any>> => {
        return await request.post<CardSchemeModel>(`/cardscheme`, model);
    },
    getActiveCardScheme: async (): Promise<AxiosResponse<CardSchemeModel[], any>> => {
        return await request.get<CardSchemeModel[]>("/cardscheme/active-cardscheme")
    },
}