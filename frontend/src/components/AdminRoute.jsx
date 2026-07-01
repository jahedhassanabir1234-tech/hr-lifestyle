import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth") === "true";
    const hrUser = localStorage.getItem("hr-user");
    setIsAuth(adminAuth && hrUser);
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
