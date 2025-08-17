/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [
    // 若你有裝 typography 才保留；沒有就移除這行
    require('@tailwindcss/typography'),
  ],
};
