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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/typography'),
    nextui({
      prefix: "nextui",
      addCommonColors: true,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {
        spacingUnit: 4,
        disabledOpacity: 0.5,
        dividerWeight: "1px",
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "1rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        radius: {
          small: "8px",
          medium: "12px",
          large: "14px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
      themes: {
        light: {
          layout: {
            boxShadow: {
              small: "0 0 5px 0 rgb(0 0 0 / 0.1)",
              medium: "0 0 15px 0 rgb(0 0 0 / 0.1)",
              large: "0 0 25px 0 rgb(0 0 0 / 0.1)",
            },
          },
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
          layout: {
            boxShadow: {
              small: "0 0 5px 0 rgb(0 0 0 / 0.2)",
              medium: "0 0 15px 0 rgb(0 0 0 / 0.2)",
              large: "0 0 25px 0 rgb(0 0 0 / 0.2)",
            },
          },
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