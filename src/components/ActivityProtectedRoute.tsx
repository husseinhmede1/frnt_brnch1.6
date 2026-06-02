import { Navigate } from "react-router-dom";
import { LOCALSTORAGE_KEYS, getLocalStorage } from "../utils/helper";
import { getActivityPermissions } from "../utils/permissionUtils";

type AccessType = "view" | "add" | "update" | "delete";

interface Props {
    activityCode: string;
    accessType?: AccessType;  // defaults to "view"
    children: React.ReactNode;
}

/**
 * Wraps a route with two checks:
 * 1. User must be authenticated (has a token).
 * 2. User must have the required access type for the given activity code.
 *    - List pages      → accessType="view"   (default)
 *    - Add/new pages   → accessType="add"
 *    - Edit pages      → accessType="update"
 * Redirects to /unauthorised-access if either check fails.
 */
const ActivityProtectedRoute = ({ activityCode, accessType = "view", children }: Props) => {
    const raw = getLocalStorage(LOCALSTORAGE_KEYS.USER);
    const loginUser = raw ? JSON.parse(raw) : null;

    if (!loginUser?.token) {
        return <Navigate to="/" replace />;
    }

    const perms = getActivityPermissions(activityCode);

    const allowed =
        accessType === "view"   ? perms.accessView   === "1" :
        accessType === "add"    ? perms.accessAdd    === "1" :
        accessType === "update" ? perms.accessUpdate === "1" :
        accessType === "delete" ? perms.accessDelete === "1" : false;

    if (!allowed) {
        return <Navigate to="/unauthorised-access" replace />;
    }

    return <>{children}</>;
};

export default ActivityProtectedRoute;
