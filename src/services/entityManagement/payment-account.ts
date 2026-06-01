import { AxiosResponse } from "axios";
import request from "../request";
import { BankCodeModel, PaymentAccountModel } from "../../models/entityManagement/EntityModel";

export const PaymentAccountService = {
  getAllPaymentAccounts: async (): Promise<AxiosResponse<PaymentAccountModel[], any>> => {
    return await request.get<PaymentAccountModel[]>("/payment-account");
  },
  getAllBankCode: async (): Promise<AxiosResponse<BankCodeModel[], any>> => {
    return await request.get<BankCodeModel[]>("/bankcode");
  },
  getPaymentAccountById: async (id: number): Promise<AxiosResponse<PaymentAccountModel>> => {
    return await request.get<PaymentAccountModel>(`/payment-account/${id}`)
  },
  deletePaymentAccount: async (id: number | undefined): Promise<AxiosResponse<PaymentAccountModel, any>> => {
    return await request.delete<PaymentAccountModel>(`/payment-account/${id}`);
  },
  saveOrUpdatePaymentAccount: async (account: PaymentAccountModel): Promise<AxiosResponse<PaymentAccountModel, any>> => {
    return await request.post<PaymentAccountModel>(`/payment-account`, account);
  },
  getPaymentAccountsByEntityId: async (id: string): Promise<AxiosResponse<PaymentAccountModel[], any>> => {
    return await request.get<PaymentAccountModel[]>(`/payment-account/entities/${id}`);
  },
  getBankCodeByInstitutionId: async (id: string): Promise<AxiosResponse<BankCodeModel[], any>> => {
    return await request.get<BankCodeModel[]>(`/bankcode/institution/${id}`);
  },
}