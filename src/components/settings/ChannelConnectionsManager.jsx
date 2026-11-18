'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { OMNICHANNEL_API_CATALOG } from '@/utils/constants';
import { Portal } from '@/components/common/Portal';
import api from '@/services/api';
import { metaCommentService } from '@/services/metaCommentService';
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
  Plus,
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
  const { activeTenant, updateTenantPolicy, triggerModal, isAdmin } = useAuth();

  // Estado local de canales conectados por tenant
  const [channelsState, setChannelsState] = useState(() => {
    return activeTenant?.connectedChannels || {
      meta: { enabled: false, status: 'disconnected', latencyMs: null },
      whatsapp: { enabled: false, status: 'disconnected', latencyMs: null },
      google: { enabled: false, status: 'disconnected', latencyMs: null },
    };
  });

  React.useEffect(() => {
    if (activeTenant?.connectedChannels) {
      setChannelsState(activeTenant.connectedChannels);
      const prefill = {};
      Object.entries(activeTenant.connectedChannels).forEach(([chanId, val]) => {
        if (val && typeof val === 'object') {
          Object.entries(val).forEach(([k, v]) => {
            if (typeof v === 'string') {
              prefill[`${chanId}_${k}`] = v;
            }
          });
        }
      });
      setFormFields((prev) => ({ ...prefill, ...prev }));
    }
  }, [activeTenant]);

  const [formFields, setFormFields] = useState({});
  const [testingChannel, setTestingChannel] = useState(null);
  const [activeGuideModal, setActiveGuideModal] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Cerrar modal con Escape y bloquear scroll de fondo cuando está abierto
  useEffect(() => {
    if (!activeGuideModal) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveGuideModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeGuideModal]);

  const handleToggleChannel = async (channelId) => {
    const current = channelsState[channelId] || { enabled: false };
    const nextEnabled = !current.enabled;
    const nextChannelsState = {
      ...channelsState,
      [channelId]: {
        ...current,
        enabled: nextEnabled,
        status: nextEnabled ? 'configured' : 'disconnected',
        latencyMs: null,
        lastSync: nextEnabled ? 'Pendiente de verificar' : null,
      },
    };
    setChannelsState(nextChannelsState);
    setIsSaved(false);

    if (updateTenantPolicy && activeTenant?.id) {
      const res = await updateTenantPolicy(activeTenant.id, {
        connectedChannels: nextChannelsState,
      });
      if (res && res.success === false) {
        triggerModal(
          'Error al Actualizar Canal',
          res?.error?.response?.data?.message ||
            res?.error?.message ||
            'No se pudo persistir el estado del canal en PostgreSQL.'
        );
      }
    }
  };

  const handleFieldChange = (channelId, fieldKey, value) => {
    setFormFields((prev) => ({
      ...prev,
      [`${channelId}_${fieldKey}`]: value,
    }));
    setIsSaved(false);
  };

  const handleTestConnection = async (channelId, channelName) => {
    if (!activeTenant?.id) {
      triggerModal(
        'Negocio Requerido',
        'Selecciona un negocio activo para verificar las credenciales contra el backend.'
      );
      return;
    }

    setTestingChannel(channelId);
    const startedAt = performance.now();

    try {
      if (channelId === 'whatsapp') {
        const response = await api.get(`/webhooks/whatsapp/health/${activeTenant.id}`);
        const data = response?.data?.data ?? response?.data ?? {};
        const elapsedMs = Math.round(performance.now() - startedAt);
        const isOk = Boolean(data?.connected || data?.isConfigured || data?.status === 'CONNECTED');

        setChannelsState((prev) => ({
          ...prev,
          [channelId]: {
            ...prev[channelId],
            enabled: isOk ? true : Boolean(prev[channelId]?.enabled),
            status: isOk ? 'connected' : 'disconnected',
            latencyMs: elapsedMs,
            lastSync: isOk ? `Verificado (${elapsedMs}ms)` : 'Sin configurar en backend',
          },
        }));

        if (isOk) {
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#E7F900', '#10B981', '#38BDF8'],
            });
          } catch (e) {}
          triggerModal(
            'WhatsApp Cloud API Verificado',
            `<b>Plataforma:</b> ${channelName}<br><b>Estado Backend:</b> ${data?.status || 'CONNECTED'}<br><b>Latencia Real:</b> ${elapsedMs}ms`
          );
        } else {
          triggerModal(
            'WhatsApp No Configurado en Backend',
            `El endpoint <code>/webhooks/whatsapp/health/${activeTenant.id}</code> respondió en ${elapsedMs}ms pero no hay credenciales activas guardadas en PostgreSQL. Ingresa tus claves y haz clic en <b>Guardar Conexiones</b>.`
          );
        }
        return;
      }

      if (channelId === 'instagram' || channelId === 'meta') {
        const health = await metaCommentService.getHealthAndConfig(activeTenant.id);
        const elapsedMs = Math.round(performance.now() - startedAt);
        const isOk = Boolean(health?.connected || health?.isConfigured || health?.status === 'CONNECTED');

        setChannelsState((prev) => ({
          ...prev,
          [channelId]: {
            ...prev[channelId],
            enabled: isOk ? true : Boolean(prev[channelId]?.enabled),
            status: isOk ? 'connected' : 'disconnected',
            latencyMs: elapsedMs,
            lastSync: isOk ? `Verificado (${elapsedMs}ms)` : 'Sin configurar en backend',
          },
        }));

        if (isOk) {
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#E7F900', '#10B981', '#38BDF8'],
            });
          } catch (e) {}
          triggerModal(
            'Meta / Instagram API Verificado',
            `<b>Plataforma:</b> ${channelName}<br><b>Estado Backend:</b> ${health?.status || 'CONNECTED'}<br><b>Latencia Real:</b> ${elapsedMs}ms`
          );
        } else {
          triggerModal(
            'Meta / Instagram No Configurado',
            `El backend respondió en ${elapsedMs}ms pero el canal Meta/Instagram aún no tiene credenciales activas en PostgreSQL para este negocio.`
          );
        }
        return;
      }

      // Otros canales (Google, TikTok, LinkedIn, YouTube, etc.): verificar credenciales guardadas en backend (tenant)
      const catalogEntry = OMNICHANNEL_API_CATALOG[channelId];
      const savedChannel = activeTenant?.connectedChannels?.[channelId] || {};
      const requiredFields = catalogEntry?.fields || [];
      const missingFields = requiredFields.filter(
        (f) => !String(savedChannel[f.key] || '').trim()
      );
      const isConfiguredInBackend = Boolean(savedChannel.enabled) && missingFields.length === 0;

      setChannelsState((prev) => ({
        ...prev,
        [channelId]: {
          ...prev[channelId],
          status: isConfiguredInBackend ? 'connected' : 'disconnected',
          latencyMs: null,
          lastSync: isConfiguredInBackend
            ? 'Credenciales guardadas en PostgreSQL'
            : 'Faltan credenciales en backend',
        },
      }));

      if (isConfiguredInBackend) {
        triggerModal(
          'Credenciales Verificadas en PostgreSQL',
          `<b>Plataforma:</b> ${channelName}<br><b>Estado:</b> Habilitado y con todos los parámetros requeridos guardados en el tenant.`
        );
      } else {
        const missingLabels = missingFields.map((f) => f.label).join(', ');
        triggerModal(
          'Credenciales Pendientes en Backend',
          `<b>Plataforma:</b> ${channelName}<br>${
            missingLabels
              ? `<b>Campos faltantes en PostgreSQL:</b> ${missingLabels}<br>`
              : 'El canal no está habilitado en PostgreSQL.<br>'
          }Completa los campos y presiona <b>Guardar Conexiones</b> para persistirlos.`
        );
      }
    } catch (err) {
      setChannelsState((prev) => ({
        ...prev,
        [channelId]: {
          ...prev[channelId],
          status: 'error',
          latencyMs: null,
          lastSync: 'Error de verificación',
        },
      }));
      triggerModal(
        'Error al Verificar Conexión',
        err?.response?.data?.message ||
          err?.message ||
          `No se pudo verificar ${channelName} contra el backend.`
      );
    } finally {
      setTestingChannel(null);
    }
  };

  const handleSaveAll = async () => {
    if (updateTenantPolicy && activeTenant?.id) {
      const SECRET_TOKEN_KEYS = ['accessToken', 'apiSecret', 'clientSecret', 'bearerToken', 'botToken'];
      const maskSecret = (val) => {
        if (!val || typeof val !== 'string') return val;
        const trimmed = val.trim();
        if (!trimmed || trimmed.startsWith('••••')) return trimmed;
        return trimmed.length > 4 ? `••••••••${trimmed.slice(-4)}` : '••••••••';
      };

      const rawConsolidated = { ...channelsState };
      const sanitizedConsolidated = { ...channelsState };

      Object.keys(rawConsolidated).forEach((chanId) => {
        const rawChanObj = { ...rawConsolidated[chanId] };
        const cleanChanObj = { ...sanitizedConsolidated[chanId] };
        Object.keys(formFields).forEach((formKey) => {
          if (formKey.startsWith(`${chanId}_`)) {
            const rawProp = formKey.replace(`${chanId}_`, '');
            rawChanObj[rawProp] = formFields[formKey];
            cleanChanObj[rawProp] = SECRET_TOKEN_KEYS.includes(rawProp)
              ? maskSecret(formFields[formKey])
              : formFields[formKey];
          }
        });
        SECRET_TOKEN_KEYS.forEach((secKey) => {
          if (cleanChanObj[secKey]) {
            cleanChanObj[secKey] = maskSecret(cleanChanObj[secKey]);
          }
        });
        rawConsolidated[chanId] = rawChanObj;
        sanitizedConsolidated[chanId] = cleanChanObj;
      });

      const errors = [];

      const waRaw = rawConsolidated.whatsapp;
      if (waRaw && (waRaw.phoneNumberId || waRaw.accessToken || waRaw.wabaId)) {
        try {
          await api.post(`/webhooks/whatsapp/connect/${activeTenant.id}`, {
            phoneNumberId: waRaw.phoneNumberId || '',
            wabaId: waRaw.wabaId || '',
            accessToken: waRaw.accessToken || '',
            verifyToken: waRaw.verifyToken || 'VectorInsideSecureWebhookToken2026',
          });
        } catch (err) {
          errors.push(
            `<b>WhatsApp:</b> ${err?.response?.data?.message || err?.message || 'Error al guardar credenciales en backend'}`
          );
        }
      }

      const metaRaw = rawConsolidated.meta;
      if (metaRaw && (metaRaw.pixelId || metaRaw.accessToken || metaRaw.instagramAccountId)) {
        const connectFn = metaCommentService.connectAccount || metaCommentService.connectInstagram;
        if (typeof connectFn === 'function') {
          try {
            await connectFn.call(metaCommentService, activeTenant.id, {
              instagramAccountId: metaRaw.instagramAccountId || metaRaw.pixelId || '',
              accountHandle: metaRaw.accountHandle || activeTenant?.shortName || '',
              accessToken: metaRaw.accessToken || '',
              webhookVerifyToken: metaRaw.verifyToken || 'VectorInsideMetaWebhook2026',
            });
          } catch (err) {
            errors.push(
              `<b>Meta / Instagram:</b> ${err?.response?.data?.message || err?.message || 'Error al guardar credenciales en backend'}`
            );
          }
        }
      }

      const policyRes = await updateTenantPolicy(activeTenant.id, {
        connectedChannels: sanitizedConsolidated,
        whatsappNumberId: sanitizedConsolidated?.whatsapp?.phoneNumberId || activeTenant?.whatsappNumberId,
      });
      if (policyRes && policyRes.success === false) {
        errors.push(
          `<b>Tenant PostgreSQL:</b> ${policyRes?.error?.response?.data?.message || policyRes?.error?.message || 'Error al persistir configuración'}`
        );
      }

      if (errors.length > 0) {
        triggerModal('Error al Guardar Conexiones', errors.join('<br/>'));
        return;
      }
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    triggerModal(
      'Configuración de Canales Guardada',
      `Los canales oficiales para <b>${activeTenant?.name || 'tu negocio'}</b> se han sincronizado con éxito. Solo los canales activos se visualizarán en el monitor de Contactabilidad.`
    );
  };

  const activeChannelsCount = Object.values(channelsState).filter((c) => c?.enabled).length;
  const totalCatalogChannels = Object.keys(OMNICHANNEL_API_CATALOG).length;

  if (!activeTenant) {
    return (
      <div className="p-12 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-center space-y-4 font-mono">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-3xl">
          📡
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--text-main)]">
            No hay un negocio seleccionado o registrado
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            El ecosistema se encuentra limpio (Zero-State). Para conectar WhatsApp Business API, Meta Ads, TikTok y Google Calendar con aislamiento estricto, da de alta tu primer negocio.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('vector_config_set_tab', {
                  detail: { tab: 'rag', mode: 'wizard' },
                })
              );
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon text-black font-bold text-xs uppercase hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Alta Nuevo Negocio</span>
          </button>
        )}
      </div>
    );
  }

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
            <span className="text-lime-700 dark:text-neon font-black">
              {activeChannelsCount} de {totalCatalogChannels}
            </span>
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
                    <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon" />
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
                        <span
                          className={`w-2 h-2 rounded-full ${
                            channelConfig.status === 'connected'
                              ? 'bg-emerald-500 animate-pulse'
                              : channelConfig.status === 'error'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-[var(--text-muted)]">Estado:</span>
                        <span
                          className={`font-bold ${
                            channelConfig.status === 'connected'
                              ? 'text-emerald-700 dark:text-emerald-500'
                              : channelConfig.status === 'error'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {channelConfig.lastSync || (channelConfig.status === 'connected' ? 'Conectado' : 'Pendiente de verificar')}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        Latencia:{' '}
                        <strong className="text-neon">
                          {channelConfig.latencyMs != null ? `${channelConfig.latencyMs}ms` : '—'}
                        </strong>
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
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveGuideModal(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Guía oficial de conexión: ${activeGuideModal.name}`}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-[var(--bg-card)] border border-neon/50 shadow-2xl p-6 space-y-4 font-sans animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between pb-3 border-b border-[var(--border-color)]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-lime-700 dark:text-neon font-bold">
                    Guía Oficial de Conexión
                  </span>
                  <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                    {activeGuideModal.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveGuideModal(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-lg font-bold p-1 rounded-lg hover:bg-[var(--bg-panel)] transition-colors"
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-[var(--text-muted)] font-sans">
                <p>
                  Para conectar este canal de manera nativa con Vector Community y recibir telemetría en tiempo real:
                </p>
                <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] font-mono text-[11px] text-[var(--text-main)] space-y-1">
                  <span className="text-lime-700 dark:text-neon block font-bold">Instrucciones de Obtención:</span>
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

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-800 dark:text-blue-300 text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
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
        </Portal>
      )}
    </div>
  );
};
