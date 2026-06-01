import { PageSearchRequestModel } from "../configuration/PageRequestModel";

export class EntityMainInfoModel {
  companyRegistratioNo!: string;
  companyVATNo!: string;
  bankCode!: string;
  accountNo!: string;
  iban!: string;
  contractDate!: Date;
  expectedStartDate!: Date;
  actualStartDate!: Date;
  terminationDate!: Date;
  lastTransDate!: Date;
  associatedPayment!: string;
  paymentMethodId!: number;
  paymentFrequencyId!: number;
  addValueDate!: Date;
  statementTypeId!: Date;
  salesManId!: number;
  employeeInChargeId!: number;
  estatementToEntity!: string;
}

export class PaymentAccountModel {
  accountNumber!: number;
  iban!: string;
  bankCodeId!: number;
  bankCode!: string;
  settlementCurrencyId!: number;
  transferCurrencyId!: number;
  currencyMarkup!: number;
  paymentAccountId!: number;
  settlementCurrencyName!: string;
  entityId!: string;
  institutionId!: string;
  transferCurrencyName!: string;
  branch!: string;
  beneficiaryName!: string;
}

export class TerminalModel {
  terminalId!: string;
  terminalTypeId!: number;
  eCommerceFlag!: string;
  actualStartDate!: Date;
  terminationDate!: Date;
  serialNumber!: string;
  institutionId!: string;
  currencyId!: number;
  mccId!: string;
  status!: string;
  entityId!: string;
  terminalTypesId!: number;
  terminalTypes!: string;
  institutionName!: string;
  currencyCode!: string;
  currencyName!: string;
  mcc!: string;
  entityName!: string;
  updateFlag!: string;
}

export class TerminalChangeStatus {
  id!: number;
  status!: string;
}

export class TerminalSearchModel extends PageSearchRequestModel {
  entityId!: string;
}

export class BankCodeModel {
  bankCodeId!: number;
  bankCode!: string;
  altBankName!: string;
  bankName!: string;
  institutionId!: string;
}

export class ContactGridModel {
  contactId!: number;
  firstName!: string;
  lastName!: string;
  middleName!: string;
  professionalTitle!: string;
  receiveEstatement!: string;
}

export class ContactDefinationModel {
  entityId!: string;
  contactId!: number;
  address1!: string;
  address2!: string;
  address3!: string;
  address4!: string;
  addressId!: number;
  cityId!: number;
  cntryId!: number;
  emailAddress1!: string;
  emailAddress2!: string;
  fax!: string;
  firstName!: string;
  freeText1!: string;
  freeText2!: string;
  geoCode!: string;
  institutionId!: string;
  lastName!: string;
  middleName!: string;
  mobile1!: string;
  mobile2!: string;
  phone!: string;
  phone1!: string;
  phone2!: string;
  phoneExternal!: string;
  postalCodeZip!: string;
  professionalTitle!: string;
  receiveEstatement!: string;
  url!: string;
}

export class CityByCountryIdModel {
  cityAbbrev!: string;
  cityId!: number;
  cityName!: string;
  cityNameAlt!: string;
}

export class EntityListModel {
  entityId!: string;
  entityName!: string;
  dbaName!: string;
  businessTypeId!: number;
  businessType!: string;
  businessTypeCodeDescription!: string;
  businessTypeCodePrefix!: string;
  businessTypeCodeSuffix!: string;
  businessTypeCodeValue!: string;
  businessTypeSystemCodeId!: number;
  entityLevelId!: number;
  hierarchyLevel!: number;
  parentId!: string;
  parentName!: string;
  entityNameAlt!: string;
  dbaNameAlt!: string;
  entityStatus!: string;
  onHoldInd!: string;
  hotMerchantFlag!: string;
  activityPackageId!: string;
  activityPackageName!: string;
  nonActivityPackageId!: string;
  nonActivityPackageName!: string;
  companyRegisterNBR!: string;
  companyVatNBR!: string;
  bankCodeId!: number;
  bankCodeName!: string;
  bankName!: string;
  defAccountNumber!: string;
  defIBAN!: string;
  contractDate!: string;
  expStartDate!: Date;
  actualStartDate!: Date;
  terminationDate!: Date;
  lastTransDate!: Date;
  associatedPayment!: string;
  paymentMethod!: string;
  paymentFrequency!: string;
  addValueDateDays!: number;
  statementType!: string;
  salesmanId!: number;
  salesmanName!: string;
  employeeIncharge!: number;
  employeeInchargeName!: string;
  estatementToEntity!: string;
  status!: string;
  typeDescription!: string;
}

export class EntityChangeStatusModel {
  idString!: string;
  status!: string;
  institutionId!: string;
}

export class EntityListByLevelModel {
  institutionId!: string;
  entityLevelId?: number;
  entityLevel?: string;
  parentId?: string;   // optional — when provided, filters by parent entity
}

export class EntitySearchRequestModel extends PageSearchRequestModel {
  search!: string;
  institutionId!: string;
}

export class EntityDefinitionModel {
  activityPackageId!: string;
  activityPackageName!: string;
  actualStartDate!: Date;
  addValueDateDays!: number;
  associatedPayment!: string;
  bankCodeId!: number;
  bankCodeName!: string;
  bankName!: string;
  businessType!: string;
  businessTypeId!: number;
  businessTypeCodeDescription!: string;
  businessTypeCodePrefix!: string;
  businessTypeCodeSuffix!: string;
  businessTypeCodeValue!: string;
  businessTypeSystemCodeId!: number;
  companyRegisterNBR!: string;
  companyVatNBR!: string;
  contractDate!: Date;
  dbaName!: string;
  dbaNameAlt!: string;
  defAccountNumber!: string;
  defIBAN!: string;
  employeeIncharge!: number;
  employeeInchargeName!: string;
  entityId!: string;
  entityLevelId!: number;
  entityName!: string;
  entityNameAlt!: string;
  entityStatus!: string;
  estatementToEntity!: string;
  expStartDate!: Date;
  hierarchyLevel!: number;
  hotMerchantFlag!: string;
  lastTransDate!: Date;
  nonActivityPackageId!: string;
  nonActivityPackageName!: string;
  onHoldInd!: string;
  parentId!: string;
  parentName!: string;
  paymentFrequency!: string;
  paymentMethod!: string;
  salesmanId!: number;
  salesmanName!: string;
  statementType!: string;
  terminationDate!: Date;
  institutionId!: string;
  institutionName!: string;
  mccId!: string;
  mccName!: string;
  defSettlementCurrency!: string;
  mobile1!: string;
  phone1!: string;
  status!: string;
  acctTemplateHdrId !: number;
}

export class EntityPayloadModel {
  activityPackageId!: string;
  actualStartDate!: Date;
  addValueDateDays!: number;
  associatedPayment!: string;
  bankCodeId!: number;
  businessTypeId!: number;
  companyRegisterNBR!: string;
  companyVatNBR!: string;
  contractDate!: Date;
  dbaName!: string;
  dbaNameAlt!: string;
  defAccountNumber!: string;
  defIBAN!: string;
  employeeInchargeId!: number;
  entityId!: string;
  entityLevelId!: number;
  entityName!: string;
  entityNameAlt!: string;
  entityStatus!: string;
  estatementToEntity!: string;
  expStartDate!: Date;
  hotMerchantFlag!: string;
  institutionId!: string;
  lastTransDate!: Date;
  mccId!: number;
  nonActivityPackageId!: string;
  onHoldInd!: string;
  parentId!: string;
  paymentFrequency!: string;
  paymentMethod!: string;
  salesmanId!: number;
  statementType!: string;
  terminationDate!: Date;
  defSettlementCurrency!: string;
  status!: string;
}

export class EntityLevelModel {
  entityLevelId!: number;
  generationMethod!: number;
  hierarchyLevel!: number;
  idLength!: number;
  statementFlag!: string;
  typeDescription!: string;
}

export class EntityAddressModel {
  entityId!: string;
  address1!: string;
  address2!: string;
  address3!: string;
  address4!: string;
  addressId!: number;
  cityId!: number;
  cntryId!: number;
  emailAddress1!: string;
  emailAddress2!: string;
  fax!: string;
  freeText1!: string;
  freeText2!: string;
  geoCode!: string;
  institutionId!: string;
  mobile1!: string;
  mobile2!: string;
  phone1!: string;
  phone2!: string;
  phoneExternal!: string;
  postalCodeZip!: string;
  url!: string;
}
export class TransactionsMerchantList {
  merchantName!: string;
}

export class EntitySearchCriteria extends PageSearchRequestModel{
  search!: string| null;
  institutionId!: string| null;
  parentId!: string| null;
  businessTypeId!: string| null;
  mccId!: string| null;
  entityStatus!: string| null;
  entityId!: string| null;
  fromDate!: string| null;
  toDate!: string| null;
  entityLevelId!: string| null;
  entityName!: string| null;
  hotMerchantFlag!: string| null;
  hotMerchantFlagBoolean!:boolean;
}
