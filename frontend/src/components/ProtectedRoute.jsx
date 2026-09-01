import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function ProtectedRoute({
  allowedRoles,
}) {

  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          color: "#64748b",
        }}
      >
        Checking authentication...
      </div>
    );

  }


  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {

    if (
      user.role ===
      "employee"
    ) {

      return (
        <Navigate
          to="/employee/dashboard"
          replace
        />
      );

    }


    if (
      user.role ===
      "agent"
    ) {

      return (
        <Navigate
          to="/agent/dashboard"
          replace
        />
      );

    }


    if (
      user.role ===
      "admin"
    ) {

      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );

    }

  }


  return <Outlet />;
}


export default ProtectedRoute;