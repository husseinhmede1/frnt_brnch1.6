import { CurrencyRateModel, CurrencyRateSearchRequestModel } from "../../models/configuration/CurrencyRateModel";
import { AxiosResponse } from "axios";
import request from "../request";
import { PageResponseModel } from "../../models/configuration/PageResponseModel";

export const CurrencyRateService = {
    getAll: async (): Promise<AxiosResponse<CurrencyRateModel[], any>> => {
        return await request.get<CurrencyRateModel[]>("/currencyrate")
    },
    getById: async (id: number): Promise<AxiosResponse<CurrencyRateModel>> => {
        return await request.get<CurrencyRateModel>(`/currencyrate/${id}`)
    },
    deleteById: async (id: number | undefined): Promise<AxiosResponse<CurrencyRateModel, any>> => {
        return await request.delete<CurrencyRateModel>(`/currencyrate/${id}`);
    },
    saveOrUpdate: async (model: any): Promise<AxiosResponse<CurrencyRateModel, any>> => {
        return await request.post<CurrencyRateModel>(`/currencyrate`, model);
    },
    getByInstitutionId: async (id: string): Promise<AxiosResponse<CurrencyRateModel[], any>> => {
        return await request.get<CurrencyRateModel[]>(`/currencyrate/institution/${id}`)
    },    
    search: async (instituteId: string ,model: CurrencyRateSearchRequestModel): Promise<AxiosResponse<PageResponseModel<CurrencyRateModel>, any>> => {
        return await request.post<PageResponseModel<CurrencyRateModel>>(`/currencyrate/search/${instituteId}`, model);
    },
}