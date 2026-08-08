/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Playfair Display"', "serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        bg: {
          base: "#17181C",
          soft: "#1D1F24",
          raised: "#24262D",
        },
        card: {
          DEFAULT: "#262931",
          raised: "#2D313A",
        },
        gold: {
          DEFAULT: "#DAB25A",
          soft: "#F2D89A",
          dim: "rgba(218,178,90,0.18)",
        },
        ink: {
          DEFAULT: "#FFFFFF",
          muted: "#B9BDC7",
          faint: "#7C818D",
        },
        success: "#4ADE80",
        warning: "#FBBF24",
        danger: "#F87171",
      },
      borderRadius: {
        card: "22px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(0,0,0,0.6)",
        goldGlow: "0 0 0 1px rgba(218,178,90,0.18), 0 20px 60px -20px rgba(218,178,90,0.25)",
        lift: "0 30px 80px -25px rgba(0,0,0,0.75)",
      },
      backgroundImage: {
        "app-gradient": "radial-gradient(circle at 20% -10%, rgba(218,178,90,0.10), transparent 40%), radial-gradient(circle at 90% 10%, rgba(218,178,90,0.06), transparent 35%), linear-gradient(180deg, #17181C 0%, #1D1F24 100%)",
        "gold-gradient": "linear-gradient(135deg, #DAB25A 0%, #F2D89A 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-24px) translateX(14px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) translateX(0) scale(1)" },
          "50%": { transform: "translateY(20px) translateX(-18px) scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        floatSlow: "floatSlow 13s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
