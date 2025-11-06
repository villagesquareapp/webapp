import type { Config } from "tailwindcss";
import type { PluginAPI } from 'tailwindcss/types/config';

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		'animate-wave-1',
		'animate-wave-2',
		'animate-wave-3',
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["var(--font-poppins)"],
				"albert-sans": ["var(--font-albert-sans)"],
				ogonek: ['"Ogonek Unicase"', 'sans-serif'],
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'wave-1': {
					'0%': { height: '4px' },
					'25%': { height: '8px' },
					'50%': { height: '12px' },
					'75%': { height: '8px' },
					'100%': { height: '4px' },
				},
				'wave-2': {
					'0%': { height: '12px' },
					'25%': { height: '8px' },
					'50%': { height: '4px' },
					'75%': { height: '8px' },
					'100%': { height: '12px' },
				},
				'wave-3': {
					'0%': { height: '8px' },
					'25%': { height: '12px' },
					'50%': { height: '8px' },
					'75%': { height: '4px' },
					'100%': { height: '8px' },
				},
				'slide-in-from-bottom': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
			},
			animation: {
				'wave-1': 'wave-1 1s ease-in-out infinite',
				'wave-2': 'wave-2 1s ease-in-out infinite',
				'wave-3': 'wave-3 1s ease-in-out infinite',
				'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
			},
			borderColor: {
				DEFAULT: 'hsl(var(--border))',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function ({ addUtilities }: PluginAPI) {
			addUtilities({
				'.no-scrollbar': {
					/* IE and Edge */
					'-ms-overflow-style': 'none',
					/* Firefox */
					'scrollbar-width': 'none',
					/* Safari and Chrome */
					'&::-webkit-scrollbar': {
						display: 'none'
					}
				}
			})
		}
	],
} satisfies Config;
