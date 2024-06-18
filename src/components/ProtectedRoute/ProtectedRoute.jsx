import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute(props) {
  if (localStorage.getItem("accessToken")) {
    return props.children;
  } else {
    return <Navigate to={"/"} />;
  }
}

export default ProtectedRoute;
