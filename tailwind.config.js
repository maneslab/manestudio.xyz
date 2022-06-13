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

      primary   : "#0042EC",
      secondary : "#955e84",
      accent    : "#555",
      neutral   : "#1E1C22",
      pink      : "#f64c71",
      
      gray: colors.gray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.green,
      blue : colors.blue,
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
  daisyui: {
    themes: [
      {
        mytheme: {
                  
          "primary": "#0042EC",
                  
          "secondary": "#955e84",
                  
          "accent": "#555",
                  
          "neutral": "#1E1C22",
                  
          "base-100": "#E6EBF4",
                  
          "info": "#1AB6EA",
                  
          "success": "#0D6D34",
                  
          "warning": "#E89211",
                  
          "error": "#E9537E",

          "--rounded-box": "0rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "0rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-text-case": "uppercase", // set default text transform for buttons
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0rem", // border radius of tabs

        },
      },
    ],
  },

  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui")
  ],
}
