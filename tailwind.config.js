const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      primaryblue : '#00A0E4',
      gray: colors.gray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.green,
      indigo : colors.indigo,
      blue : colors.blue,
      orange: {
        '50':  '#fdfdea',
        '100': '#fdf6b2',
        '200': '#fce96a',
        '300': '#faca15',
        '400': '#e3a008',
        '500': '#c27803',
        '600': '#9f580a',
        '700': '#8e4b10',
        '800': '#723b13',
        '900': '#633112',
      },
      indigo: {
        '50':  '#fafbfa',
        '100': '#f3f1f6',
        '200': '#e6d9ec',
        '300': '#cab3d5',
        '400': '#b087b6',
        '500': '#956399',
        '600': '#79477a',
        '700': '#5a3b5d',
        '800': '#3d243d',
        '900': '#231623',
      },
      navy: {
        '50':  '#f3f8f9',
        '100': '#daf1fa',
        '200': '#afe0f5',
        '300': '#7cc2e7',
        '400': '#479ed3',
        '500': '#357dc0',
        '600': '#2d62a9',
        '700': '#254a87',
        '800': '#1b3260',
        '900': '#101f3f',
      },
      cerise: {
        '50':  '#fdfcfb',
        '100': '#faeff2',
        '200': '#f6cbe6',
        '300': '#ec9ecb',
        '400': '#ea6fac',
        '500': '#df4b91',
        '600': '#c93270',
        '700': '#a22652',
        '800': '#771b35',
        '900': '#49111c',
      },
    },
    boxShadow : {
      'DEFAULT' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      'dark'    : '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
      'none'    : 'none',
      'sm'      : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'md'      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      'lg'      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'xl'      : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl'     : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    screens : {
      'sm'      : '640px',
      'md'      : '768px',
      'lg'      : '1024px',
      'xl'      : '1280px',
      '2xl'     : '1536px',
      '3xl'     : '1920px'
    },
    extend: {
      typography: (theme) => ({
        indigo : {
          css: {
            '--tw-prose-bullets': theme('colors.indigo.200'),
            '--tw-prose-invert-bullets': theme('colors.gray.500'),
            '--tw-prose-invert-links'  : theme('colors.yellow.500')
          },
        },
      }),
      gridTemplateColumns: {
        // Complex site-specific column configuration
        'setting': '1fr 380px',
        'club': '240px 1fr',
      },
      keyframes: {
        'fade-in': {
            '0%': {
                opacity: '0',
            },
            '100%': {
                opacity: '1',
            },
        },
        'fade-out': {
            'from': {
                opacity: '1',
            },
            'to': {
                opacity: '0',
            },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
      }
      
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderWidth: ['last'],
      textOpacity: ['dark'],
      boxShadow: ['dark'],
      display: ['dark']
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

/*    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
      dark: '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
    },*/