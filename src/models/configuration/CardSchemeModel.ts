export class CardSchemeModel {
    recordSequenceNumber!: number;
    cardSchemeId!: string;
    cardSchemeName!: string;
    cardSchemeSpecific!: string;
    status!: string;
}

export class SchemeType {
    schemeSpecificId?: number;
    schemeSpecificName!: string
}

export class CardSchemeChangeStatus {
    id!: number;
    idString!: string;
    status!: string;
    instId?:string;
}