import {
    IssProfile,
} from "../../models/configuration/IssuerProfileModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const IssuerProfileService = {
    getAllIssuerProfiles: async (): Promise<AxiosResponse<IssProfile[], any>> => {
        return await request.get<IssProfile[]>("/issuer-profile");
    },
    getIssuerProfilesById: async (
        id: number
      ): Promise<AxiosResponse<IssProfile, any>> => {
        return await request.get<IssProfile>(`/issuer-profile/${id}`);
    },
    getIssuerProfilesByInstitution: async (
        id: String
      ): Promise<AxiosResponse<IssProfile[], any>> => {
        return await request.get<IssProfile[]>(`/issuer-profile/inst/${id}`);
    },
    saveOrUpdateIssuerProfile: async (
        model: any
      ): Promise<AxiosResponse<IssProfile, any>> => {
        return await request.post<IssProfile>(`/issuer-profile`, model);
      },
    deleteIssuerProfile: async (
        id: number
      ): Promise<AxiosResponse<IssProfile, any>> => {
        return await request.delete<IssProfile>(`/issuer-profile/${id}`);
    }
}