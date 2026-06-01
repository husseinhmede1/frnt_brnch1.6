import {
  OutputFileTemplateHdrModel,
} from "../../models/configuration/OutputFileTemplateHdrModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const OutputTemplateHdrService = {
  getOutputFileTemplateById: async (
    id: number
  ): Promise<AxiosResponse<OutputFileTemplateHdrModel, any>> => {
    return await request.get<OutputFileTemplateHdrModel>(`/output-template/${id}`);
  },
  getOutputFileTemplateByInstitution: async (
    id: String
  ): Promise<AxiosResponse<OutputFileTemplateHdrModel[], any>> => {
    return await request.get<OutputFileTemplateHdrModel[]>(`/output-template/inst/${id}`);
  },
  saveOrUpdateOutputFileTemplate: async (
    model: any
  ): Promise<AxiosResponse<OutputFileTemplateHdrModel, any>> => {
    return await request.post<OutputFileTemplateHdrModel>(`/output-template`, model);
  },
  deleteOutputFileTemplate: async (
    id: number
  ): Promise<AxiosResponse<OutputFileTemplateHdrModel, any>> => {
    return await request.delete<OutputFileTemplateHdrModel>(`/output-template/${id}`);
  }
}