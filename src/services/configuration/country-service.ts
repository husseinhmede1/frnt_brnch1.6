import {
  CountryModel,
  CountryStatusModel,
} from "../../models/configuration/CountryModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const CountryService = {
  getAllCountry: async (): Promise<AxiosResponse<CountryModel[], any>> => {
    return await request.get<CountryModel[]>("/country");
  },

  getActiveCountries: async (): Promise<AxiosResponse<CountryModel[], any>> => {
    return await request.get<CountryModel[]>("/country/active-country");
  },

  changeStatus: async (
    model: CountryStatusModel
  ): Promise<AxiosResponse<CountryModel, any>> => {
    return await request.post<CountryModel>(`/country/status-change`, model);
  },

  deleteById: async (
    id: number | undefined
  ): Promise<AxiosResponse<CountryModel, any>> => {
    return await request.delete<CountryModel>(`/country/${id}`);
  },

  saveOrUpdateCountry: async (data: any): Promise<AxiosResponse<CountryModel, any>> => {
    return await request.post<CountryModel>("/country", data);
  },
};
