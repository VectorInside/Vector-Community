'use client';

import React from 'react';
import { clsx } from 'clsx';

export const Badge = ({
  children,
  variant = 'default', // 'neon', 'success', 'warning', 'danger', 'info', 'slate'
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    neon: 'bg-brand-primary/10 text-brand-primary border-brand-primary/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  };

  const dotColors = {
    neon: 'bg-brand-primary',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-blue-400',
    purple: 'bg-purple-400',
    default: 'bg-zinc-400',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium',
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-semibold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant] || dotColors.default)}
        />
      )}
      {children}
    </span>
  );
};
