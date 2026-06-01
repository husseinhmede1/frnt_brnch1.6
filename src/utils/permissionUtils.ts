import { LOCALSTORAGE_KEYS, getLocalStorage } from "./helper";

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
 * Look up a user's permissions for a given activity code from the
 * modules tree stored in localStorage after login.
 * Searches all levels: module → subModule → subModule (3 levels deep).
 */
export function getActivityPermissions(activityCode: string): ActivityPermissions {
    try {
        const raw = getLocalStorage(LOCALSTORAGE_KEYS.MODULES);
        if (!raw) return DEFAULT;

        const modules: any[] = JSON.parse(raw);

        for (const module of modules) {
            const found = findInModule(module, activityCode);
            if (found) return toPerms(found);
        }
    } catch {
        /* localStorage unavailable or corrupt — fail silently */
    }
    return DEFAULT;
}

function findInModule(module: any, activityCode: string): any {
    // direct activities under this module
    const act = module.activities?.find((a: any) => a.activityCode === activityCode);
    if (act) return act;

    // recurse into subModules
    for (const sub of (module.subModule ?? [])) {
        const found = findInModule(sub, activityCode);
        if (found) return found;
    }
    return null;
}

function toPerms(act: any): ActivityPermissions {
    return {
        accessView:    act.accessView    ?? "0",
        accessAdd:     act.accessAdd     ?? "0",
        accessUpdate:  act.accessUpdate  ?? "0",
        accessDelete:  act.accessDelete  ?? "0",
        accessChecker: act.accessChecker ?? "0",
    };
}
