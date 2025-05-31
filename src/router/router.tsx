// src/routes/router.tsx
import { createBrowserRouter } from "react-router-dom";
import UserRagisterContainer from "../components/UserRagisterContainer";
import AdminPage from "../pages/AdminPage";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PublicPage from "../pages/PublicPage";
import Unauthorized from "../pages/Unauthorized";
import UserPage from "../pages/UserPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <PublicPage />,
      },

      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <UserRagisterContainer />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["USER"]} />,
    children: [
      {
        path: "/user",
        element: <UserPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
