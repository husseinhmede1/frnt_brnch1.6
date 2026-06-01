import {
  BankFilesOutputModel,
} from "../../models/configuration/BankFilesOutputModel";
import { AxiosResponse } from "axios";
import request from "../request";
import { BankInfoModel } from "../../models/configuration/BankInfoModel";

export const BankFilesOutputService = {
  getAllBankFilesOutputByInstitution: async (
    id: String
  ): Promise<AxiosResponse<BankFilesOutputModel[], any>> => {
    return await request.get<BankFilesOutputModel[]>(`/bank-files/inst/${id}`);
  },
  getAllMappedBanksByOutputTemplateHdrId: async (
    outputTemplateHdrId: number
  ): Promise<AxiosResponse<BankInfoModel[], any>> => {
    return await request.get<BankInfoModel[]>(`/bank-files/map/${outputTemplateHdrId}`);
  },
  saveBankFilesOutput: async (
    model: any
  ): Promise<AxiosResponse<BankFilesOutputModel, any>> => {
    return await request.post<BankFilesOutputModel>(`/bank-files`, model);
  },
  mapOutputFileTemplateToBanks: async (
    model: any
  ): Promise<AxiosResponse<BankFilesOutputModel[], any>> => {
    return await request.post<BankFilesOutputModel[]>(`/bank-files/assign`, model);
  },
  unMapOutputFileTemplateToBanks: async (
    model: any
  ): Promise<AxiosResponse<BankFilesOutputModel[], any>> => {
    return await request.delete('/bank-files/unassign', { data: model });
  },
  getDistinctBankFilesOutputByInstitution: async (instId: string): Promise<AxiosResponse<string[], any>> => {
    return await request.get<string[], any>(`/bank-files/distinct/inst/${instId}`);
  },
  getAllBankFilesOutputByInstitutionAndOutputFileType: async (instId: string, outPutFileType: string): Promise<AxiosResponse<string[], any>> => {
    return await request.get<string[]>(`/bank-files/output-file-type/inst/${instId}/${outPutFileType}`);
  },
  getDistinctBankFilesOutputBankCodesByInstitution: async (instId: string): Promise<AxiosResponse<string[], any>> => {
    return await request.get<string[], any>(`/bank-files/distinct/bank-code/inst/${instId}`);
  },
}