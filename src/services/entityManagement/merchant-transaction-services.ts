import { AxiosResponse } from "axios";
import { PageResponseModel } from "../../models/configuration/PageResponseModel";
import { MerchantTransactionDefinitionModel, MerchantTransactionListingModel } from "../../models/entityManagement/MerchantTransactionModel";
  import request from "../request";
  
  export const MerchantTransactionServices = {
    getById: async (id: number): Promise<AxiosResponse<MerchantTransactionDefinitionModel, any>> => {
        return await request.get<MerchantTransactionDefinitionModel>(`/manualmerchanttransaction/${id}`)
    },
    deleteById: async (id: number | undefined): Promise<AxiosResponse<MerchantTransactionListingModel, any>> => {
        return await request.delete<MerchantTransactionListingModel>(`/manualmerchanttransaction/${id}`);
    },
    saveOrUpdate:  async (transaction: any): Promise<AxiosResponse<MerchantTransactionDefinitionModel, any>> => {
        return await request.post<MerchantTransactionDefinitionModel>(`/manualmerchanttransaction`, transaction);
    },
    getBySearch: async (model: any): Promise<AxiosResponse<PageResponseModel<MerchantTransactionListingModel>, any>> => {
      return await request.post<PageResponseModel<MerchantTransactionListingModel>>("/manualmerchanttransaction/search", model);
    },
  }