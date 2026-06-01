export class PageResponseModel<T> {
    response!: boolean;
    data! : T[];
    totalPages!: number;
    totalRecords!: number;
}