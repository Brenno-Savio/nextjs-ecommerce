import { Config } from 'tailwindcss/types/config';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          default: '#152537',
          primary: '#0073ff',
          secondary: '#0099ff',
          tertiary: '#001530',
          accent: '#ac0000',
          neutral: '#0D1926',
          'base-100': '#152537',
          info: '#00a6d2',
          success: '#00d526',
          warning: '#c34500',
          error: '#ff435e',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
export default config;
