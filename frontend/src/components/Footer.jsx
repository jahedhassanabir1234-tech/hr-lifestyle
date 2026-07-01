import { Link } from "react-router-dom";
import {
  HiPhone,
  HiMail,
  HiLocationMarker,
} from "react-icons/hi";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 font-poppins">
      {/* Main Footer */}
      <div className="bg-[#1d1d1d]">
        <div className="max-w-[1200px] bg-[#1d1d1d] mx-auto grid gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 text-sm">
            <Logo className="w-[140px] h-[60px] brightness-0 invert mx-auto sm:mx-0" />
            <p className="text-base uppercase italic text-white">
              HR-Lifestyle
            </p>
            <p className="text-xs leading-relaxed">
              Your premium destination for fashion, electronics, and lifestyle
              products. Quality guaranteed.
            </p>
            <div className="flex gap-3 flex-wrap">
              {[
                { icon: FaFacebookF, color: "hover:bg-blue-600", href: "https://www.facebook.com/share/184BWCkSRk/" },
                { icon: FaInstagram, color: "hover:bg-pink-600", href: "https://www.instagram.com/hr_life_styl?igsh=MWZ2M2p3anVmNHk3eA==" },
                { icon: FaTiktok, color: "hover:bg-black", href: "https://www.tiktok.com/@mdhridoykhanz?_r=1&_t=ZS-97fckCFm4R6" },
                { icon: FaWhatsapp, color: "hover:bg-green-600", href: "https://wa.me/message/QUMZST6ZN2JOJ1" },
                { icon: FaYoutube, color: "hover:bg-red-600", href: "https://youtube.com/@hrlifestyl?si=5T53gxuxr4w6DR_Y" },
              ].map(({ icon: Icon, color, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white ${color} transition`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-base uppercase italic text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "All Products", to: "/products" },
                { label: "Flash Sale", to: "/flash-sale" },
                { label: "Bundle Products", to: "/bundle-products" },
                { label: "My Cart", to: "/cart" },
                { label: "My Orders", to: "/orders" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-primary transition font-poppins"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-base uppercase italic text-white">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {["Fashion", "Electronics", "Lifestyle", "Sports"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products`}
                    className="text-sm text-gray-400 hover:text-primary transition font-poppins"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-base uppercase italic text-white">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <HiLocationMarker className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 font-poppins">
                  Mirpur Shopping Center Level 5 Shop No 578 (Lift-4)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <HiPhone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-gray-400 font-poppins">01300773455</span>
              </li>
              <li className="flex items-center gap-3">
                <HiMail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-gray-400 font-poppins">Hrlifestylehrshopping@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500 font-poppins">
              &copy; {new Date().getFullYear()} HR-Lifestyle. All rights reserved.
            </p>
            <div className="flex gap-5 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-gray-300 transition font-poppins">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="hover:text-gray-300 transition font-poppins">
                Terms of Service
              </Link>
              <Link to="/return" className="hover:text-gray-300 transition font-poppins">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
