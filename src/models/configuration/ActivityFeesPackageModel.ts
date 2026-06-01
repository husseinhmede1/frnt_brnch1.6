import { NumberLiteralType } from "typescript";

export class ActivityFeesPackageModel {
  packageName!: string;
  institutionId!: string;
  packageId!: string;
  updateFlag!: string;
}

export class ActivityFeesRecordModel {
  isEdit?: boolean
  chargeMethod!: string;
  cardSchemeId!: string;
  currencyId!: number;
  startDate!: Date;
  endDate!: Date;
  amount!: number;
  transactionId!: string;
  minAmount!: number;
  maxAmount!: number;
  transactionGroupId!: number;
  issuerId!: number;
  chargeMethodId!: number;
  currencyCode!: string;
  currencyCodeId!: number;
  fixAmount!: number;
  packageDetailId!: number;
  packageId!: string;
  percentageAmount!: number;
  schemeId!: number;
  tips!: string;
  tranGroupId!: number;
  tranId!: string;
  cardScheme!: string;
  chargeMethodName!: string;
  chargeMethodCodeDescription!: string;
  issuer!: string;
  status!: string;
  tranGroupName!: string;
  tranName!: string;
  chargeMethodCodePrefix!: string;
  chargeMethodCodeSuffix!: string;
  chargeMethodCodeValue!: string;
  chargeMethodSystemCodeId!: number;
}

export class ActivityFeesPackage {
  recordSeqId!: number;
  institutionId!: string;
  institutionName!: string;
  packageId!: string;
  packageName!: string;
  toggel!: boolean;
  status!: string;
}

export class ActivityFeesPackageSorted {
  institutionId!: string;
  institutionName!: string;
  packageId!: string;
  packageName!: string;
  status!: string;
}

export class ActivityFeesPackageChangeStatus {
  idString!: string;
  status!: string;
}

export class ActivityFeesPackageDefinationModel {
  chargeMethodId!: number;
  chargeMethodCodeDescription!: string;
  chargeMethodCodePrefix!: string;
  chargeMethodCodeSuffix!: string;
  chargeMethodCodeValue!: string;
  chargeMethod!: string;
  chargeMethodSystemCodeId!: number;
  currencyCode!: string;
  currencyCodeId!: number;
  endDate!: string;
  fixAmount!: number;
  maxAmount!: number;
  minAmount!: number;
  packageDetailId!: number;
  packageId!: string;
  percentageAmount!: number;
  schemeId!: number;
  startDate!: string;
  tips!: string;
  tranGroupId!: number;
  tranId!: string;
  cardScheme!: string;
  cardSchemeId!: string;
  chargeMethodName!: string;
  issuer!: string;
  issuerId!: number;
  status!: string;
  tranGroupName!: string;
  tranName!: string;
}

export class ActivityFeesPackageChargeModel {
  activityPackageDetailId!: number;
  activityPackageTierId!: number;
  frequencyCodeDescription!: string;
  frequencyCodePrefix!: string;
  frequencyCodeSuffix!: string;
  frequencyCodeValue!: string;
  frequencySystemCodeId!: number;
  fixAmount!: number;
  frequencyId!: number;
  percentageAmount!: number;
  startAmount!: number;
  uptoAmount!: number;
  volumeCountApplied!: number;
}

export class ActivityFeesChargeDetailModel {
  id!: number;
  activityPackageTierId!: number;
  frequencyCodeDescription!: string;
  frequencyCodePrefix!: string;
  frequencyCodeSuffix!: string;
  frequencyCodeValue!: string;
  frequencySystemCodeId!: number;
  fixAmount!: number;
  frequency!: string;
  frequencyId!: number;
  packageDetailId!: number;
  percentageAmount!: number;
  startAmount!: number;
  uptoAmount!: number;
  volumeCountApplied!: number;
}

export class IFrequency {
  frequencyId!: number;
  frequency!: string;
}

export class IChargeMethod {
  chargeMethodId!: number;
  chargeMethod!: string;
}

export class IIssuer {
  description!: string;
  institutionId!: string;
  issuerId!: number;
  issuerRelation!: IIssuerRelation[];
  profile!: string;
}

export class IIssuerRelation {
  issuerRelationId!: number;
  panFrom!: string;
  panTo!: string;
}

export class NoNActivityFeesPackageDefinationModel {
  recordSeqId!: number;
  amount!: number;
  assignedTransactionDescription!: string;
  assignedTransactionId!: string;
  cardSchemeId!: string;
  cardSchemeName!: string;
  chargeCount!: string;
  chargeFirstTransaction!: string;
  chargeTypeMasterId!: number;
  chargeTypeMasterName!: string;
  chargeTypeCodeDescription!: string;
  chargeTypeCodePrefix!: string;
  chargeTypeCodeSuffix!: string;
  chargeTypeCodeValue!: string;
  chargeTypeSystemCodeId!: number;
  currencyCode!: string;
  currencyId!: number;
  currencyName!: string;
  endDate!: string;
  frequency!: string;
  frequencyId!: number;
  frequencyCodeDescription!: string;
  frequencyCodePrefix!: string;
  frequencyCodeSuffix!: string;
  frequencyCodeValue!: string;
  frequencySystemCodeId!: number;
  institutionId!: string;
  institutionName!: string;
  maxAmount!: number;
  numberOfInstallments!: number;
  packageDetailsId!: number;
  packageId!: string;
  packageLine!: number;
  packageName!: string;
  startDate!: string;
  status!: string;
  terminalType!: string;
  terminalTypesId!: number;
}

export class NoNActivityFeesRecordModel {
  isEdit?: boolean
  amount!: number;
  assignedTransactionId!: string;
  // cardSchemeId!: string;
  chargeCount!: string;
  chargeFirstTransaction!: string;
  chargeTypeCodeDescription!: string;
  chargeTypeCodePrefix!: string;
  chargeTypeCodeSuffix!: string;
  chargeTypeCodeValue!: string;
  chargeTypeSystemCodeId!: number;
  chargeMasterId!: number;
  currencyId!: number;
  endDate!: Date;
  frequencyId!: number;
  frequencyCodeDescription!: string;
  frequencyCodePrefix!: string;
  frequencyCodeSuffix!: string;
  frequencyCodeValue!: string;
  frequencySystemCodeId!: number;
  institutionId!: string;
  maxAmount!: number;
  numberOfInstallments!: number;
  packageDetailsId!: number;
  packageId!: string;
  packageLine!: number;
  startDate!: Date;
  terminalTypeId!: number;
}

export class ChargeTypeMaster {
  chargeTypeMasterId!: number;
  chargeTypeMasterName!: string;
}
