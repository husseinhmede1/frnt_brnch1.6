import {
    InstitutionAccountsModel,
} from "../../models/configuration/InstitutionAccountsModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const InstitutionAccountsService = {
    getInstitutionAccountsById: async (
        id: number
      ): Promise<AxiosResponse<InstitutionAccountsModel, any>> => {
        return await request.get<InstitutionAccountsModel>(`/institution-accounts/${id}`);
    },
    getInstitutionAccountsByInstitution: async (
        id: String
      ): Promise<AxiosResponse<InstitutionAccountsModel[], any>> => {
        return await request.get<InstitutionAccountsModel[]>(`/institution-accounts/inst/${id}`);
    },
    saveOrUpdateInstitutionAccounts: async (
      model: any
    ): Promise<AxiosResponse<InstitutionAccountsModel, any>> => {
      return await request.post<InstitutionAccountsModel>(`/institution-accounts`, model);
    },
    getAllInstitutionAccountsByInstitutionChargingInstitutionAndBankCode: async (
        model: any
      ): Promise<AxiosResponse<InstitutionAccountsModel[], any>> => {
        return await request.post<InstitutionAccountsModel[]>(`/institution-accounts/charging`, model);
      },
    getDistinctAccountTypes: async (
      model: any
    ): Promise<AxiosResponse<String[], any>> => {
      return await request.post<String[]>(`/institution-accounts/account-types`, model);
    },
    deleteInstitutionAccounts: async (
        id: number
      ): Promise<AxiosResponse<InstitutionAccountsModel, any>> => {
        return await request.delete<InstitutionAccountsModel>(`/institution-accounts/${id}`);
    }
}