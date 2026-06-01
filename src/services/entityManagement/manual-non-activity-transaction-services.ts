import { AxiosResponse } from "axios";
import { PageResponseModel } from "../../models/configuration/PageResponseModel";
import { ManualNonActivityTransactionModel, ManualNonActivityTransactionResponseModel } from "../../models/entityManagement/ManualNonActivityTransactions";
  import request from "../request";
  
  export const ManualNonActivityTransactionServices = {
    getById: async (id: number): Promise<AxiosResponse<ManualNonActivityTransactionModel, any>> => {
        return await request.get<ManualNonActivityTransactionModel>(`/manualnonactivitytransaction/${id}`)
    },
    deleteById: async (id: number | undefined): Promise<AxiosResponse<ManualNonActivityTransactionModel, any>> => {
        return await request.delete<ManualNonActivityTransactionModel>(`/manualnonactivitytransaction/${id}`);
    },
    saveOrUpdate:  async (transaction: any): Promise<AxiosResponse<ManualNonActivityTransactionModel, any>> => {
        return await request.post<ManualNonActivityTransactionModel>(`/manualnonactivitytransaction`, transaction);
    },
    getBySearch: async (model: any): Promise<AxiosResponse<PageResponseModel<ManualNonActivityTransactionResponseModel>, any>> => {
      return await request.post<PageResponseModel<ManualNonActivityTransactionResponseModel>>("/manualnonactivitytransaction/search", model);
    },
  }