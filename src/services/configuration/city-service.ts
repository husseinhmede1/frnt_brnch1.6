import {
  CityModel,
  CityStatusModel,
} from "../../models/configuration/CityModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const CityService = {
  getAllCity: async (): Promise<AxiosResponse<CityModel[], any>> => {
    return await request.get<CityModel[]>("/city");
  },

  getActiveCities: async (): Promise<AxiosResponse<CityModel[], any>> => {
    return await request.get<CityModel[]>("/city/active-city");
  },

  changeStatus: async (
    model: CityStatusModel
  ): Promise<AxiosResponse<CityModel, any>> => {
    return await request.post<CityModel>(`/city/status-change`, model);
  },

  deleteById: async (
    id: number | undefined
  ): Promise<AxiosResponse<CityModel, any>> => {
    return await request.delete<CityModel>(`/city/${id}`);
  },

  saveOrUpdateCity: async (data: any): Promise<AxiosResponse<CityModel, any>> => {
    return await request.post<CityModel>("/city", data);
  },
};
