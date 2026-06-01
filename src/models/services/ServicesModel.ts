export class ServiceModel {
    serviceId!: number;
    serviceName!: string;
    status!: boolean;
}

export class PaginationRequestDto {
  offset!: string;
  pageSize!: string;   
  sortBy?: string;     
  asc?: string;       
}

export class ServiceChangeStatusModel {
    serviceId!: number;
    paginationRequestDto!:PaginationRequestDto;
}

export class DeleteServiceModel {
    serviceId!: number;
    paginationRequestDto!:PaginationRequestDto;
}

export class CreateServiceModel {
  serviceId!:Number;
  serviceName!: string;        
  distributionList?: string;  
  template?: string;         
  status!: string;           
  institutionId!:string;
  icon?: string;
  paginationRequestDto?: PaginationRequestDto;
}

export interface SingleServiceResponseDto {
  serviceId: number;
  serviceName: string;
  distributionList: string;
  template: string;
  status: string;
  actionKey:string;
  icon?: string;
}