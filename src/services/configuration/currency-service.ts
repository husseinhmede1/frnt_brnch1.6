import {
  CurrencyChangeStatus,
  CurrencyModel,
} from "../../models/configuration/CurrencyModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const CurrencyService = {
  getAllCurrencies: async (): Promise<AxiosResponse<CurrencyModel[], any>> => {
    return await request.get<CurrencyModel[]>("/currency");
  },

  getCurrencyById: async (
    id: number
  ): Promise<AxiosResponse<CurrencyModel>> => {
    return await request.get<CurrencyModel>(`/currency/${id}`);
  },

  deleteCurrency: async (
    id: number
  ): Promise<AxiosResponse<CurrencyModel, any>> => {
    return await request.delete<CurrencyModel>(`/currency/${id}`);
  },

  changeCurrencyStatus: async (
    model: CurrencyChangeStatus
  ): Promise<AxiosResponse<CurrencyModel, any>> => {
    return await request.post<CurrencyModel>(`/currency/status-change`, model);
  },

  saveOrUpdateCurrency: async (
    model: any
  ): Promise<AxiosResponse<CurrencyModel, any>> => {
    return await request.post<CurrencyModel>(`/currency`, model);
  },
  getActiveCurrencies: async (): Promise<AxiosResponse<CurrencyModel[], any>> => {
    return await request.get<CurrencyModel[]>("/currency/active-currencies");
  },
};
