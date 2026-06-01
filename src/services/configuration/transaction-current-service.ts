import {
    TransactionCurrentModel,
} from "../../models/configuration/TransactionCurrentModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const TransactionCurrentService = {
    getMerchSettlDate: async (acqInstId: string): Promise<AxiosResponse<TransactionCurrentModel[], any>> => {
        return await request.get<TransactionCurrentModel[]>(`/transaction-current/merch-setl-date/${acqInstId}`);
    },
    getMerchPaymentDate: async (acqInstId: string): Promise<AxiosResponse<TransactionCurrentModel[], any>> => {
        return await request.get<TransactionCurrentModel[]>(`/transaction-current/merch-payment-date/${acqInstId}`);
    }
    ,
    getMerchSettleDateRevert: async (acqInstId: string): Promise<AxiosResponse<TransactionCurrentModel[], any>> => {
        return await request.get<TransactionCurrentModel[]>(`/transaction-current/merch-setl-date-revert/${acqInstId}`);
    }
}