'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Portal } from './Portal';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Globe,
  Share2,
  QrCode,
  Sparkles,
  Upload,
  Trash2,
  Save,
  Download,
  Sliders,
  Store,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Layers,
  Plus,
  Clock,
  MapPin,
  Tag,
  Phone,
  ArrowUp,
  ArrowDown,
  Printer,
  Palette,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_COVERS = {
  dental: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
  polanco: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  urban: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
  corp: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
};

const DEFAULT_LEAD_FORMS = {
  dental: {
    title: 'Motivo principal de consulta:',
    subtitle: 'Te orientamos sobre fechas y presupuestos en minutos',
    buttonText: 'Solicitar Cita de Valoración',
    options: ['Limpieza Dental', 'Implante Molar', 'Ortodoncia', 'Diagnóstico General'],
  },
  polanco: {
    title: 'Reserva tu Mesa VIP en Terraza:',
    subtitle: 'Confirmación prioritaria por WhatsApp en < 5 min',
    buttonText: 'Solicitar Reserva de Mesa',
    options: ['2 comensales', '4 comensales', '6 comensales', 'Mesa VIP 8+'],
  },
  urban: {
    title: 'Talla o Modelo a consultar / apartar:',
    subtitle: 'Verificamos disponibilidad de tu talla de inmediato',
    buttonText: 'Consultar Stock & Apartar',
    options: ['26 MX', '26.5 MX', '27 MX', '27.5 MX', '28 MX'],
  },
  corp: {
    title: 'Servicio de Interés Estratégico:',
    subtitle: 'Sesión de 30 min con un consultor de soluciones',
    buttonText: 'Agendar Discovery Call (30 min)',
    options: ['Automatización IA', 'Integración CRM', 'Agentes Multi-Canal', 'Consultoría B2B'],
  },
};

const DEFAULT_SERVICES = {
  dental: [
    { title: 'Diagnóstico Digital 3D', desc: 'Escaneo intraoral sin molde incómodo', badge: 'Gratis esta semana', tone: 'neon' },
    { title: 'Limpieza Ultrasónica & Pulido', desc: 'Profilaxis profunda con ultrasonido y flúor', badge: 'Más solicitado', tone: 'emerald' },
    { title: 'Ortodoncia Invisible', desc: 'Alineadores transparentes de última generación', badge: 'Hasta 12 MSI', tone: 'blue' },
    { title: 'Blanqueamiento Láser LED', desc: 'Aclara hasta 4 tonos en 1 sola sesión de 45 min', badge: '-20% Descuento', tone: 'neon' },
  ],
  polanco: [
    { title: 'Reserva de Mesa VIP & Terraza', desc: 'Asignación prioritaria para ocasiones especiales', badge: 'Confirmación 5 min', tone: 'emerald' },
    { title: 'Menú Degustación 5 Tiempos', desc: 'Maridaje exclusivo seleccionado por nuestro Sommelier', badge: 'Recomendado', tone: 'neon' },
    { title: 'Cavas & Mixología de Autor', desc: 'Coctelería premium con destilados artesanales', badge: 'Happy Hour 6-8pm', tone: 'blue' },
  ],
  urban: [
    { title: 'Drops Exclusivos & Sneakers Hype', desc: 'Ediciones limitadas de Nike, Jordan, Yeezy y New Balance', badge: 'Stock Limitado', tone: 'neon' },
    { title: 'Envío Express Mismo Día', desc: 'Entregas seguras en CDMX en menos de 4 horas', badge: 'Envío Gratis > $2,500', tone: 'emerald' },
    { title: 'Verificación de Autenticidad', desc: 'Certificado físico y digital de legitimidad por expertos', badge: '100% Original', tone: 'blue' },
  ],
};

export const MicroLandingPreviewModal = ({ isOpen, onClose, tenant }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('customize'); // 'customize' | 'qr' | 'overview'
  const [activeSubSection, setActiveSubSection] = useState('services'); // 'brand' | 'services' | 'contact'
  const [deviceMode, setDeviceMode] = useState('iphone'); // 'iphone' | 'android'
  const [savedSuccess, setSavedSuccess] = useState(false);

  const badgeToneOptions = [
    { id: 'emerald', label: 'Esmeralda', badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    { id: 'neon', label: 'Neón', badgeClass: 'bg-[#D4FF00]/15 text-[#D4FF00] border-[#D4FF00]/30' },
    { id: 'blue', label: 'Zafiro', badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    { id: 'purple', label: 'Violeta VIP', badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    { id: 'amber', label: 'Ámbar', badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  ];

  // Customization state
  const [customData, setCustomData] = useState({
    name: '',
    tagline: '',
    phone: '',
    address: '',
    hoursWeek: '',
    hoursWeekend: '',
    logo: null,
    cover: null,
    services: [],
    leadForm: {
      title: '',
      subtitle: '',
      buttonText: '',
      options: [],
    },
  });

  const iframeRef = useRef(null);
  const qrCanvasRef = useRef(null);

  // Initialize tenant data from localStorage or tenant defaults
  useEffect(() => {
    if (!tenant) return;
    const defaultList = DEFAULT_SERVICES[tenant.id] || DEFAULT_SERVICES.dental;
    const defaultCover = DEFAULT_COVERS[tenant.id] || DEFAULT_COVERS.dental;
    const defaultLeadForm = DEFAULT_LEAD_FORMS[tenant.id] || DEFAULT_LEAD_FORMS.dental;

    try {
      const saved = localStorage.getItem(`vector_microlanding_${tenant.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomData({
          name: parsed.name || tenant.name || 'Mi Negocio',
          tagline: parsed.tagline || (tenant.giro ? `${tenant.giro} de vanguardia y atención personalizada.` : 'Atención inmediata y personalizada.'),
          phone: parsed.phone || tenant.phone || '+525512345678',
          address: parsed.address || 'Av. Horacio 1520, Polanco, Miguel Hidalgo, CDMX',
          hoursWeek: parsed.hoursWeek || 'Lun–Vie: 09:00 a 19:00 hrs',
          hoursWeekend: parsed.hoursWeekend || 'Sáb: 09:00 a 14:00 hrs',
          ga4MeasurementId: parsed.ga4MeasurementId || tenant.ga4MeasurementId || '',
          metaPixelId: parsed.metaPixelId || tenant.metaPixelId || '',
          logo: parsed.logo || null,
          cover: parsed.cover || defaultCover,
          services: parsed.services && parsed.services.length > 0 ? parsed.services : defaultList,
          leadForm: parsed.leadForm || defaultLeadForm,
        });
      } else {
        setCustomData({
          name: tenant.name || 'Mi Negocio',
          tagline: tenant.giro ? `${tenant.giro} de vanguardia y atención personalizada.` : 'Atención inmediata y personalizada.',
          phone: tenant.phone || '+525512345678',
          address: 'Av. Horacio 1520, Polanco, Miguel Hidalgo, CDMX',
          hoursWeek: 'Lun–Vie: 09:00 a 19:00 hrs',
          hoursWeekend: 'Sáb: 09:00 a 14:00 hrs',
          ga4MeasurementId: tenant.ga4MeasurementId || '',
          metaPixelId: tenant.metaPixelId || '',
          logo: null,
          cover: defaultCover,
          services: defaultList,
          leadForm: defaultLeadForm,
        });
      }
    } catch (e) {
      setCustomData({
        name: tenant.name || 'Mi Negocio',
        tagline: 'Atención inmediata y personalizada.',
        phone: tenant.phone || '+525512345678',
        address: 'Av. Horacio 1520, Polanco, Miguel Hidalgo, CDMX',
        hoursWeek: 'Lun–Vie: 09:00 a 19:00 hrs',
        hoursWeekend: 'Sáb: 09:00 a 14:00 hrs',
        ga4MeasurementId: tenant.ga4MeasurementId || '',
        metaPixelId: tenant.metaPixelId || '',
        logo: null,
        cover: defaultCover,
        services: defaultList,
        leadForm: defaultLeadForm,
      });
    }
  }, [tenant]);

  // Sync with iframe whenever customData changes
  const notifyIframe = (data) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'VECTOR_MICROLANDING_UPDATE',
          tenantId: tenant.id,
          payload: data,
        },
        '*'
      );
    }
  };

  const handleUpdateField = (field, value) => {
    const updated = { ...customData, [field]: value };
    setCustomData(updated);
    try {
      localStorage.setItem(`vector_microlanding_${tenant.id}`, JSON.stringify(updated));
    } catch (e) {}
    notifyIframe(updated);
  };

  // Service list mutations
  const handleUpdateService = (index, field, value) => {
    const nextServices = [...customData.services];
    nextServices[index] = { ...nextServices[index], [field]: value };
    handleUpdateField('services', nextServices);
  };

  const handleAddService = () => {
    const newService = {
      title: 'Nuevo Servicio o Promoción',
      desc: 'Descripción breve de la oferta o tratamiento...',
      badge: 'Promo Exclusiva',
      tone: 'neon',
    };
    handleUpdateField('services', [...customData.services, newService]);
  };

  const handleRemoveService = (index) => {
    const nextServices = customData.services.filter((_, i) => i !== index);
    handleUpdateField('services', nextServices);
  };

  const handleDuplicateService = (index) => {
    const srv = customData.services[index];
    if (!srv) return;
    const duplicated = { ...srv, title: `${srv.title} (Copia)` };
    const nextServices = [...customData.services];
    nextServices.splice(index + 1, 0, duplicated);
    handleUpdateField('services', nextServices);
  };

  const handleMoveService = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= customData.services.length) return;
    const nextServices = [...customData.services];
    const [moved] = nextServices.splice(index, 1);
    nextServices.splice(targetIndex, 0, moved);
    handleUpdateField('services', nextServices);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert('Por favor selecciona una imagen menor a 2.5 MB para no sobrecargar el almacenamiento local.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      handleUpdateField('logo', base64);
      try {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#25D366', '#FFFFFF'],
        });
      } catch (err) {}
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    handleUpdateField('logo', null);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3.5 * 1024 * 1024) {
      alert('Por favor selecciona una imagen menor a 3.5 MB para no sobrecargar el almacenamiento local.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      handleUpdateField('cover', base64);
      try {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#25D366', '#FFFFFF'],
        });
      } catch (err) {}
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    const defaultCover = DEFAULT_COVERS[tenant?.id] || DEFAULT_COVERS.dental;
    handleUpdateField('cover', defaultCover);
  };

  // Lead Form state handlers
  const handleUpdateLeadFormField = (field, value) => {
    const current = customData.leadForm || DEFAULT_LEAD_FORMS[tenant?.id] || DEFAULT_LEAD_FORMS.dental;
    const updated = { ...current, [field]: value };
    handleUpdateField('leadForm', updated);
  };

  const handleAddLeadOption = () => {
    const current = customData.leadForm || DEFAULT_LEAD_FORMS[tenant?.id] || DEFAULT_LEAD_FORMS.dental;
    const nextOptions = [...(current.options || []), `Opción ${(current.options?.length || 0) + 1}`];
    handleUpdateLeadFormField('options', nextOptions);
  };

  const handleUpdateLeadOption = (index, value) => {
    const current = customData.leadForm || DEFAULT_LEAD_FORMS[tenant?.id] || DEFAULT_LEAD_FORMS.dental;
    const nextOptions = [...(current.options || [])];
    nextOptions[index] = value;
    handleUpdateLeadFormField('options', nextOptions);
  };

  const handleRemoveLeadOption = (index) => {
    const current = customData.leadForm || DEFAULT_LEAD_FORMS[tenant?.id] || DEFAULT_LEAD_FORMS.dental;
    const nextOptions = [...(current.options || [])];
    nextOptions.splice(index, 1);
    handleUpdateLeadFormField('options', nextOptions);
  };

  const handleLoadLeadFormPreset = (presetKey) => {
    const preset = DEFAULT_LEAD_FORMS[presetKey];
    if (preset) {
      handleUpdateField('leadForm', { ...preset });
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#25D366', '#FFFFFF'],
        });
      } catch (e) {}
    }
  };

  // Generate QR with Logo on Canvas
  useEffect(() => {
    if (activeTab !== 'qr' || !tenant || !qrCanvasRef.current) return;

    const canvas = qrCanvasRef.current;
    const prodUrl = `https://app.vectorinside.com/m/${tenant.id}`;

    QRCode.toCanvas(
      canvas,
      prodUrl,
      {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 280,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      },
      (error) => {
        if (error) {
          console.error('Error generating QR:', error);
          return;
        }

        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const centerSize = 64;
        const centerPos = (size - centerSize) / 2;

        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(centerPos - 4, centerPos - 4, centerSize + 8, centerSize + 8, 12);
        } else {
          ctx.arc(size / 2, size / 2, centerSize / 2 + 4, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#D4FF00';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (customData.logo) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(centerPos, centerPos, centerSize, centerSize, 8);
            } else {
              ctx.arc(size / 2, size / 2, centerSize / 2, 0, Math.PI * 2);
            }
            ctx.clip();
            ctx.drawImage(img, centerPos, centerPos, centerSize, centerSize);
            ctx.restore();
          };
          img.src = customData.logo;
        } else {
          ctx.font = '28px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(tenant.avatar || '⚡', size / 2, size / 2);
          ctx.restore();
        }
      }
    );
  }, [activeTab, tenant, customData.logo]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !tenant) return null;

  const prodUrl = `https://app.vectorinside.com/m/${tenant.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(prodUrl);
    setCopiedLink(true);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#D4FF00', '#25D366', '#FFFFFF'],
      });
    } catch (e) {}
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!qrCanvasRef.current) return;
    try {
      const link = document.createElement('a');
      link.download = `QR_${tenant.id || 'microlanding'}.png`;
      link.href = qrCanvasRef.current.toDataURL('image/png');
      link.click();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#D4FF00', '#25D366', '#FFFFFF'],
      });
    } catch (e) {
      console.error('Error downloading QR:', e);
    }
  };

  const handleDownloadStandCard = () => {
    if (!qrCanvasRef.current) return;
    try {
      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = 800;
      cardCanvas.height = 1100;
      const ctx = cardCanvas.getContext('2d');
      if (!ctx) return;

      // Dark Gradient Background
      const gradient = ctx.createLinearGradient(0, 0, 0, 1100);
      gradient.addColorStop(0, '#0D1117');
      gradient.addColorStop(1, '#07090D');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 1100);

      // Border Box with Neon Accent
      ctx.strokeStyle = '#D4FF00';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 1040);

      // Business Header
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(customData.name || tenant.name, 400, 120);

      // Subtitle
      ctx.fillStyle = '#A1A1AA';
      ctx.font = '20px sans-serif';
      ctx.fillText(customData.tagline || 'Atención personalizada directa por WhatsApp', 400, 160);

      // QR Code Container
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(175, 230, 450, 450);
      ctx.drawImage(qrCanvasRef.current, 195, 250, 410, 410);

      // Call to action text below QR
      ctx.fillStyle = '#D4FF00';
      ctx.font = 'bold 30px monospace';
      ctx.fillText('ESCANEA CON TU CÁMARA', 400, 760);

      ctx.fillStyle = '#E4E4E7';
      ctx.font = '22px sans-serif';
      ctx.fillText('Para consultar catálogo, cartas y atención inmediata', 400, 810);

      // Contact info
      ctx.fillStyle = '#71717A';
      ctx.font = '18px monospace';
      ctx.fillText(`WhatsApp Oficial: ${customData.phone || tenant.phone}`, 400, 880);
      ctx.fillText(customData.address, 400, 920);

      // Footer branding
      ctx.fillStyle = '#52525B';
      ctx.font = '14px monospace';
      ctx.fillText('Tecnología Direct-to-Messaging • Vector Inside', 400, 1020);

      const link = document.createElement('a');
      link.download = `Ficha_Mesa_${tenant.id}_Imprimible.png`;
      link.href = cardCanvas.toDataURL('image/png');
      link.click();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4FF00', '#25D366', '#FFFFFF'],
      });
    } catch (e) {
      handleDownloadQR();
    }
  };

  const handleSaveChanges = () => {
    try {
      localStorage.setItem(`vector_microlanding_${tenant.id}`, JSON.stringify(customData));
      notifyIframe(customData);
      setSavedSuccess(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#D4FF00', '#25D366', '#FFFFFF'],
      });
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {}
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="w-full max-w-6xl rounded-3xl bg-[var(--bg-panel)] border border-neon/40 shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[94vh] my-auto animate-scale-up text-[var(--text-main)]">
        
        {/* Left Column: Phone Mockup Frame (Sleek Dynamic Island Pro) */}
        <div className="w-full lg:w-[390px] bg-[var(--bg-card)] p-4 sm:p-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[var(--border-color)] relative shrink-0">
          <div className="w-full flex items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-bold">
                Previsualización en Vivo
              </span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-[var(--bg-card-subtle)] p-0.5 rounded-lg border border-[var(--border-color)] text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setDeviceMode('iphone')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  deviceMode === 'iphone'
                    ? 'bg-neon text-black font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                iPhone 16 Pro
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('android')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  deviceMode === 'android'
                    ? 'bg-neon text-black font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Android
              </button>
            </div>
          </div>

          {/* Smartphone Frame (Optimized viewport) */}
          <div className="w-[305px] sm:w-[325px] h-[580px] rounded-[48px] bg-black border-[7px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_25px_rgba(212,255,0,0.15)] ring-1 ring-white/10 relative overflow-hidden flex flex-col">
            {/* Top iOS Status Bar Area */}
            {deviceMode === 'iphone' ? (
              <div className="absolute top-0 left-0 right-0 h-8 px-6 flex items-center justify-between z-30 pointer-events-none select-none text-white text-[11px] font-semibold">
                <span>9:41</span>
                
                {/* Dynamic Island Notch */}
                <div className="w-24 h-5 bg-black rounded-full ring-1 ring-zinc-800/80 flex items-center justify-between px-2.5 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/90 animate-pulse" />
                </div>

                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="text-[9px] font-bold">5G</span>
                  <div className="w-4 h-2.5 rounded-[3px] border border-white/70 p-[1px] flex items-center">
                    <div className="w-full h-full bg-white rounded-[1px]" />
                  </div>
                </div>
              </div>
            ) : (
              /* Android Pinhole Camera Notch */
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black border border-zinc-800 z-30 pointer-events-none flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              </div>
            )}

            {/* Embedded Iframe of the MicroLanding */}
            <iframe
              ref={iframeRef}
              src={`/m/${tenant.id}?preview=true`}
              title="MicroLanding Live Preview"
              className="w-full flex-1 border-0 rounded-[40px] bg-[#07090D]"
            />

            {/* iOS Bottom Home Bar Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-30 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Studio Tabs & Customization Editor */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-4 bg-[var(--bg-panel)]">
          <div className="space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden shrink-0">
                  {customData.logo ? (
                    <Image
                      src={customData.logo}
                      alt="Logo"
                      width={36}
                      height={36}
                      unoptimized
                      className="w-full h-full object-contain p-0.5"
                    />
                  ) : (
                    <span className="text-xl">{tenant.avatar || '🏢'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)] leading-tight">
                    {customData.name || tenant.name}
                  </h3>
                  <span className="text-[10px] text-lime-700 dark:text-neon font-mono font-bold">
                    Micro-Landing Studio
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Tabs (Personalizar | QR con Logo | Enlace & Info) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('customize')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'customize'
                    ? 'bg-neon text-black font-bold shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Personalizar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'qr'
                    ? 'bg-neon text-black font-bold shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR con Logo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'overview'
                    ? 'bg-neon text-black font-bold shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Enlace & Info</span>
              </button>
            </div>

            {/* TAB 1: CUSTOMIZE MICRO-LANDING (Organized in 3 sub-sections) */}
            {activeTab === 'customize' && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* Sub-section Selector (Servicios & Promos | Formulario & Captación | Marca & Portada | Contacto & Horarios) */}
                <div className="flex items-center gap-1.5 border-b border-[var(--border-color)] pb-2 text-[11px] font-mono overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setActiveSubSection('services')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors ${
                      activeSubSection === 'services'
                        ? 'bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Servicios ({customData.services?.length || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubSection('leadForm')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors ${
                      activeSubSection === 'leadForm'
                        ? 'bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Formulario de Captación ({customData.leadForm?.options?.length || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubSection('brand')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors ${
                      activeSubSection === 'brand'
                        ? 'bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Logo & Portada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubSection('contact')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors ${
                      activeSubSection === 'contact'
                        ? 'bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ubicación & Horarios</span>
                  </button>
                </div>

                {/* SUB-SECTION 1: SERVICES & PROMOTIONS */}
                {activeSubSection === 'services' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                          <span>Editor de Servicios & Ofertas Destacadas</span>
                        </h4>
                        <p className="text-[10.5px] text-[var(--text-muted)]">
                          Edita los títulos, descripciones y badges promocionales que se ven en el teléfono.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddService}
                        className="py-1.5 px-3 rounded-xl bg-neon/10 hover:bg-neon/20 text-lime-700 dark:text-neon border border-neon/30 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Oferta</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[330px] overflow-y-auto pr-1">
                      {customData.services?.map((srv, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5 relative group hover:border-neon/50 transition-all shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[var(--border-color)] pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-lime-700 dark:text-neon font-bold">
                                Oferta #{idx + 1}
                              </span>
                              {srv.badge && (
                                <span
                                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                    srv.tone === 'emerald'
                                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                      : srv.tone === 'blue'
                                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                      : srv.tone === 'purple'
                                      ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                      : srv.tone === 'amber'
                                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                      : 'bg-[#D4FF00]/15 text-lime-700 dark:text-[#D4FF00] border border-[#D4FF00]/30'
                                  }`}
                                >
                                  {srv.badge}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveService(idx, 'up')}
                                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white disabled:opacity-20 hover:bg-[var(--bg-card-subtle)] transition-colors"
                                title="Mover arriba"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === customData.services.length - 1}
                                onClick={() => handleMoveService(idx, 'down')}
                                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white disabled:opacity-20 hover:bg-[var(--bg-card-subtle)] transition-colors"
                                title="Mover abajo"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateService(idx)}
                                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-neon hover:bg-[var(--bg-card-subtle)] transition-colors"
                                title="Duplicar oferta"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveService(idx)}
                                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--bg-card-subtle)] transition-colors"
                                title="Eliminar oferta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9.5px] font-mono text-[var(--text-muted)] block mb-0.5">
                                Título del Servicio u Oferta
                              </label>
                              <input
                                type="text"
                                value={srv.title}
                                onChange={(e) => handleUpdateService(idx, 'title', e.target.value)}
                                placeholder="ej. Reserva de Mesa VIP & Terraza"
                                className="w-full p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs focus:border-neon outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[9.5px] font-mono text-[var(--text-muted)] block mb-0.5">
                                Texto del Badge
                              </label>
                              <input
                                type="text"
                                value={srv.badge || ''}
                                onChange={(e) => handleUpdateService(idx, 'badge', e.target.value)}
                                placeholder="ej. Confirmación 5 min, -20%"
                                className="w-full p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono focus:border-neon outline-none"
                              />
                            </div>
                          </div>

                          {/* Interactive Badge Tone Selector */}
                          <div>
                            <label className="text-[9.5px] font-mono text-[var(--text-muted)] block mb-1">
                              Color del Badge:
                            </label>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {badgeToneOptions.map((tone) => (
                                <button
                                  key={tone.id}
                                  type="button"
                                  onClick={() => handleUpdateService(idx, 'tone', tone.id)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1 border ${
                                    (srv.tone || 'neon') === tone.id
                                      ? 'border-neon font-bold ring-1 ring-neon/40 shadow-sm'
                                      : 'border-[var(--border-color)] hover:border-zinc-500 text-[var(--text-muted)]'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${
                                    tone.id === 'emerald' ? 'bg-emerald-400' :
                                    tone.id === 'neon' ? 'bg-[#D4FF00]' :
                                    tone.id === 'blue' ? 'bg-blue-400' :
                                    tone.id === 'purple' ? 'bg-purple-400' : 'bg-amber-400'
                                  }`} />
                                  <span>{tone.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[9.5px] font-mono text-[var(--text-muted)] block mb-0.5">
                              Descripción Corta
                            </label>
                            <input
                              type="text"
                              value={srv.desc}
                              onChange={(e) => handleUpdateService(idx, 'desc', e.target.value)}
                              placeholder="ej. Asignación prioritaria para ocasiones especiales"
                              className="w-full p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs focus:border-neon outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Save and Apply Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-lg ${
                          savedSuccess
                            ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                            : 'bg-neon text-black hover:bg-[var(--neon-hover)] shadow-neon'
                        }`}
                      >
                        {savedSuccess ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>¡Cambios Guardados y Sincronizados en Vivo!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Guardar y Sincronizar en Vivo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB-SECTION 2: LEAD CAPTURE FORM / BOOKING CHIPS */}
                {activeSubSection === 'leadForm' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                          <span>Configuración del Formulario & Chips de Captación</span>
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)] font-sans">
                          Personaliza la pregunta o motivo, los chips seleccionables y el botón que envía a WhatsApp.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddLeadOption}
                        className="py-1.5 px-3 rounded-xl bg-neon text-black font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all shadow-md active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Opción</span>
                      </button>
                    </div>

                    {/* Presets Rápidos por Giro */}
                    <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                        Cargar plantilla rápida según giro:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => handleLoadLeadFormPreset('dental')}
                          className="py-2 px-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-main)] hover:text-neon border border-[var(--border-color)] text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <span>🦷 Dental</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadLeadFormPreset('polanco')}
                          className="py-2 px-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-main)] hover:text-neon border border-[var(--border-color)] text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <span>🍷 Restaurante</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadLeadFormPreset('urban')}
                          className="py-2 px-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-main)] hover:text-neon border border-[var(--border-color)] text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <span>👟 Calzado</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadLeadFormPreset('corp')}
                          className="py-2 px-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-main)] hover:text-neon border border-[var(--border-color)] text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <span>💼 Asesoría B2B</span>
                        </button>
                      </div>
                    </div>

                    {/* Form Texts (Title & Button) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1 font-bold">
                          Título del Campo (Pregunta o Motivo)
                        </label>
                        <input
                          type="text"
                          value={customData.leadForm?.title ?? ''}
                          onChange={(e) => handleUpdateLeadFormField('title', e.target.value)}
                          placeholder="ej. Motivo principal de consulta:"
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs focus:border-neon outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1 font-bold">
                          Texto del Botón CTA
                        </label>
                        <input
                          type="text"
                          value={customData.leadForm?.buttonText ?? ''}
                          onChange={(e) => handleUpdateLeadFormField('buttonText', e.target.value)}
                          placeholder="ej. Solicitar Cita de Valoración"
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-lime-700 dark:text-neon font-bold text-xs focus:border-neon outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1 font-bold">
                        Subtítulo o Promesa de Respuesta Rápida
                      </label>
                      <input
                        type="text"
                        value={customData.leadForm?.subtitle ?? ''}
                        onChange={(e) => handleUpdateLeadFormField('subtitle', e.target.value)}
                        placeholder="ej. Te orientamos sobre fechas y presupuestos en minutos"
                        className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs focus:border-neon outline-none"
                      />
                    </div>

                    {/* Options / Chips List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                          Opciones / Chips Seleccionables ({customData.leadForm?.options?.length || 0})
                        </label>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          El usuario elige 1 opción al interactuar
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(customData.leadForm?.options || []).map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] focus-within:border-neon transition-colors"
                          >
                            <span className="text-[10px] font-mono text-[var(--text-muted)] w-4 text-center">
                              {optIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleUpdateLeadOption(optIdx, e.target.value)}
                              placeholder={`Opción ${optIdx + 1}`}
                              className="flex-1 bg-transparent text-xs text-[var(--text-main)] outline-none font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveLeadOption(optIdx)}
                              className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Eliminar opción"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {(!customData.leadForm?.options || customData.leadForm.options.length === 0) && (
                        <div className="p-4 rounded-xl border border-dashed border-[var(--border-color)] text-center text-xs text-[var(--text-muted)] font-mono">
                          No hay opciones configuradas. Haz clic en "Agregar Opción" o selecciona una plantilla arriba.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUB-SECTION 3: BRAND, LOGO & COVER */}
                {activeSubSection === 'brand' && (
                  <div className="space-y-3">
                    {/* Cover Photo / Header Banner Upload */}
                    <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                          <span>Foto de Portada / Banner Superior</span>
                        </label>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">Recomendado 800x260</span>
                      </div>

                      {/* Banner Preview */}
                      <div className="w-full h-24 rounded-xl bg-zinc-950 border border-[var(--border-color)] overflow-hidden relative group">
                        <Image
                          src={customData.cover || DEFAULT_COVERS[tenant?.id] || DEFAULT_COVERS.dental}
                          alt="Cover Banner"
                          width={400}
                          height={100}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2 justify-between">
                          <span className="text-[10px] font-mono text-zinc-300 truncate max-w-[220px]">
                            {customData.cover?.startsWith('data:') ? 'Imagen personalizada cargada' : customData.cover}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-main)] font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-[var(--border-color)] transition-colors font-bold">
                          <Upload className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                          <span>Subir Portada (JPG / PNG)</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                        </label>

                        {customData.cover && (
                          <button
                            type="button"
                            onClick={handleRemoveCover}
                            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border border-[var(--border-color)] text-xs font-mono transition-colors flex items-center gap-1"
                            title="Restaurar portada por defecto"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Restaurar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                          <span>Logo Oficial (.PNG transparente recomendado)</span>
                        </label>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">Max 2.5MB</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card-subtle)] border-2 border-dashed border-[var(--border-color)] flex items-center justify-center overflow-hidden shrink-0">
                          {customData.logo ? (
                            <Image
                              src={customData.logo}
                              alt="Logo preview"
                              width={56}
                              height={56}
                              unoptimized
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-2xl">{tenant.avatar || '🏢'}</span>
                          )}
                        </div>

                        <div className="flex-1 flex items-center gap-2">
                          <label className="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-main)] font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-[var(--border-color)] transition-colors font-bold">
                            <Upload className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                            <span>{customData.logo ? 'Cambiar Logo' : 'Subir Archivo PNG'}</span>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/webp"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>

                          {customData.logo && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 transition-colors"
                              title="Remover logo personalizado"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                        Nombre Comercial del Negocio
                      </label>
                      <input
                        type="text"
                        value={customData.name}
                        onChange={(e) => handleUpdateField('name', e.target.value)}
                        placeholder="Nombre de tu negocio"
                        className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs focus:border-neon outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                        Eslogan o Propuesta de Valor (Texto Superior)
                      </label>
                      <textarea
                        rows={2}
                        value={customData.tagline}
                        onChange={(e) => handleUpdateField('tagline', e.target.value)}
                        placeholder="Describe en una frase atractiva lo que ofreces..."
                        className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs focus:border-neon outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* SUB-SECTION 3: CONTACT & HOURS */}
                {activeSubSection === 'contact' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                          Teléfono WhatsApp (10 Dígitos)
                        </label>
                        <input
                          type="tel"
                          value={customData.phone}
                          onChange={(e) => handleUpdateField('phone', e.target.value)}
                          placeholder="+52 55 1234 5678"
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono focus:border-neon outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                          Dirección Física (Enlace a Google Maps)
                        </label>
                        <input
                          type="text"
                          value={customData.address}
                          onChange={(e) => handleUpdateField('address', e.target.value)}
                          placeholder="Calle, Número, Colonia, Ciudad"
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs focus:border-neon outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                          Horario Entre Semana
                        </label>
                        <input
                          type="text"
                          value={customData.hoursWeek}
                          onChange={(e) => handleUpdateField('hoursWeek', e.target.value)}
                          placeholder="Lun–Vie: 09:00 a 19:00 hrs"
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono focus:border-neon outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                          Horario Fin de Semana
                        </label>
                        <input
                          type="text"
                          value={customData.hoursWeekend}
                          onChange={(e) => handleUpdateField('hoursWeekend', e.target.value)}
                          placeholder="Sáb: 09:00 a 14:00 hrs"
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono focus:border-neon outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[var(--border-color)]">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                            GA4 Measurement ID (Analítica Web)
                          </label>
                          <span className="text-[9px] text-[var(--text-muted)] font-bold">$0 USD</span>
                        </div>
                        <input
                          type="text"
                          value={customData.ga4MeasurementId || ''}
                          onChange={(e) => handleUpdateField('ga4MeasurementId', e.target.value)}
                          placeholder="G-XXXXXXXXXX"
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono focus:border-neon outline-none"
                        />
                        <span className="text-[9.5px] text-[var(--text-muted)] mt-0.5 block">
                          Obtenlo en Google Analytics para medir visitas a la micro-landing.
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                            Meta Pixel ID (Para Meta Ads)
                          </label>
                          <span className="text-[9px] text-lime-700 dark:text-neon font-bold">Recomendado</span>
                        </div>
                        <input
                          type="text"
                          value={customData.metaPixelId || ''}
                          onChange={(e) => handleUpdateField('metaPixelId', e.target.value)}
                          placeholder="123456789012345"
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono focus:border-neon outline-none"
                        />
                        <span className="text-[9.5px] text-[var(--text-muted)] mt-0.5 block">
                          Obtenlo en Meta Events Manager para medir conversiones de anuncios.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save and Apply Action */}
                <div className="pt-2 border-t border-[var(--border-color)] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-neon text-black font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savedSuccess ? '¡Cambios Guardados con Éxito!' : 'Guardar y Aplicar Todo'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: QR CODE GENERATOR WITH CENTER LOGO */}
            {activeTab === 'qr' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-mono text-xs text-center">
                  <div className="flex items-center justify-center gap-2 text-[var(--text-main)] font-bold text-xs">
                    <QrCode className="w-4 h-4 text-lime-700 dark:text-neon" />
                    <span>Código QR con Logo Oficial</span>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                    Generado con corrección de error de alta densidad (Level H). Imprime este código para colocarlo en tu recepción, cartas de menú, empaques o tarjetas de presentación.
                  </p>

                  {/* QR Canvas Display */}
                  <div className="p-3 rounded-2xl bg-white w-64 h-64 mx-auto flex items-center justify-center shadow-xl">
                    <canvas ref={qrCanvasRef} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      className="py-2.5 px-4 rounded-xl bg-neon text-black font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar QR (.PNG)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadStandCard}
                      className="py-2.5 px-4 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-main)] font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all border border-[var(--border-color)] active:scale-95 shadow-sm"
                    >
                      <Printer className="w-4 h-4 text-neon" />
                      <span>Ficha de Mesa / Mostrador (Imprimible)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: OVERVIEW & PUBLIC LINK */}
            {activeTab === 'overview' && (
              <div className="space-y-3.5 animate-fadeIn">
                <p className="text-xs text-[var(--text-main)] font-sans leading-relaxed">
                  Diseñada específicamente para tráfico directo desde <strong>Instagram Reels, TikTok y Meta Ads</strong> sin fricción de cookies ni tiempos lentos de carga web.
                </p>

                {/* Public Link Card */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 font-mono text-xs">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                    Enlace Público Oficial (Link in Bio):
                  </span>
                  <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-lime-700 dark:text-neon font-bold text-[11px] truncate select-all">
                    {prodUrl}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 py-2 px-3 rounded-xl bg-neon text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                    </button>
                    <a
                      href={`/m/${tenant.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]"
                      title="Abrir en pestaña nueva"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* COMMERCIAL UPSELL BANNER */}
            <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/30 space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[var(--text-main)] font-bold text-xs">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>¿Tu negocio necesita el siguiente nivel?</span>
              </div>
              <p className="text-[10.5px] text-[var(--text-muted)] font-sans leading-relaxed">
                Tu micro-landing captura prospectos inmediatos de redes. Si necesitas <strong>posicionamiento SEO en Google, pasarela de pagos integrada y dominio propio (.com)</strong>, motívate a dar el salto a un Sitio Web Oficial con Vector Inside.
              </p>
              <a
                href="https://vectorinside.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-600 dark:text-purple-300 hover:underline group"
              >
                <span>Cotizar Sitio Web Corporativo en vectorinside.com</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Almacenamiento local client-side • 0 consumo de servidor
            </span>
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono transition-colors border border-[var(--border-color)]"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
    </Portal>
  );
};
