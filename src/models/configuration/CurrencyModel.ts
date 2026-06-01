export class CurrencyModel {
  currencyId!: number;
  currencyCode!: string;
  currencyName!: string;
  currCodeALPHA2!: string;
  currCodeALPHA3!: number;
  currExponent!: string;
  status!: string;
}

export class CurrencyChangeStatus {
  id!: number;
  status!: string;
}
