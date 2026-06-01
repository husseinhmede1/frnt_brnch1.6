export class PageSearchRequestModel {        
    pageNo!: number;
    pageSize!: number;
    sort!: PageSearchSortModel[];       
}

export class PageSearchSortModel {
    column!: string;
    sortOrder!: string;
}