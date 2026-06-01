import { PageSearchRequestModel } from "../configuration/PageRequestModel";

export class ManualNonActivityTransactionModel extends PageSearchRequestModel {
    cardNumber!: string;
    comments!: string;
    fromTransactionDate!: Date | null;
    institutionId!: string;
    manualNonActivityTransactionId!: number;
    outletId!: string;;
    reversalFlag!: string;
    systemCodeId!: number;
    toTransactionDate!: Date | null;
    transactionAmount!: number;
    transactionCurrencyId!: number;
    transactionDate!: Date | null;
    transactionId!: string
}

export class ManualNonActivityTransactionResponseModel {
      manualNonActivityTransactionId!: number;
      institutionId!: string;
      institutionName!: string;
      transactionId!: string;
      transactionDescription!: string;
      reversalFlag!: string;
      systemCodeId!: number;
      codeSuffix!: string;
      codePrefix!: string;
      codePattern!: string;
      codeValue!: string;
      codeDescription!: string;
      comments!: string;
      entityId!: string;
      entityName!: string;;
      transactionAmount!: number;
      transactionCurrencyId!: number;
      transactionCurrencyCode!: string;
      transactionCurrencyName!: string;
      transactionDate!: Date | null;
      pageNo!: number;
      pageSize!: number;
    }
