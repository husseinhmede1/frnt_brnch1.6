export class CountryModel {
  cntryCode !: string;
  cntryCodeAlpha2 !: string;
  cntryCodeAlpha3 !: string;
  cntryId !: number;
  cntryName !: string;
  cntryNameAlt !: string;
  cntryStatus !: string;
  currCode !: string;
  currPattern !: string;
  datePattern !: string;
  economicAreaInd !: string;
  currencyId!: number;
  currencyName!: string;
}

export class CountryStatusModel {
  id!: number;
  status!: string
}