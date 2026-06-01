export class OutputFileTemplateDetailsModel {
    outputTemplateDtlId   !: number;
    institutionId!: string;
    outputTemplateHdrId!: number;
    fieldSequence!: number;
    fieldSection!:string;
    fieldId!: number;
    description!: string;
    fieldPad!: string;
    fieldPadChar!: string;
    fieldLength!: number;
    // numericMultiply!: number;
    // outputAcctingEntryDesc!: string;
    fieldFormat!: string;
    codePrefix!: string;
    codeSuffix!: string;
    // fieldCustomSyntex!: string;
    fieldCsyntax!: string;
}