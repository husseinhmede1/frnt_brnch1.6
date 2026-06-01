export interface BlockedIpResponse {
    id: number;
    ipAddress: string;
    blockedAt: string;
}

export class PaginationRequestDto {
  offset!: string;
  pageSize!: string;   
  sortBy?: string;     
  asc?: string;       
}
