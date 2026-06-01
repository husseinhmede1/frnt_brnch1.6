import { PageSearchRequestModel } from "./PageRequestModel";

export class CurrencyRateModel {
    isEdit?: boolean;
    currencyRateId!: number;
    institutionId!: string;
    institutionName!: string;
    currencyId!: number;
    currencyCode!: string;
    currencyName!: string;
    effectiveDate!: string | Date;
    buyRate!: number;
    midRate!: number;
    sellRate!: number;
    recordSeqId!: number;
}

export class CurrencyRateSearchRequestModel extends PageSearchRequestModel {
    fromDate!: string;
    toDate!: string;
}