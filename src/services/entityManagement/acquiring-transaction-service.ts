import { AxiosResponse } from "axios";
import { PageResponseModel } from "../../models/configuration/PageResponseModel";
import { AcquiringTransactionModel, HaltPayModel, HaltResponse, RepresentmentModel, ReversalTransactionModel, UnhaltPayModel } from "../../models/entityManagement/AcquiringTransactionModel";

import request from "../request";

export const AcquiringTransactionServices = {
  getBySearch: async (model: any): Promise<AxiosResponse<PageResponseModel<any>, any>> => {
    return await request.post<PageResponseModel<any>>("/acquiringtransaction/search", model);
  },
  getById: async (id: number): Promise<AxiosResponse<any, any>> => {
    return await request.get<any>(`/acquiringtransaction/${id}`)
  },
  haltPay: async (model: HaltPayModel): Promise<AxiosResponse<HaltResponse, any>> => {
    return await request.post<HaltResponse>(`/acquiringtransaction/haltpaytransaction`, model);
  },
  unHaltTransaction: async (model: UnhaltPayModel): Promise<AxiosResponse<AcquiringTransactionModel, any>> => {
    return await request.post<AcquiringTransactionModel>(`/acquiringtransaction/unhaltTransaction`, model);
  },
  representment: async (model: RepresentmentModel): Promise<AxiosResponse<AcquiringTransactionModel, any>> => {
    return await request.post<AcquiringTransactionModel>(`/acquiringtransaction/representment`, model);
  },
  reversalTransaction: async (model: ReversalTransactionModel): Promise<AxiosResponse<AcquiringTransactionModel, any>> => {
    return await request.post<AcquiringTransactionModel>(`/acquiringtransaction/reversalTransaction`, model);
  },
  checkIfAlreadyRepresented: async (id: number): Promise<AxiosResponse<string, any>> => {
    return await request.get<string>(`/acquiringtransaction/representment/${id}`);
  },
  checkIfAlreadyReversed: async (id: number): Promise<AxiosResponse<string, any>> => {
    return await request.get<string>(`/acquiringtransaction/reversal/${id}`);
  },
  applyAccountingAdjustment: async (
    model: any
  ): Promise<AxiosResponse<AcquiringTransactionModel[], any>> => {
    return await request.post<AcquiringTransactionModel[]>(`/acquiringtransaction/account-adjustment`, model);
  },
}