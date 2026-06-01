import { AxiosResponse } from "axios";
import { PageResponseModel } from "../../models/configuration/PageResponseModel";
import { NonActivityFeeQueryModel } from "../../models/entityManagement/NonActivityFeeQueryModel";
  import request from "../request";
  
  export const NonActivityFeeQueryServices = {
    getBySearch: async (model: any): Promise<AxiosResponse<PageResponseModel<NonActivityFeeQueryModel>, any>> => {
      return await request.post<PageResponseModel<NonActivityFeeQueryModel>>("/nonactivityfeequery/search", model);
    },
  }