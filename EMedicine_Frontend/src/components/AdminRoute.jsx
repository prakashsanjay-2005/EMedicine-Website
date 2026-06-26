import { Navigate } from "react-router-dom";
import { getRole } from "../services/auth";

function AdminRoute({ children }) {
  const role = getRole();

  if (role !== "Admin") {
    return <Navigate to="/medicines" />;
  }

  return children;
}

export default AdminRoute;