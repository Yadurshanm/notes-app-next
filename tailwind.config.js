const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/typography'),
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              50: "#F0F9FF",
              100: "#E0F2FE",
              200: "#BAE6FD",
              300: "#7DD3FC",
              400: "#38BDF8",
              500: "#0EA5E9",
              600: "#0284C7",
              700: "#0369A1",
              800: "#075985",
              900: "#0C4A6E",
              DEFAULT: "#0EA5E9",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            background: "#18181B",
            foreground: "#ECEDEE",
            primary: {
              50: "#F0F9FF",
              100: "#E0F2FE",
              200: "#BAE6FD",
              300: "#7DD3FC",
              400: "#38BDF8",
              500: "#0EA5E9",
              600: "#0284C7",
              700: "#0369A1",
              800: "#075985",
              900: "#0C4A6E",
              DEFAULT: "#0EA5E9",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
}