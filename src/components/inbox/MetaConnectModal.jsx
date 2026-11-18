'use client';

import React, { useState, useEffect } from 'react';
import {
  Instagram,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Key,
  Server,
  Sparkles,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldAlert,
  Zap,
  Radio,
  FileText,
  Smartphone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { metaCommentService } from '@/services/metaCommentService';
import { Portal } from '@/components/common/Portal';

export const MetaConnectModal = ({
  isOpen,
  onClose,
  activeTenant,
  onSaveCredentials,
  onTestConnection,
}) => {
  const [instagramAccountId, setInstagramAccountId] = useState('');
  const [accountHandle, setAccountHandle] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [webhookVerifyToken, setWebhookVerifyToken] = useState('VectorInsideSecureWebhookToken2026');
  const [showToken, setShowToken] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Cargar credenciales existentes del tenant
  useEffect(() => {
    if (activeTenant) {
      const igConfig = activeTenant.connectedChannels?.instagram || {};
      setInstagramAccountId(igConfig.instagramAccountId || activeTenant.instagramAccountId || '');
      setAccountHandle(igConfig.accountHandle || activeTenant.instagramHandle || '');
      setAccessToken(igConfig.accessToken || '');
      if (igConfig.webhookVerifyToken) {
        setWebhookVerifyToken(igConfig.webhookVerifyToken);
      }
      setTestResult(null);
      setValidationError('');
    }
  }, [activeTenant, isOpen]);

  // Cierre con Escape y bloqueo de scroll del body
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow || 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://vectorinside.com';
  const callbackUrl = `${currentOrigin}/api/v1/webhooks/meta-comments`;

  const handleCopy = (text, fieldName) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleSave = async () => {
    if (!instagramAccountId.trim()) {
      setValidationError('Por favor ingresa el Instagram Business Account ID para vincular el canal.');
      return;
    }
    setValidationError('');

    const payload = {
      instagramAccountId: instagramAccountId.trim(),
      accountHandle: accountHandle.trim().replace('@', ''),
      accessToken: accessToken.trim(),
      webhookVerifyToken: webhookVerifyToken.trim() || 'VectorInsideSecureWebhookToken2026',
    };

    try {
      if (onSaveCredentials) {
        await onSaveCredentials(payload);
      }

      setIsSavedSuccess(true);
      try {
        confetti({ particleCount: 40, spread: 60, colors: ['#E1306C', '#C13584', '#00F0FF', '#E7F900'] });
      } catch (e) {
        console.warn('[MetaConnectModal] Confetti error:', e);
      }

      setTimeout(() => {
        setIsSavedSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setTestResult({
        success: false,
        message:
          err?.response?.data?.message ||
          err?.message ||
          'No se pudieron guardar las credenciales de Meta en PostgreSQL.',
      });
    }
  };

  const handleRunDiagnostic = async () => {
    setIsTesting(true);
    setTestResult(null);

    if (onTestConnection) {
      try {
        const res = await onTestConnection();
        setTestResult(res);
      } catch (err) {
        setTestResult({
          success: false,
          message: err?.response?.data?.message || err.message || 'Error al conectar con Meta Graph API',
        });
      } finally {
        setIsTesting(false);
      }
      return;
    }

    if (!activeTenant?.id) {
      setIsTesting(false);
      setTestResult({
        success: false,
        message: 'Selecciona un negocio activo para validar las credenciales contra el backend.',
      });
      return;
    }

    const startedAt = performance.now();
    try {
      const health = await metaCommentService.getHealthAndConfig(activeTenant.id);
      const elapsedMs = Math.round(performance.now() - startedAt);
      const isOk = Boolean(health?.connected || health?.isConfigured || health?.status === 'CONNECTED');
      setTestResult({
        success: isOk,
        message: isOk
          ? `Canal verificado en backend (${health?.status || 'CONNECTED'}). Meta Graph API v21.0 activa.`
          : 'El canal Meta/Instagram aún no está configurado en PostgreSQL para este negocio.',
        latency: `${elapsedMs}ms`,
        account:
          health?.accountHandle ||
          (accountHandle ? `@${accountHandle.replace('@', '')}` : 'Instagram Professional'),
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Error validando canal Meta contra el backend.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative w-full max-w-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans animate-scale-up">
          {/* Header con gradiente Instagram dual-theme */}
          <div className="p-6 border-b border-[var(--border-color)] bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-[var(--bg-panel)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[var(--text-main)] font-mono tracking-tight">
                    Conexión Meta Graph API v21.0
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-700 dark:text-pink-400 border border-pink-500/30 font-bold">
                    Instagram &amp; Facebook
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {activeTenant?.name ? `Para el negocio: ${activeTenant.name}` : 'Monitoreo de comentarios y respuestas con IA'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              aria-label="Cerrar modal"
              className="w-8 h-8 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] flex items-center justify-center transition-colors font-mono text-sm"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs custom-scrollbar">
            {/* Banner de Estado */}
            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-pink-500/25 flex items-start gap-3">
              <Radio className="w-5 h-5 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <span className="font-bold text-[var(--text-main)] text-xs block font-mono">
                  Sincronización Bidireccional en Tiempo Real (0ms)
                </span>
                <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                  Al conectar Meta Graph API, cada comentario recibido en tus Reels y publicaciones es evaluado por la IA de Vector Inside según tu <b>Manual de Identidad</b>. Si es un lead comercial, se despacha un <b>Private Reply (DM)</b> y se crea el prospecto en tu CRM Kanban.
                </p>
              </div>
            </div>

            {/* Guía Rápida Plegable (5 Pasos Oficiales) */}
            <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--bg-card-subtle)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--neon-text)]" />
                  <span className="font-bold text-[var(--text-main)] font-mono text-xs">
                    Guía Oficial de Conexión en 5 Pasos (Requisitos de Meta)
                  </span>
                </div>
                {isGuideOpen ? (
                  <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                )}
              </button>

              {isGuideOpen && (
                <div className="p-4 pt-1 border-t border-[var(--border-color)] space-y-3 text-[11px] text-[var(--text-muted)] font-sans">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                      <span className="w-5 h-5 rounded-full bg-pink-500/15 text-pink-700 dark:text-pink-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                        1
                      </span>
                      <div>
                        <p className="font-bold text-[var(--text-main)]">Instagram Profesional (Empresa o Creador)</p>
                        <p className="text-[var(--text-muted)] text-[10px]">
                          Tu cuenta de Instagram debe ser de tipo <b>Profesional</b> (Business o Creator). Las cuentas personales no tienen acceso a la Graph API de comentarios.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                      <span className="w-5 h-5 rounded-full bg-pink-500/15 text-pink-700 dark:text-pink-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                        2
                      </span>
                      <div>
                        <p className="font-bold text-[var(--text-main)]">Vincular Fan Page de Facebook</p>
                        <p className="text-[var(--text-muted)] text-[10px]">
                          En la configuración de Instagram o en Meta Business Suite, enlaza tu cuenta de Instagram con una Fan Page de Facebook de la cual seas Administrador.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-800 dark:text-amber-300">Paso Crítico: Switch en la App Móvil de Instagram</p>
                        <p className="text-[var(--text-main)] text-[10px] leading-relaxed">
                          Abre la app de Instagram en tu teléfono: <code>Configuración y privacidad &gt; Mensajes y respuestas a historias &gt; Herramientas conectadas &gt; <b>Permitir acceso a los mensajes</b></code> (Debe estar <b>ACTIVADO</b> para permitir Private Replies automáticas).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                      <span className="w-5 h-5 rounded-full bg-pink-500/15 text-pink-700 dark:text-pink-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                        4
                      </span>
                      <div>
                        <p className="font-bold text-[var(--text-main)]">Obtener Instagram Business Account ID y Token</p>
                        <p className="text-[var(--text-muted)] text-[10px]">
                          En <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-[var(--neon-text)] font-semibold hover:underline inline-flex items-center gap-0.5">Meta for Developers <ExternalLink className="w-2.5 h-2.5" /></a>, crea una App con permisos: <code>instagram_manage_comments</code>, <code>instagram_manage_messages</code>, <code>pages_show_list</code>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                      <span className="w-5 h-5 rounded-full bg-pink-500/15 text-pink-700 dark:text-pink-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                        5
                      </span>
                      <div>
                        <p className="font-bold text-[var(--text-main)]">Configurar el Webhook Oficial de Vector Inside</p>
                        <p className="text-[var(--text-muted)] text-[10px]">
                          En el panel de Webhooks de Meta, suscribe el objeto <b>Instagram</b> con los campos <code>comments</code> y <code>mentions</code> usando los datos de abajo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Datos del Webhook (Copy-Paste para Meta) */}
            <div className="space-y-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-mono tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Datos para el Webhook en Meta for Developers</span>
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Callback URL */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--text-muted)] font-mono flex items-center justify-between">
                    <span>URL de Devolución de Llamada (Callback URL):</span>
                    <span className="text-pink-600 dark:text-pink-400 font-mono text-[9px]">GET (Handshake) &amp; POST (Eventos)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={callbackUrl}
                      className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] font-mono text-[11px] outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(callbackUrl, 'url')}
                      className="p-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors shrink-0"
                      title="Copiar URL"
                    >
                      {copiedField === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Verify Token */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--text-muted)] font-mono flex items-center justify-between">
                    <span>Token de Verificación (Verify Token):</span>
                    <span className="text-[var(--neon-text)] font-mono font-bold text-[9px]">hub.verify_token</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={webhookVerifyToken}
                      onChange={(e) => setWebhookVerifyToken(e.target.value)}
                      className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--neon-text)] font-bold font-mono text-[11px] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(webhookVerifyToken, 'token')}
                      className="p-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors shrink-0"
                      title="Copiar Token"
                    >
                      {copiedField === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Credenciales de Meta */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-mono tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[var(--neon-text)]" />
                <span>Credenciales Oficiales de la Cuenta</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--text-muted)]">
                    Instagram Business Account ID <span className="text-rose-600 dark:text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ej: 17841400123456789"
                    value={instagramAccountId}
                    onChange={(e) => {
                      setInstagramAccountId(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    className={`w-full bg-[var(--bg-card)] border rounded-xl px-3.5 py-2.5 text-[var(--text-main)] text-xs outline-none focus:border-pink-500 font-mono ${
                      validationError && !instagramAccountId.trim() ? 'border-rose-500/60' : 'border-[var(--border-color)]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--text-muted)]">
                    Usuario de Instagram (Handle)
                  </label>
                  <input
                    type="text"
                    placeholder="ej: @vectorinside"
                    value={accountHandle}
                    onChange={(e) => setAccountHandle(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-main)] text-xs outline-none focus:border-pink-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <label className="text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                  <span>Meta Access Token (System User / Page Token Permanente)</span>
                  <span className="text-[var(--text-muted)] text-[9px]">Cifrado AES-256 en Base de Datos</span>
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    placeholder="EAABw..."
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 pr-10 text-[var(--text-main)] text-xs outline-none focus:border-pink-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Resultado de Diagnóstico */}
            {testResult && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 animate-fade-in ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <p className="font-bold text-xs">{testResult.message}</p>
                  {testResult.account && (
                    <p className="text-[10px] font-mono opacity-85">
                      Cuenta: {testResult.account}
                      {testResult.latency ? ` • Latencia: ${testResult.latency}` : ''}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer con Acciones */}
          <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
            <button
              type="button"
              disabled={isTesting}
              onClick={handleRunDiagnostic}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-main)] border border-[var(--border-color)] text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-pink-600 dark:text-pink-400' : ''}`} />
              <span>{isTesting ? 'Probando Handshake...' : 'Diagnóstico de Conexión'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
              >
                {isSavedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>¡Conectado!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar y Vincular Canal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
