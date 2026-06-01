export default class ScopeModel {
    scopeAbbrev!: string;
    scopeDesc!: string;
    scopeId!: number;
    scopeStatus!: string;
  }

  export class ApiModel {
    objectName!: string;
    scopeAbbrev!: string;
    scopeId!: number;
  }

  export class API{
    apiCode!: string;
    apiDesc!: string;
    apiId!: number;
    apiUrl!: string;
    enabled!: string
  }

  
  export class APIListModel {
    api!: API;
    apiDescription!: string;
    apiFunction!: string;
    apiId!: number;
    apiObject!: string;
    apiUrl!: string;
    instId!: number;
    instName!: string;
    scope!: ScopeModel;
    stp!: string
  }