import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../redux/store";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
//   allowedRoles?: string[];
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const authData = useSelector((state: Rootstate) => state.authData);
  const { accessToken, } = authData;
    const location = useLocation();

  // If not logged in
  if (!accessToken) {
    // If user tries admin route
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    // Else go to normal login
    return <Navigate to="/login" replace />;
  }

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

  return <>{children}</>;
};

export default PrivateRoute;
