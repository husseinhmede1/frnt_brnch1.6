import { ILoginModel, ILoginResponse } from "../models/login/LoginModel";
import { AxiosResponse } from "axios";
import request from "./request";

export const LoginService = {
  loginUser: async (model: any): Promise<AxiosResponse<ILoginModel, ILoginResponse>> => {
    return await request.post<ILoginModel>('/authenticate', model);
  },

  logout: async (): Promise<AxiosResponse<any>> => {
    return await request.post<any>('/logout')
  },
  refreshAuthenticateUser: async(): Promise<AxiosResponse<any>> => {
    return await request.post<any>(`/refresh-token`);
  }
};
