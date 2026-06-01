import {
  ProvinceModel,
  ProvinceStatusModel,
} from "../../models/configuration/ProvinceModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const ProvinceService = {
  getAllProvince: async (): Promise<AxiosResponse<ProvinceModel[], any>> => {
    return await request.get<ProvinceModel[]>("/province/province");
  },
};
