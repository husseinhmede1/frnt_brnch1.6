import {
  CurrencyConversionModel,
  CurrencyConversionGridModel,
} from "../../models/configuration/CurrencyConversionModels";
import { AxiosResponse } from "axios";
import request from "../request";

export const CurrencyConversionService = {
  getAllCurrencyConversion: async (): Promise<
    AxiosResponse<CurrencyConversionGridModel[], any>
  > => {
    return await request.get<CurrencyConversionGridModel[]>(
      "/currencyconversion"
    );
  },

  getCurrencyConversionById: async (
    id: number
  ): Promise<AxiosResponse<CurrencyConversionModel>> => {
    return await request.get<CurrencyConversionModel>(
      `/currencyconversion/${id}`
    );
  },

  getCurrencyConversionByInstitutionId: async (
    id: string
  ): Promise<AxiosResponse<CurrencyConversionGridModel[], any>> => {
    return await request.get<CurrencyConversionGridModel[], any>(
      `/currencyconversion/institution/${id}`
    );
  },

  deleteCurrencyConversion: async (
    id: number
  ): Promise<AxiosResponse<CurrencyConversionModel, any>> => {
    return await request.delete<CurrencyConversionModel>(
      `/currencyconversion/${id}`
    );
  },

  saveOrUpdateCurrencyConversion: async (
    model: any
  ): Promise<AxiosResponse<CurrencyConversionModel, any>> => {
    return await request.post<CurrencyConversionModel>(
      `/currencyconversion`,
      model
    );
  },
};
