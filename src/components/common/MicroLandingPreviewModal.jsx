'use client';

import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Customization state
  const [customData, setCustomData] = useState({
    name: '',
    tagline: '',
    phone: '',
    address: '',
    hoursWeek: '',
    hoursWeekend: '',
    logo: null,
    services: [],
  });

  const iframeRef = useRef(null);
  const qrCanvasRef = useRef(null);

  // Initialize tenant data from localStorage or tenant defaults
  useEffect(() => {
    if (!tenant) return;
    const defaultList = DEFAULT_SERVICES[tenant.id] || DEFAULT_SERVICES.dental;

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
          services: parsed.services && parsed.services.length > 0 ? parsed.services : defaultList,
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
          services: defaultList,
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
        services: defaultList,
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
    const link = document.createElement('a');
    link.download = `QR_${tenant.id}_VectorInside.png`;
    link.href = qrCanvasRef.current.toDataURL('image/png');
    link.click();
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#D4FF00', '#25D366', '#FFFFFF'],
      });
    } catch (e) {}
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
        <div className="w-full max-w-6xl rounded-3xl bg-zinc-950 border border-[#D4FF00]/40 shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[94vh] my-auto animate-scale-up">
        
        {/* Left Column: Phone Mockup Frame (Sleek Dynamic Island Pro) */}
        <div className="w-full lg:w-[380px] bg-zinc-900/60 p-4 sm:p-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-800 relative shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Previsualización Móvil en Vivo
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Smartphone Frame (Optimized viewport) */}
          <div className="w-[300px] sm:w-[315px] h-[560px] rounded-[44px] bg-black border-[6px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_20px_rgba(212,255,0,0.12)] ring-1 ring-white/10 relative overflow-hidden flex flex-col">
            {/* Dynamic Island Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 ring-1 ring-zinc-800/80 flex items-center justify-between px-2.5 pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* Embedded Iframe of the MicroLanding */}
            <iframe
              ref={iframeRef}
              src={`/m/${tenant.id}`}
              title="MicroLanding Live Preview"
              className="w-full flex-1 border-0 rounded-[38px] bg-[#07090D]"
            />

            {/* iOS Bottom Home Bar Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-30 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Studio Tabs & Customization Editor */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {customData.logo ? (
                    <img src={customData.logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
                  ) : (
                    <span className="text-xl">{tenant.avatar || '🏢'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {customData.name || tenant.name}
                  </h3>
                  <span className="text-[10px] text-[#D4FF00] font-mono font-bold">
                    Micro-Landing Studio
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Tabs (Personalizar | QR con Logo | Enlace & Info) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('customize')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'customize'
                    ? 'bg-[#D4FF00] text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white'
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
                    ? 'bg-[#D4FF00] text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white'
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
                    ? 'bg-[#D4FF00] text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Enlace & Info</span>
              </button>
            </div>

            {/* TAB 1: CUSTOMIZE MICRO-LANDING (Organized in 3 sub-sections) */}
            {activeTab === 'customize' && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* Sub-section Selector (Servicios & Promos | Marca & Logo | Contacto & Horarios) */}
                <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveSubSection('services')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                      activeSubSection === 'services'
                        ? 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30 font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Servicios & Promos ({customData.services?.length || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubSection('brand')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                      activeSubSection === 'brand'
                        ? 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30 font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Marca & Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubSection('contact')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                      activeSubSection === 'contact'
                        ? 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30 font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ubicación & Horarios</span>
                  </button>
                </div>

                {/* SUB-SECTION 1: SERVICES & PROMOTIONS (WHERE THE USER ASKED TO EDIT) */}
                {activeSubSection === 'services' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
                          <span>Editor de Servicios & Ofertas Destacadas</span>
                        </h4>
                        <p className="text-[10.5px] text-zinc-400">
                          Edita los títulos, descripciones y badges promocionales que se ven en el teléfono.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddService}
                        className="py-1.5 px-3 rounded-xl bg-[#D4FF00]/10 hover:bg-[#D4FF00]/20 text-[#D4FF00] border border-[#D4FF00]/30 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Oferta</span>
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
                      {customData.services?.map((srv, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 relative group hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-[#D4FF00] font-bold">
                              Oferta #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveService(idx)}
                              className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                              title="Eliminar este servicio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9.5px] font-mono text-zinc-400 block mb-0.5">
                                Título del Servicio
                              </label>
                              <input
                                type="text"
                                value={srv.title}
                                onChange={(e) => handleUpdateService(idx, 'title', e.target.value)}
                                placeholder="ej. Limpieza Ultrasónica"
                                className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-[#D4FF00] outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[9.5px] font-mono text-zinc-400 block mb-0.5">
                                Badge / Promoción
                              </label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={srv.badge || ''}
                                  onChange={(e) => handleUpdateService(idx, 'badge', e.target.value)}
                                  placeholder="ej. MÁS SOLICITADO, -20%"
                                  className="flex-1 p-2 rounded-xl bg-black border border-zinc-800 text-white text-xs font-mono focus:border-[#D4FF00] outline-none"
                                />
                                <select
                                  value={srv.tone || 'neon'}
                                  onChange={(e) => handleUpdateService(idx, 'tone', e.target.value)}
                                  className="p-2 rounded-xl bg-black border border-zinc-800 text-[11px] text-zinc-300 font-mono outline-none"
                                >
                                  <option value="neon">Neón</option>
                                  <option value="emerald">Verde</option>
                                  <option value="blue">Azul</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-[9.5px] font-mono text-zinc-400 block mb-0.5">
                              Descripción Corta
                            </label>
                            <input
                              type="text"
                              value={srv.desc}
                              onChange={(e) => handleUpdateService(idx, 'desc', e.target.value)}
                              placeholder="ej. Profilaxis profunda con ultrasonido y flúor"
                              className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-[#D4FF00] outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-SECTION 2: BRAND & LOGO */}
                {activeSubSection === 'brand' && (
                  <div className="space-y-3">
                    {/* Logo Upload Box (PNG/JPG to Base64) */}
                    <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#D4FF00]" />
                          <span>Logo Oficial (.PNG transparente recomendado)</span>
                        </label>
                        <span className="text-[10px] text-zinc-500 font-mono">Max 2.5MB</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-black border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                          {customData.logo ? (
                            <img src={customData.logo} alt="Logo preview" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-2xl">{tenant.avatar || '🏢'}</span>
                          )}
                        </div>

                        <div className="flex-1 flex items-center gap-2">
                          <label className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-[#D4FF00]" />
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
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                              title="Remover logo personalizado"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                        Nombre Comercial del Negocio
                      </label>
                      <input
                        type="text"
                        value={customData.name}
                        onChange={(e) => handleUpdateField('name', e.target.value)}
                        placeholder="Nombre de tu negocio"
                        className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-[#D4FF00] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                        Eslogan o Propuesta de Valor (Texto Superior)
                      </label>
                      <textarea
                        rows={2}
                        value={customData.tagline}
                        onChange={(e) => handleUpdateField('tagline', e.target.value)}
                        placeholder="Describe en una frase atractiva lo que ofreces..."
                        className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-[#D4FF00] outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* SUB-SECTION 3: CONTACT & HOURS (WHERE THE USER ASKED FOR UBICACIÓN & HORARIOS) */}
                {activeSubSection === 'contact' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Teléfono WhatsApp (10 Dígitos)
                        </label>
                        <input
                          type="tel"
                          value={customData.phone}
                          onChange={(e) => handleUpdateField('phone', e.target.value)}
                          placeholder="+52 55 1234 5678"
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-[#D4FF00] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Dirección Física (Enlace a Google Maps)
                        </label>
                        <input
                          type="text"
                          value={customData.address}
                          onChange={(e) => handleUpdateField('address', e.target.value)}
                          placeholder="Calle, Número, Colonia, Ciudad"
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-[#D4FF00] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Horario Entre Semana
                        </label>
                        <input
                          type="text"
                          value={customData.hoursWeek}
                          onChange={(e) => handleUpdateField('hoursWeek', e.target.value)}
                          placeholder="Lun–Vie: 09:00 a 19:00 hrs"
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-[#D4FF00] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Horario Fin de Semana
                        </label>
                        <input
                          type="text"
                          value={customData.hoursWeekend}
                          onChange={(e) => handleUpdateField('hoursWeekend', e.target.value)}
                          placeholder="Sáb: 09:00 a 14:00 hrs"
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-[#D4FF00] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-zinc-800/80">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase block">
                            GA4 Measurement ID (Analítica Web)
                          </label>
                          <span className="text-[9px] text-zinc-500 font-bold">$0 USD</span>
                        </div>
                        <input
                          type="text"
                          value={customData.ga4MeasurementId || ''}
                          onChange={(e) => handleUpdateField('ga4MeasurementId', e.target.value)}
                          placeholder="G-XXXXXXXXXX"
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-[#D4FF00] outline-none"
                        />
                        <span className="text-[9.5px] text-zinc-500 mt-0.5 block">
                          Obtenlo en Google Analytics para medir visitas a la micro-landing.
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase block">
                            Meta Pixel ID (Para Meta Ads)
                          </label>
                          <span className="text-[9px] text-[#D4FF00] font-bold">Recomendado</span>
                        </div>
                        <input
                          type="text"
                          value={customData.metaPixelId || ''}
                          onChange={(e) => handleUpdateField('metaPixelId', e.target.value)}
                          placeholder="123456789012345"
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-[#D4FF00] outline-none"
                        />
                        <span className="text-[9.5px] text-zinc-500 mt-0.5 block">
                          Obtenlo en Meta Events Manager para medir conversiones de anuncios.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save and Apply Action */}
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#D4FF00] hover:bg-[#bce000] text-black font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
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
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-3 font-mono text-xs text-center">
                  <div className="flex items-center justify-center gap-2 text-white font-bold text-xs">
                    <QrCode className="w-4 h-4 text-[#D4FF00]" />
                    <span>Código QR con Logo Oficial</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Generado con corrección de error de alta densidad (Level H). Imprime este código para colocarlo en tu recepción, cartas de menú, empaques o tarjetas de presentación.
                  </p>

                  {/* QR Canvas Display */}
                  <div className="p-3 rounded-2xl bg-white w-64 h-64 mx-auto flex items-center justify-center shadow-xl">
                    <canvas ref={qrCanvasRef} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      className="py-2.5 px-5 rounded-xl bg-[#D4FF00] hover:bg-[#bce000] text-black font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar QR en Alta Calidad (.PNG)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: OVERVIEW & PUBLIC LINK */}
            {activeTab === 'overview' && (
              <div className="space-y-3.5 animate-fadeIn">
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Diseñada específicamente para tráfico directo desde <strong>Instagram Reels, TikTok y Meta Ads</strong> sin fricción de cookies ni tiempos lentos de carga web.
                </p>

                {/* Public Link Card */}
                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 font-mono text-xs">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                    Enlace Público Oficial (Link in Bio):
                  </span>
                  <div className="p-2.5 rounded-xl bg-black border border-zinc-800 text-[#D4FF00] text-[11px] truncate select-all">
                    {prodUrl}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#D4FF00] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                    </button>
                    <a
                      href={`/m/${tenant.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700"
                      title="Abrir en pestaña nueva"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* COMMERCIAL UPSELL BANNER: Motivate Purchase of Full Official Website */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>¿Tu negocio necesita el siguiente nivel?</span>
              </div>
              <p className="text-[10.5px] text-zinc-300 font-sans leading-relaxed">
                Tu micro-landing captura prospectos inmediatos de redes. Si necesitas <strong>posicionamiento SEO en Google, pasarela de pagos integrada y dominio propio (.com)</strong>, motívate a dar el salto a un Sitio Web Oficial con Vector Inside.
              </p>
              <a
                href="https://vectorinside.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-300 hover:text-white group"
              >
                <span>Cotizar Sitio Web Corporativo en vectorinside.com</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-500">
              Almacenamiento local client-side • 0 consumo de servidor
            </span>
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
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
