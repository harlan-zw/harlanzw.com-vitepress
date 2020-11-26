module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './app/.vitepress/**/*.vue',
      './app/.vitepress/**/*.js',
      './app/.vitepress/**/*.ts',
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: 'Open Sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        header: 'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              color: theme('color.gray.600'),
              fontWeight: '600',
              fontFamily: theme('fontFamily.header'),
              lineHeight: 1.3
            },
            a: {
              textDecoration: 'initial',
            }
          },
        },
        xl: {
          css: {
            h1: {
              lineHeight: 1.3
            }
          }
        }
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}