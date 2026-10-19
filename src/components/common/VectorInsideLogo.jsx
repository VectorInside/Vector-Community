'use client';

import React from 'react';

/**
 * Componente oficial de identidad Vector Inside según el Código Maestro 2026.
 * Soporta las 3 variantes oficiales (Bloque 10.8.2):
 * - 'imagotype': Isotipo + Logotipo horizontal (Versión principal)
 * - 'isotype': Solo la "V" vectorial (Favicon, avatar, sello, badges)
 * - 'isologo': "V" dominante de fondo con texto fusionado (Impacto visual)
 */
export const VectorInsideLogo = ({
  size = 'md',
  variant = 'imagotype', // 'imagotype' | 'isotype' | 'isologo'
  showCommunity = true,
  showClaim = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { width: 30, height: 26, fontSize: 'text-xs', subSize: 'text-[8px]', claimSize: 'text-[7px]' },
    md: { width: 44, height: 38, fontSize: 'text-sm', subSize: 'text-[9px]', claimSize: 'text-[8px]' },
    lg: { width: 68, height: 58, fontSize: 'text-lg', subSize: 'text-[10px]', claimSize: 'text-[9px]' },
    xl: { width: 100, height: 85, fontSize: 'text-2xl', subSize: 'text-xs', claimSize: 'text-[10px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // SVG Isotipo Oficial: "V" Vectorial con cortes geométricos de código (Bloques 10.8.3 y 13.3)
  const IsotypeSvg = ({ w = currentSize.width, h = currentSize.height, customClass = '' }) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none filter drop-shadow-[0_0_12px_rgba(231,249,0,0.38)] ${customClass}`}
    >
      {/* Trazo Principal Amarillo Vectorial (#E7F900) */}
      <path
        d="M10 0 L40 76 L60 76 L90 0 L72 0 L50 56 L28 0 Z"
        fill="#E7F900"
      />
      {/* Cortes Geométricos de Código y Núcleo (#000000) */}
      <rect x="36" y="24" width="16" height="6" fill="#000000" />
      <rect x="52" y="40" width="14" height="7" fill="#000000" />
      <rect x="30" y="52" width="10" height="5" fill="#000000" />
      <rect x="62" y="16" width="12" height="4" fill="#000000" />
    </svg>
  );

  // Variante 1: Solo Isotipo
  if (variant === 'isotype') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <IsotypeSvg />
      </div>
    );
  }

  // Variante 2: Isologo de Impacto (Lockup fusionado con V de fondo)
  if (variant === 'isologo') {
    return (
      <div className={`relative inline-flex items-center justify-center p-4 select-none ${className}`}>
        <IsotypeSvg w={currentSize.width * 2.2} h={currentSize.height * 2.2} customClass="opacity-90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] px-2">
          <div className="flex items-center gap-1 font-heading font-black tracking-[0.2em] text-white uppercase text-center text-xs sm:text-sm drop-shadow-md">
            <span>VECTOR</span>
            <span className="text-neon">INSIDE</span>
          </div>
          {showCommunity && (
            <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-zinc-300 uppercase mt-0.5">
              {`// COMMUNITY`}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Variante 3 (Predeterminada): Imagotipo Horizontal Principal
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <IsotypeSvg />
      </div>

      <div className="flex flex-col justify-center">
        {/* Wordmark Oficial Vector Inside */}
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-heading font-black tracking-[0.16em] text-white uppercase ${currentSize.fontSize}`}>
            VECTOR
          </span>
          <span className={`font-heading font-black tracking-[0.16em] text-neon uppercase ${currentSize.fontSize}`}>
            INSIDE
          </span>
        </div>

        {/* Descriptor Vector Community (evita duplicar la palabra VECTOR) */}
        {showCommunity && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-neon font-mono font-black text-[9px]">{`//`}</span>
            <span className={`font-mono font-bold tracking-[0.22em] text-zinc-300 uppercase ${currentSize.subSize}`}>
              COMMUNITY OS
            </span>
          </div>
        )}

        {/* Claim / Eslogan Institucional Oficial (Bloque 10.8.22) */}
        {showClaim && (
          <div className="text-cognitive font-mono font-semibold tracking-wider text-[8px] mt-0.5 uppercase">
            Aceleración Digital, Diseño desde el Núcleo
          </div>
        )}
      </div>
    </div>
  );
};
