import { AxiosResponse } from "axios";
import request from "../request";
import { TransactionGroupModel, TransactionGroupChangeStatus, TransactionsModel, TransactionUsageModel } from "../../models/configuration/TransactionGroupModel";

export const TransactionGroupService = {
    getAllTransactionGroup: async (): Promise<AxiosResponse<TransactionGroupModel[], any>> => {
        return await request.get<TransactionGroupModel[]>("/transactiongroup")
    },
    getAllTransactionChargesDetails: async (): Promise<AxiosResponse<TransactionsModel[], any>> => {
        return await request.get<TransactionsModel[]>("/defaulttransactionid")
    },
    getTransactionGroupById: async (id: number): Promise<AxiosResponse<TransactionGroupModel>> => {
        return await request.get<TransactionGroupModel>(`/transactiongroup/${id}`)
    },
    deleteTransactionGroup: async (id: number | undefined): Promise<AxiosResponse<TransactionGroupModel, any>> => {
        return await request.delete<TransactionGroupModel>(`/transactiongroup/${id}`);
    },
    deleteTransactionChargeDetail: async (id: number): Promise<AxiosResponse<any, any>> => {
        return await request.delete<any>(`/transactiongroup/deletetransactionchargedetail/${id}`);
    },
    changeTransactionGroupStatus: async (model: TransactionGroupChangeStatus): Promise<AxiosResponse<TransactionGroupModel, any>> => {
        return await request.post<TransactionGroupModel>(`/transactiongroup/status-change`, model);
    },
    saveOrUpdateTransactionGroup: async (institution: TransactionGroupModel): Promise<AxiosResponse<TransactionGroupModel, any>> => {
        return await request.post<TransactionGroupModel>(`/transactiongroup`, institution);
    },
    getAllActiveTransactionGroup: async (): Promise<AxiosResponse<TransactionGroupModel[], any>> => {
        return await request.get<TransactionGroupModel[]>("/transactiongroup/active-transactiongroup")
    },
    getAllTransactionsByUsage: async (usage: string, institutionId: string): Promise<AxiosResponse<TransactionUsageModel[], any>> => {
        return await request.post<TransactionUsageModel[]>("/defaulttransactionid/usage", { transUsage: usage, transactionId: "", institutionId: institutionId })
    },
    getDefaultTransactionIdByInstitutionId: async (institutionId: string): Promise<AxiosResponse<TransactionsModel[], any>> => {
        return await request.get<TransactionsModel[]>(`/defaulttransactionid/institution/${institutionId}`)
    },
}