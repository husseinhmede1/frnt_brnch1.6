import { PageSearchRequestModel } from "../configuration/PageRequestModel";

export class MerchantTransactionListingModel {
    authorizationNumber!: string;
    cardNumber!: string;
    cardSeqNbr!: number;
    codeDescription!: string;
    codePattern!: string;
    codePrefix!: string;
    codeSuffix!: string;
    codeValue!: string;
    comments!: string;
    entityId!: string;
    entityName!: string;
    expiryDate!: string;
    institutionId!: string;
    institutionName!: string;
    merchantTransactionId!: number;
    pan!: string;
    reversalFlag!: string;
    systemCodeId!: number;
    terminalId!: number;
    tipsAmount!: number;
    tipsCurrencyCode!: string;
    tipsCurrencyId!: number;
    tipsCurrencyName!: string;
    transactionAmount!: number;
    transactionCurrencyCode!: string;
    transactionCurrencyId!: number;
    transactionCurrencyName!: string;
    transactionDate!: string;
    transactionDescription!: string;
    transactionId!: string
}

export class MerchantTransactionDefinitionModel {
  authorizationNumber!: string;
  cardNumber!: string;
  cardSeqNbr!: number;
  comments!: string;
  expiryDate!: Date | null;
  institutionId!: string;
  merchantTransactionId!: number;
  outletId!: string;
  pan!: string;
  reversalFlag!: string;
  systemCodeId!: number | string;
  terminalId!: number;
  tipsAmount!: number;
  tipsCurrencyId!: number;
  transactionAmount!: number;
  transactionCurrencyId!: number;
  transactionDate!: Date | null;
  transactionId!: string
}

export class MerchantTransactionFilterModel extends PageSearchRequestModel {
  authorizationNumber!: string;
  cardNumber!: string;
  cardSeqNbr!: number;
  comments!: string;
  expiryDate!: string;
  fromTransactionDate!: Date | null;
  institutionId!: string;
  merchantTransactionId!: number;
  outletId!: string;
  pan!: string;
  reversalFlag!: string;
  systemCodeId!: number;
  terminalId!: number;
  tipsAmount!: number;
  tipsCurrencyId!: number;
  toTransactionDate!: Date | null;
  transactionAmount!: number;
  transactionCurrencyId!: number;
  transactionDate!: string;
  transactionId!: string
}


