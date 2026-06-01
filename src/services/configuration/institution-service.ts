import {
  InstituteChangeStatus,
  Institution,
} from "../../models/configuration/InstitutionModel";
import { AxiosResponse } from "axios";
import request from "../request";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";

export const InstitutionService = {
  getAllInstitution: async (): Promise<AxiosResponse<Institution[], any>> => {
    return await request.get<Institution[]>("/institution");
  },
  getAllInstitutionTypes: async (): Promise<
    AxiosResponse<Institution[], any>
  > => {
    return await request.get<Institution[]>("/institutiontype");
  },
  getInstitutionById: async (
    id: string
  ): Promise<AxiosResponse<Institution>> => {
    return await request.get<Institution>(`/institution/${id}`);
  },
  deleteInstitution: async (
    id: string
  ): Promise<AxiosResponse<Institution, any>> => {
    return await request.delete<Institution>(`/institution/${id}`);
  },
  changeInstituteStatus: async (  
    model: InstituteChangeStatus
  ): Promise<AxiosResponse<Institution, any>> => {
    return await request.post<Institution>(`/institution/status-change`, model);
  },
  saveOrUpdateInstitutions: async (
    model: any
  ): Promise<AxiosResponse<Institution, any>> => {
    return await request.post<Institution>(`/institution`, model);
  },
  getActiveInstitution: async (): Promise<AxiosResponse<Institution[], any>> => {
    return await request.get<Institution[]>("/institution/active-institutions");
  },
  getAllActiveInstitution: async (): Promise<AxiosResponse<Institution[], any>> => {
    return await request.get<Institution[]>("/institution/active-all-institutions");
  },
};
