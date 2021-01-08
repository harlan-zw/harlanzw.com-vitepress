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
      animation: {
        fadeIn: 'fadeIn 200ms ease-in forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      fontFamily: {
        sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        header: 'Dosis, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
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
              fontFamily: theme('fontFamily.header'),
            },
            h3: {
              color: 'rgb(55, 70, 60)',
              fontFamily: theme('fontFamily.header'),
            },
            h4: {
              color: 'rgb(55, 70, 60)',
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontFamily: theme('fontFamily.header'),
              textDecoration: 'underline'
            },
            a: {
              textDecoration: 'initial',
            },
            blockquote: {
              fontWeight: '400',
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