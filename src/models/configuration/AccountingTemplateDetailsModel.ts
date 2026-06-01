export class AccountingTemplateDetailsModel {
    acctTemplateDtlId   !: number;
    institutionId!: string;
    acctTemplateHdrId!: number;
    transId!: string;
    accountOrigin!: string;
    destinationInstitution!: string;
    destinationInstitutionName!: string;
    accountType!: string;
    amountType!: string;
    percentageApplied!: number;
    signFlag!: string;
    lineDescription!: string;
    bankCode!: string;
    bankDesc!: string;
    percentSrc!: string;
    show!: number;  
}

export class AccountingTemplateSubHeader {
    acctTemplateHdrId!: number;
    acctTemplateHdrSubId!: number;
    bankCode!: string;
    institutionId!: string;
    tenplateDescription!: string
    templateCode!: string;
}