import {
  AccountingTemplateDetailsModel,
} from "../../models/configuration/AccountingTemplateDetailsModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const AccountingTemplateDetailsService = {
  getAccountTemplateDetailsById: async (
    id: number
  ): Promise<AxiosResponse<AccountingTemplateDetailsModel, any>> => {
    return await request.get<AccountingTemplateDetailsModel>(`/accounting-details/${id}`);
  },
  getAllAccountingTemplateDetailsByAccountingTemplateHDRId: async (
    id: number
  ): Promise<AxiosResponse<AccountingTemplateDetailsModel[], any>> => {
    return await request.get<AccountingTemplateDetailsModel[]>(`/accounting-details/accountingHdr/${id}`);
  },

  getAllAccountingTemplateDetailsByAccountingTemplateHDRSubId: async (
    id: number
  ): Promise<AxiosResponse<AccountingTemplateDetailsModel[], any>> => {
    return await request.get<AccountingTemplateDetailsModel[]>(`/accounting-details/accountingHdrSub/${id}`);
  },
  saveAccountingTemplateDetails: async (
    model: any
  ): Promise<AxiosResponse<AccountingTemplateDetailsModel, any>> => {
    return await request.post<AccountingTemplateDetailsModel>(`/accounting-details`, model);
  },
  deleteAccountingTemplateDetails: async (
    id: number
  ): Promise<AxiosResponse<AccountingTemplateDetailsModel, any>> => {
    return await request.delete<AccountingTemplateDetailsModel>(`/accounting-details/${id}`);
  }
}