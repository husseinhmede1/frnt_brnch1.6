import {
  BankInfoModel,
} from "../../models/configuration/BankInfoModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const BankInfoService = {
    getBankInfoById: async (
        id: number
      ): Promise<AxiosResponse<BankInfoModel, any>> => {
        return await request.get<BankInfoModel>(`/bankcode/${id}`);
    },
    getAllBankInfoByInstitution: async (
        id: String
      ): Promise<AxiosResponse<BankInfoModel[], any>> => {
        return await request.get<BankInfoModel[]>(`/bankcode/institution/${id}`);
    },
    saveOrUpdateBankInfo: async (
        model: any
      ): Promise<AxiosResponse<BankInfoModel, any>> => {
        return await request.post<BankInfoModel>(`/bankcode`, model);
      },
    deleteBankInfo: async (
        id: number
      ): Promise<AxiosResponse<BankInfoModel, any>> => {
        return await request.delete<BankInfoModel>(`/bankcode/${id}`);
    }
}