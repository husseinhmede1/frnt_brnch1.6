import { Navigate } from "react-router-dom";
import { LOCALSTORAGE_KEYS, getLocalStorage } from "../utils/helper";
import { getActivityPermissions } from "../utils/permissionUtils";

interface Props {
    activityCode: string;
    children: React.ReactNode;
}

/**
 * Wraps a route with two checks:
 * 1. User must be authenticated (has a token).
 * 2. User must have accessView="1" for the given activity code in their modules.
 * Redirects to /unauthorised-access if either check fails.
 */
const ActivityProtectedRoute = ({ activityCode, children }: Props) => {
    const raw = getLocalStorage(LOCALSTORAGE_KEYS.USER);
    const loginUser = raw ? JSON.parse(raw) : null;

    if (!loginUser?.token) {
        return <Navigate to="/" replace />;
    }

    const { accessView } = getActivityPermissions(activityCode);
    if (accessView !== "1") {
        return <Navigate to="/unauthorised-access" replace />;
    }

    return <>{children}</>;
};

export default ActivityProtectedRoute;
