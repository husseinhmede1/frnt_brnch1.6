import { LOCALSTORAGE_KEYS, getLocalStorage } from "./helper";
import { ActivityPermissionModel } from "../models/configuration/ModuleModel";

export interface ActivityPermissions {
    accessView:    string;
    accessAdd:     string;
    accessUpdate:  string;
    accessDelete:  string;
    accessChecker: string;
}

const DEFAULT: ActivityPermissions = {
    accessView: "0", accessAdd: "0", accessUpdate: "0",
    accessDelete: "0", accessChecker: "0",
};

/**
 * Look up a user's permissions for a given activity code.
 * Reads from the flat ActivityPermissionModel[] stored in localStorage
 * after login by /v1/lookup/modules/user.
 */
export function getActivityPermissions(activityCode: string): ActivityPermissions {
    try {
        const raw = getLocalStorage(LOCALSTORAGE_KEYS.MODULES);
        if (!raw) return DEFAULT;

        const activities: ActivityPermissionModel[] = JSON.parse(raw);
        const act = activities.find(a => a.activityCode === activityCode);
        if (!act) return DEFAULT;

        return {
            accessView:    act.accessView    ?? "0",
            accessAdd:     act.accessAdd     ?? "0",
            accessUpdate:  act.accessUpdate  ?? "0",
            accessDelete:  act.accessDelete  ?? "0",
            accessChecker: act.accessChecker ?? "0",
        };
    } catch {
        /* localStorage unavailable or corrupt */
    }
    return DEFAULT;
}

/**
 * Check if a specific API code is available for the given activity.
 * Used to enable/disable individual buttons and dropdowns.
 *
 * Examples:
 *   hasApiAccess('MCC', 'SMCC')       → can the user call the MCC create API?
 *   hasApiAccess('MCC', 'DMCC')       → can the user call the MCC delete API?
 *   hasApiAccess('MCC', 'GACSSCHEME') → should the card-scheme dropdown load?
 */
export function hasApiAccess(activityCode: string, apiCode: string): boolean {
    try {
        const raw = getLocalStorage(LOCALSTORAGE_KEYS.MODULES);
        if (!raw) return false;
        const activities: ActivityPermissionModel[] = JSON.parse(raw);
        const act = activities.find(a => a.activityCode === activityCode);
        return act?.urls?.some(u => u.apiCode === apiCode) ?? false;
    } catch {}
    return false;
}

/**
 * Returns all activities where accessView = "1" — used by the Sidebar
 * to decide which menu items to show.
 */
export function getViewableActivities(): ActivityPermissionModel[] {
    try {
        const raw = getLocalStorage(LOCALSTORAGE_KEYS.MODULES);
        if (!raw) return [];
        const activities: ActivityPermissionModel[] = JSON.parse(raw);
        return activities.filter(a => a.accessView === "1" && a.isMenu === "1");
    } catch {}
    return [];
}
