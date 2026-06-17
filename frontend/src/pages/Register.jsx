import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import { trackEvent } from "../utils/pixel";

const Register = () => {
  const [step, setStep] = useState("register"); // register | otp
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, verifyOTP, resendOTP, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const otpRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const data = await register(name, email, password, phone);
      setUserId(data.userId);
      setStep("otp");
      setResendTimer(60);
      toast.success("OTP sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    const otpStr = otp.join("");
    if (otpStr.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    try {
      setOtpLoading(true);
      await verifyOTP(userId, otpStr);
      trackEvent("CompleteRegistration");
      toast.success("Account verified! Welcome!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      await resendOTP(userId);
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      toast.success("New OTP sent!");
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      setGoogleLoading(true);
      await googleLogin();
      toast.success("Google login successful!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex justify-center mx-auto max-w-[1200px] items-center px-4 py-8">
      <div className="flex flex-col lg:flex-row font-poppins justify-around p-3 lg:p-16 w-full">
        <AnimatePresence mode="wait">
          {step === "register" ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:w-1/2 md:pr-8"
            >
              <h1 className="text-2xl md:text-4xl font-medium text-black/90 !font-poppins pb-5">
                Create Account
              </h1>

              <form onSubmit={handleSubmit} autoComplete="off">
                {error && (
                  <div className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-3 mb-4">
                    <p className="font-semibold text-sm">{error}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1 font-poppins">Full Name*</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm font-poppins"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1 font-poppins">Email Address*</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm font-poppins"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1 font-poppins">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm font-poppins"
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>

                <div className="relative mb-4">
                  <label className="block text-sm text-gray-700 mb-1 font-poppins">Password*</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black pr-10 text-sm font-poppins"
                    placeholder="Min 6 characters"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-9 text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1 font-poppins">Confirm Password*</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm font-poppins"
                    placeholder="Re-enter password"
                    required
                  />
                </div>

                <label className="flex items-start gap-2 mb-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 text-black border-gray-300 rounded focus:ring-black"
                    required
                  />
                  <span className="text-sm text-gray-600 font-poppins">
                    I agree to the{" "}
                    <a href="#" className="underline hover:text-black">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-black">Privacy Policy</a>
                  </span>
                </label>

                <div className="mt-4">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[rgb(28,0,0)] text-white hover:bg-gray-600 focus:outline-none transition inline-flex items-center justify-center px-5 py-2 text-sm font-poppins uppercase disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      "Register"
                    )}
                  </motion.button>
                </div>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500 font-poppins">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <motion.button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                whileHover={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none transition py-2.5 text-sm font-poppins font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:w-1/2 md:pr-8"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FiCheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl md:text-4xl font-medium text-black/90 !font-poppins pb-2">
                  Verify Email
                </h1>
                <p className="text-sm text-gray-500 mb-6 text-center font-poppins">
                  We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>
                </p>

                {error && (
                  <div className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-3 mb-4 w-full">
                    <p className="font-semibold text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} className="w-full">
                  <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition font-poppins"
                      />
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={otpLoading || otp.join("").length !== 6}
                    whileHover={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[rgb(28,0,0)] text-white hover:bg-gray-600 focus:outline-none transition inline-flex items-center justify-center px-5 py-2 text-sm font-poppins uppercase disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  >
                    {otpLoading ? "Verifying..." : "Verify"}
                  </motion.button>
                </form>

                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500 font-poppins">Didn't receive the code? </span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className={`text-sm font-medium font-poppins ${
                      resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-black underline hover:text-gray-700"
                    }`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                  </button>
                </div>

                <button
                  onClick={() => { setStep("register"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700 font-poppins underline"
                >
                  Back to Register
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden lg:block border-r w-2 border-gray-200 h-80 self-center"></div>

        <motion.div
          className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-4xl font-medium text-black/90 !font-poppins pb-5">
            Already Have an Account?
          </h1>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed font-poppins">
            Welcome back! Sign in to access your account, track your orders, and enjoy a personalized shopping experience.
          </p>
          <Link to="/login">
            <motion.button
              whileHover={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[rgb(28,0,0)] text-white hover:bg-gray-600 focus:outline-none transition inline-flex items-center justify-center px-5 py-2 text-sm font-poppins uppercase"
            >
              LogIn
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
