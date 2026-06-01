import { OutputFileTemplateDetailsModel } from "./OutputTemplateDetailsModel";
import { BankFilesOutputModel } from "./BankFilesOutputModel";

export class OutputFileTemplateHdrModel {
    outputTemplateHdrId   !: number;
    institutionId!: string;
    outputFileType!: string;
    outputFileTypeAbbr!: string;
    outputDescription!: string;
    sumPerAccount!: string;
    merchantSubSummary!: string;
    instSubSummary!: string;
    outputFormat!: string;
    separator!: string;
    outputFileTemplateDetailsRequestDtos!: OutputFileTemplateDetailsModel[];
    bankFilesOutputResponseDto !: BankFilesOutputModel;
}

export class OutputFileTemplateHdrModelSorted {
    outputTemplateHdrId   !: number;
    institutionId!: string;
    outputFileType!: string;
    outputFileTypeAbbr!: string;
    outputDescription!: string;
    sumPerAccount!: string;
    merchantSubSummary!: string;
    instSubSummary!: string;
    outputFormat!: string;
    separator!: string;
}