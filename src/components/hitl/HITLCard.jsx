'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { formatRelativeTime, formatCurrency } from '@/utils/formatters';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  User,
  Phone,
  Calendar,
  DollarSign,
  TrendingDown,
  ShoppingBag,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const HITLCard = ({
  alert,
  onApprove,
  onReject,
  isProcessing = false,
}) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const isApproved = alert.status === 'APPROVED';
  const isRejected = alert.status === 'REJECTED';
  const isPending = alert.status === 'PENDING_AGENCY_APPROVAL';

  const getTypeBadge = (type) => {
    switch (type) {
      case 'APPOINTMENT_REQUEST':
        return <Badge variant="neon" size="xs">Cita & Agendamiento</Badge>;
      case 'CREATIVE_FATIGUE':
        return <Badge variant="danger" size="xs">Fatiga Creativa</Badge>;
      case 'HIGH_INTENT_LEAD':
        return <Badge variant="purple" size="xs">Lead Alto Valor</Badge>;
      default:
        return <Badge variant="default" size="xs">{type}</Badge>;
    }
  };

  const getUrgencyIndicator = (urgency) => {
    if (urgency === 'HIGH') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 font-bold">
          <ShieldAlert className="w-3.5 h-3.5" /> ALTA PRIORIDAD
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
        <Clock className="w-3.5 h-3.5" /> NORMAL
      </span>
    );
  };

  return (
    <div
      className={`relative rounded-2xl bg-dark-surface border transition-all duration-300 p-5 ${
        isApproved
          ? 'border-emerald-500/40 bg-dark-surface/80'
          : isRejected
          ? 'border-dark-border/40 opacity-60'
          : 'border-dark-border hover:border-brand-primary/40 hover:shadow-surface'
      }`}
    >
      {/* Top Banner & Confidence Score */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-dark-border/60">
        <div className="flex items-center gap-2">
          {getTypeBadge(alert.type)}
          <span className="text-zinc-500 text-xs font-mono">•</span>
          <span className="text-xs text-zinc-400 font-mono">
            {formatRelativeTime(alert.timestamp)}
          </span>
          <span className="text-zinc-500 text-xs font-mono hidden sm:inline">•</span>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            {alert.source}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {getUrgencyIndicator(alert.urgency)}
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-[11px] font-mono font-bold">
            <Sparkles className="w-3 h-3" />
            <span>{alert.confidenceScore}% IA Score</span>
          </div>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="space-y-3">
        <div>
          <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {alert.title}
          </h4>
          <p className="mt-1 text-xs text-zinc-300 bg-dark-elevated/70 p-2.5 rounded-xl border border-dark-border/60 leading-relaxed font-sans">
            <strong className="text-brand-primary font-mono font-medium">Co-Pilot RAG: </strong>
            {alert.botSummary}
          </p>
        </div>

        {/* Client & Structured Payload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Client Details */}
          <div className="p-3 rounded-xl bg-dark-base border border-dark-border/60 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Datos del Lead / Cliente
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <User className="w-3.5 h-3.5 text-brand-primary" />
              <span>{alert.clientName}</span>
            </div>
            {alert.clientPhone !== 'N/A' && (
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>{alert.clientPhone}</span>
              </div>
            )}
          </div>

          {/* Proposed Reservation / Action Details */}
          <div className="p-3 rounded-xl bg-dark-base border border-dark-border/60 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Parámetros a Sincronizar
            </span>

            {alert.proposedData?.date && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" /> Horario:
                </span>
                <span className="font-semibold text-white font-mono">
                  {alert.proposedData.date}
                </span>
              </div>
            )}

            {alert.proposedData?.zone && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Zona:</span>
                <span className="text-zinc-200 font-medium">
                  {alert.proposedData.zone}
                </span>
              </div>
            )}

            {alert.proposedData?.doctor && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Especialista:</span>
                <span className="text-zinc-200 font-medium font-mono">
                  {alert.proposedData.doctor}
                </span>
              </div>
            )}

            {alert.proposedData?.estimatedValue && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Valor Estimado:
                </span>
                <span className="font-bold text-emerald-400 font-mono">
                  ${alert.proposedData.estimatedValue} MXN
                </span>
              </div>
            )}

            {alert.proposedData?.recommendation && (
              <div className="text-xs text-amber-300 font-mono">
                {alert.proposedData.recommendation}
              </div>
            )}
          </div>
        </div>

        {/* Conversation Snippet Drawer Toggle */}
        {alert.transcriptSnippet && alert.transcriptSnippet.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-brand-primary font-mono transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{showTranscript ? 'Ocultar' : 'Ver'} transcripción de la captura ({alert.transcriptSnippet.length} mensajes)</span>
              {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTranscript && (
              <div className="mt-2.5 p-3 rounded-xl bg-dark-base border border-dark-border/80 space-y-2 text-xs font-sans animate-fadeIn">
                {alert.transcriptSnippet.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-start' : 'items-end'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {msg.sender === 'user' ? alert.clientName : 'Vector Bot RAG'}
                    </span>
                    <div
                      className={`max-w-[85%] mt-0.5 px-3 py-1.5 rounded-xl ${
                        msg.sender === 'user'
                          ? 'bg-dark-elevated text-zinc-200 border border-dark-border'
                          : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/25'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer 1-Click Action Bar */}
      <div className="mt-5 pt-3.5 border-t border-dark-border/80 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono text-zinc-500">
          ID: <span className="text-zinc-400">{alert.id}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reject / Discard Button */}
          {isPending && (
            <Button
              variant="outline"
              size="sm"
              icon={XCircle}
              onClick={() => onReject(alert.id, 'Descartado por operador')}
            >
              Descartar
            </Button>
          )}

          {/* 1-Click Action Direct Button (Rule from Specification) */}
          {isApproved ? (
            <Button
              variant="success"
              size="sm"
              disabled={true}
              icon={CheckCircle2}
              className="cursor-not-allowed bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            >
              ✅ Aprobado & Sincronizado
            </Button>
          ) : isRejected ? (
            <Badge variant="danger" size="md">
              Descartado
            </Badge>
          ) : (
            <Button
              variant="primary"
              size="sm"
              loading={isProcessing}
              disabled={isProcessing}
              icon={CheckCircle2}
              onClick={() => onApprove(alert.id)}
              className="shadow-neon-sm"
            >
              ✅ Aprobar & Sincronizar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
