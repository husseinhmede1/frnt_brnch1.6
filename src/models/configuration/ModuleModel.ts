export interface UrlModel {
    url: string;
    isMenu?: string;
}

export interface ActivityModel {
    activityId: number;
    activityCode: string;
    activityDesc?: string;
    isMenu?: string;
    hasScreen?: string;
    subMenu?: string;
    url?: UrlModel[];
    accessView: string;
    accessAdd: string;
    accessUpdate: string;
    accessDelete: string;
    accessChecker?: string;
}

export interface ModuleActivityModel {
    moduleId: number;
    moduleDesc: string;
    activities: ActivityModel[];
    subModule: ModuleActivityModel[];
}
