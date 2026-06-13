import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F9BA3B",
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#F9BA3B",
          600: "#F9A825",
          700: "#F57F17",
          800: "#E65100",
          900: "#BF360C",
        },
        brand: {
          gold: "#F9BA3B",
          "dark-gold": "#9f9143",
          "bright-yellow": "#ffd036",
          navy: "#111C43",
          "dark-bg": "#222",
          "darker-bg": "#15161B",
          "card-dark": "#1d1d1d",
          gray: {
            50: "#F9F9F9",
            100: "#F7F7F7",
            200: "#F2F2F6",
          },
        },
      },
      fontFamily: {
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
        hind: ["Hind Siliguri", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        sm: "0.3rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        shimmer: "shimmer 1.3s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
