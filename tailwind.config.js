/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 10px 40px rgba(8, 18, 33, 0.35)",
        card: "0 15px 45px rgba(5, 13, 28, 0.25)",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
        display: ["Sora", "ui-sans-serif", "system-ui"],
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        drift: "drift 16s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drift: {
          "0%": { transform: "translateX(0px) translateY(0px)" },
          "50%": { transform: "translateX(12px) translateY(-10px)" },
          "100%": { transform: "translateX(0px) translateY(0px)" },
        },
      },
    },
  },
  plugins: [],
};
