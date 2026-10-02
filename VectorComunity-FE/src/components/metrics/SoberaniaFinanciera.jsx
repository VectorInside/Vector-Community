'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  PieChart,
  CalendarCheck,
  Users,
  Flame,
  Thermometer,
  FileText,
  BrainCircuit,
  AlertTriangle,
  PenTool,
  CheckCircle2,
  Sparkles,
  Facebook,
  Instagram,
  Download,
  Award,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SoberaniaFinanciera = () => {
  const { activeTenant, triggerModal } = useAuth();

  const handleShowDictamenAna = () => {
    triggerModal(
      'Dictamen Pre-Cita: Ana Martínez',
      '<b>Interés:</b> Implantes Dentales.<br><b>Objeción superada:</b> Pagos a meses sin intereses.<br><b>Estatus:</b> Cita confirmada en Google Calendar para el próximo jueves a las 14:00 hrs.',
      null,
      'Cerrar'
    );
  };

  const handleShowDictamenRoberto = () => {
    triggerModal(
      'Dictamen Pre-Cita: Roberto Sánchez',
      '<b>Interés:</b> Cotización general.<br><b>Fricción:</b> Comparando con la competencia.<br><b>Acción sugerida:</b> Enviar cupón de diagnóstico de cortesía.',
      null,
      'Cerrar'
    );
  };

  const handleGenerateScript = () => {
    triggerModal(
      'Generación de Guion (DeepSeek R1)',
      `<b>Guion Viral (30 Segundos - Reels / TikTok):</b><br><br>
      <b>[0-3s Gancho]:</b> "¿Sabías que postergar tu implante dental puede duplicar tu costo en 6 meses?"<br>
      <b>[4-15s Demostración]:</b> "En ${activeTenant?.name}, usamos tomografía 3D guiada para colocación en 1 sola sesión sin dolor."<br>
      <b>[16-25s Oferta]:</b> "Aceptamos hasta 12 meses sin intereses y te regalamos el diagnóstico computarizado."<br>
      <b>[26-30s CTA]:</b> "Toca el botón aquí abajo para agendar con nuestro especialista en WhatsApp."`,
      () => {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            colors: ['#A855F7', '#E5FF00', '#FFFFFF'],
          });
        } catch (e) {}
      },
      'Copiar Guion'
    );
  };

  const handleGenerateMonthlyReport = () => {
    triggerModal(
      `Reporte Ejecutivo Mensual (ROI & Operaciones) — ${activeTenant?.name}`,
      `<b>Periodo:</b> Septiembre 2026<br>
      <b>Cliente:</b> ${activeTenant?.name}<br>
      <b>Agencia Responsable:</b> Vector Inside<br><br>
      <div style="background:#0D0F12; padding:12px; border-radius:8px; border:1px solid #1F242D; font-family:monospace; font-size:12px; line-height:1.6;">
        <span style="color:#D4FF00; font-weight:bold;">📊 RESUMEN DE RENDIMIENTO MENSUAL:</span><br>
        • <b>DMs y Comentarios Atendidos por IA:</b> 1,480 mensajes<br>
        • <b>Tiempo de Respuesta Promedio:</b> 4.2 segundos (24/7 sin descanso)<br>
        • <b>Horas de Trabajo Humano Ahorradas:</b> 124 hrs estimadas<br>
        • <b>Citas / Conversiones Concluidas:</b> ${activeTenant?.citas || 34} eventos confirmados<br>
        • <b>Gasto Publicitario en Meta Ads:</b> $28,500 MXN<br>
        • <b>Ingresos Reales Atribuidos (Backend):</b> $168,400 MXN<br>
        • <b>ROAS Real / MER:</b> ${activeTenant?.mer || '5.6x'} (Retorno Real)<br>
        • <b>Costo por Adquisición Real (CAC):</b> ${activeTenant?.cac || '$185'} MXN<br>
      </div><br>
      <b>Dictamen Ejecutivo:</b> Campaña altamente rentable. El bot resolvió el 94% de las dudas sin intervención humana, derivando a la agencia solo citas pre-calificadas y quejas de servicio.`,
      () => {
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            colors: ['#D4FF00', '#10B981', '#FFFFFF'],
          });
        } catch (e) {}
      },
      'Descargar Reporte PDF'
    );
  };

  return (
    <div className="p-8 block animate-fade-in">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
            Soberanía <span className="text-neon">Financiera</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Auditoría Full Funnel y Métricas para: <strong className="text-[var(--text-main)]">{activeTenant?.name}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateMonthlyReport}
            className="bg-neon text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_12px_var(--neon-glow)] flex items-center gap-2 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Generar Reporte Ejecutivo Mensual</span>
          </button>
          <span className="text-[10px] font-mono bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 px-3 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Meta CAPI Sincronizado
          </span>
        </div>
      </header>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="vector-bg-panel vector-border p-5 rounded-lg">
          <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">
            MER (ROAS Global)
          </p>
          <p className="text-2xl font-black text-[var(--text-main)] font-mono">
            {activeTenant?.mer}
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-lg">
          <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">
            CAC (Costo Adquisición)
          </p>
          <p className="text-2xl font-black text-[var(--text-main)] font-mono">
            {activeTenant?.cac} <span className="text-xs font-normal">MXN</span>
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-lg">
          <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">
            LTV (Valor Vida Cliente)
          </p>
          <p className="text-2xl font-black text-neon font-mono">
            {activeTenant?.ltv} <span className="text-xs font-normal">MXN</span>
          </p>
        </div>

        <div className="vector-bg-panel border border-[var(--success)] bg-[var(--success-bg)] p-5 rounded-lg">
          <p className="text-[10px] font-mono text-[var(--success)] font-bold uppercase mb-2">
            Citas Agendadas IA
          </p>
          <p className="text-2xl font-black text-[var(--text-main)] font-mono flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[var(--success)]" />
            <span>{activeTenant?.citas}</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Radar de Prospectos + Reporte DeepSeek */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Radar de Leads */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="vector-bg-card vector-border rounded-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-main)]">
                  <Users className="w-4 h-4 text-neon" />
                  <span>Radar de Prospectos (Leads)</span>
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                  Calificación de intención y origen CAPI en tiempo real.
                </p>
              </div>
              <span className="text-[10px] font-mono bg-neon text-black px-2 py-1 rounded font-bold">
                Últimas 24h
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--bg-base)] text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
                  <tr>
                    <th className="p-4 font-normal">Nombre / Contacto</th>
                    <th className="p-4 font-normal">Origen (Atribución)</th>
                    <th className="p-4 font-normal">Temperatura (Scoring)</th>
                    <th className="p-4 font-normal">Estado IA</th>
                    <th className="p-4 font-normal text-right">Análisis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {/* Lead 1: Ana Martínez */}
                  <tr className="hover:bg-[var(--bg-panel)] transition-colors">
                    <td className="p-4 font-bold text-[var(--text-main)] text-xs">
                      Ana Martínez
                      <br />
                      <span className="text-[10px] font-mono text-[var(--text-muted)] font-normal">
                        +52 55 1234 5678
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-[10px] text-blue-400 font-mono">
                        <Facebook className="w-3.5 h-3.5" /> Meta Ads (Campaña A)
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)] rounded text-[10px] font-bold uppercase tracking-wider shadow-[0_0_8px_var(--success-bg)] flex items-center gap-1 w-fit">
                        <Flame className="w-3 h-3" /> Caliente
                      </span>
                    </td>
                    <td className="p-4 text-[10px] text-[var(--text-muted)] font-mono">
                      Cita Agendada Jue 14:00
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={handleShowDictamenAna}
                        className="text-[10px] bg-[var(--bg-base)] border border-[var(--border-color)] px-3 py-1.5 rounded hover:border-neon text-[var(--text-main)] transition-colors flex items-center justify-end gap-1 ml-auto"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Ver Dictamen</span>
                      </button>
                    </td>
                  </tr>

                  {/* Lead 2: Roberto Sánchez */}
                  <tr className="hover:bg-[var(--bg-panel)] transition-colors">
                    <td className="p-4 font-bold text-[var(--text-main)] text-xs">
                      Roberto Sánchez
                      <br />
                      <span className="text-[10px] font-mono text-[var(--text-muted)] font-normal">
                        DM Instagram
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-[10px] text-pink-500 font-mono">
                        <Instagram className="w-3.5 h-3.5" /> Perfil Orgánico
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)] rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                        <Thermometer className="w-3 h-3" /> Tibio
                      </span>
                    </td>
                    <td className="p-4 text-[10px] text-[var(--text-muted)] font-mono">
                      Dudas de precio. En Follow-up.
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={handleShowDictamenRoberto}
                        className="text-[10px] bg-[var(--bg-base)] border border-[var(--border-color)] px-3 py-1.5 rounded hover:border-neon text-[var(--text-main)] transition-colors flex items-center justify-end gap-1 ml-auto"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Ver Dictamen</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Reporte Creativo IA (DeepSeek) */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1525] border border-[#a855f7]/50 p-6 rounded-lg relative shadow-[0_0_20px_rgba(168,85,247,0.15)] h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#a855f7]/20 rounded-md">
                  <BrainCircuit className="w-5 h-5 text-[#c084fc]" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-[#e9d5ff]">
                    Reporte Creativo IA
                  </h4>
                  <p className="text-[9px] font-mono text-[#a855f7]">
                    DeepSeek Analista
                  </p>
                </div>
              </div>

              <div className="bg-black/40 border border-[#a855f7]/30 p-4 rounded text-sm mb-4">
                <span className="text-[10px] font-bold uppercase text-[var(--danger)] tracking-wider flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-3 h-3" /> Fatiga Detectada
                </span>
                <p className="text-xs text-[#d8b4fe] leading-relaxed mb-4">
                  El anuncio <strong className="text-white">"Imagen Promo"</strong> superó la frecuencia de 3.5. Costos en aumento.
                </p>

                <div className="border-t border-[#a855f7]/30 pt-3">
                  <p className="text-[10px] font-mono text-[#e9d5ff] font-bold mb-2 uppercase">
                    Sugerencia (Diversidad):
                  </p>
                  <p className="text-xs text-[#d8b4fe] leading-relaxed">
                    Grabar Reel respondiendo dudas de precio (objeción principal de Leads Tibios esta semana).
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateScript}
              className="w-full mt-4 bg-[#a855f7] hover:bg-[#9333ea] text-white font-black text-[10px] uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] active:scale-95"
            >
              <PenTool className="w-4 h-4" />
              <span>Generar Guion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
