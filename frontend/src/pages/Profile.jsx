import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiMapPin,
  FiEdit3,
  FiLogOut,
  FiPackage,
  FiHome,
  FiChevronRight,
} from "react-icons/fi";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [state, setState] = useState(user?.address?.state || "");
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || "");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = {
        name,
        email,
        phone,
        address: { street, city, state, zipCode, country: "Bangladesh" },
      };
      if (password) userData.password = password;
      await updateProfile(userData);
      toast.success("Profile updated!");
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-poppins">
        <FiHome className="h-3.5 w-3.5" />
        <span onClick={() => navigate("/")} className="cursor-pointer hover:text-gray-600 transition">Home</span>
        <FiChevronRight className="h-3 w-3" />
        <span className="text-gray-700">My Account</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          {/* User Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-6 text-center">
            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold font-poppins border-2 border-white/30">
              {getInitials(user?.name)}
            </div>
            <h2 className="text-white font-poppins font-semibold mt-3 text-lg">
              {user?.name || "User"}
            </h2>
            <p className="text-white/70 text-xs font-poppins mt-1">
              {user?.email}
            </p>
            {user?.phone && (
              <p className="text-white/70 text-xs font-poppins mt-0.5">
                {user?.phone}
              </p>
            )}
            <span className="inline-block mt-2 px-3 py-0.5 bg-primary/20 text-primary text-[10px] font-semibold rounded-full font-poppins uppercase tracking-wider">
              {user?.role === "admin" ? "Admin" : "Member"}
            </span>
          </div>

          {/* Menu */}
          <div className="p-3">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-poppins transition ${
                activeTab === "profile"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiUser className="h-4 w-4" />
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-poppins text-gray-600 hover:bg-gray-50 transition"
            >
              <FiPackage className="h-4 w-4" />
              My Orders
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-poppins transition ${
                activeTab === "address"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiMapPin className="h-4 w-4" />
              Address
            </button>

            <div className="my-2 border-t border-gray-100"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-poppins text-red-500 hover:bg-red-50 transition"
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {activeTab === "profile" ? (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiEdit3 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-poppins font-semibold text-gray-800">Edit Profile</h2>
                  <p className="text-xs text-gray-400 font-poppins">Update your personal information</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5 font-poppins">
                      <FiUser className="h-3.5 w-3.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5 font-poppins">
                      <FiMail className="h-3.5 w-3.5" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5 font-poppins">
                      <FiPhone className="h-3.5 w-3.5" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                      placeholder="+880 ..."
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5 font-poppins">
                      <FiLock className="h-3.5 w-3.5" /> New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiMapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-poppins font-semibold text-gray-800">Shipping Address</h2>
                  <p className="text-xs text-gray-400 font-poppins">Manage your delivery address</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5 font-poppins">
                    <FiMapPin className="h-3.5 w-3.5" /> Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="input-field"
                    placeholder="House no, road, area"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 font-poppins">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-field"
                      placeholder="e.g. Dhaka"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 font-poppins">State / Division</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="input-field"
                      placeholder="e.g. Dhaka"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 font-poppins">Zip Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="input-field"
                      placeholder="e.g. 1207"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
