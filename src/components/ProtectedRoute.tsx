import { Navigate } from "react-router-dom";
import { LOCALSTORAGE_KEYS } from "../utils/helper";

const ProtectedRoute = ({ children }: any) => {
  const loginUser = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.USER) as string);
  const accessToken = loginUser ? loginUser.token : null;

  if (accessToken == null) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
