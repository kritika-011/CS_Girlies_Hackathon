import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cozy color palette
        cream: {
          50: "#fefcf8",
          100: "#fdf8f0",
          200: "#faf0e1",
          300: "#f6e7d2",
          400: "#f0d5b4",
          500: "#e9c396",
          600: "#d2b087",
          700: "#b8956e",
          800: "#9e7a55",
          900: "#85653c",
        },
        peach: {
          50: "#fef7f4",
          100: "#fdeee9",
          200: "#fad5c8",
          300: "#f7bca7",
          400: "#f18a65",
          500: "#eb5823",
          600: "#d44f20",
          700: "#b0421b",
          800: "#8c3516",
          900: "#722c12",
        },
        sage: {
          50: "#f6f8f6",
          100: "#edf1ed",
          200: "#d2ddd2",
          300: "#b7c9b7",
          400: "#81a181",
          500: "#4b794b",
          600: "#446d44",
          700: "#395b39",
          800: "#2e492e",
          900: "#253b25",
        },
        rose: {
          50: "#faf7f7",
          100: "#f5efef",
          200: "#e6d7d7",
          300: "#d7bfbf",
          400: "#b98f8f",
          500: "#9b5f5f",
          600: "#8c5656",
          700: "#754848",
          800: "#5e3a3a",
          900: "#4d2f2f",
        },
        taupe: {
          50: "#f9f8f7",
          100: "#f3f1ef",
          200: "#e1ddd7",
          300: "#cfc9bf",
          400: "#aba18f",
          500: "#87795f",
          600: "#7a6d56",
          700: "#665b48",
          800: "#52493a",
          900: "#433b2f",
        },
        softBrown: "#8B7D6B",
        warmGray: "#6B5B73",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        serif: ["var(--font-crimson)", "Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
