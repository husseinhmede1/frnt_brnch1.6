  import { AxiosResponse } from "axios";
import { MccModel, MccSearchRequestModel } from "../../models/configuration/MccModel";
import { CardSchemeModel } from "../../models/configuration/CardSchemeModel";
  import request from "../request";
import { PageResponseModel } from "../../models/configuration/PageResponseModel";
  
  export const MccService = {
    getAllMcc: async (): Promise<AxiosResponse<MccModel[], any>> => {
      return await request.get<MccModel[]>("/mcc");
    },
    getAllMerchantTypes: async (): Promise<
    AxiosResponse<MccModel[], any>
    > => {
      return await request.get<MccModel[]>("/merchanttype");
    },
    getAllCardScheme: async (): Promise<
    AxiosResponse<CardSchemeModel[], any>
    > => {
      return await request.get<CardSchemeModel[]>("/cardscheme/active-cardscheme");
    },
    getMccById: async (
      id: number | undefined
    ): Promise<AxiosResponse<MccModel>> => {
      return await request.get<MccModel>(`/mcc/${id}`);
    },
    deleteMcc: async (
      id: number | undefined
    ): Promise<AxiosResponse<MccModel, any>> => {
      return await request.delete<MccModel>(`/mcc/${id}`);
    },
    saveOrUpdateMcc : async (
      model: MccModel
    ): Promise<AxiosResponse<MccModel, any>> => {
      return await request.post<MccModel>(`/mcc`, model);
    },
    search: async (model: MccSearchRequestModel): Promise<AxiosResponse<PageResponseModel<MccModel>, any>> => {
      return await request.post<PageResponseModel<MccModel>>(`/mcc/getMCCList`, model);
    },
    filterSearch: async (model: any): Promise<AxiosResponse<PageResponseModel<MccModel>, any>> => {
      return await request.post<PageResponseModel<MccModel>>(`/mcc/search`, model);
    },
}