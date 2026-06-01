import {
    AccountingLedgerModule,
} from "../../models/configuration/AccountingLedgerModule";
import { AxiosResponse } from "axios";
import request from "../request";

export const AccountingLedgerService = {
    getMerchPaymentDateRevert: async (acqInstId: string): Promise<AxiosResponse<AccountingLedgerModule[], any>> => {
        return await request.get<AccountingLedgerModule[]>(`/accounting-ledger/payment-date/${acqInstId}`);
    }
}