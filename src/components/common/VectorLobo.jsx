'use client';

import React from 'react';

/**
 * Componente oficial del Lobo Vectorial según el Código Maestro 2026.
 * (Bloque 13.9, 14.7, 32.11)
 * Símbolo vivo de instinto estratégico, lectura del entorno y guía de IA hacia el núcleo.
 */
export const VectorLobo = ({
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  status = 'active', // 'active', 'analyzing', 'alert'
  showStatusBadge = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { width: 28, height: 28 },
    md: { width: 42, height: 42 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const glowColors = {
    active: 'rgba(231, 249, 0, 0.3)',
    analyzing: 'rgba(138, 149, 182, 0.4)',
    alert: 'rgba(239, 68, 68, 0.4)',
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: `drop-shadow(0 0 14px ${glowColors[status] || glowColors.active})` }}
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Silueta Geométrica Vectorial del Lobo */}
        {/* Orejas triangulares con ángulos técnicos */}
        <polygon points="20,15 36,42 16,38" fill="#0D1016" stroke="#E7F900" strokeWidth="2.5" strokeLinejoin="bevel" />
        <polygon points="80,15 84,38 64,42" fill="#0D1016" stroke="#E7F900" strokeWidth="2.5" strokeLinejoin="bevel" />
        
        {/* Frente y cráneo facetado */}
        <polygon points="36,42 50,22 64,42 50,52" fill="#141820" stroke="#8A95B6" strokeWidth="2" strokeLinejoin="bevel" />
        
        {/* Ojos / Sensores de Lectura Estratégica */}
        <polygon points="34,48 44,52 38,55" fill="#E7F900" />
        <polygon points="66,48 62,55 56,52" fill="#E7F900" />
        
        {/* Mejillas angulares de alta tracción */}
        <polygon points="16,38 36,42 28,68 12,56" fill="#0D1016" stroke="#8A95B6" strokeWidth="2" strokeLinejoin="bevel" />
        <polygon points="84,38 88,56 72,68 64,42" fill="#0D1016" stroke="#8A95B6" strokeWidth="2" strokeLinejoin="bevel" />
        
        {/* Hocico y Mandíbula inferior (Dirección hacia el Núcleo) */}
        <polygon points="50,52 38,68 62,68" fill="#1A1F2B" stroke="#E7F900" strokeWidth="2" strokeLinejoin="bevel" />
        <polygon points="38,68 50,90 62,68" fill="#08090C" stroke="#E7F900" strokeWidth="2.5" strokeLinejoin="bevel" />
        
        {/* Trufa / Corte Central */}
        <polygon points="46,80 54,80 50,86" fill="#E7F900" />

        {/* Pupila cognitiva pulsante */}
        {status === 'analyzing' && (
          <circle cx="50" cy="52" r="3" fill="#8A95B6" className="animate-ping" />
        )}
      </svg>

      {showStatusBadge && (
        <span
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
            status === 'alert'
              ? 'bg-red-500 animate-pulse'
              : status === 'analyzing'
              ? 'bg-cognitive animate-spin'
              : 'bg-neon animate-pulse'
          }`}
        />
      )}
    </div>
  );
};
