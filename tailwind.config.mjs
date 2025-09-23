/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Habilita modo oscuro con clase
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Grises oscuros elegantes (no negro puro)
        dark: {
          50: '#f8fafc',   // Muy claro
          100: '#f1f5f9',  // Claro
          200: '#e2e8f0',  // Medio claro
          300: '#cbd5e1',  // Medio
          400: '#94a3b8',  // Medio oscuro
          500: '#64748b',  // Oscuro
          600: '#475569',  // Más oscuro
          700: '#334155',  // Muy oscuro
          800: '#1e293b',  // Super oscuro (fondo principal)
          850: '#1a2332',  // Entre 800 y 900
          900: '#0f172a',  // Extremo (solo para bordes)
          950: '#020617',  // Negro (solo para texto en claro)
        },
        
        // Colores neón vibrantes pero elegantes
        neon: {
          blue: {
            400: '#38bdf8',  // Cyan brillante
            500: '#0ea5e9',  // Azul neón principal
            600: '#0284c7',  // Azul neón oscuro
            glow: '#38bdf8',  // Para efectos glow
          },
          green: {
            400: '#4ade80',  // Verde neón claro
            500: '#22c55e',  // Verde neón principal  
            600: '#16a34a',  // Verde neón oscuro
            glow: '#4ade80',  // Para efectos glow
          },
          yellow: {
            400: '#facc15',  // Amarillo neón claro
            500: '#eab308',  // Amarillo neón principal
            600: '#ca8a04',  // Amarillo neón oscuro
            glow: '#facc15',  // Para efectos glow
          },
          red: {
            400: '#f87171',  // Rojo neón claro
            500: '#ef4444',  // Rojo neón principal
            600: '#dc2626',  // Rojo neón oscuro
            glow: '#f87171',  // Para efectos glow
          },
          orange: {
            400: '#fb923c',  // Naranja neón claro
            500: '#f97316',  // Naranja neón principal
            600: '#ea580c',  // Naranja neón oscuro
            glow: '#fb923c', // Para efectos glow
          },
          purple: {
            400: '#a78bfa',  // Morado neón claro
            500: '#8b5cf6',  // Morado neón principal
            600: '#7c3aed',  // Morado neón oscuro
            glow: '#a78bfa', // Para efectos glow
          },
          pink: {
            400: '#f472b6',  // Rosa neón claro
            500: '#ec4899',  // Rosa neón principal
            600: '#db2777',  // Rosa neón oscuro
            glow: '#f472b6', // Para efectos glow
          }
        }
      },
      
      // Efectos de glow/resplandor
      boxShadow: {
        'glow-blue': '0 0 20px rgba(56, 189, 248, 0.5)',
        'glow-green': '0 0 20px rgba(74, 222, 128, 0.5)',
        'glow-yellow': '0 0 20px rgba(250, 204, 21, 0.5)',
        'glow-red': '0 0 20px rgba(248, 113, 113, 0.5)',
        'glow-purple': '0 0 20px rgba(167, 139, 250, 0.5)',
        'glow-pink': '0 0 20px rgba(244, 114, 182, 0.5)',
        'glow-soft': '0 0 15px rgba(255, 255, 255, 0.1)',
      },
      
      // Animaciones personalizadas
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px currentColor'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 30px currentColor, 0 0 40px currentColor'
          },
        },
        'glow': {
          '0%, 100%': { 
            textShadow: '0 0 10px currentColor'
          },
          '50%': { 
            textShadow: '0 0 20px currentColor, 0 0 30px currentColor'
          },
        }
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      }
    },
  },
  plugins: [],
}