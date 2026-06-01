export class TerminalTypeModel {
    terminalTypesId!: number;
    terminalType!: string;
    makeName!: string;
    makeModel!: string;
    posCapability!: number;
    freeText!: string;
    status!: string;
}

export class TerminalTypeChangeStatusModel {
    id!: number;
    status!: string
}