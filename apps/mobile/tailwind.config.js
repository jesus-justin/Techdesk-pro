/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        danger: "#EF4444",
        warning: "#F59E0B",
        success: "#10B981"
      }
    }
  },
  presets: [require("nativewind/preset")]
};
