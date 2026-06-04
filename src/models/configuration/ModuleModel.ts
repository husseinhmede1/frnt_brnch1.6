export interface ApiUrlModel {
    apiCode?:    string;
    apiUrl:      string;
    apiFunction?: string;
}

/** Flat activity permission entry returned by /v1/lookup/modules/user */
export interface ActivityPermissionModel {
    activityId:    number;
    activityCode:  string;
    activityDesc:  string;
    isMenu?:       string;
    hasScreen?:    string;
    accessView:    string;
    accessAdd:     string;
    accessUpdate:  string;
    accessDelete:  string;
    accessChecker?: string;
    urls?:         ApiUrlModel[];
}
