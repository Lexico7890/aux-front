/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', 'class'], // Habilita modo oscuro con clase
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		colors: {
  			dark: {
  				'50': '#f8fafc',
  				'100': '#f1f5f9',
  				'200': '#e2e8f0',
  				'300': '#cbd5e1',
  				'400': '#94a3b8',
  				'500': '#64748b',
  				'600': '#475569',
  				'700': '#334155',
  				'800': '#1e293b',
  				'850': '#1a2332',
  				'900': '#0f172a',
  				'950': '#020617'
  			},
  			neon: {
  				blue: {
  					'400': '#38bdf8',
  					'500': '#0ea5e9',
  					'600': '#0284c7',
  					glow: '#38bdf8'
  				},
  				green: {
  					'400': '#4ade80',
  					'500': '#22c55e',
  					'600': '#16a34a',
  					glow: '#4ade80'
  				},
  				yellow: {
  					'400': '#facc15',
  					'500': '#eab308',
  					'600': '#ca8a04',
  					glow: '#facc15'
  				},
  				red: {
  					'400': '#f87171',
  					'500': '#ef4444',
  					'600': '#dc2626',
  					glow: '#f87171'
  				},
  				orange: {
  					'400': '#fb923c',
  					'500': '#f97316',
  					'600': '#ea580c',
  					glow: '#fb923c'
  				},
  				purple: {
  					'400': '#a78bfa',
  					'500': '#8b5cf6',
  					'600': '#7c3aed',
  					glow: '#a78bfa'
  				},
  				pink: {
  					'400': '#f472b6',
  					'500': '#ec4899',
  					'600': '#db2777',
  					glow: '#f472b6'
  				}
  			},
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
  			}
  		},
  		boxShadow: {
  			'glow-blue': '0 0 20px rgba(56, 189, 248, 0.5)',
  			'glow-green': '0 0 20px rgba(74, 222, 128, 0.5)',
  			'glow-yellow': '0 0 20px rgba(250, 204, 21, 0.5)',
  			'glow-red': '0 0 20px rgba(248, 113, 113, 0.5)',
  			'glow-purple': '0 0 20px rgba(167, 139, 250, 0.5)',
  			'glow-pink': '0 0 20px rgba(244, 114, 182, 0.5)',
  			'glow-soft': '0 0 15px rgba(255, 255, 255, 0.1)'
  		},
  		keyframes: {
  			'pulse-neon': {
  				'0%, 100%': {
  					opacity: '1',
  					boxShadow: '0 0 20px currentColor'
  				},
  				'50%': {
  					opacity: '0.8',
  					boxShadow: '0 0 30px currentColor, 0 0 40px currentColor'
  				}
  			},
  			glow: {
  				'0%, 100%': {
  					textShadow: '0 0 10px currentColor'
  				},
  				'50%': {
  					textShadow: '0 0 20px currentColor, 0 0 30px currentColor'
  				}
  			}
  		},
  		animation: {
  			'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			glow: 'glow 2s ease-in-out infinite alternate'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}