import { NavLink, Outlet } from "react-router-dom";
import {
  HiHome,
  HiShoppingBag,
  HiClipboardList,
  HiCog,
  HiMenu,
  HiX,
} from "react-icons/hi";
import { useState } from "react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { to: "/admin", icon: <HiHome className="h-5 w-5" />, label: "Dashboard", end: true },
    { to: "/admin/products", icon: <HiShoppingBag className="h-5 w-5" />, label: "Products" },
    { to: "/admin/categories", icon: <HiCog className="h-5 w-5" />, label: "Categories" },
    { to: "/admin/orders", icon: <HiClipboardList className="h-5 w-5" />, label: "Orders" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-primary-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <HiX className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            ← Back to Store
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b bg-white">
          <button onClick={() => setSidebarOpen(true)}>
            <HiMenu className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-bold">Admin Panel</h2>
        </div>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
