'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, X } from 'lucide-react';

export const GeneralModal = () => {
  const { modal, closeModal, executeModalAction } = useAuth();

  if (!modal.isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        className="vector-bg-panel vector-border w-[520px] max-w-[90vw] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.7)] flex flex-col max-h-[85vh] animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)] rounded-t-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-main)]">
            <ShieldAlert className="w-4 h-4 text-neon" />
            <span>{modal.title}</span>
          </h3>
          <button
            type="button"
            onClick={closeModal}
            className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div
          className="p-6 overflow-y-auto text-sm leading-relaxed text-[var(--text-main)] space-y-2"
          dangerouslySetInnerHTML={{ __html: modal.bodyHtml }}
        />

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] rounded-b-xl flex justify-end gap-3">
          {modal.onAction ? (
            <>
              <button
                type="button"
                onClick={closeModal}
                className="text-xs font-bold bg-[var(--bg-base)] border border-[var(--border-color)] px-4 py-2 rounded hover:border-[var(--text-muted)] transition-colors text-[var(--text-main)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeModalAction}
                className="text-xs font-bold bg-neon text-black px-4 py-2 rounded hover:bg-[var(--neon-hover)] transition-colors shadow-[0_0_10px_var(--neon-glow)] active:scale-95"
              >
                {modal.actionText || 'Confirmar'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={closeModal}
              className="text-xs font-bold bg-neon text-black px-5 py-2 rounded hover:bg-[var(--neon-hover)] transition-colors shadow-[0_0_10px_var(--neon-glow)] active:scale-95"
            >
              {modal.actionText || 'Entendido'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
