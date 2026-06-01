import {
  IssRelation,
} from "../../models/configuration/IssuerRelationModel";
import { PageableIssuerRelationModel } from "../../models/configuration/PageableIssuerRelationModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const IssuerRelationService = {
  getAllIssuerRelations: async (): Promise<AxiosResponse<IssRelation[], any>> => {
    return await request.get<IssRelation[]>("/issuer-relation");
  },
  getIssuerRelationsById: async (
    id: number
  ): Promise<AxiosResponse<IssRelation, any>> => {
    return await request.get<IssRelation>(`/issuer-relation/${id}`);
  },
  getIssuerRelationsByAcqProfile: async (
    issuerAcqProfile: String,
    instId:String
  ): Promise<AxiosResponse<IssRelation[], any>> => {
    return await request.get<IssRelation[]>(`/issuer-relation/issuer-profile/${issuerAcqProfile}/${instId}`);
  },
  getAllPaginatedIssuerRelationByIssuerId: async (
    issuerProfileId: number,
    model: any
  ): Promise<AxiosResponse<IssRelation[], any>> => {
    return await request.post<IssRelation[]>(`/issuer-relation/all/${issuerProfileId}`, model);
  },
  getIssuerRelationsByPanRange: async (
    model: any
    ): Promise<AxiosResponse<IssRelation[], any>> => {
    return await request.post<IssRelation[]>(`/issuer-relation/search`, model);
  },
  getAllIssuerRelationsByPanRange: async (
    model: any
  ): Promise<AxiosResponse<IssRelation[], any>> => {
    return await request.post<IssRelation[]>(`/issuer-relation/pan`, model);
  },
  saveOrUpdateIssuerRelation: async (
    model: any
  ): Promise<AxiosResponse<IssRelation, any>> => {
    return await request.post<IssRelation>(`/issuer-relation`, model);
  },
  deleteIssuerRelation: async (
    id: number
  ): Promise<AxiosResponse<IssRelation, any>> => {
    return await request.delete<IssRelation>(`/issuer-relation/${id}`);
  }
}