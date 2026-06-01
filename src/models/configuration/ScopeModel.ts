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
    apiId!: number;
    apiCode!: string;
    apiUrl!: string;
    apiObject!: string;
    apiFunction!: string;
    apiDesc!: string;
    enabled!: string;
    instId!: number;
    stp!: string;
  }