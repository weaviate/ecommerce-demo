import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "100px",
      md: "1000px",
      lg: "1200px",
      full: "1700px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#000000",

          secondary: "#000000",

          accent: "#000000",

          neutral: "#dce1de",

          "base-100": "#ffffff",

          info: "#FFD500",

          success: "#8ac926",

          warning: "#ff595e",

          error: "#ff595e",
        },
      },
      "dark",
      "light",
    ],
  },
};
export default config;
