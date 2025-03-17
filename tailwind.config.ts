/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        llama: '#4f46e5',
        gemini: '#0ea5e9',
        mistral: '#8b5cf6',
        gpt: '#10b981',
        deepseek: '#f59e0b',
        claude: '#6366f1',
      },
    },
  },
  plugins: [],
};
