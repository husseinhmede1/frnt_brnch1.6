export interface PendingActivityModel {
    pendingActivityId: number;
    apiDesc:           string;
    apiUrl:            string;
    status:            string;
    notes?:            string;
    instId?:           string;
    clazz?:            string;
    method?:           string;
    createdDate:       string;
    createdById?:      number;
    createdByUsername: string;
}

export interface PendingActivitySearchRequest {
    offset:    number;
    pageSize:  number;
    status?:   string;
    apiId?:    number;
    fromDate?: string;   // YYYY-MM-DD
    toDate?:   string;   // YYYY-MM-DD
}

export interface PageablePendingActivityResponse {
    pendingActivities:    PendingActivityModel[];
    paginationResponseDto: {
        pageNumber:          number;
        pageSize:            number;
        totalNumberOfRecords: number;
    };
}
