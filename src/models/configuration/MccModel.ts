import { PageSearchRequestModel } from "./PageRequestModel";

export class MccModel {
  mccId!: number;
  cardSchemeId!: string;
  cardSchemeName!: string;
  mcc!: string;
  merchantTypeId!: number;
  merchantType!: string;
  description!: string;
  merchantTypeCodeDescription!: string;
  merchantTypeCodePrefix!: string;
  merchantTypeCodeSuffix!: string;
  merchantTypeCodeValue!: string;
  merchantTypeSystemCodeId!: number;
}

export class MccSearchRequestModel extends PageSearchRequestModel {
  description!: string;
}
