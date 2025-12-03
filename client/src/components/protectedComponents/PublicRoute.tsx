import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../redux/store";
import type { ReactNode } from "react";



interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const authData = useSelector((state: Rootstate) => state.authData);
  const { accessToken, role,verificationCheck } = authData;

  // If already logged in, redirect based on role
  if (accessToken) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "trainer"){
      if(verificationCheck) {
        return <Navigate to="/trainer/dashboard" replace/>
      }else {
        return <Navigate to="/trainer/verification" replace />;
      }
      
    } 
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
