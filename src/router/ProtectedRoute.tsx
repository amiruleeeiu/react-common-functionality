// src/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, userRoles, token } = useAuth();

  console.log(token);

  if (isLoading) {
    // show loading only while checking auth
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.some((role) => userRoles.includes(role))
  ) {
    return <div className="text-center p-4">unauthorized...</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
