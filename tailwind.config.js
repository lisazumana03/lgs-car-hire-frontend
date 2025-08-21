/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Make Tailwind scan all your files
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1E40AF', // Blue
                    light: '#3B82F6', // Light Blue
                    dark: '#1E3A8A', // Dark Blue
                },
                secondary: {
                    DEFAULT: '#F59E0B', // Yellow
                    light: '#FCD34D', // Light Yellow
                    dark: '#B45309', // Dark Yellow
                }
            },
            fontFamily: {
                sans: ['Arial', 'sans-serif'], // Use Inter font for sans-serif
                serif: ['Merriweather', 'serif'], // Use Merriweather font for serif
            }
        },
    },
    plugins: [],
}
