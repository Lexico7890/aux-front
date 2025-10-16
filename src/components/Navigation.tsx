import React, { useState } from 'react';
import { Package, RotateCcw, Upload, Users, Bell } from 'lucide-react';

const Navigation = ({ currentPath = '/' }) => {
  const navItems = [
    { path: '/inventario', icon: Package, label: 'Inventario' },
    { path: '/movimientos', icon: RotateCcw, label: 'Movimientos' },
    { path: '/documentos', icon: Upload, label: 'Documentos' },
    { path: '/clientes', icon: Users, label: 'Clientes' },
    { path: '/notificaciones', icon: Bell, label: 'Notificaciones' }
  ];

  const [showMenuMovil, setShowMenuMovil] = useState<boolean>(false)

  return (
    <nav className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-dark-800/95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center space-x-2 group">
            <Package className="h-8 w-8 text-blue-600 dark:text-neon-blue-400 group-hover:animate-pulse-neon transition-all" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Inventario
            </span>
          </a>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <a
                key={path}
                href={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  currentPath === path 
                    ? 'text-neon-blue-400 bg-neon-blue-400/10 dark:bg-neon-blue-400/20 shadow-glow-blue border border-neon-blue-400/20' 
                    : 'text-gray-700 dark:text-dark-300 hover:text-neon-blue-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:shadow-glow-soft'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button className="p-2 rounded-md text-gray-700 dark:text-dark-300 hover:text-neon-blue-400 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className={`${showMenuMovil ? "" : "hidden "} border-t border-gray-200 dark:border-dark-700 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm`}>
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <a
              key={path}
              href={path}
              className={`flex flex-col items-center p-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                currentPath === path 
                  ? 'text-neon-blue-400 bg-neon-blue-400/10 dark:bg-neon-blue-400/20 shadow-glow-blue' 
                  : 'text-gray-700 dark:text-dark-300 hover:text-neon-blue-400 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;