import { AxiosResponse } from "axios";
import { TransactionsModel } from "../../models/entityManagement/TransactionModel";
import { UserChangeStatus } from "../../models/security/UserModel";
import request from "../request";

export const TransactionService = {
    viewDefaultTransactionId: async (): Promise<AxiosResponse<TransactionsModel[], any>> => {
        return await request.get<TransactionsModel[]>(`/defaulttransactionid`);
    },

    addDefaulTransactionId: async (model: TransactionsModel): Promise<AxiosResponse<TransactionsModel, any>> => {
        return await request.post<TransactionsModel>(`/defaulttransactionid`, model);
    },

    getDefaultTransactionId: async (id: string): Promise<AxiosResponse<TransactionsModel, any>> => {
        return await request.get<TransactionsModel>(`/defaulttransactionid/${id}`);
    },

    deleteDefaultTransactionId: async (id: string): Promise<AxiosResponse<any>> => {
        return await request.delete<any>(`/defaulttransactionid/${id}`);
    },

    getInstDefaultTransactionIdByInstitutionId: async (id: String): Promise<AxiosResponse<TransactionsModel[]>> => {
        return await request.get<TransactionsModel[]>(`/defaulttransactionid/inst/${id}`);
    },

    getDefaultTransactionByInstitutionId: async (id: String): Promise<AxiosResponse<TransactionsModel[]>> => {
        return await request.get<TransactionsModel[]>(`/defaulttransactionid/institution/${id}`);
    },

    changeStatus: async (model: UserChangeStatus): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/defaulttransactionid/status-change`, model);
    },

    getDefaultTransactionIdByTransUsage: async (model: any): Promise<AxiosResponse<TransactionsModel[]>> => {
        return await request.post<TransactionsModel[]>(`/defaulttransactionid/usage`, model);
    },

    getDefaultTransactionIdByTransUsageAndInstitutionId: async (model: TransactionsModel, id: number): Promise<AxiosResponse<TransactionsModel[]>> => {
        return await request.post<TransactionsModel[]>(`/defaulttransactionid/usage/${id}`, model)
    }
}