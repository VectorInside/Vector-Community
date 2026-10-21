'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Portal } from './Portal';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        {/* Modal Card */}
        <div
          className={`relative w-full ${maxWidth} bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-up my-auto`}
        >
          {/* Top brand glow bar */}
          <div className="h-1 w-full bg-gradient-to-r from-neon via-emerald-400 to-neon" />

          {/* Modal Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--border-color)]">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                  {subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-5 max-h-[75vh] overflow-y-auto text-sm text-[var(--text-main)]">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
