export class RoleModel {
  roleId!: number;
  roleName!: string;
  roleDesctription!: string;
  status!: string | boolean;
}

/* Role get response model */
export class API {
  apiCode!: string;
  apiDesc!: string;
  apiId!: number;
  apiUrl!: string;
  enabled!: string;
}
export class ActivityAPI {
  accessRight!: string;
  activityApiId!: number;
  api!: API;
  customValidator!: string;
  isRestricted!: string;
  stp!: string;
}

export class Activity {
  accessAdd!: string;
  accessDelete!: string;
  accessUpdate!: string;
  accessView!: string;
  accessChecker!: string;
  activityApi!: ActivityAPI[];
  activityCode!: string;
  activityDesc!: string;
  activityId!: number;
  activityMode!: string;
  activityType!: string;
  hasScreen!: string;
  instId!: number;
  instName!: string;
  isMenu!: string;
  parentActivityDesc!: string;
  parentActivityId!: number;
}
export class roleActivities {
  accessAdd?: string;
  accessDelete?: string;
  accessUpdate?: string;
  accessView?: string;
  accessChecker?: string;
  activity?: Activity;
  roleActivityId?: number;
}
export class RoleMainModel {
  instId!: string| null;
  instName!: string | null;
  roleActivities!: roleActivities[];
  roleDesc!: string;
  roleId!: number;
  roleName!: string;
  status!: string|boolean;
  isSystemAdminRole!: boolean;
}