'use client';

import React from 'react';
import { clsx } from 'clsx';

export const Button = ({
  children,
  variant = 'primary', // 'primary' (neon), 'secondary', 'danger', 'ghost', 'outline', 'success'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-base disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-brand-primary text-black font-semibold hover:bg-brand-hover hover:shadow-neon focus:ring-brand-primary',
    secondary: 'bg-dark-elevated text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] border border-dark-border focus:ring-zinc-600',
    success: 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:ring-emerald-500 shadow-sm',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 focus:ring-rose-500',
    outline: 'bg-transparent text-[var(--text-main)] border border-dark-border hover:border-zinc-500 hover:text-[var(--text-main)]',
    ghost: 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-dark-elevated',
    neonOutline: 'bg-transparent text-neon border border-neon/40 hover:bg-neon/10 hover:border-neon',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
