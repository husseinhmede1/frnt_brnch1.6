export class CurrencyConversionModel {
  currencyConversionId!: number;
  currencyId!: number;
  institutionId!: string;
  institutionName!: string;
  baseCurrencyId!: number;
  roundingRule!: string;
  rateExpression!: string;
  midRateUsed!: string;
}

export class CurrencyConversionGridModel {
  currencyConversionId!: number;
  institutionId!: string;
  institutionName!: string;
  currencyCode!: string;
  currencyName!: string;
  baseCurrencyCode!: string;
  baseCurrencyName!: string;
  roundingRule!: string;
  rateExpression!: string;
  midRateUsed!: string;
}
