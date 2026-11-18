'use client';

import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subvalue,
  change,
  isPositive,
  icon: Icon,
  badgeText,
  accentColor = 'brand',
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 transition-all duration-300 hover:border-[var(--neon-primary)]/40 hover:shadow-sm group',
        className
      )}
    >
      {/* Subtle top glow line */}
      <div
        className={clsx(
          'absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity',
          accentColor === 'brand' && 'bg-gradient-to-r from-transparent via-[var(--neon-primary)] to-transparent',
          accentColor === 'emerald' && 'bg-gradient-to-r from-transparent via-emerald-500 to-transparent',
          accentColor === 'blue' && 'bg-gradient-to-r from-transparent via-blue-500 to-transparent',
          accentColor === 'amber' && 'bg-gradient-to-r from-transparent via-amber-500 to-transparent',
          accentColor === 'rose' && 'bg-gradient-to-r from-transparent via-rose-500 to-transparent',
          accentColor === 'zinc' && 'bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-500 to-transparent'
        )}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {title}
          </p>
          <div className="mt-2 flex flex-col">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--text-main)] font-mono leading-tight">
              {value}
            </span>
            {subvalue && (
              <span className="text-xs text-[var(--text-muted)] font-mono mt-1">
                {subvalue}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] group-hover:text-lime-700 dark:group-hover:text-neon group-hover:border-[var(--neon-primary)]/40 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-[var(--border-color)]/60">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {isPositive === true && (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                {change}
              </span>
            )}
            {isPositive === false && (
              <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-bold">
                <TrendingDown className="w-3.5 h-3.5" />
                {change}
              </span>
            )}
            {isPositive === null && (
              <span className="flex items-center gap-0.5 text-[var(--text-muted)]">
                <Minus className="w-3.5 h-3.5" />
                {change}
              </span>
            )}
            <span className="text-[var(--text-muted)]">vs período anterior</span>
          </div>
        ) : (
          <span className="text-xs text-[var(--text-muted)]">Sincronización en vivo</span>
        )}

        {badgeText && (
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
