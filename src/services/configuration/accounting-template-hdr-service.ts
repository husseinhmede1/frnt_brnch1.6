import {
  AccountingTemplateHDRModel,
} from "../../models/configuration/AccountingTemplateHDRModel";
import { EntityListModel } from "../../models/entityManagement/EntityModel";
import { AxiosResponse } from "axios";
import request from "../request";
import { AccountingTemplateSubHeader } from "../../models/configuration/AccountingTemplateDetailsModel";

export const AccountingTemplateHDRService = {
  getAccountingTemplateHDRById: async (
    id: number
  ): Promise<AxiosResponse<AccountingTemplateHDRModel, any>> => {
    return await request.get<AccountingTemplateHDRModel>(`/accounting-template/${id}`);
  },
  getAllAccountingTemplateHDRsByInstitution: async (
    id: String
  ): Promise<AxiosResponse<AccountingTemplateHDRModel[], any>> => {
    return await request.get<AccountingTemplateHDRModel[]>(`/accounting-template/inst/${id}`);
  },
  saveAccountingTemplateHDR: async (
    model: any
  ): Promise<AxiosResponse<AccountingTemplateHDRModel, any>> => {
    return await request.post<AccountingTemplateHDRModel>(`/accounting-template`, model);
  },
  deleteAccountingTemplateHDR: async (
    id: number
  ): Promise<AxiosResponse<AccountingTemplateHDRModel, any>> => {
    return await request.delete<AccountingTemplateHDRModel>(`/accounting-template/${id}`);
  },
  mapAccountingTemplateWithEntity: async (
    model: any
  ): Promise<AxiosResponse<any[], any>> => {
    return await request.post<any[]>(
      "/accounting-template/assignment", model
    );
  },
  getAllMappedEntities: async (
    id: number
  ): Promise<AxiosResponse<EntityListModel[], any>> => {
    return await request.get<EntityListModel[]>(
      `/accounting-template/mapped-entities/${id}`
    );
  }
}

export const AccountingTemplateSubheaderService = {
  getAllAccountingTemplateHDRSubByAccrTemplateHdrSubId: async(id: number): Promise<AxiosResponse<AccountingTemplateSubHeader[], any>> => {
    return await request.get<AccountingTemplateSubHeader[]>(`/accounting-template-sub/header/${id}`);
  },
  saveAccountingTemplateHDRSub: async(model: any): Promise<AxiosResponse<any>> => {
    return await request.post<any>(`/accounting-template-sub`, model);
  },
  getAccountingTemplateHDRSubById: async(id: number): Promise<AxiosResponse<AccountingTemplateSubHeader, any>> => {
    return await request.get<AccountingTemplateSubHeader>(`/accounting-template-sub/${id}`);
  },
  deleteAccountingTemplateSubHDR: async(id: number): Promise<AxiosResponse<any>> => {
    return await request.delete<any>(`/accounting-template-sub/${id}`);
  }
}