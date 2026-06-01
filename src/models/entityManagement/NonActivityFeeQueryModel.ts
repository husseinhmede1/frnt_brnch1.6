import { PageSearchRequestModel } from "../configuration/PageRequestModel";

export class NonActivityFeeQueryModel {
    nonActivityFeeQueryId!: number;
    microfilmRefNbr!: string;
    refNbrSeq!: number;
    entityId!: string;
    entityName!: string;
    institutionId!: string;
    institutionName!: string;
    transactionId!: string;
    transactionDescription!: string;
    transactionDate!: Date | null;
    transactionAmount!: number;
    transactionCurrencyId!: number;
    transactionCurrencyCode!: string;
    transactionCurrencyName!: string;
    reversalReason!: string;
    manualEntry!: string;
    transDesc!: string;
    processingDate!: Date | null;
    processingRefNbr!: string;
    reason!: string;
    description!: string;
    pageNo!: number;
    pageSize!: number;
}

export class NonActivityFeeQueryFilterModel extends PageSearchRequestModel{
    description!: string;
    entityId!: string;
    fromProcessingDate!: Date | null;
    institutionId!: string;
    manualEntry!: string;
    microfilmRefNbr!: string;
    nonActivityFeeQueryId!: number;
    processingDate!: string;
    processingRefNbr!: string;
    reason!: string;
    refNbrSeq!: number;
    reversalReason!: string;
    toProcessingDate!: Date | null;
    transDesc!: string;
    transactionAmount!: number;
    transactionCurrencyId!: number;
    transactionDate!: string;
    transactionId!: string
}