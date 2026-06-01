import {IssRelation} from "./IssuerRelationModel";
import {PaginationRequestModel} from "./PaginationRequestModel";
export class PageableIssuerRelationModel {
    issuerRelationResponseDto!: IssRelation[];
    paginatedResponseDto!: PaginationRequestModel;
}