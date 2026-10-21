'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Componente oficial de identidad Vector Inside según el Código Maestro 2026.
 * Soporta las 3 variantes oficiales (Bloque 10.8.2):
 * - 'imagotype': Isotipo + Logotipo horizontal (Versión principal)
 * - 'isotype': Solo la "V" vectorial (Favicon, avatar, sello, badges)
 * - 'isologo': "V" dominante de fondo con texto fusionado (Impacto visual)
 */
export const VectorInsideLogo = ({
  size = 'md',
  variant = 'imagotype', // 'imagotype' | 'isotype' | 'isologo' | 'official'
  showCommunity = true,
  showClaim = false,
  className = '',
  useOfficialImage = true,
}) => {
  const sizeMap = {
    sm: { width: 28, height: 24, imgWidth: 112, fontSize: 'text-xs', subSize: 'text-[8px]', claimSize: 'text-[7px]' },
    md: { width: 38, height: 32, imgWidth: 160, fontSize: 'text-sm', subSize: 'text-[9px]', claimSize: 'text-[8px]' },
    lg: { width: 56, height: 48, imgWidth: 220, fontSize: 'text-lg', subSize: 'text-[10px]', claimSize: 'text-[9px]' },
    xl: { width: 85, height: 72, imgWidth: 280, fontSize: 'text-2xl', subSize: 'text-xs', claimSize: 'text-[10px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Render oficial con los assets PNG aportados por la marca
  if (useOfficialImage && (variant === 'official' || variant === 'imagotype')) {
    const calculatedHeight = Math.round(currentSize.imgWidth * (1634 / 6322)) || 36;
    return (
      <div className={`inline-flex items-center gap-1.5 select-none shrink-0 ${className}`}>
        <Image
          src="/assets/vector-logo-white.png"
          alt="Vector Inside"
          width={currentSize.imgWidth}
          height={calculatedHeight}
          priority
          style={{ width: currentSize.imgWidth, height: 'auto' }}
          className="dark:block hidden object-contain shrink-0"
        />
        <Image
          src="/assets/vector-logo-light.png"
          alt="Vector Inside"
          width={currentSize.imgWidth}
          height={calculatedHeight}
          priority
          style={{ width: currentSize.imgWidth, height: 'auto' }}
          className="dark:hidden block object-contain shrink-0"
        />
        {showCommunity && (
          <span className="text-[9px] font-heading font-extrabold px-1.5 py-0.5 rounded bg-lime-400 text-black uppercase tracking-wider shrink-0">
            COMUNITY
          </span>
        )}
      </div>
    );
  }

  // SVG Isotipo Oficial: "V" Vectorial con cortes geométricos y color oficial #C3F400
  const IsotypeSvg = ({ w = currentSize.width, h = currentSize.height, customClass = '' }) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none filter drop-shadow-[0_0_12px_rgba(195,244,0,0.35)] ${customClass}`}
    >
      {/* Trazo Principal Lima Vectorial (#C3F400) */}
      <path
        d="M10 0 L40 76 L60 76 L90 0 L72 0 L50 56 L28 0 Z"
        fill="#C3F400"
      />
      {/* Cortes Geométricos de Código y Núcleo Adaptativos */}
      <rect x="36" y="24" width="16" height="6" fill="var(--bg-panel, #101114)" />
      <rect x="52" y="40" width="14" height="7" fill="var(--bg-panel, #101114)" />
      <rect x="30" y="52" width="10" height="5" fill="var(--bg-panel, #101114)" />
      <rect x="62" y="16" width="12" height="4" fill="var(--bg-panel, #101114)" />
    </svg>
  );

  // Variante 1: Solo Isotipo
  if (variant === 'isotype') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {useOfficialImage ? (
          <Image
            src="/assets/vector-isotype.png"
            alt="V"
            width={currentSize.width}
            height={Math.round(currentSize.width * 0.5) || 20}
            priority
            style={{ width: currentSize.width, height: 'auto' }}
            className="object-contain drop-shadow-[0_0_8px_rgba(195,244,0,0.3)]"
          />
        ) : (
          <IsotypeSvg />
        )}
      </div>
    );
  }

  // Variante 2: Isologo de Impacto (Lockup fusionado con V de fondo)
  if (variant === 'isologo') {
    return (
      <div className={`relative inline-flex items-center justify-center p-4 select-none ${className}`}>
        <IsotypeSvg w={currentSize.width * 2.2} h={currentSize.height * 2.2} customClass="opacity-90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] px-2">
          <div className="flex items-center gap-1 font-heading font-black tracking-[0.2em] text-[var(--text-main)] uppercase text-center text-xs sm:text-sm drop-shadow-md">
            <span>VECTOR</span>
            <span className="text-neon">INSIDE</span>
          </div>
          {showCommunity && (
            <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-[var(--text-muted)] uppercase mt-0.5">
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
          <span className={`font-heading font-black tracking-[0.16em] text-[var(--text-main)] uppercase ${currentSize.fontSize}`}>
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
            <span className={`font-mono font-bold tracking-[0.22em] text-[var(--text-muted)] uppercase ${currentSize.subSize}`}>
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
