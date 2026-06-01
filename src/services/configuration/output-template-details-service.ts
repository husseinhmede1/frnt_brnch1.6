import {
  OutputFileTemplateDetailsModel,
} from "../../models/configuration/OutputTemplateDetailsModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const OutputTemplateDetailsService = {
  getOutputFileTemplateDetailsByOutputFileTemplateHdrId: async (
    outputFileTemplateHdrId: number
  ): Promise<AxiosResponse<OutputFileTemplateDetailsModel[], any>> => {
    return await request.get<OutputFileTemplateDetailsModel[]>(`/output-details/header/${outputFileTemplateHdrId}`);
  },
  getOutputFileTemplateDetailsByOutputFileTemplateHdrIdAndFieldSection: async (
    outputFileTemplateHdrId: number,
    fieldSection: string
  ): Promise<AxiosResponse<OutputFileTemplateDetailsModel[], any>> => {
    return await request.get<OutputFileTemplateDetailsModel[]>(`/output-details/details/${outputFileTemplateHdrId}/${fieldSection}`);
  },
  // deleteOutputFileTemplateDetailsByFieldId: async (
  //   outputTemplateHdrId: number,
  //   fieldId: number
  // ): Promise<AxiosResponse<OutputFileTemplateDetailsModel, any>> => {
  //   return await request.delete<OutputFileTemplateDetailsModel>(`/output-details/${outputTemplateHdrId}/field/${fieldId}`);
  // }
}