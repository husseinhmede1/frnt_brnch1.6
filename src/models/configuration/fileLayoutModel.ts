export class FileLayoutModel {
    fileId!: number;
    fileName!: string;
    fileType!: string;
    fileTypeDescription!: string;
    status!: string;
}

export class InputOutputLayoutModel {
    fileId!: number;
    fileName!: string;
    fileTypeCode!: string;
    fileTypeId!: string;
    status!: string;
}

export class FileElementModel {
    fileElementResponseDto!: FileElementResponseModel[];
    fileId!: number;
    fileName!: string
}

export class FileEcomModel {
    fileId!: number;
    fileName!: string;
    createdBy!: number;
    createdDate!: string;
}

export class FileElementResponseModel {
    validationFormat?: string;
    validationLength!: number;
    validationRequired?: string;
    detailsFlag!: string;
    detailsId!: number;
    elementId!: number;
    elementName!: string;
    elementLength!: number;
    elementOrder!: number;
    elementParentId!: number;
    elementSection!: string;
    paddingType!: string;
    paddingValue!: string;
    isMandatory!: string;
    isRepeated?: string;
}

export class InputOutputModel {
    fileId!: number;
    fileName!: string
    fileElementResponseDto!: InputOutputResponseModel[];
}

export class InputOutputResponseModel {
    elementId!: number;
    elementName!: string;
    elementSection!: string;
    validationRequired?: string;
    isMandatory!: string;
    validationLength!: number;
    validationFormat?: string;
}

export class FileResponseDto {
    fileId!: number;
    fileName!: string;
    fileTypeCode!: string;
    fileTypeId!: number;
    status!: string;
}

export class LayoutModel {
    fileResponseDto!: FileResponseDto;
    instId!: number;
    instName!: string;
    layoutFormat!: string;
    layoutFormatDesc!: string;
    includesHeader!: boolean;
    layoutId!: number;
    layoutName!: string;
    layoutSeparator!: string;
    layoutType!: string;
    listLayoutDetailsResponse!: layoutDetailsResponseModel[];
    status!: string;
}

export class layoutDetailsResponseModel {
    detailsFlag!: string;
    detailsId!: number;
    elementId!: number;
    elementLength!: number;
    elementName!: string;
    elementOrder!: number;
    elementPaddingType!: string;
    elementPaddingValue!: string;
    elementParentId!: number;
    elementParentName!: string;
    elementSection!: string;
    validationFormat?: string;
    validationLength!: number;
    validationRequired?: string;
}