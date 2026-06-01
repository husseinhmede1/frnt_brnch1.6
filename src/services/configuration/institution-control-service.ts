import {
    InstitutionControlModel,
} from "../../models/configuration/InstitutionControlModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const InstitutionControlService = {
    getInstitutionControlByInstitution: async (
        id: String
      ): Promise<AxiosResponse<InstitutionControlModel, any>> => {
        return await request.get<InstitutionControlModel>(`/institution-control/inst/${id}`);
    },
    saveOrUpdateInstitutionControl: async (
      model: any
    ): Promise<AxiosResponse<InstitutionControlModel, any>> => {
      return await request.post<InstitutionControlModel>(`/institution-control`, model);
    }
}