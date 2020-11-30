module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './app/.vitepress/**/*.vue',
      './app/.vitepress/**/*.js',
      './app/.vitepress/**/*.ts',
      './app/**/*.md',
      './app/*.md',
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
              color: 'rgb(55, 70, 60)',
              fontWeight: '600',
              fontFamily: theme('fontFamily.header'),
              lineHeight: 1.3
            },
            h2: {
              color: 'rgb(55, 70, 60)',
            },
            h3: {
              color: 'rgb(55, 70, 60)',
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