export class Institution {
  institutionId!: string;
  institutionName!: string;
  institutionType!: string;
  institutionTypeAlt!: string;
  institutionTypeId!: number;
  status!: string;
  updateFlag!: string;
  institutionTypeCodeDescription!: string;
  institutionTypeCodePrefix!: string;
  institutionTypeCodeSuffix!: string;
  institutionTypeCodeValue!: string;
  institutionTypeSystemCodeId!: number;
  recordSeqId!: number;
  baseCurrency!: string;
  merchantRateUsage!: string;
  weekDay!: string;
  outputDirectory!: string;
  inputDirectory!: string;
  discountReturnOn!: number;
  eodProcessByTxn!: string;
}

export class InstitutionType {
  institutionTypeId?: number;
  institutionType!: string;
}

export class InstituteChangeStatus {
  idString!: string;
  status!: string;
}
