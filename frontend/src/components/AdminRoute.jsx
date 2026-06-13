import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-4">Admin panel access requires login.</p>
          <a href="/login" className="btn-primary inline-block">Login as Admin</a>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">You don't have admin permissions.</p>
          <a href="/" className="btn-primary inline-block">Go Back Home</a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
