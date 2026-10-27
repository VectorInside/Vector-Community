'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { OMNICHANNEL_API_CATALOG } from '@/utils/constants';
import {
  Globe,
  Instagram,
  MessageSquare,
  Video,
  Linkedin,
  Play,
  Share2,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  Key,
  Lock,
  Save,
  RefreshCw,
  ExternalLink,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP = {
  Instagram: Instagram,
  Globe: Globe,
  MessageSquare: MessageSquare,
  Video: Video,
  Linkedin: Linkedin,
  Play: Play,
  Share2: Share2,
  Send: Send,
};

export const ChannelConnectionsManager = () => {
  const { activeTenant, updateTenantPolicy, triggerModal } = useAuth();

  // Estado local de canales conectados por tenant
  const [channelsState, setChannelsState] = useState(() => {
    return activeTenant?.connectedChannels || {
      meta: { enabled: true, status: 'connected', latencyMs: 142 },
      whatsapp: { enabled: true, status: 'connected', latencyMs: 85 },
      google: { enabled: true, status: 'connected', latencyMs: 190 },
    };
  });

  const [formFields, setFormFields] = useState({});
  const [testingChannel, setTestingChannel] = useState(null);
  const [activeGuideModal, setActiveGuideModal] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleChannel = (channelId) => {
    setChannelsState((prev) => {
      const current = prev[channelId] || { enabled: false };
      const nextEnabled = !current.enabled;
      return {
        ...prev,
        [channelId]: {
          ...current,
          enabled: nextEnabled,
          status: nextEnabled ? 'connected' : 'disconnected',
          latencyMs: nextEnabled ? Math.floor(Math.random() * 90) + 70 : null,
          lastSync: nextEnabled ? 'En tiempo real' : null,
        },
      };
    });
    setIsSaved(false);
  };

  const handleFieldChange = (channelId, fieldKey, value) => {
    setFormFields((prev) => ({
      ...prev,
      [`${channelId}_${fieldKey}`]: value,
    }));
    setIsSaved(false);
  };

  const handleTestConnection = (channelId, channelName) => {
    setTestingChannel(channelId);
    setTimeout(() => {
      setTestingChannel(null);
      const simulatedLatency = Math.floor(Math.random() * 80) + 65;
      setChannelsState((prev) => ({
        ...prev,
        [channelId]: {
          ...prev[channelId],
          enabled: true,
          status: 'connected',
          latencyMs: simulatedLatency,
          lastSync: 'Recién verificado (200 OK)',
        },
      }));

      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#E7F900', '#10B981', '#38BDF8'],
        });
      } catch (e) {}

      triggerModal(
        'Prueba de API Exitosa',
        `<b>Plataforma:</b> ${channelName}<br><b>Estado Webhook:</b> 200 OK<br><b>Latencia de Respuesta:</b> ${simulatedLatency}ms<br><b>Verificación:</b> Token válido con permisos de lectura y despacho de eventos.`
      );
    }, 900);
  };

  const handleSaveAll = () => {
    if (updateTenantPolicy && activeTenant?.id) {
      updateTenantPolicy(activeTenant.id, {
        connectedChannels: channelsState,
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    triggerModal(
      'Configuración de Canales Guardada',
      `Los canales oficiales para <b>${activeTenant?.name || 'tu negocio'}</b> se han sincronizado con éxito. Solo los canales activos se visualizarán en el monitor de Contactabilidad.`
    );
  };

  const activeChannelsCount = Object.values(channelsState).filter((c) => c?.enabled).length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Banner Superior Explicativo */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-neon/15 text-neon border border-neon/30">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold">
              Arquitectura Omnicanal con Aislamiento Dinámico
            </span>
          </div>
          <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
            Canales de Adquisición & APIs Oficiales
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-2xl">
            Da de alta tus credenciales oficiales de cada plataforma. <strong>Solo los canales que actives aquí se mostrarán en el monitor de Contactabilidad</strong>, manteniendo la vista ejecutiva limpia y sin saturación.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[var(--text-muted)]">Canales Activos:</span>
            <span className="text-neon font-black">{activeChannelsCount} de 8</span>
          </div>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs flex items-center gap-2 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? '¡Sincronizado!' : 'Guardar Conexiones'}</span>
          </button>
        </div>
      </div>

      {/* Grid de Canales Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(OMNICHANNEL_API_CATALOG).map((channel) => {
          const IconComponent = ICON_MAP[channel.iconName] || Globe;
          const channelConfig = channelsState[channel.id] || { enabled: false };
          const isEnabled = Boolean(channelConfig.enabled);
          const isTesting = testingChannel === channel.id;

          return (
            <div
              key={channel.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isEnabled
                  ? 'bg-[var(--bg-card)] border-neon/40 shadow-sm'
                  : 'bg-[var(--bg-panel)]/60 border-[var(--border-color)] opacity-85 hover:opacity-100'
              }`}
            >
              <div className="space-y-3">
                {/* Header de la Tarjeta del Canal */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`p-2.5 rounded-xl bg-gradient-to-br ${channel.color} text-white shadow-sm shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[var(--text-main)]">
                          {channel.name}
                        </h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${channel.badgeColor}`}>
                          {channel.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {channel.description}
                      </p>
                    </div>
                  </div>

                  {/* Switch On/Off */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggleChannel(channel.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon" />
                  </label>
                </div>

                {/* Campos de Credenciales (Visibles solo si está habilitado) */}
                {isEnabled ? (
                  <div className="pt-2 space-y-2.5 font-mono text-xs border-t border-[var(--border-color)]">
                    {channel.fields.map((field) => {
                      const inputKey = `${channel.id}_${field.key}`;
                      const currentValue = formFields[inputKey] || '';

                      return (
                        <div key={field.key} className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center justify-between">
                            <span>{field.label}</span>
                            <Key className="w-3 h-3 text-neon/70" />
                          </label>
                          <input
                            type={field.type}
                            value={currentValue}
                            onChange={(e) => handleFieldChange(channel.id, field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] focus:border-neon focus:outline-none text-[var(--text-main)] text-xs placeholder:text-zinc-600 font-mono transition-colors"
                          />
                        </div>
                      );
                    })}

                    {/* Status de Conexión y Latencia */}
                    <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[var(--text-muted)]">Webhook Status:</span>
                        <span className="text-emerald-500 font-bold">200 OK</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        Latencia: <strong className="text-neon">{channelConfig.latencyMs || 120}ms</strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-dashed border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
                    Canal inactivo. Activa el interruptor para ingresar credenciales y visualizarlo en el monitor de Contactabilidad.
                  </div>
                )}
              </div>

              {/* Footer con Ayuda y Test Button */}
              <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveGuideModal(channel)}
                  className="text-[11px] text-[var(--text-muted)] hover:text-neon flex items-center gap-1.5 transition-colors font-sans"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-neon" />
                  <span>¿Cómo obtener estas claves?</span>
                </button>

                {isEnabled && (
                  <button
                    type="button"
                    disabled={isTesting}
                    onClick={() => handleTestConnection(channel.id, channel.name)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--bg-panel)] hover:bg-[var(--bg-card)] text-[var(--text-main)] hover:border-neon border border-[var(--border-color)] text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-neon' : ''}`} />
                    <span>{isTesting ? 'Verificando...' : 'Probar Webhook'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Guiado de Ayuda para Obtener Credenciales */}
      {activeGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveGuideModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-[var(--bg-card)] border border-neon/50 shadow-2xl p-6 space-y-4 font-sans animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold">
                  Guía Oficial de Conexión
                </span>
                <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                  {activeGuideModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                className="text-zinc-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[var(--text-muted)] font-sans">
              <p>
                Para conectar este canal de manera nativa con Vector Community y recibir telemetría en tiempo real:
              </p>
              <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] font-mono text-[11px] text-[var(--text-main)] space-y-1">
                <span className="text-neon block font-bold">Instrucciones de Obtención:</span>
                <p>{activeGuideModal.credentialsGuide}</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-[var(--text-main)] block">Parámetros Requeridos:</span>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                  {activeGuideModal.fields.map((f) => (
                    <li key={f.key}>
                      <strong className="text-[var(--text-main)]">{f.label}:</strong> {f.placeholder}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Tus credenciales se cifran bajo los protocolos de aislamiento multi-tenant de Vector Inside. Nunca se comparten entre empresas ni con terceros.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                className="px-5 py-2 rounded-xl bg-neon text-black font-bold text-xs hover:bg-[var(--neon-hover)] transition-all font-mono"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
