export class SystemCodeModel {
    systemCodeId!: number;
    codeSuffix!: string;
    codePrefix!: string;
    codePattern!: string;
    codeValue!: string;
    description!: string;
    institutionId!: string;
    institutionName!: string;
    status!: string;
    systemCodeHeaderId!: number;
}

export class SystemHeaderCode {
    codePattern!: string;
    codePrefix!: string;
    description!: string;
    maxSuffixLength!: number;
    systemCodeHeaderId!: number;
    userFlag!: string;
}

export class SystemHeaderCodeResponse {
    codePrefix!: string;
    codeSuffix!: string;
    codeValue!: string;
    description!: string;
    institutionId!: string;
    institutionName!: string;
    status!: string;
    systemCodeHeaderId!: number;
    systemCodeId!: string;
}