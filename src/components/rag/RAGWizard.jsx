'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BriefingBridge } from '@/services/briefingBridge';
import { auditService } from '@/services/auditService';
import { resolveBrandPreset } from '@/utils/brandPresets';
import { useAuth } from '@/context/AuthContext';
import {
  Database,
  FileText,
  Upload,
  Shield,
  ShieldCheck,
  Key,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  BookOpen,
  AlertTriangle,
  History,
  Building2,
  Calendar,
  Clock,
  Sun,
  Sunset,
  Target,
  Activity,
  Layers,
  Cpu,
  RefreshCw,
  PlusCircle,
  Plus,
  Trash2,
  Eye,
  Check,
  X,
  HelpCircle,
  FileCode,
  FileSpreadsheet,
  FileCheck,
  Send,
  Lock,
  Megaphone,
  ToggleLeft,
  ToggleRight,
  Info,
  Sliders,
  Zap,
  CheckSquare,
  Flame,
  ShieldAlert,
  ListFilter,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  List,
  Lightbulb,
  Search,
  Dumbbell,
  GraduationCap,
  Users,
  ShoppingBag,
  Utensils,
  Briefcase,
  Home,
  Video,
  Scale,
  Car,
  HeartPulse,
  Copy,
  Code,
  Globe,
  Smartphone,
  Power,
  ExternalLink,
  MessageSquare,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VectorLobo } from '@/components/common/VectorLobo';
import { Portal } from '@/components/common/Portal';
import { SAMPLE_ONBOARDING_PAYLOAD } from '@/utils/constants';
import {
  BUSINESS_VERTICALS_CONFIG,
  VERTICAL_PILLARS_ADAPTIVE_CONFIG,
} from '@/utils/businessVerticals';
import { InviolableRulesEditor } from '@/components/shared/InviolableRulesEditor';

// =========================================================================
// TAXONOMÍA UNIVERSAL DE GIROS DE NEGOCIO Y MODELOS DE CONVERSIÓN
// =========================================================================
export const BUSINESS_CATEGORIES = [
  { id: 'all', name: 'Todos los Giros', icon: Layers },
  { id: 'fitness_health', name: 'Fitness & Salud', icon: Dumbbell },
  { id: 'education', name: 'Educación & Cursos', icon: GraduationCap },
  { id: 'networking', name: 'Networking & Membresías', icon: Users },
  { id: 'retail_ecom', name: 'Retail & E-Commerce', icon: ShoppingBag },
  { id: 'hospitality', name: 'Hospitality & Eventos', icon: Utensils },
  { id: 'b2b_services', name: 'B2B & Servicios Pro', icon: Briefcase },
  { id: 'realestate_auto', name: 'Bienes Raíces & Autos', icon: Home },
  { id: 'creators', name: 'Creadores & Marcas Meta', icon: Video },
];

export const RAGWizard = ({
  externalAdminViewMode,
  onAdminViewModeChange,
  hideHeader = false,
}) => {
  const {
    role,
    isAdmin,
    isClient,
    activeTenant,
    triggerModal,
    tenantsData,
    toggleTenantMicroLanding,
    registerTenant,
    deleteTenant,
    updateTenantPolicy,
    switchTenantContext,
  } = useAuth();

  // Mode for Admin: 'list' (Tenant Overview & Requests) or 'wizard' (Step-by-Step New Business Onboarding)
  const [internalAdminViewMode, setInternalAdminViewMode] = useState(externalAdminViewMode || 'list');
  const [currentStep, setCurrentStep] = useState(1);

  // Listener para control reactivo desde el Tutor Contextual Multi-Nivel
  useEffect(() => {
    const handleWizardControl = (e) => {
      const { action, step, ensureWizardMode } = e.detail || {};
      if (ensureWizardMode && onAdminViewModeChange) {
        onAdminViewModeChange('wizard');
      }
      if (action === 'set_step' && typeof step === 'number') {
        setCurrentStep(step);
      }
    };
    window.addEventListener('vector_wizard_control', handleWizardControl);
    return () => window.removeEventListener('vector_wizard_control', handleWizardControl);
  }, [onAdminViewModeChange]);

  // Manejador para eliminación segura de un negocio con popup modal
  const handleDeleteTenant = (tenant) => {
    if (!tenant) return;
    const isCurrentlyActive = activeTenant?.id === tenant.id;

    triggerModal(
      `Eliminar Negocio: ${tenant.name}`,
      `
        <div class="space-y-3">
          <p class="text-xs text-[var(--text-main)]">
            ¿Estás completamente seguro de que deseas eliminar a <strong class="text-rose-600 dark:text-rose-400 font-bold">${tenant.name}</strong> (ID: <code class="text-lime-700 dark:text-neon">${tenant.id}</code>)?
          </p>
          <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs space-y-1.5 font-mono">
            <p class="font-bold flex items-center gap-1.5">
              ⚠️ Esta acción es destructiva e irreversible:
            </p>
            <ul class="list-disc list-inside space-y-0.5 text-[11px] text-[var(--text-muted)]">
              <li>Se removerán los <strong class="text-[var(--text-main)]">4 Pilares de Conocimiento RAG</strong> indexados.</li>
              <li>Se desvinculará la sincronización de <strong class="text-[var(--text-main)]">Meta Conversions API (CAPI)</strong> y Webhooks.</li>
              <li>Se dará de baja la <strong class="text-[var(--text-main)]">Micro-Landing Universal</strong> (/m/${tenant.microLandingSlug || tenant.id}).</li>
              ${isCurrentlyActive ? '<li class="text-amber-700 dark:text-amber-400 font-bold">Nota: Este negocio es el actualmente activo en tu panel. Se cambiará el contexto al siguiente disponible.</li>' : ''}
            </ul>
          </div>
          <p class="text-[11px] text-[var(--text-muted)]">
            Confirma la eliminación para revocar el aislamiento de base de datos de este cliente.
          </p>
        </div>
      `,
      async () => {
        try {
          if (deleteTenant) {
            await deleteTenant(tenant.id);
          }
          triggerModal(
            'Negocio Eliminado',
            `El tenant <strong class="text-[var(--text-main)]">${tenant.name}</strong> ha sido eliminado del sistema y desvinculado de la memoria RAG.`,
            null,
            'Entendido'
          );
        } catch (err) {
          triggerModal(
            'Error al Eliminar Negocio',
            err?.response?.data?.message || err?.message || 'No se pudo eliminar el negocio en PostgreSQL.',
            null,
            'Entendido',
            'danger'
          );
        }
      },
      'Sí, Eliminar Definitivamente',
      'danger'
    );
  };

  // Manejador único para pausar/activar la Micro-Landing de un tenant
  const handleToggleMicroLanding = (tenant, nextStatus) => {
    if (!tenant) return;
    toggleTenantMicroLanding(tenant.id, nextStatus);
    const isSuspending = nextStatus === 'suspended';
    const slug = tenant.microLandingSlug || tenant.id;
    triggerModal(
      isSuspending ? 'Micro-Landing Pausada' : 'Micro-Landing Activada',
      isSuspending
        ? `<div class="space-y-2">
            <p class="text-xs text-[var(--text-main)]">
              La micro-landing para <strong class="text-[var(--text-main)] font-bold">${tenant.name}</strong> ha sido pausada temporalmente.
            </p>
            <p class="text-[11px] text-[var(--text-muted)] font-mono">
              Los visitantes verán un aviso de mantenimiento temporal al visitar <code class="text-lime-700 dark:text-neon">/m/${slug}</code>. Puedes reactivarla en cualquier momento con un solo clic.
            </p>
          </div>`
        : `<div class="space-y-2">
            <p class="text-xs text-[var(--text-main)]">
              La micro-landing para <strong class="text-lime-700 dark:text-neon font-bold">${tenant.name}</strong> ha sido activada con éxito.
            </p>
            <p class="text-[11px] text-[var(--text-muted)] font-mono">
              La página vuelve a estar en línea y lista para recibir tráfico y canalizar prospectos de forma inmediata.
            </p>
          </div>`,
      () => {},
      isSuspending ? 'Entendido' : 'Aceptar'
    );
  };

  const getTenantRagMetrics = (tenant) => {
    if (!tenant) {
      return {
        completedCount: 0,
        totalPillars: 4,
        healthPct: 0,
        ifvScore: 0,
        statusLabel: 'Sin Indexar',
      };
    }
    const p = tenant.pillars || {};
    const p1Done = Boolean(
      (p.pillar1 && p.pillar1.enabled !== false && (p.pillar1.fileName || p.pillar1.cacMax || p.pillar1.enabled)) ||
        (!tenant.pillars && (tenant.leadPriceMXN || tenant.cacMax))
    );
    const p2Done = Boolean(
      (p.pillar2 && p.pillar2.enabled !== false && (p.pillar2.fileName || p.pillar2.brandTone || p.pillar2.enabled)) ||
        tenant.toneOfVoice ||
        tenant.brandPurpose
    );
    const p3Done = Boolean(
      (p.pillar3 && p.pillar3.enabled !== false && (p.pillar3.fileName || p.pillar3.keywords || p.pillar3.enabled)) ||
        (Array.isArray(tenant.crisisKeywords) && tenant.crisisKeywords.length > 0) ||
        (Array.isArray(tenant.inviolableRules) && tenant.inviolableRules.length > 0)
    );
    const p4Done = Boolean(
      (p.pillar4 && p.pillar4.enabled && (p.pillar4.fileName || p.pillar4.context || p.pillar4.enabled)) ||
        tenant.commercialOffer?.hook
    );

    const completedCount = [p1Done, p2Done, p3Done, p4Done].filter(Boolean).length;
    const healthPct = Math.round((completedCount / 4) * 100);
    const ifvScore = Math.round((healthPct / 100) * 50);
    const statusLabel =
      completedCount === 0 ? 'Sin Indexar' : healthPct >= 75 ? 'Antifrágil' : 'En Calibración';
    return { completedCount, totalPillars: 4, healthPct, ifvScore, statusLabel };
  };

  const activeTenantRagMetrics = useMemo(
    () => getTenantRagMetrics(activeTenant),
    [activeTenant]
  );

  // Sync with external mode prop if provided
  useEffect(() => {
    if (externalAdminViewMode) {
      setInternalAdminViewMode(externalAdminViewMode);
    }
  }, [externalAdminViewMode]);

  const adminViewMode = externalAdminViewMode || internalAdminViewMode;

  const setAdminViewMode = (newMode) => {
    setInternalAdminViewMode(newMode);
    if (onAdminViewModeChange) {
      onAdminViewModeChange(newMode);
    }
  };

  // Multi-Tenant Control Panel State (Search, Filters, View Mode, Accordion)
  const [tenantSearchQuery, setTenantSearchQuery] = useState('');
  const [tenantStatusFilter, setTenantStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [tenantVerticalFilter, setTenantVerticalFilter] = useState('all');
  const [tenantViewLayout, setTenantViewLayout] = useState('table'); // 'table' | 'cards'
  const [expandedTenantPillars, setExpandedTenantPillars] = useState({});

  // Computed metrics for ecosystem
  const allTenantsList = useMemo(() => {
    return Object.values(tenantsData || {});
  }, [tenantsData]);

  const tenantEcosystemStats = useMemo(() => {
    const list = allTenantsList;
    const total = list.length;
    const activeCount = list.filter(
      (t) => t.microLandingStatus !== 'suspended' && t.microLandingStatus !== 'disabled' && t.microLandingEnabled !== false
    ).length;
    const pausedCount = total - activeCount;
    return { total, activeCount, pausedCount };
  }, [allTenantsList]);

  // Filtered and searched tenant list (Aislamiento Multi-Tenant Estricto)
  const filteredTenantsList = useMemo(() => {
    let list = Object.values(tenantsData || {});
    // Si el usuario es cliente, filtrar ÚNICAMENTE su propio negocio asignado
    if (!isAdmin && activeTenant?.id) {
      list = list.filter((t) => t.id === activeTenant.id);
    }
    return list.filter((tenant) => {
      // 1. Search Query
      if (tenantSearchQuery.trim()) {
        const q = tenantSearchQuery.toLowerCase();
        const matchesName = tenant.name?.toLowerCase().includes(q);
        const matchesId = tenant.id?.toLowerCase().includes(q);
        const matchesGiro = (tenant.giro || tenant.vertical || tenant.verticalLabel)?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesGiro) return false;
      }

      // 2. Status Filter
      if (tenantStatusFilter !== 'all') {
        const isSuspended =
          tenant.microLandingStatus === 'suspended' ||
          tenant.microLandingStatus === 'disabled' ||
          tenant.microLandingEnabled === false;
        if (tenantStatusFilter === 'active' && isSuspended) return false;
        if (tenantStatusFilter === 'suspended' && !isSuspended) return false;
      }

      // 3. Vertical Filter
      if (tenantVerticalFilter !== 'all') {
        const tVert = (tenant.vertical || tenant.giro || '').toLowerCase();
        if (!tVert.includes(tenantVerticalFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [tenantsData, tenantSearchQuery, tenantStatusFilter, tenantVerticalFilter, isAdmin, activeTenant?.id]);

  // Toggle expanded pillars for a tenant
  const toggleTenantPillars = (tenantId) => {
    setExpandedTenantPillars((prev) => ({
      ...prev,
      [tenantId]: !prev[tenantId],
    }));
  };

  // Category Filter, View Mode and Search Query for Vertical Selection
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [verticalViewMode, setVerticalViewMode] = useState('compact'); // 'compact' | 'detailed'

  // Control de interfaz enfocada Paso 1: Inicia con catálogo abierto (true) y sin giro forzado
  const [isGiroSelectorOpen, setIsGiroSelectorOpen] = useState(true);
  const [justCalibratedGiro, setJustCalibratedGiro] = useState(false);

  useEffect(() => {
    if (justCalibratedGiro) {
      const timer = setTimeout(() => setJustCalibratedGiro(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [justCalibratedGiro]);

  const categoryCounts = useMemo(() => {
    const counts = { all: Object.keys(BUSINESS_VERTICALS_CONFIG).length };
    Object.values(BUSINESS_VERTICALS_CONFIG).forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Ingestion Mode: unified 6-step guided wizard with AI 1-click briefing accelerator
  const [ingestionMode, setIngestionMode] = useState('guided');
  const [isAnalyzingBriefing, setIsAnalyzingBriefing] = useState(false);
  const [briefingAnalysisStage, setBriefingAnalysisStage] = useState('');
  const [briefingAnalyzed, setBriefingAnalyzed] = useState(false);
  const [masterDocText, setMasterDocText] = useState('');
  const [masterFile, setMasterFile] = useState(null);
  const briefingAbortRef = useRef(null);

  // Client change request modal
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPillarForChange, setSelectedPillarForChange] = useState('pillar2');
  const [changeNotes, setChangeNotes] = useState('');
  const [changeFileName, setChangeFileName] = useState('');

  // Form State for Onboarding Wizard
  const [wizardData, setWizardData] = useState({
    businessName: '',
    legalNameTaxId: '',
    vertical: null, // Inicia sin selección para que el usuario elija su propio giro
    verticalTipo: 'service_appointments',
    businessGoal: 'appointments',
    primaryContact: '',
    contactEmail: '',
    ownerPhone: '',

    // Estrategia Dual has_website & Canales Meta
    hasWebsite: true,
    websiteUrl: '',
    ga4MeasurementId: '',
    metaPixelId: '',
    metaCapiToken: '',
    whatsappPhoneId: '',
    wabaId: '',
    instagramAccountId: '',
    socialLinks: {
      youtube: '',
      tiktok: '',
      linkedin: '',
      instagram: '',
      facebook: '',
      x: '',
    },

    // Micro-Landing Universal como Servicio
    microLandingBillingPlan: 'trial_90d', // 'trial_90d' (3 Meses Gratis) | 'active_monthly' ($29 USD/mes) | 'disabled' (Inactiva)
    microLandingCustomSlug: '',

    // Google Calendar & Performance (Iniciamos 100% limpio en turnos)
    googleCalendarId: '',
    appointmentDuration: 60,
    bufferBetweenAppointmentsMin: 0,
    userEditedDuration: false,
    calendarScheduleType: 'single', // 'single' (corrido) | 'split' (2 turnos) | 'hospitality' (mesas) | 'calls' (b2b)
    shifts: [], // Limpio por defecto: el usuario agrega turnos manualmente
    shiftMorningStart: '',
    shiftMorningEnd: '',
    shiftAfternoonStart: '',
    shiftAfternoonEnd: '',
    breakStart: '',
    breakEnd: '',
    breakLabel: 'Receso / Cambio de Turno',
    activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    concurrencyLimit: 1,
    costPerQualifiedLead: 350.0,
    monthlyAdBudget: '',
    showOnboardingPayloadModal: false,
    
    // Toggles for Optional Pillars (Only Pillar 2 is strictly required!)
    enablePricingPillar: true,
    enableCrisisPillar: true,
    enableHistoryPillar: false,

    // Propuesta Comercial & Oferta de Valor (HÍBRIDO: Documento + 3 Highlights)
    enableCommercialProposal: true,
    commercialProposalDoc: null,
    commercialProposalFormat: 'pdf',
    offerHook: '',
    offerCta: '',
    offerValidity: '',

    // Delimitación de Buyer Persona & 4 Ps
    buyerPersona: null,
    marketingMix4P: null,

    // Inviolable Rules (Reglas Inviolables) - Iniciamos 100% limpio
    inviolableRules: [],

    // Pillar 1: Matriz de Rentabilidad (OPCIONAL)
    cacMax: 150,
    ltvExpected: 3600,
    minGrossMargin: 55,
    pricingDoc: null,
    pricingFormat: 'json',

    // Pillar 2: Identidad y Tono de Voz (OBLIGATORIO)
    brandTone: '',
    archetype: '',
    emojiPolicy: 'Moderado (según documentos)',
    brandbookDoc: null,
    brandbookFormat: 'md',

    // Pillar 3: Protocolos de Crisis y FAQs (OPCIONAL)
    useDefaultCrisisTemplate: true,
    crisisKeywords: 'estafa, lesion, queja, profeco, cancelar, reembolso, cobrar de mas',
    hitlEscalationLatency: 'Sub-segundo (< 1.2s)',
    faqsDoc: null,
    faqsFormat: 'md',

    // Pillar 4: Histórico de Datos (OPCIONAL)
    historicalContext: '',
    historicalDoc: null,
    historicalFormat: 'txt',

    // API Credentials
    metaAccessToken: '',
    deepseekApiKey: '',
    stripeWebhookSecret: '',
  });

  // Modal and JSON payload states for 6-block onboarding
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isCustomizingSchedule, setIsCustomizingSchedule] = useState(false);

  const getDynamicOnboardingPayload = () => {
    return {
      tenant_id: `tenant_${(wizardData.businessName || 'nuevo_negocio').toLowerCase().replace(/[^a-z0-9]/g, '_')}_001`,
      business_name: wizardData.businessName || 'Nuevo Negocio',
      legal_name_tax_id: wizardData.legalNameTaxId || 'Pendiente / En Validación',
      vertical_tipo: wizardData.vertical,
      owner_name: wizardData.primaryContact || wizardData.ownerName || 'No especificado',
      owner_phone: wizardData.ownerPhone || null,
      meta_credentials: {
        whatsapp_phone_number_id: wizardData.whatsappPhoneId || null,
        waba_id: wizardData.wabaId || null,
        whatsapp_access_token: wizardData.metaCapiToken ? '••••••••' : null,
        instagram_account_id: wizardData.instagramAccountId || null,
        facebook_page_id: wizardData.facebookPageId || null,
      },
      web_tracking: {
        has_website: wizardData.hasWebsite,
        website_url: wizardData.hasWebsite ? (wizardData.websiteUrl || null) : null,
        ga4_measurement_id: wizardData.ga4MeasurementId || null,
        meta_pixel_id: wizardData.metaPixelId || null,
        meta_capi_token: wizardData.metaCapiToken ? '••••••••' : null,
        monthly_ad_budget_mxn: Number(wizardData.monthlyAdBudget || 0),
        cost_per_qualified_lead_mxn: Math.max(350, Number(wizardData.costPerQualifiedLead || 350)),
        auto_generated_micro_landing: `https://app.vectorinside.com/m/${(wizardData.microLandingCustomSlug || wizardData.businessName || 'demo').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        micro_landing_slug: (wizardData.microLandingCustomSlug || wizardData.businessName || 'demo').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        micro_landing_enabled: wizardData.microLandingBillingPlan !== 'disabled',
        micro_landing_status:
          wizardData.microLandingBillingPlan === 'disabled'
            ? 'disabled'
            : wizardData.microLandingBillingPlan === 'active_monthly'
            ? 'active'
            : 'trial',
        micro_landing_trial_days_left: wizardData.microLandingBillingPlan === 'trial_90d' ? 90 : 0,
        micro_landing_billing_plan: wizardData.microLandingBillingPlan || 'trial_90d',
      },
      google_calendar_integration: {
        google_calendar_id: wizardData.googleCalendarId || null,
        appointment_duration_minutes: wizardData.appointmentDuration || 45,
        service_hours: {
          timezone: 'America/Mexico_City',
          days: wizardData.activeDays || ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
          schedule_type: wizardData.calendarScheduleType || 'split',
          concurrency_limit: wizardData.concurrencyLimit || 1,
          shifts: (Array.isArray(wizardData.shifts) && wizardData.shifts.length > 0)
            ? wizardData.shifts
            : [],
          shift_1: (Array.isArray(wizardData.shifts) && wizardData.shifts[0])
            ? `${wizardData.shifts[0].start} - ${wizardData.shifts[0].end}`
            : (wizardData.shiftMorningStart ? `${wizardData.shiftMorningStart} - ${wizardData.shiftMorningEnd}` : 'Horario a convenir / 24/7'),
          shift_2: (Array.isArray(wizardData.shifts) && wizardData.shifts[1])
            ? `${wizardData.shifts[1].start} - ${wizardData.shifts[1].end}`
            : null,
        },
      },
      catalog_or_services: [
        {
          id: 'srv-01',
          name: wizardData.offerHook || 'Servicio / Oferta Principal',
          price_mxn: wizardData.costPerQualifiedLead * 3 || 1050.0,
          requires_calendar_slot: true,
        },
      ],
      ai_rag_pillars: {
        pilar_1_pricing: {
          details: wizardData.pricingDetails || 'Tarifas base del giro comercial',
          document_source: typeof wizardData.pricingDoc === 'string' ? wizardData.pricingDoc : (wizardData.pricingDoc?.name || null),
        },
        pilar_2_brandbook: {
          brand_tone: wizardData.brandTone || 'Empático, resolutivo y profesional',
          archetype: wizardData.archetype || currentVerticalObj.badge || 'El Asesor Experto',
          document_source: typeof wizardData.brandbookDoc === 'string' ? wizardData.brandbookDoc : (wizardData.brandbookDoc?.name || null),
        },
        commercial_offer: {
          offer_hook: wizardData.offerHook || 'Diagnóstico de bienvenida sin costo',
          document_source: typeof wizardData.commercialProposalDoc === 'string' ? wizardData.commercialProposalDoc : (wizardData.commercialProposalDoc?.name || null),
        },
        pilar_3_policies_faqs: {
          details: wizardData.faqDetails || 'Políticas de cancelación con 24h y garantías oficiales',
          document_source: typeof wizardData.faqsDoc === 'string' ? wizardData.faqsDoc : (wizardData.faqsDoc?.name || null),
        },
        pilar_4_lead_matrix: {
          criteria_and: currentPillarsAdaptive.criteria || [],
          cost_per_qualified_lead_mxn: wizardData.costPerQualifiedLead || 350,
        },
      },
      inviolable_rules: wizardData.inviolableRules,
    };
  };

  const handleCopyPayload = () => {
    try {
      const payloadObj = getDynamicOnboardingPayload();
      navigator.clipboard.writeText(JSON.stringify(payloadObj, null, 2));
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#E7F900', '#10B981'],
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    }
  };

  // Active suggestions state for interactive 1-click apply
  const [suggestions, setSuggestions] = useState(BUSINESS_VERTICALS_CONFIG.gym_fitness.proactiveSuggestions);

  // Filtered verticals based on category and search query
  const filteredVerticals = useMemo(() => {
    return Object.values(BUSINESS_VERTICALS_CONFIG).filter((vert) => {
      const matchesCategory = selectedCategory === 'all' || vert.category === selectedCategory;
      const matchesSearch =
        vert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vert.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const [showPilar4Guide, setShowPilar4Guide] = useState(false);

  // Dynamic Deficiencies & Gaps in Master Plan
  const detectedDeficiencies = useMemo(() => {
    const list = [];
    const vert = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
    const adaptive = VERTICAL_PILLARS_ADAPTIVE_CONFIG[wizardData.vertical] || VERTICAL_PILLARS_ADAPTIVE_CONFIG.gym_fitness;

    // 1. Pilar 2 (Brandbook / Tono)
    if (!wizardData.brandTone && !wizardData.brandbookDoc) {
      list.push({
        id: 'gap-pilar2',
        pilar: 'Pilar 2: Brandbook',
        severity: 'critical',
        severityLabel: 'Crítico',
        title: 'Falta Tono de Voz o Identidad de Marca [Obligatorio]',
        description: `El bot no tiene directrices de lenguaje para ${vert.name}. Podría sonar plano o responder sin empatía.`,
        suggestedFix: adaptive.pilar2.placeholder.replace(/^ej\.\s*/, ''),
        actionLabel: 'Asignar Tono Recomendado',
        field: 'brandTone',
      });
    }

    // 2. Propuesta Comercial & Oferta
    if (!wizardData.offerHook && !wizardData.commercialProposalDoc) {
      list.push({
        id: 'gap-offer',
        pilar: 'Propuesta Comercial',
        severity: 'recommended',
        severityLabel: 'Recomendado',
        title: 'Sin Gancho Comercial o Lead Magnet de Captación',
        description: 'Una oferta con beneficio tangible (clase muestra, diagnóstico, bono) eleva la conversión en pauta en un 42%.',
        suggestedFix: adaptive.offer.placeholder.replace(/^ej\.\s*/, ''),
        actionLabel: 'Activar Gancho del Giro',
        field: 'offerHook',
      });
    }

    // 3. Pilar 1 (Precios & Servicios)
    if (!wizardData.pricingDetails && !wizardData.pricingDoc) {
      list.push({
        id: 'gap-pilar1',
        pilar: 'Pilar 1: Precios & Servicios',
        severity: 'warning',
        severityLabel: 'Advertencia',
        title: 'Tarifario o Servicios no Especificados',
        description: 'El prospecto preguntará precios. Sin este pilar, la IA dependerá de aranceles genéricos o citas a ciegas.',
        suggestedFix: adaptive.pilar1.placeholder.replace(/^ej\.\s*/, ''),
        actionLabel: 'Cargar Tarifario del Giro',
        field: 'pricingDetails',
      });
    }

    // 4. Pilar 3 (Políticas & FAQs)
    if (!wizardData.faqDetails && !wizardData.faqsDoc) {
      list.push({
        id: 'gap-pilar3',
        pilar: 'Pilar 3: Políticas & FAQs',
        severity: 'optional',
        severityLabel: 'Opcional',
        title: 'Sin Reglas de Cancelación o Preguntas Frecuentes',
        description: 'Es clave prevenir reclamos definiendo con anticipación políticas de cancelación, garantías y tolerancias.',
        suggestedFix: adaptive.pilar3.placeholder.replace(/^ej\.\s*/, ''),
        actionLabel: 'Incorporar Políticas Base',
        field: 'faqDetails',
      });
    }

    // 5. Pilar 4 (Reglas Inviolables)
    if (!wizardData.inviolableRules || wizardData.inviolableRules.length === 0) {
      list.push({
        id: 'gap-pilar4',
        pilar: 'Pilar 4: Reglas & Filtros',
        severity: 'recommended',
        severityLabel: 'Recomendado',
        title: 'Sin Reglas Inviolables de Protección Comercial',
        description: 'Faltan límites éticos y comerciales que la IA jamás deba cruzar (ej. no prometer resultados médicos sin consulta).',
        suggestedFix: vert.defaultRules?.[0] || 'No prometer resultados absolutos sin valoración previa presencial.',
        actionLabel: 'Activar Regla Inviolable',
        field: 'inviolableRule',
      });
    }

    return list;
  }, [wizardData.vertical, wizardData.brandTone, wizardData.brandbookDoc, wizardData.offerHook, wizardData.commercialProposalDoc, wizardData.pricingDetails, wizardData.pricingDoc, wizardData.faqDetails, wizardData.faqsDoc, wizardData.inviolableRules]);

  // Calculate dynamic RAG Health Score (0-100)
  const calculateHealthScore = () => {
    let score = 30;
    if (wizardData.brandTone || wizardData.brandbookDoc) score += 20;
    if (wizardData.enableCommercialProposal && (wizardData.offerHook || wizardData.commercialProposalDoc)) score += 20;
    if (wizardData.pricingDetails || wizardData.pricingDoc) score += 15;
    if (wizardData.faqDetails || wizardData.faqsDoc) score += 10;
    if (wizardData.inviolableRules && wizardData.inviolableRules.length >= 1) score += 5;
    return Math.min(score, 100);
  };

  const healthScore = calculateHealthScore();

  // 1-Click resolve deficiency suggested by AI
  const handleResolveDeficiency = (def) => {
    if (def.field === 'brandTone') {
      setWizardData((prev) => ({ ...prev, brandTone: def.suggestedFix }));
    } else if (def.field === 'offerHook') {
      setWizardData((prev) => ({ ...prev, offerHook: def.suggestedFix }));
    } else if (def.field === 'pricingDetails') {
      setWizardData((prev) => ({ ...prev, pricingDetails: def.suggestedFix }));
    } else if (def.field === 'faqDetails') {
      setWizardData((prev) => ({ ...prev, faqDetails: def.suggestedFix }));
    } else if (def.field === 'inviolableRule') {
      setWizardData((prev) => ({
        ...prev,
        inviolableRules: [...prev.inviolableRules, def.suggestedFix],
      }));
    }

    try {
      confetti({ particleCount: 30, spread: 60, colors: ['#E7F900', '#00f2fe', '#FFFFFF'] });
    } catch (e) {}

    triggerModal(
      'Sugerencia IA Aplicada con Éxito',
      `Se integró la directriz recomendada para <strong>${def.pilar}</strong>. El Health Score de tu base de conocimiento aumentó.`,
      () => {},
      'Excelente'
    );
  };

  // Switch vertical & update pillar defaults + suggestions + auto-suggest schedule
  const handleSelectVertical = (verticalId) => {
    const verticalConfig = BUSINESS_VERTICALS_CONFIG[verticalId] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
    const isSalesFocused = verticalConfig.category === 'retail_ecom' || verticalConfig.category === 'realestate_auto';
    
    // Configuración sugerida de duración de citas y días según giro (los turnos se mantienen limpios)
    let suggestedSchedule = {
      calendarScheduleType: 'single',
      appointmentDuration: 45,
      concurrencyLimit: 1,
      activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    };

    if (verticalId === 'hospitality') {
      suggestedSchedule = {
        calendarScheduleType: 'hospitality',
        appointmentDuration: 90,
        concurrencyLimit: 8,
        activeDays: ['martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      };
    } else if (verticalId === 'creator') {
      suggestedSchedule = {
        calendarScheduleType: 'calls',
        appointmentDuration: 45,
        concurrencyLimit: 1,
        activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
      };
    } else if (verticalId === 'b2b' || verticalId === 'legal_accounting') {
      suggestedSchedule = {
        calendarScheduleType: 'calls',
        appointmentDuration: 60,
        concurrencyLimit: 1,
        activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
      };
    } else if (verticalId === 'gym_fitness' || verticalId === 'spa_beauty') {
      suggestedSchedule = {
        calendarScheduleType: 'single',
        appointmentDuration: 60,
        concurrencyLimit: 15,
        activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
      };
    }

    setWizardData((prev) => ({
      ...prev,
      vertical: verticalId,
      businessGoal: isSalesFocused ? 'sales_direct' : verticalConfig.category === 'creators' ? 'marketing_branding' : 'appointments',
      enablePricingPillar: verticalId !== 'creator',
      enableCrisisPillar: true,
      inviolableRules: prev.inviolableRules,
      ...suggestedSchedule,
      appointmentDuration: prev.userEditedDuration ? prev.appointmentDuration : suggestedSchedule.appointmentDuration,
      bufferBetweenAppointmentsMin: prev.bufferBetweenAppointmentsMin ?? 0,
    }));

    setSuggestions(verticalConfig.proactiveSuggestions || []);
    setJustCalibratedGiro(true);
    setIsGiroSelectorOpen(false); // Colapso automático a Hero Card (10/10)
  };

  // 1-Click Master Briefing AI Ingestion Bridge (Real AI & Fallback)
  const handleAnalyzeMasterBriefing = async () => {
    if (!masterFile && !masterDocText.trim()) {
      triggerModal(
        'Documento o Texto Requerido',
        'Por favor selecciona o arrastra tu documento maestro (.pdf, .docx, .md, .txt) o escribe las instrucciones en el cuadro de texto antes de ejecutar el análisis con IA.',
        () => {},
        'Entendido'
      );
      return;
    }

    setIsAnalyzingBriefing(true);
    setBriefingAnalyzed(false);
    briefingAbortRef.current?.abort();
    briefingAbortRef.current = new AbortController();

    try {
      const fallbackVertKey = wizardData.vertical || 'b2b';
      const vert = BUSINESS_VERTICALS_CONFIG[fallbackVertKey] || BUSINESS_VERTICALS_CONFIG.b2b || BUSINESS_VERTICALS_CONFIG.gym_fitness;
      const adaptive = VERTICAL_PILLARS_ADAPTIVE_CONFIG[fallbackVertKey] || VERTICAL_PILLARS_ADAPTIVE_CONFIG.b2b || VERTICAL_PILLARS_ADAPTIVE_CONFIG.gym_fitness;

      const result = await BriefingBridge.analyze({
        file: masterFile,
        text: masterDocText,
        verticalConfig: vert,
        onProgress: (stage) => setBriefingAnalysisStage(stage),
        signal: briefingAbortRef.current.signal,
      });

      setIsAnalyzingBriefing(false);
      setBriefingAnalyzed(true);

      const resolvedVerticalKey =
        wizardData.vertical ||
        (result.verticalSuggested && BUSINESS_VERTICALS_CONFIG[result.verticalSuggested] ? result.verticalSuggested : fallbackVertKey);
      const resolvedVertObj = BUSINESS_VERTICALS_CONFIG[resolvedVerticalKey] || vert;

      if (!wizardData.vertical) {
        setIsGiroSelectorOpen(false);
      }

      const fileObj = masterFile ? { name: masterFile.name, size: masterFile.size, type: masterFile.type } : null;

      // Auto-popular los 6 pasos (Entidad, Web, 4 Pilares RAG, Propuesta Comercial y Reglas) con la extracción real de IA
      setWizardData((prev) => {
        const sanitizeField = (val, fallback = '') => {
          if (!val || typeof val !== 'string') return fallback;
          const lower = val.toLowerCase().trim();
          if (
            lower.startsWith('no especifica') ||
            lower.startsWith('no disponible') ||
            lower.startsWith('sin especific') ||
            lower === 'pendiente' ||
            lower === 'n/a'
          ) {
            return fallback;
          }
          return val.trim();
        };

        const cleanExtractedName =
          result.businessName && !result.businessName.startsWith('Centro de Excelencia')
            ? sanitizeField(result.businessName, prev.businessName || resolvedVertObj.name.split(',')[0])
            : prev.businessName || resolvedVertObj.name.split(',')[0];

        // Limpiar teléfono para asegurar que solo se guarde si contiene dígitos reales
        const rawPhone = sanitizeField(result.ownerPhone, '');
        const phoneDigits = rawPhone.replace(/\D/g, '');
        const cleanPhone = phoneDigits.length >= 10 ? rawPhone : (prev.ownerPhone || '');

        // Limpiar URL oficial si no parece enlace web válido
        const rawUrl = sanitizeField(result.websiteUrl, '');
        const cleanUrl = (/^https?:\/\//i.test(rawUrl) || /^www\./i.test(rawUrl)) ? rawUrl : (prev.websiteUrl || '');

        return {
          ...prev,
          vertical: prev.vertical || resolvedVerticalKey,
          businessName: cleanExtractedName,
          legalNameTaxId: sanitizeField(result.legalNameTaxId, prev.legalNameTaxId || ''),
          primaryContact: sanitizeField(result.primaryContact, prev.primaryContact || ''),
          ownerPhone: cleanPhone,
          websiteUrl: cleanUrl,
          brandColor: result.brandColor || prev.brandColor || '#E7F900',
          brandSecondaryColor: result.brandSecondaryColor || prev.brandSecondaryColor || '#000000',
          microLandingCustomSlug: cleanExtractedName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          // Pilar 2: Brandbook & Tono
          brandTone: sanitizeField(result.brandTone, adaptive?.pilar2?.placeholder?.replace(/^ej\.\s*/, '') || 'Profesional, Empático y Orientado a Resultados'),
          brandbookDoc: (result.brandbookDoc && typeof result.brandbookDoc === 'object') ? result.brandbookDoc : (fileObj ? { name: `Brandbook_${fileObj.name}`, size: fileObj.size, type: fileObj.type || 'text/markdown' } : null),
          archetype: sanitizeField(result.archetype, resolvedVertObj.badge || 'El Asesor Experto'),
          // Propuesta Comercial & Gancho
          offerHook: sanitizeField(result.offerHook, adaptive?.offer?.placeholder?.replace(/^ej\.\s*/, '') || 'Diagnóstico de Valoración Sin Costo'),
          offerCta: sanitizeField(result.offerCta, 'Envía mensaje para apartar cupo'),
          offerValidity: sanitizeField(result.offerValidity, 'Válido por tiempo limitado'),
          commercialProposalDoc: (result.commercialProposalDoc && typeof result.commercialProposalDoc === 'object') ? result.commercialProposalDoc : (fileObj || null),
          // Pilar 1: Precios & Servicios
          pricingDetails: sanitizeField(result.pricingDetails, adaptive?.pilar1?.placeholder?.replace(/^ej\.\s*/, '') || 'Tarifas base y opciones de pago diferido'),
          pricingDoc: (result.pricingDoc && typeof result.pricingDoc === 'object') ? result.pricingDoc : (fileObj ? { name: `Tarifario_${fileObj.name}`, size: fileObj.size, type: fileObj.type || 'application/pdf' } : null),
          // Pilar 3: Políticas & FAQs
          faqDetails: sanitizeField(result.faqDetails, adaptive?.pilar3?.placeholder?.replace(/^ej\.\s*/, '') || 'Cancelaciones con 24h de anticipación'),
          faqsDoc: (result.faqsDoc && typeof result.faqsDoc === 'object') ? result.faqsDoc : (fileObj ? { name: `FAQs_Reglamento_${fileObj.name}`, size: fileObj.size, type: fileObj.type || 'text/markdown' } : null),
          // Pilar 4 & Reglas
          enableCommercialProposal: true,
          enableCrisisPillar: true,
          inviolableRules: result.inviolableRules?.length > 0 ? result.inviolableRules : (resolvedVertObj.defaultRules || prev.inviolableRules),
          // Bloque 5: Buyer Persona & Marketing Mix 4 Ps
          buyerPersona: (result.buyerPersona && typeof result.buyerPersona === 'object') ? result.buyerPersona : prev.buyerPersona,
          marketingMix4P: (result.marketingMix4P && typeof result.marketingMix4P === 'object') ? result.marketingMix4P : prev.marketingMix4P,
        };
      });

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          colors: ['#E7F900', '#8A95B6', '#FFFFFF'],
        });
      } catch (e) {}

      // Llevar al usuario al Paso 2 para revisar lo auto-generado
      setCurrentStep(2);

      triggerModal(
        '¡Extracción Documental con IA Completada!',
        `El documento "${masterFile?.name || 'Briefing'}" fue analizado con DeepSeek IA para "${resolvedVertObj.name}". Se extrajeron los datos de la marca (${result.businessName || resolvedVertObj.name}), contacto (${result.primaryContact || 'detectado'}), tono, arquetipo y reglas inviolables. Revísalos en el Paso 2.`,
        () => {},
        'Revisar Datos Extraídos'
      );
    } catch (err) {
      if (err.message === 'AbortError') return;
      console.error('[AI Bridge Error]:', err);
      setIsAnalyzingBriefing(false);
      setBriefingAnalysisStage('Error al conectar con el motor IA. Intenta de nuevo.');
    }
  };

  // Apply Proactive Suggestion with 1 Click
  const handleApplySuggestion = async (sugId) => {
    const targetSug = suggestions.find((s) => s.id === sugId);
    const updatedSuggestions = suggestions.map((s) =>
      s.id === sugId ? { ...s, applied: true } : s
    );
    setSuggestions(updatedSuggestions);

    try {
      if (activeTenant?.id && updateTenantPolicy) {
        const nextRules = targetSug?.description
          ? Array.from(
              new Set([
                ...(activeTenant.inviolableRules || []),
                `${targetSug.title}: ${targetSug.description}`,
              ])
            )
          : activeTenant.inviolableRules || [];
        await updateTenantPolicy(activeTenant.id, {
          inviolableRules: nextRules,
          proactiveSuggestions: updatedSuggestions,
        });
      }

      triggerModal(
        'Sugerencia Aplicada con Éxito',
        'Se ha incorporado la directriz a la memoria del bot. El Health Score de tu base de conocimiento aumentó.',
        () => {
          try {
            confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#8A95B6', '#FFFFFF'] });
          } catch (e) {}
        },
        'Excelente'
      );
    } catch (err) {
      triggerModal(
        'Error al Persistir Sugerencia',
        err?.response?.data?.message || err?.message || 'No se pudo persistir la sugerencia en PostgreSQL.',
        null,
        'Entendido',
        'danger'
      );
    }
  };

  // Handle Deploy New Swarm (Con Deploy Gate de Validación)
  const handleDeploySwarm = async () => {
    // 1. Validar Nombre Comercial Obligatorio
    if (!wizardData.businessName || wizardData.businessName.trim() === '') {
      triggerModal(
        'Falta Nombre Comercial [Obligatorio]',
        'Para aprovisionar el nuevo negocio con aislamiento en base de datos (PostgreSQL RLS), es indispensable ingresar el Nombre Comercial del Negocio.',
        () => {
          setCurrentStep(2);
        },
        'Ingresar Nombre'
      );
      return;
    }

    // 2. Validar Teléfono de Escalación Humana Obligatorio (HITL)
    if (!wizardData.ownerPhone || wizardData.ownerPhone.trim() === '') {
      triggerModal(
        'Falta Teléfono de Escalación [Obligatorio]',
        'Por arquitectura de seguridad RAG, es estrictamente obligatorio registrar un Teléfono o WhatsApp de Escalación Humana (HITL) para transferir emergencias o quejas de clientes.',
        () => {
          setCurrentStep(2);
        },
        'Ingresar Teléfono'
      );
      return;
    }

    const activePillarsCount = 1 + (wizardData.enablePricingPillar ? 1 : 0) + (wizardData.enableCrisisPillar ? 1 : 0) + (wizardData.enableHistoryPillar ? 1 : 0);
    const vert = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;

    const tenantSlug = (wizardData.microLandingCustomSlug || wizardData.businessName || 'nuevo-negocio')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const preset = resolveBrandPreset({ vertical: vert.id, id: tenantSlug });

    const newTenant = {
      id: tenantSlug,
      name: wizardData.businessName,
      shortName: wizardData.businessName,
      legalNameTaxId: wizardData.legalNameTaxId || 'Validación en trámite',
      vertical: vert.id,
      verticalKey: vert.id,
      verticalLabel: vert.name,
      canonicalId: vert.canonicalId,
      giro: vert.name,
      brandPurpose: wizardData.brandPurpose || (wizardData.offerHook ? `${wizardData.offerHook}. ${wizardData.offerCta || ''}`.trim() : (vert.conversionGoal || `Excelencia operativa y conversión directa para ${wizardData.businessName}.`)),
      toneOfVoice: wizardData.brandTone || preset.defaultTone || 'Profesional, empático y orientado a conversión',
      slaTarget: wizardData.hitlEscalationLatency?.includes('<') ? 5 : 15,
      brandColors: (wizardData.brandColor && /^#[0-9A-F]{6}$/i.test(wizardData.brandColor))
        ? [
            { name: 'Color Primario (Detectado)', hex: wizardData.brandColor },
            { name: 'Base / Contraste (Detectado)', hex: wizardData.brandSecondaryColor || '#000000' },
            { name: 'Acento Dinámico', hex: wizardData.brandColor.toUpperCase() === '#E7F900' ? '#C3F400' : '#06B6D4' },
            { name: 'Gris Grafito', hex: '#1E293B' },
            { name: 'Blanco Óptico', hex: '#FFFFFF' },
          ]
        : preset.colors,
      avatar: (wizardData.businessName && wizardData.businessName.toLowerCase().includes('vector'))
        ? '🐺'
        : (wizardData.archetype && wizardData.archetype.toLowerCase().includes('lobo') ? '🐺' : (vert.avatar || preset.avatar || '🏢')),
      connectedSocialNetworks: [
        'WHATSAPP',
        ...Object.keys(wizardData.socialLinks || {})
          .filter((k) => wizardData.socialLinks[k]?.trim())
          .map((k) => k.toUpperCase()),
      ],
      socialLinks: {
        youtube: wizardData.socialLinks?.youtube || '',
        tiktok: wizardData.socialLinks?.tiktok || '',
        linkedin: wizardData.socialLinks?.linkedin || '',
        instagram: wizardData.socialLinks?.instagram || '',
        facebook: wizardData.socialLinks?.facebook || '',
        x: wizardData.socialLinks?.x || '',
        website: wizardData.hasWebsite ? wizardData.websiteUrl : '',
      },
      hasWebsite: wizardData.hasWebsite,
      websiteUrl: wizardData.hasWebsite ? wizardData.websiteUrl : null,
      ga4MeasurementId: wizardData.ga4MeasurementId || null,
      metaPixelId: wizardData.metaPixelId || null,
      leadPriceMXN: Math.max(350, Number(wizardData.costPerQualifiedLead || 350)),
      costPerQualifiedLead: Math.max(350, Number(wizardData.costPerQualifiedLead || 350)),
      monthlyAdBudget: Number(wizardData.monthlyAdBudget || 0),
      microLandingEnabled: wizardData.microLandingBillingPlan !== 'disabled',
      microLandingStatus:
        wizardData.microLandingBillingPlan === 'disabled'
          ? 'disabled'
          : wizardData.microLandingBillingPlan === 'active_monthly'
          ? 'active'
          : 'trial',
      microLandingTrialDaysLeft: wizardData.microLandingBillingPlan === 'trial_90d' ? 90 : 0,
      microLandingSlug: tenantSlug,
      microLandingUrl: `https://app.vectorinside.com/m/${tenantSlug}`,
      cacMax: `${Math.max(350, Number(wizardData.costPerQualifiedLead || 350))} MXN`,
      cac: Math.max(350, Number(wizardData.costPerQualifiedLead || 350)),
      ifv: `${healthScore}%`,
      capiStatus: 'Sincronizado',
      phone: wizardData.ownerPhone,
      email: wizardData.contactEmail,
      primaryContact: wizardData.primaryContact,
      isAiActive: true,
      crisisMode: false,

      // Pilares RAG & Oferta Comercial inyectados para Perfil de Marca
      commercialOffer: {
        hook: wizardData.offerHook,
        cta: wizardData.offerCta,
        validity: wizardData.offerValidity,
        hasProposalDoc: !!wizardData.commercialProposalDoc,
        proposalDocName: wizardData.commercialProposalDoc?.name || null,
      },
      inviolableRules: wizardData.inviolableRules || [],
      buyerPersona: wizardData.buyerPersona || null,
      marketingMix4P: wizardData.marketingMix4P || null,
      appointmentDuration: wizardData.appointmentDuration || 60,
      calendarId: wizardData.googleCalendarId || `c_${tenantSlug}_agenda@group.calendar.google.com`,
      calendarConfig: {
        googleCalendarId: wizardData.googleCalendarId || `c_${tenantSlug}_agenda@group.calendar.google.com`,
        slotDurationMin: wizardData.appointmentDuration || 60,
        bufferBetweenAppointmentsMin: wizardData.bufferBetweenAppointmentsMin ?? 0,
        shifts: Array.isArray(wizardData.shifts) && wizardData.shifts.length > 0
          ? wizardData.shifts
          : [{ id: 'shift-1', name: 'Horario Comercial', start: '09:00', end: '18:00' }],
        concurrencyLimit: wizardData.concurrencyLimit || 1,
        activeDays: wizardData.activeDays || ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
      },
      systemPrompt: (vert.id === 'b2b' || tenantSlug.includes('vector'))
        ? `Eres el Asistente Ejecutivo de ${wizardData.businessName}. Tu objetivo es calificar requerimientos comerciales con precisión y criterio estratégico, responder con autoridad técnica y visión de negocio, y guiar al tomador de decisión a ${wizardData.offerCta || 'agendar su Discovery Call estratégica'}.${wizardData.brandPurpose ? ` Propósito rector: ${wizardData.brandPurpose}` : ''}\n\n• Reglas de Agenda & Disponibilidad: Atención y calificación de prospectos 24/7 en WhatsApp y Web. Las reuniones comerciales / Discovery Calls se agendan exclusivamente de Lunes a Viernes entre 09:00 y 18:00 hrs (duración: ${wizardData.appointmentDuration || 60} minutos por sesión). Bajo ninguna circunstancia ofrezcas citas fuera de este rango comercial ni en horarios nocturnos/madrugada.`
        : `Eres el Asistente Inteligente de ${wizardData.businessName}. Tu objetivo es atender con profesionalismo y agilidad, resolver consultas sobre productos y servicios y guiar al usuario a ${wizardData.offerCta || 'agendar su cita o llamada de atención'}.`,
      followUpMessage: (vert.id === 'b2b' || tenantSlug.includes('vector'))
        ? `¡Hola! Vimos que revisaste ${wizardData.offerHook || 'la propuesta de aceleración comercial con IA'} de ${wizardData.businessName}. Si te surgió alguna duda técnica o quieres evaluar cómo aplicaría a tu embudo antes de ${wizardData.offerCta || 'agendar la Discovery Call'}, dime y lo revisamos con gusto.`
        : `¡Hola! Notamos que te interesó la información de ${wizardData.businessName}. ¿Tienes alguna duda puntual o te gustaría que coordinemos tu horario de atención?`,
      pillars: {
        pillar1: {
          enabled: wizardData.enablePricingPillar,
          cacMax: wizardData.cacMax,
          ltvExpected: wizardData.ltvExpected,
          minGrossMargin: wizardData.minGrossMargin,
          fileName: wizardData.pricingDoc?.name || null,
        },
        pillar2: {
          enabled: true,
          brandTone: wizardData.brandTone,
          archetype: wizardData.archetype,
          emojiPolicy: wizardData.emojiPolicy,
          inviolableRules: wizardData.inviolableRules || [],
          fileName: wizardData.brandbookDoc?.name || null,
        },
        pillar3: {
          enabled: wizardData.enableCrisisPillar,
          keywords: wizardData.crisisKeywords,
          latency: wizardData.hitlEscalationLatency,
          fileName: wizardData.faqsDoc?.name || null,
        },
        pillar4: {
          enabled: wizardData.enableHistoryPillar,
          context: wizardData.historicalContext,
          fileName: wizardData.historicalDoc?.name || null,
        },
      },
    };

    try {
      if (registerTenant) {
        await registerTenant(newTenant, true);
      }
      if (switchTenantContext) {
        switchTenantContext(newTenant.id);
      }

      triggerModal(
        '¡Nuevo Negocio Desplegado con Éxito!',
        `El tenant "${wizardData.businessName}" ha sido configurado en el giro ${vert.name}. Se indexaron ${activePillarsCount} pilares con aislamiento PostgreSQL RLS y Score de Salud ${healthScore}/100. Servicio de Micro-Landing: ${newTenant.microLandingEnabled ? 'Activa' : 'Inactiva'}.`,
        () => {
          try {
            confetti({
              particleCount: 70,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#E7F900', '#8A95B6', '#FFFFFF'],
            });
          } catch (e) {}
          if (switchTenantContext) {
            switchTenantContext(newTenant.id);
          }
          setAdminViewMode('list');
          setCurrentStep(1);
        },
        'Finalizar y Ver Centro de Mando'
      );
    } catch (err) {
      triggerModal(
        'Error al Desplegar Negocio',
        err?.response?.data?.message || err?.message || 'Falló el registro del negocio en PostgreSQL.',
        null,
        'Entendido',
        'danger'
      );
    }
  };

    const currentVerticalObj = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
  const currentPillarsAdaptive = VERTICAL_PILLARS_ADAPTIVE_CONFIG[wizardData.vertical] || VERTICAL_PILLARS_ADAPTIVE_CONFIG.gym_fitness;

  const hasPendingAnalysis = (Boolean(masterFile) || Boolean(masterDocText?.trim())) && !briefingAnalyzed;

  const canProceedFromStep = (stepNumber) => {
    if (stepNumber === 1) {
      if (!wizardData.vertical) {
        return { valid: false, reason: 'Debes seleccionar un giro comercial en la lista antes de continuar al Paso 2.' };
      }
      if (isAnalyzingBriefing) {
        return { valid: false, reason: 'El análisis semántico con DeepSeek IA está en proceso. Por favor espera a que finalice.' };
      }
      if (hasPendingAnalysis) {
        return {
          valid: false,
          reason: `Tienes un archivo cargado ("${masterFile?.name || 'Documento Maestro'}") pendiente de análisis. Para auto-llenar los 6 pasos y extraer las directrices de la marca, haz clic en "Auto-Clasificar con IA", o retira el archivo si prefieres llenar los datos manualmente.`,
          isPendingAnalysis: true,
        };
      }
      return { valid: true };
    }
    if (stepNumber === 2) {
      if (!wizardData.businessName?.trim()) {
        return { valid: false, reason: 'El Nombre Comercial del Negocio es obligatorio para continuar.' };
      }
      const cleanPhone = (wizardData.ownerPhone || '').replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        return { valid: false, reason: 'El Teléfono / WhatsApp de Escalación Humana (HITL) es obligatorio (mínimo 10 dígitos) para continuar.' };
      }
      return { valid: true };
    }
    if (stepNumber === 3) {
      const price = Number(wizardData.costPerQualifiedLead);
      if (!Number.isFinite(price) || price < 350) {
        return { valid: false, reason: 'El costo por lead calificado debe ser mayor o igual a $350 MXN.' };
      }
      return { valid: true };
    }
    return { valid: true };
  };

  const shouldShowHeader = !hideHeader && !externalAdminViewMode;

  return (
    <div className={shouldShowHeader ? "p-6 lg:p-8 block animate-fade-in space-y-8" : "space-y-6 animate-fade-in"}>
      {/* Header Section (Oculto cuando está integrado en SystemConfigHub) */}
      {shouldShowHeader && (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              <Database className="w-3.5 h-3.5" />
              {adminViewMode === 'wizard' ? 'Aprovisionamiento RLS de Nuevo Tenant' : 'Taxonomía Universal de Giros RAG & Auto-Ingestión'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)]">
              {adminViewMode === 'wizard' ? (
                <>
                  Asistente de Alta <span className="text-neon">& Provisión de Negocio</span>
                </>
              ) : (
                <>
                  Base de Conocimiento <span className="text-neon">& Clasificación por Giro</span>
                </>
              )}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              {adminViewMode === 'wizard'
                ? 'Paso a paso para integrar un nuevo cliente: Giro comercial (17 Giros Oficiales), los 4 pilares y aislamiento en base de datos.'
                : 'Gimnasios, Escuelas, Redes de Networking, Clínicas, E-Commerce o Consultoría: La IA adapta los 4 pilares y sus reglas inviolables.'}
            </p>
          </div>

          {/* View Controls for Admin */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              {adminViewMode === 'list' ? (
                <button
                  type="button"
                  onClick={() => {
                    setWizardData((prev) => ({
                      ...prev,
                      vertical: null,
                    }));
                    setIsGiroSelectorOpen(true);
                    setAdminViewMode('wizard');
                    setCurrentStep(1);
                  }}
                  className="bg-neon text-black font-mono font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] flex items-center gap-2 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Dar de Alta Nuevo Negocio</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdminViewMode('list')}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono font-bold px-4 py-2.5 rounded-xl hover:border-neon transition-all flex items-center gap-2 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Lista de Tenants</span>
                </button>
              )}
            </div>
          )}
        </header>
      )}

      {/* ========================================================================= */}
      {/* VISTA 1: ADMINISTRADOR — LISTA DE TENANTS & BANDEJA DE APROBACIÓN         */}
      {/* ========================================================================= */}
      {isAdmin && adminViewMode === 'list' && (
        <div className="space-y-6 animate-fade-in font-sans">
          {/* ========================================================================= */}
          {/* 1. BARRA DE TELEMETRÍA EJECUTIVA (KPIs CLAVE DEL ECOSISTEMA)              */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] uppercase font-bold">
                <span>Total Empresas</span>
                <Building2 className="w-3.5 h-3.5 text-neon" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-heading font-black text-[var(--text-main)]">
                  {tenantEcosystemStats.total}
                </span>
                <span className="text-[10px] text-neon font-bold">Tenants Aislados</span>
              </div>
              <span className="text-[9px] text-[var(--text-muted)] block truncate">
                PostgreSQL RLS Multi-Tenant Activo
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] uppercase font-bold">
                <span>Micro-Landings</span>
                <Smartphone className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-heading font-black text-emerald-700 dark:text-emerald-400">
                  {tenantEcosystemStats.activeCount}
                </span>
                <span className="text-[10px] text-emerald-500 font-bold">Activas</span>
                {tenantEcosystemStats.pausedCount > 0 && (
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold">
                    • {tenantEcosystemStats.pausedCount} Pausada{tenantEcosystemStats.pausedCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-[var(--text-muted)] block truncate">
                Tráfico público directo a WhatsApp
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] uppercase font-bold">
                <span>Salud RAG Global</span>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-heading font-black text-cyan-700 dark:text-cyan-400">
                  {activeTenant ? `${activeTenantRagMetrics.healthPct}%` : '0%'}
                </span>
                <span className="text-[10px] text-cyan-500 font-bold">
                  {activeTenant ? activeTenantRagMetrics.statusLabel : 'Sin Indexar'}
                </span>
              </div>
              <span className="text-[9px] text-[var(--text-muted)] block truncate">
                {activeTenant
                  ? `${activeTenantRagMetrics.completedCount}/4 Pilares Indexados en Vector DB`
                  : '0/4 Pilares Indexados en Vector DB'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-neon/30 space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] uppercase font-bold">
                <span>Contexto Activo</span>
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-base shrink-0">{activeTenant?.avatar || '🏢'}</span>
                <span className="font-heading font-bold text-xs text-[var(--text-main)] truncate">
                  {activeTenant ? activeTenant.name : 'Sin Negocio Activo'}
                </span>
              </div>
              <span className="text-[9px] text-neon font-bold font-mono block truncate">
                ID: {activeTenant ? activeTenant.id : 'N/A'}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. BARRA DE HERRAMIENTAS: BÚSQUEDA, FILTROS Y CAMBIO DE VISTA (TOOLBAR)   */}
          {/* ========================================================================= */}
          <div className="p-3 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm font-mono text-xs">
            {/* Buscador en Vivo */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tenantSearchQuery}
                onChange={(e) => setTenantSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, ID o giro comercial..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs transition-colors placeholder:text-[var(--text-muted)]"
              />
              {tenantSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTenantSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filtros de Estado y Switcher de Layout */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filtro de Estado */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px]">
                {[
                  { id: 'all', label: `Todos (${tenantEcosystemStats.total})` },
                  { id: 'active', label: `Activos (${tenantEcosystemStats.activeCount})` },
                  { id: 'suspended', label: `Pausados (${tenantEcosystemStats.pausedCount})` },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setTenantStatusFilter(st.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
                      tenantStatusFilter === st.id
                        ? 'bg-neon text-black shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Switcher de Vista: Tabla Compacta vs Tarjetas */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setTenantViewLayout('table')}
                  className={`p-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold ${
                    tenantViewLayout === 'table'
                      ? 'bg-neon text-black shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  title="Vista Tabla de Alta Densidad (Recomendada para 10+ clientes)"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tabla</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTenantViewLayout('cards')}
                  className={`p-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold ${
                    tenantViewLayout === 'cards'
                      ? 'bg-neon text-black shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  title="Vista Tarjetas Detalladas"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tarjetas</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. VISTA EN TABLA DE ALTA DENSIDAD (LINEAR / STRIPE STYLE)                */}
          {/* ========================================================================= */}
          {tenantViewLayout === 'table' && (
            <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 text-[10px] font-bold uppercase text-[var(--text-muted)]">
                      <th className="py-3 px-4">Negocio / Tenant</th>
                      <th className="py-3 px-4">Giro Comercial</th>
                      <th className="py-3 px-4">Micro-Landing</th>
                      <th className="py-3 px-4">Salud RAG</th>
                      <th className="py-3 px-4">4 Pilares</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredTenantsList.map((tenant) => {
                      const isCurrentlyActive = activeTenant?.id === tenant.id;
                      const isExpanded = !!expandedTenantPillars[tenant.id];
                      const isLandingActive =
                        tenant.microLandingStatus !== 'suspended' &&
                        tenant.microLandingStatus !== 'disabled' &&
                        tenant.microLandingEnabled !== false;

                      return (
                        <React.Fragment key={tenant.id}>
                          <tr
                            className={`transition-colors group hover:bg-[var(--bg-card)]/40 ${
                              isCurrentlyActive ? 'bg-neon/5' : ''
                            }`}
                          >
                            {/* Negocio / Tenant */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5 min-w-[200px]">
                                <span className="text-xl shrink-0 p-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                                  {tenant.avatar || '🏢'}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-heading font-bold text-xs text-[var(--text-main)] truncate">
                                      {tenant.name}
                                    </p>
                                    {isCurrentlyActive && (
                                      <span className="px-1.5 py-0.5 rounded bg-neon text-black font-black text-[8px] uppercase tracking-wider shrink-0">
                                        Activo
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-[var(--text-muted)] font-mono block truncate">
                                    ID: {tenant.id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Giro Comercial */}
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-main)] font-medium max-w-[170px] truncate">
                                {tenant.giro || tenant.vertical || 'Servicios'}
                              </span>
                            </td>

                            {/* Micro-Landing */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 min-w-[160px]">
                                {isLandingActive ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-bold inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Activa
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30 text-[9px] font-bold inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                    Inactiva
                                  </span>
                                )}

                                <a
                                  href={`/m/${tenant.microLandingSlug || tenant.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:underline flex items-center gap-0.5 shrink-0"
                                  title="Abrir Micro-Landing"
                                >
                                  <span>/m/{tenant.microLandingSlug || tenant.id}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </td>

                            {/* Salud RAG */}
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                {(() => {
                                  const m = getTenantRagMetrics(tenant);
                                  return `${m.healthPct}% ${m.statusLabel}`;
                                })()}
                              </span>
                            </td>

                            {/* Botón de inspección de 4 Pilares */}
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => toggleTenantPillars(tenant.id)}
                                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  isExpanded
                                    ? 'bg-neon/15 border-neon text-neon'
                                    : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-neon/40'
                                }`}
                              >
                                <span>4 Pilares</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </td>

                            {/* Acciones */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Botón Activar / Pausar Micro-Landing */}
                                {isLandingActive ? (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleMicroLanding(tenant, 'suspended')}
                                    className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-500/40 transition-colors text-[10px] font-bold"
                                    title="Pausar Micro-Landing"
                                  >
                                    <Power className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleMicroLanding(tenant, 'active')}
                                    className="p-1.5 rounded-lg bg-emerald-500 text-black font-bold text-[10px] hover:bg-emerald-400 transition-colors"
                                    title="Activar Micro-Landing"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                  </button>
                                )}

                                {/* Botón Establecer como Contexto Activo */}
                                {!isCurrentlyActive ? (
                                  <button
                                    type="button"
                                    onClick={() => switchTenantContext && switchTenantContext(tenant.id)}
                                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon hover:text-neon text-[10px] font-bold text-[var(--text-muted)] transition-all"
                                    title="Cambiar al contexto de este negocio en el panel"
                                  >
                                    <span>Activar</span>
                                  </button>
                                ) : (
                                  <a
                                    href="/profile"
                                    className="px-2.5 py-1 rounded-lg bg-neon/15 border border-neon/30 text-neon hover:bg-neon hover:text-black text-[10px] font-bold transition-all flex items-center gap-1"
                                    title="Editar perfil de marca y ADN RAG"
                                  >
                                    <span>Perfil</span>
                                    <ArrowRight className="w-2.5 h-2.5" />
                                  </a>
                                )}

                                {/* Eliminar Negocio */}
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTenant(tenant);
                                    }}
                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    title={`Eliminar negocio ${tenant.name}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Acordeón Desplegable de los 4 Pilares RAG para esta fila */}
                          {isExpanded && (
                            <tr className="bg-[var(--bg-card)]/30 border-b border-[var(--border-color)]">
                              <td colSpan={6} className="p-4">
                                <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-neon/20 space-y-2.5">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-neon">
                                    <span className="flex items-center gap-1.5">
                                      <Database className="w-3.5 h-3.5" />
                                      Desglose de Memoria RAG: {tenant.name}
                                    </span>
                                    <a
                                      href="/profile"
                                      onClick={() => switchTenantContext && switchTenantContext(tenant.id)}
                                      className="text-[10px] text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1"
                                    >
                                      <span>Ajustar en Perfil de Marca</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </a>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[10px]">
                                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                                      <span className="text-neon font-bold block mb-0.5">Pilar 1: Precios & CAC</span>
                                      <p className="text-[var(--text-main)] font-semibold truncate">
                                        CAC Máx: {tenant.cacMax || 'N/D'}
                                      </p>
                                      <span className="text-[9px] text-[var(--text-muted)]">Matriz Financiera</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-cyan-500/30">
                                      <span className="text-cyan-700 dark:text-cyan-400 font-bold block mb-0.5">Pilar 2: Brandbook & Tono</span>
                                      <p className="text-[var(--text-main)] font-semibold truncate">
                                        {tenant.toneOfVoice || 'Tono Profesional'}
                                      </p>
                                      <span className="text-[9px] text-[var(--text-muted)]">Identidad Activa</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-amber-500/30">
                                      <span className="text-amber-700 dark:text-amber-400 font-bold block mb-0.5">Pilar 3: Crisis & FAQs</span>
                                      <p className="text-[var(--text-main)] font-semibold truncate">
                                        Escalación Sub-segundo
                                      </p>
                                      <span className="text-[9px] text-[var(--text-muted)]">HITL WhatsApp Activo</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-purple-500/30">
                                      <span className="text-purple-700 dark:text-purple-400 font-bold block mb-0.5">Pilar 4: Histórico</span>
                                      <p className="text-[var(--text-main)] font-semibold truncate">
                                        Casos de Éxito & FAQs
                                      </p>
                                      <span className="text-[9px] text-[var(--text-muted)]">Memoria Retroactiva</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. VISTA EN TARJETAS DETALLADAS (MODERNA / EXPANDIDA)                      */}
          {/* ========================================================================= */}
          {tenantViewLayout === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTenantsList.map((tenant) => {
                const isCurrentlyActive = activeTenant?.id === tenant.id;
                const isExpanded = !!expandedTenantPillars[tenant.id];
                const isLandingActive =
                  tenant.microLandingStatus !== 'suspended' &&
                  tenant.microLandingStatus !== 'disabled' &&
                  tenant.microLandingEnabled !== false;

                return (
                  <div
                    key={tenant.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border transition-all space-y-4 shadow-sm ${
                      isCurrentlyActive
                        ? 'border-neon/60 shadow-[0_0_15px_rgba(195,244,0,0.12)]'
                        : 'border-[var(--border-color)] hover:border-neon/30'
                    }`}
                  >
                    {/* Header de la Tarjeta */}
                    <div className="flex items-start justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-2xl p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shrink-0">
                          {tenant.avatar || '🏢'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[var(--text-main)] font-mono truncate">
                              {tenant.name}
                            </h4>
                            {isCurrentlyActive && (
                              <span className="px-1.5 py-0.5 rounded bg-neon text-black font-black text-[8px] uppercase tracking-wider shrink-0">
                                Activo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono block truncate">
                            {tenant.giro || tenant.vertical || 'Vertical Activa'} • ID: {tenant.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                          {(() => {
                            const m = getTenantRagMetrics(tenant);
                            return `${m.healthPct}% ${m.statusLabel}`;
                          })()}
                        </span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTenant(tenant);
                            }}
                            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title={`Eliminar negocio ${tenant.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Resumen Compacto de 4 Pilares con Toggle */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[var(--text-muted)] font-bold uppercase">Estado de Pilares RAG:</span>
                        <button
                          type="button"
                          onClick={() => toggleTenantPillars(tenant.id)}
                          className="text-neon hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>{isExpanded ? 'Ocultar' : 'Ver Detalles'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* 4 Mini-Pills */}
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-mono font-bold">
                        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-neon">
                          P1: Precios
                        </div>
                        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-cyan-500/30 text-cyan-700 dark:text-cyan-400">
                          P2: Brand
                        </div>
                        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-amber-500/30 text-amber-700 dark:text-amber-400">
                          P3: Crisis
                        </div>
                        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-purple-500/30 text-purple-700 dark:text-purple-400">
                          P4: Hist
                        </div>
                      </div>

                      {/* Contenido Expandido del Acordeón */}
                      {isExpanded && (
                        <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 text-[10px] font-mono animate-fade-in mt-2">
                          <div className="flex justify-between border-b border-[var(--border-color)] pb-1.5">
                            <span className="text-[var(--text-muted)]">Pilar 1 (Rentabilidad):</span>
                            <span className="text-[var(--text-main)] font-bold">{tenant.cacMax || 'N/D'}</span>
                          </div>
                          <div className="flex justify-between border-b border-[var(--border-color)] pb-1.5">
                            <span className="text-[var(--text-muted)]">Pilar 2 (Tono de Voz):</span>
                            <span className="text-cyan-700 dark:text-cyan-400 font-bold truncate max-w-[200px]">{tenant.toneOfVoice || 'Activo'}</span>
                          </div>
                          <div className="flex justify-between border-b border-[var(--border-color)] pb-1.5">
                            <span className="text-[var(--text-muted)]">Pilar 3 (HITL Crisis):</span>
                            <span className="text-amber-700 dark:text-amber-400 font-bold">Sub-segundo (&lt; 1.2s)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Pilar 4 (Histórico):</span>
                            <span className="text-purple-700 dark:text-purple-400 font-bold">Memoria Activa</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer de la Tarjeta con Micro-Landing y Acciones */}
                    <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        {isLandingActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Activa
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30 text-[9px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            Inactiva
                          </span>
                        )}

                        <a
                          href={`/m/${tenant.microLandingSlug || tenant.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1 truncate max-w-[130px]"
                        >
                          <span>/m/{tenant.microLandingSlug || tenant.id}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle Micro-Landing */}
                        {isLandingActive ? (
                          <button
                            type="button"
                            onClick={() => handleToggleMicroLanding(tenant, 'suspended')}
                            className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                            title="Pausar Micro-Landing"
                          >
                            <Power className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleMicroLanding(tenant, 'active')}
                            className="p-1.5 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
                            title="Activar Micro-Landing"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </button>
                        )}

                        {/* Switch / Ver Perfil */}
                        {!isCurrentlyActive ? (
                          <button
                            type="button"
                            onClick={() => switchTenantContext && switchTenantContext(tenant.id)}
                            className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon hover:text-neon text-[10px] font-bold text-[var(--text-muted)] transition-all"
                          >
                            Activar
                          </button>
                        ) : (
                          <a
                            href="/profile"
                            className="px-2.5 py-1 rounded-lg bg-neon/15 border border-neon/30 text-neon hover:bg-neon hover:text-black text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <span>Perfil</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. ESTADO VACÍO (CUANDO NO HAY RESULTADOS DE BÚSQUEDA O FILTRO)           */}
          {/* ========================================================================= */}
          {filteredTenantsList.length === 0 && (
            <div className="p-8 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-center space-y-3 font-mono">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-2xl text-[var(--text-muted)]">
                🏢
              </div>
              <h4 className="text-sm font-bold text-[var(--text-main)]">
                {allTenantsList.length === 0
                  ? 'No hay negocios registrados en el sistema'
                  : 'No se encontraron negocios con los filtros actuales'}
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                {allTenantsList.length === 0
                  ? 'El ecosistema se encuentra limpio (Zero-State). Haz clic en "+ Alta Nuevo Negocio" para dar de alta tu primer negocio.'
                  : `No hay coincidencias para "${tenantSearchQuery}". Prueba modificando tu término de búsqueda o limpia los filtros.`}
              </p>
              {allTenantsList.length === 0 && isAdmin && (
                <button
                  type="button"
                  onClick={() => setAdminViewMode('wizard')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon text-black font-bold text-xs uppercase hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95 mt-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Alta Nuevo Negocio</span>
                </button>
              )}
              {allTenantsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setTenantSearchQuery('');
                    setTenantStatusFilter('all');
                    setTenantVerticalFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs uppercase hover:bg-[var(--neon-hover)] transition-all shadow-sm"
                >
                  Limpiar Filtros
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: ADMINISTRADOR — WIZARD DE ALTA CON TAXONOMÍA COMPLETA DE GIROS   */}
      {/* ========================================================================= */}
      {isAdmin && adminViewMode === 'wizard' && (
        <div className="vector-bg-card vector-border rounded-2xl p-4 sm:p-6 lg:p-8 w-full shadow-2xl space-y-8 animate-fade-in">

          {/* Stepper Header: Barra de Progreso y Estados Visuales (Stripe / Linear standard) */}
          <div id="tour-wizard-stepper" className="space-y-4 border-b border-[var(--border-color)] pb-6 font-mono">
            {/* Barra superior de métrica de avance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                <span className="font-bold text-[var(--text-main)]">Paso {currentStep} de 6:</span>
                <span className="text-neon font-black">
                  {currentStep === 1 && 'Giro Comercial & IA'}
                  {currentStep === 2 && 'Entidad & Web'}
                  {currentStep === 3 && 'Marketing & Tracking'}
                  {currentStep === 4 && 'Agenda & Horarios'}
                  {currentStep === 5 && 'Pilares RAG & Oferta'}
                  {currentStep === 6 && 'Reglas & Despliegue'}
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('vector_start_tour', { detail: { tourId: `wizard_step_${currentStep}` } }))}
                  title={`Explicar a detalle el Paso ${currentStep}`}
                  className="px-2.5 py-1 rounded-lg bg-neon/10 border border-neon/30 text-neon hover:bg-neon/20 font-mono text-[10px] font-bold transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-neon" />
                  <span>Explicar Paso {currentStep}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('vector_start_tour', { detail: { tourId: 'wizard_6_steps' } }))}
                  title="Tour guiado completo de los 6 pasos para dar de alta un negocio"
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] hover:text-neon font-mono text-[10px] font-bold transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <GraduationCap className="w-3 h-3" />
                  <span className="hidden md:inline">Tour 6 Pasos</span>
                </button>
                <span className="font-bold text-[var(--text-muted)] text-[11px] ml-1">
                  {Math.round((currentStep / 6) * 100)}%
                </span>
              </div>
            </div>

            {/* Track de Progreso */}
            <div className="w-full h-1.5 bg-[var(--bg-panel)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-neon to-neon transition-all duration-300 shadow-[0_0_8px_rgba(231,249,0,0.5)]"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>

            {/* Stepper Tabs Interactivos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {[
                { num: 1, title: 'Giro & IA', icon: Target },
                { num: 2, title: 'Entidad & Web', icon: Building2 },
                { num: 3, title: 'Marketing & Tracking', icon: Activity },
                { num: 4, title: 'Agenda & Horarios', icon: Clock },
                { num: 5, title: 'Pilares RAG', icon: Database },
                { num: 6, title: 'Reglas & Despliegue', icon: Shield },
              ].map((st) => {
                const isCurrent = currentStep === st.num;
                const isCompleted = currentStep > st.num;

                return (
                  <button
                    key={st.num}
                    type="button"
                    disabled={isAnalyzingBriefing}
                    onClick={() => {
                      if (isAnalyzingBriefing) return;
                      if (st.num === currentStep) return;

                      // Si intenta avanzar hacia un paso mayor, validar todos los pasos intermedios
                      if (st.num > currentStep) {
                        for (let s = currentStep; s < st.num; s++) {
                          const check = canProceedFromStep(s);
                          if (!check.valid) {
                            triggerModal(
                              check.isPendingAnalysis ? 'Análisis con IA Pendiente' : 'Paso Incompleto',
                              check.reason,
                              check.isPendingAnalysis ? () => handleAnalyzeMasterBriefing() : null,
                              check.isPendingAnalysis ? 'Auto-Clasificar con IA Ahora' : 'Completar Datos'
                            );
                            return;
                          }
                        }
                      }
                      setCurrentStep(st.num);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 relative group ${
                      isCurrent
                        ? 'bg-neon/15 border-neon text-[var(--text-main)] shadow-neon-sm ring-1 ring-neon/40'
                        : isCompleted
                        ? 'bg-[var(--bg-panel)] border-emerald-500/40 text-[var(--text-main)] hover:border-emerald-400'
                        : 'bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-neon text-black shadow-[0_0_8px_rgba(231,249,0,0.6)]'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-[var(--text-muted)] font-bold uppercase truncate">
                        {isCompleted ? 'Listo' : `Paso ${st.num}`}
                      </span>
                      <span
                        className={`block text-xs font-bold truncate ${
                          isCurrent ? 'text-neon' : isCompleted ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 1: Giro Comercial del Negocio & Acelerador con IA       */}
          {/* ============================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">

              {/* Contenedor del Giro Comercial (Hero Card o Catálogo de 17 opciones) */}
              <div id="tour-wizard-step1-catalog" className="space-y-4">
              {/* CASO A: VISTA ENFOQUE HERO CARD (10/10) - Cuando un giro ya fue seleccionado y el catálogo está colapsado */}
              {!isGiroSelectorOpen && wizardData.vertical && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  {/* Micro-banner reactivo de Calibración IA en Vivo (10/10) */}
                  {justCalibratedGiro && (
                    <div className="p-3 rounded-xl bg-neon/15 border border-neon/40 flex items-center justify-between text-xs font-mono text-neon animate-in fade-in slide-in-from-top-2 duration-300 shadow-[0_0_20px_rgba(231,249,0,0.2)]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-neon animate-spin" />
                        <span className="font-bold">
                          ⚡ ¡IA Calibrada con éxito para {currentVerticalObj.name}! Arquetipo y directrices precargadas.
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] border border-neon/30 text-lime-700 dark:text-neon font-black">
                        Score {healthScore}%
                      </span>
                    </div>
                  )}

                  {/* Hero Card Enfoque */}
                  <div className="p-5 md:p-6 rounded-2xl bg-[var(--bg-card)] border-2 border-brand-primary/40 shadow-sm relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-neon/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
                      {/* Lado Izquierdo: Avatar + Títulos + Badges */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-neon/15 border border-neon/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                          {currentVerticalObj.avatar}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neon/20 text-neon border border-neon/40 uppercase">
                              {currentVerticalObj.canonicalId || 'V01'}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Giro Activo & Calibrado
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] hidden sm:inline">
                              {currentVerticalObj.badge}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-[var(--text-main)] font-mono">
                            {currentVerticalObj.name}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] font-mono line-clamp-1">
                            {currentVerticalObj.description}
                          </p>
                        </div>
                      </div>

                      {/* Lado Derecho: Botón Ergonómico Cambiar Giro */}
                      <div className="flex items-center gap-2 self-stretch lg:self-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--border-color)]">
                        <button
                          type="button"
                          onClick={() => setIsGiroSelectorOpen(true)}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--bg-panel)] hover:bg-neon/15 border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] hover:text-neon text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 group"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-neon group-hover:rotate-180 transition-transform duration-500" />
                          <span>Cambiar Giro Comercial</span>
                        </button>
                      </div>
                    </div>

                    {/* Fila de 3 Certezas Automáticas (Metas, Agenda & RAG) (10/10) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-[var(--border-color)]/70 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]/50 space-y-1">
                        <span className="text-[10px] text-[var(--text-muted)] block flex items-center gap-1 uppercase font-bold">
                          <Target className="w-3 h-3 text-neon" /> Meta Comercial
                        </span>
                        <span className="font-bold text-[var(--text-main)] block truncate">
                          {currentVerticalObj.conversionGoal}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]/50 space-y-1">
                        <span className="text-[10px] text-[var(--text-muted)] block flex items-center gap-1 uppercase font-bold">
                          <Calendar className="w-3 h-3 text-cyan-700 dark:text-cyan-400" /> Agenda Calibrada
                        </span>
                        <span className="font-bold text-[var(--text-main)] block truncate">
                          {wizardData.calendarScheduleType === 'hospitality'
                            ? 'Mesas & Comensales (90m)'
                            : wizardData.calendarScheduleType === 'calls'
                            ? 'Llamadas & Discovery (30-45m)'
                            : 'Citas & Sesiones (45-60m)'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]/50 space-y-1">
                        <span className="text-[10px] text-[var(--text-muted)] block flex items-center gap-1 uppercase font-bold">
                          <Sparkles className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> RAG Score
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                          {healthScore}% Calibrado ({currentVerticalObj.defaultRules?.length || 3} reglas)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CASO B: MODO EXPLORACIÓN (CATÁLOGO ABIERTO CON LAS 17 OPCIONES) */}
              {(isGiroSelectorOpen || !wizardData.vertical) && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                            Paso 1 de 6
                          </span>
                          <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                            <Target className="w-5 h-5 text-neon" />
                            <span>Catálogo de Giros Comerciales</span>
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30">
                          {filteredVerticals.length} disponibles
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                        Selecciona el sector comercial de tu negocio para calibrar automáticamente arquetipo de ventas, metas y directrices.
                      </p>
                    </div>

                    {/* Botón Salida Rápida: Visible únicamente si ya hay un giro previamente seleccionado */}
                    {wizardData.vertical && (
                      <div className="flex items-center gap-2 self-stretch lg:self-auto">
                        <button
                          type="button"
                          onClick={() => setIsGiroSelectorOpen(false)}
                          className="px-3.5 py-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-xs font-mono font-bold text-[var(--text-main)] hover:text-neon flex items-center gap-1.5 transition-all shadow-sm"
                          title="Cerrar catálogo y mantener giro seleccionado"
                        >
                          <X className="w-3.5 h-3.5 text-neon" />
                          <span>Mantener {currentVerticalObj.name}</span>
                        </button>
                      </div>
                    )}
                  </div>

                {/* Controls: Search Bar + View Toggle */}
                <div className="flex items-center gap-2 self-stretch lg:self-auto">
                  <div className="relative flex-1 lg:w-64">
                    <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar giro (ej. gym, clínica, b2b)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl pl-9 pr-8 py-2 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-neon outline-none font-mono transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* View Mode Toggle (Compact vs Detailed) */}
                  <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-0.5 rounded-xl shrink-0">
                    <button
                      type="button"
                      onClick={() => setVerticalViewMode('compact')}
                      title="Vista Compacta (Rápida y práctica)"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                        verticalViewMode === 'compact'
                          ? 'bg-neon text-black shadow-neon-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Compacto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerticalViewMode('detailed')}
                      title="Vista Detallada (Explicaciones completas)"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                        verticalViewMode === 'detailed'
                          ? 'bg-neon text-black shadow-neon-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Detallado</span>
                    </button>
                  </div>
                </div>

              {/* Taxonomy Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {[
                  { id: 'all', label: 'Todos los Giros', icon: Layers },
                  { id: 'fitness_health', label: 'Salud & Bienestar', icon: HeartPulse },
                  { id: 'education', label: 'Educación & Coaching', icon: GraduationCap },
                  { id: 'networking', label: 'Networking & Comunidades', icon: Users },
                  { id: 'retail_ecom', label: 'Comercio & Retail', icon: ShoppingBag },
                  { id: 'hospitality', label: 'Gastronomía & Hotelería', icon: Utensils },
                  { id: 'b2b_services', label: 'Servicios B2B & Legal', icon: Briefcase },
                  { id: 'realestate_auto', label: 'Inmobiliaria & Autos', icon: Home },
                  { id: 'creators', label: 'Creadores & Marca Personal', icon: Video },
                ].map((cat) => {
                  const IconComponent = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isSelected
                          ? 'bg-neon text-black shadow-neon-sm'
                          : 'bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                      }`}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-black/20 text-black'
                            : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Empty state for search */}
              {filteredVerticals.length === 0 && (
                <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center space-y-3 font-mono">
                  <p className="text-sm font-bold text-[var(--text-main)]">
                    No se encontraron giros que coincidan con "{searchQuery}"
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs font-mono hover:bg-[var(--neon-hover)] transition-all"
                  >
                    Restablecer Filtros y Ver Todos los Giros
                  </button>
                </div>
              )}

              {/* COMPACT VIEW MODE: Sleek tiles up to 6 columns */}
              {verticalViewMode === 'compact' && filteredVerticals.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
                  {filteredVerticals.map((vert) => {
                    const isSelected = wizardData.vertical === vert.id;
                    return (
                      <button
                        key={vert.id}
                        type="button"
                        onClick={() => handleSelectVertical(vert.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group relative ${
                          isSelected
                            ? 'bg-[var(--bg-panel)] border-2 border-brand-primary shadow-sm ring-1 ring-brand-primary/40'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-brand-primary/50 hover:bg-[var(--bg-panel)]/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{vert.avatar}</span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                                isSelected
                                  ? 'bg-neon/20 text-neon border border-neon/40'
                                  : 'bg-[var(--bg-panel)] text-[var(--text-muted)]'
                              }`}
                            >
                              {vert.canonicalId || vert.id}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[var(--text-main)] font-mono leading-snug line-clamp-2">
                            {vert.name}
                          </h4>
                        </div>
                        <div className="pt-2 border-t border-[var(--border-color)]/60 mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-[var(--text-muted)] font-mono truncate max-w-[130px]">
                            {vert.badge}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* DETAILED VIEW MODE: 3-column cards with conversionGoal and description */}
              {verticalViewMode === 'detailed' && filteredVerticals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredVerticals.map((vert) => {
                    const isSelected = wizardData.vertical === vert.id;
                    return (
                      <button
                        key={vert.id}
                        type="button"
                        onClick={() => handleSelectVertical(vert.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between group relative space-y-3 ${
                          isSelected
                            ? 'bg-[var(--bg-panel)] border-2 border-brand-primary shadow-sm ring-1 ring-brand-primary/40'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-brand-primary/50 hover:bg-[var(--bg-panel)]/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">{vert.avatar}</span>
                              <div>
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 uppercase">
                                  {vert.canonicalId || vert.id}
                                </span>
                                <h4 className="text-xs font-bold text-[var(--text-main)] font-mono leading-snug mt-1">
                                  {vert.name}
                                </h4>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed font-sans">
                            {vert.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[var(--border-color)]/60 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-neon font-bold flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {vert.badge}
                          </span>
                          <span className="text-[var(--text-muted)]">
                            {vert.defaultRules?.length || 3} reglas base
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
              </div>

              {/* Acelerador Opcional 1-Click con IA */}
              <div id="tour-wizard-step1-ai-accelerator" className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-brand-primary/30 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-neon" />
                    <span className="text-xs font-mono font-black uppercase text-[var(--text-main)]">
                      Acelerador 1-Click con IA (Opcional)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold uppercase self-start sm:self-auto">
                    DeepSeek R1 Semantic Parser
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] font-mono">
                  ¿Tienes un Brief, Brandbook, Catálogo o Documento Maestro (.pdf, .docx, .md)? Súbelo o pega el texto para pre-llenar los 6 pasos automáticamente.
                </p>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const droppedFile = e.dataTransfer?.files?.[0];
                    if (droppedFile) {
                      setMasterFile(droppedFile);
                      setBriefingAnalyzed(false);
                    }
                  }}
                  className="border-2 border-dashed border-[var(--border-color)] hover:border-brand-primary rounded-2xl p-5 text-center space-y-2.5 bg-[var(--bg-card-subtle)] transition-all"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-main)] font-mono">
                      Arrastra tu Master Briefing, Catálogo o Brandbook aquí
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                      Soporta PDF, Word (.docx), Markdown (.md) y archivos de texto plano
                    </p>
                  </div>
                  <input
                    type="file"
                    className="text-xs text-[var(--text-muted)] file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neon file:text-black hover:file:bg-[var(--neon-hover)] cursor-pointer"
                    accept=".pdf,.docx,.doc,.txt,.md"
                    onChange={(e) => {
                    setMasterFile(e.target.files?.[0] || null);
                    setBriefingAnalyzed(false);
                  }}
                  />
                  {masterFile && (
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold pt-1">
                      <FileCheck className="w-4 h-4" />
                      <span>Archivo listo para IA: {masterFile.name} ({(masterFile.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={() => {
                        setMasterFile(null);
                        setBriefingAnalyzed(false);
                      }}
                        className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 ml-2"
                        title="Quitar archivo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--text-muted)] block">
                    O pega el texto del brief / instrucciones aquí:
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Pega la información de ${currentVerticalObj.name}, precios, reglas inviolables, tono de voz o propuesta comercial...`}
                    value={masterDocText}
                    onChange={(e) => {
                    setMasterDocText(e.target.value);
                    setBriefingAnalyzed(false);
                  }}
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                      Auto-extracción semántica con DeepSeek
                    </span>
                    {isAnalyzingBriefing && (
                      <p className="text-xs text-neon font-mono font-bold flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-neon" />
                        <span>{briefingAnalysisStage}</span>
                      </p>
                    )}
                    {!isAnalyzingBriefing && briefingAnalyzed && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Los 4 pilares y datos fueron auto-configurados con éxito para {currentVerticalObj.name}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isAnalyzingBriefing}
                    onClick={handleAnalyzeMasterBriefing}
                    className="bg-neon text-black font-mono font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAnalyzingBriefing ? 'Analizando...' : 'Auto-Clasificar con IA'}</span>
                  </button>
                </div>
              </div>

              {/* Botón de continuación al Paso 2 */}
                            {/* Botón de continuación al Paso 2 con Bloqueo Estricto de Análisis */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]">
                {hasPendingAnalysis ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3.5 py-2.5 rounded-xl border border-amber-500/30 w-full sm:w-auto">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400" />
                    <span>Archivo cargado pendiente de procesar. Haz clic en <strong>Auto-Clasificar con IA</strong> para continuar.</span>
                  </div>
                ) : isAnalyzingBriefing ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-neon bg-neon/10 px-3.5 py-2.5 rounded-xl border border-neon/30 w-full sm:w-auto">
                    <RefreshCw className="w-4 h-4 shrink-0 text-neon animate-spin" />
                    <span>{briefingAnalysisStage || 'Analizando documento maestro con DeepSeek IA...'}</span>
                  </div>
                ) : briefingAnalyzed ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-2.5 rounded-xl border border-emerald-500/30 w-full sm:w-auto">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                    <span>Extracción con IA completada. Datos listos para revisar en el Paso 2.</span>
                  </div>
                ) : (
                  <div className="text-xs text-[var(--text-muted)] font-mono">
                    Paso 1 de 6: Giro Comercial & Acelerador IA
                  </div>
                )}

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {hasPendingAnalysis ? (
                    <button
                      id="tour-wizard-step1-next"
                      type="button"
                      disabled={isAnalyzingBriefing}
                      onClick={handleAnalyzeMasterBriefing}
                      className="w-full sm:w-auto bg-neon text-black font-mono font-black text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--neon-glow)] active:scale-95 animate-pulse"
                      title="Procesa el documento cargado para pre-llenar los 6 pasos y continuar"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Auto-Clasificar con IA para Continuar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id="tour-wizard-step1-next"
                      type="button"
                      disabled={isAnalyzingBriefing}
                      onClick={() => {
                        const check = canProceedFromStep(1);
                        if (!check.valid) {
                          triggerModal(
                            check.isPendingAnalysis ? 'Análisis con IA Pendiente' : 'Selecciona un Giro Comercial',
                            check.reason,
                            check.isPendingAnalysis ? () => handleAnalyzeMasterBriefing() : () => setIsGiroSelectorOpen(true),
                            check.isPendingAnalysis ? 'Auto-Clasificar con IA Ahora' : 'Seleccionar Giro'
                          );
                          return;
                        }
                        setCurrentStep(2);
                      }}
                      className="w-full sm:w-auto bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center justify-center gap-2 shadow-neon active:scale-95 disabled:opacity-50"
                    >
                      <span>Siguiente: Entidad del Negocio & Web</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

              {/* PASO 1: Entidad del Negocio & Presencia Web                   */}
              {/* ============================================================= */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                          Paso 2 de 6
                        </span>
                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-neon" />
                          <span>Entidad del Negocio & Presencia Web</span>
                        </h3>
                      </div>

                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Giro seleccionado: <strong className="text-neon">{currentVerticalObj.name}</strong>
                    </p>
                  </div>

                  <div id="tour-wizard-step2-identity" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div>
                      <label className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                        <span>Nombre Comercial del Negocio</span>
                        <span className="text-[10px] text-neon uppercase font-bold">[Obligatorio]</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ej. Clínica Dental Sonrisas / Urban Sneaks"
                        value={wizardData.businessName}
                        onChange={(e) => setWizardData({ ...wizardData, businessName: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                        <span>Razón Social & RFC (Tax ID)</span>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase">[Opcional]</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Sonrisas Dentales S.A. de C.V. / SDS120304XYZ"
                        value={wizardData.legalNameTaxId}
                        onChange={(e) => setWizardData({ ...wizardData, legalNameTaxId: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                        <span>Contacto Principal / Administrador</span>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase">[Recomendado]</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Dr. Alejandro Silva"
                        value={wizardData.primaryContact}
                        onChange={(e) => setWizardData({ ...wizardData, primaryContact: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                        <span>Teléfono WhatsApp / Escalación Humana (HITL)</span>
                        <span className="text-[10px] text-neon uppercase font-bold">[Obligatorio]</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="ej. +52 55 9876 5432"
                        value={wizardData.ownerPhone}
                        onChange={(e) => setWizardData({ ...wizardData, ownerPhone: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* ESTRATEGIA DE CONVERSIÓN & PRESENCIA WEB */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                      <span className="text-xs font-mono font-bold uppercase text-[var(--text-main)] flex items-center gap-2">
                        <Zap className="w-4 h-4 text-neon" />
                        Estrategia Digital: Micro-Landing de Conversión & Sitio Web
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold uppercase">
                        ✦ Micro-Landing Incluida Siempre
                      </span>
                    </div>

                    {/* Micro-Landing Universal Card */}
                    <div id="tour-wizard-step2-microlanding" className="p-4 rounded-xl bg-[var(--bg-panel)] border border-neon/30 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-neon/15 border border-neon/30 flex items-center justify-center text-neon shrink-0">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-mono font-bold text-[var(--text-main)]">
                                Micro-Landing Universal `/m/[slug]`
                              </h4>
                              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                ● Embudo de Captación
                              </span>
                            </div>
                            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                              URL Pública: app.vectorinside.com/m/
                              <span className="text-neon font-bold">
                                {(wizardData.microLandingCustomSlug || wizardData.businessName || 'tu-negocio').toLowerCase().replace(/[^a-z0-9]/g, '-') || 'demo'}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold uppercase border border-emerald-500/30">
                          ● Activa por Defecto
                        </span>
                      </div>

                      {/* Aviso Informativo & Cortesía 3 Meses */}
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                              ✦ Micro-Landing Incluida
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                              Activo
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                            Tu Micro-Landing se aprovisiona automáticamente con este registro para recibir tráfico de pauta y canalizarlo directamente a WhatsApp.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const slug = (wizardData.microLandingCustomSlug || wizardData.businessName || 'tu-negocio').toLowerCase().replace(/[^a-z0-9]/g, '-') || 'demo';
                            navigator.clipboard?.writeText(`https://app.vectorinside.com/m/${slug}`);
                            alert(`Enlace copiado: https://app.vectorinside.com/m/${slug}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-[10px] text-[var(--text-main)] hover:border-neon hover:text-neon transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
                        >
                          <Copy className="w-3 h-3" />
                          Copiar Enlace
                        </button>
                      </div>

                      {wizardData.microLandingBillingPlan !== 'disabled' && (
                        <div className="pt-2 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-3 text-xs font-mono">
                          <label className="text-[10px] text-[var(--text-muted)] shrink-0">
                            Slug Personalizado (Opcional):
                          </label>
                          <div className="flex items-center w-full">
                            <span className="px-2.5 py-1.5 rounded-l-lg bg-[var(--bg-card)] border border-r-0 border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">
                              app.vectorinside.com/m/
                            </span>
                            <input
                              type="text"
                              placeholder="ej. sonrisas-polanco"
                              value={wizardData.microLandingCustomSlug}
                              onChange={(e) => setWizardData({ ...wizardData, microLandingCustomSlug: e.target.value })}
                              className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-r-lg p-1.5 text-xs text-[var(--text-main)] focus:border-neon outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selector de Sitio Web Oficial */}
                    <div id="tour-wizard-step2-website-toggle" className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label className="text-xs font-mono font-bold text-[var(--text-main)]">
                          ¿El Negocio Cuenta con Sitio Web Oficial Corporativo?
                        </label>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {wizardData.hasWebsite
                            ? 'Conectaremos tu web para SEO y mantendremos la Micro-Landing para Ads'
                            : 'La Micro-Landing será su presencia web principal'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setWizardData({ ...wizardData, hasWebsite: true })}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            wizardData.hasWebsite
                              ? 'bg-neon/10 border-neon text-[var(--text-main)] shadow-neon-sm'
                              : 'bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-brand-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                              <span>🌐 SÍ, Tengo Sitio Web Oficial</span>
                            </span>
                            {wizardData.hasWebsite && <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">
                            Conecta tu URL oficial para SEO/GA4. Tu Micro-Landing se mantiene activa como embudo de pauta publicitaria.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setWizardData({ ...wizardData, hasWebsite: false })}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            !wizardData.hasWebsite
                              ? 'bg-neon/10 border-neon text-[var(--text-main)] shadow-neon-sm'
                              : 'bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-brand-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                              <span>💬 NO, Operación Directa a WhatsApp</span>
                            </span>
                            {!wizardData.hasWebsite && <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">
                            La Micro-Landing autogenerada fungirá como tu página web principal con Meta CAPI y catálogo directo.
                          </p>
                        </button>
                      </div>

                      {wizardData.hasWebsite && (
                        <div className="pt-1 animate-fade-in">
                          <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1">
                            URL del Sitio Web Oficial
                          </label>
                          <input
                            type="url"
                            placeholder="https://minegocio.com"
                            value={wizardData.websiteUrl}
                            onChange={(e) => setWizardData({ ...wizardData, websiteUrl: e.target.value })}
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] focus:border-neon outline-none font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Presencia Digital & Redes Sociales Oficiales */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-neon" />
                        <div>
                          <h4 className="font-heading font-black text-xs text-[var(--text-main)] uppercase tracking-wide">
                            Redes Sociales & Presencia Digital Oficial (Opcional)
                          </h4>
                          <p className="text-[10px] text-[var(--text-muted)] font-mono">
                            La IA usará estos enlaces para responder a prospectos y se mostrarán en la Micro-Landing.
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-neon font-bold bg-neon/10 px-2 py-0.5 rounded border border-neon/20">
                        Community Manager IA (HITL)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                      {/* YouTube */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold">
                          <Youtube className="w-3.5 h-3.5 text-rose-500" />
                          <span>YouTube (@canal o URL)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://youtube.com/@minegocio"
                          value={wizardData.socialLinks?.youtube || ''}
                          onChange={(e) =>
                            setWizardData({
                              ...wizardData,
                              socialLinks: { ...(wizardData.socialLinks || {}), youtube: e.target.value },
                            })
                          }
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-xs text-[var(--text-main)] focus:border-neon outline-none"
                        />
                      </div>

                      {/* TikTok */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold">
                          <Video className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                          <span>TikTok (@cuenta o URL)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://tiktok.com/@minegocio"
                          value={wizardData.socialLinks?.tiktok || ''}
                          onChange={(e) =>
                            setWizardData({
                              ...wizardData,
                              socialLinks: { ...(wizardData.socialLinks || {}), tiktok: e.target.value },
                            })
                          }
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-xs text-[var(--text-main)] focus:border-neon outline-none"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold">
                          <Linkedin className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                          <span>LinkedIn (/company/...)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/company/minegocio"
                          value={wizardData.socialLinks?.linkedin || ''}
                          onChange={(e) =>
                            setWizardData({
                              ...wizardData,
                              socialLinks: { ...(wizardData.socialLinks || {}), linkedin: e.target.value },
                            })
                          }
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-xs text-[var(--text-main)] focus:border-neon outline-none"
                        />
                      </div>

                      {/* Instagram */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold">
                          <Instagram className="w-3.5 h-3.5 text-pink-500" />
                          <span>Instagram (@perfil o URL)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/minegocio"
                          value={wizardData.socialLinks?.instagram || ''}
                          onChange={(e) =>
                            setWizardData({
                              ...wizardData,
                              socialLinks: { ...(wizardData.socialLinks || {}), instagram: e.target.value },
                            })
                          }
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-xs text-[var(--text-main)] focus:border-neon outline-none"
                        />
                      </div>

                      {/* Facebook */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold">
                          <Facebook className="w-3.5 h-3.5 text-blue-600" />
                          <span>Facebook (Página Oficial)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://facebook.com/minegocio"
                          value={wizardData.socialLinks?.facebook || ''}
                          onChange={(e) =>
                            setWizardData({
                              ...wizardData,
                              socialLinks: { ...(wizardData.socialLinks || {}), facebook: e.target.value },
                            })
                          }
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-xs text-[var(--text-main)] focus:border-neon outline-none"
                        />
                      </div>

                      {/* X (Twitter) */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold">
                          <Share2 className="w-3.5 h-3.5 text-neon" />
                          <span>X / Twitter (@handle)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://x.com/minegocio"
                          value={wizardData.socialLinks?.x || ''}
                          onChange={(e) =>
                            setWizardData({
                              ...wizardData,
                              socialLinks: { ...(wizardData.socialLinks || {}), x: e.target.value },
                            })
                          }
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-xs text-[var(--text-main)] focus:border-neon outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
                    <button
                      id="tour-wizard-step2-next"
                      type="button"
                      onClick={() => {
                        const check = canProceedFromStep(2);
                        if (!check.valid) {
                          triggerModal('Datos Obligatorios Requeridos', check.reason, null, 'Completar Datos');
                          return;
                        }
                        setCurrentStep(3);
                      }}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Marketing & Tracking</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* PASO 2: Marketing, Tracking & Modelo de Cobro                 */}
              {/* ============================================================= */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                          Paso 3 de 6
                        </span>
                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                          <Activity className="w-5 h-5 text-neon" />
                          <span>Marketing, Tracking & Modelo Comercial</span>
                        </h3>
                      </div>

                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Configuración de analítica, atribución de anuncios y costo por lead calificado.
                    </p>
                  </div>

                  {/* Telemetría y Píxeles */}
                  <div id="tour-wizard-step3-pixels" className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                      <span className="text-xs font-mono font-bold uppercase text-[var(--text-main)] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-neon" />
                        Telemetría y Píxeles de Conversión
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon font-bold uppercase">
                        Medición de Anuncios
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-[var(--text-muted)] font-bold block">
                            Google Analytics 4 Measurement ID
                          </label>
                          <span className="text-[9px] text-[var(--text-muted)] font-bold">$0 USD</span>
                        </div>
                        <input
                          type="text"
                          placeholder="ej. G-ABC123XYZ"
                          value={wizardData.ga4MeasurementId || ''}
                          onChange={(e) => setWizardData({ ...wizardData, ga4MeasurementId: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                        />
                        <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                          Mide visitas a tu landing y sitio web sin costo en Google Analytics 4.
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-[var(--text-muted)] font-bold block">
                            Meta Pixel ID (Dataset ID)
                          </label>
                          <span className="text-[9px] text-neon font-bold">Recomendado</span>
                        </div>
                        <input
                          type="text"
                          placeholder="ej. 123456789012345"
                          value={wizardData.metaPixelId || ''}
                          onChange={(e) => setWizardData({ ...wizardData, metaPixelId: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                        />
                        <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                          Rastrea visitas y eventos de conversión desde tus campañas en Meta Ads.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Modelo de Cobro por Lead */}
                  <div id="tour-wizard-step3-billing" className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                      <span className="text-xs font-mono font-bold uppercase text-[var(--text-main)] flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        Esquema de Cobro & Presupuesto Publicitario
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                        Pay-Per-Qualified-Lead
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-bold text-[var(--text-main)]">
                            Costo por Lead Calificado (MXN)
                          </label>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neon/15 text-neon font-black">
                            Mínimo $350 MXN · 4/4 AND
                          </span>
                        </div>

                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-neon font-black text-sm pointer-events-none">
                            $
                          </span>
                          <input
                            type="number"
                            min={350}
                            step={50}
                            placeholder="350"
                            value={wizardData.costPerQualifiedLead ?? 350}
                            onChange={(e) => {
                              const rawVal = e.target.value;
                              setWizardData({
                                ...wizardData,
                                costPerQualifiedLead: rawVal === '' ? '' : Number(rawVal),
                              });
                            }}
                            onBlur={() => {
                              const numVal = Number(wizardData.costPerQualifiedLead);
                              if (!Number.isFinite(numVal) || numVal < 350) {
                                setWizardData((prev) => ({ ...prev, costPerQualifiedLead: 350 }));
                              }
                            }}
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] focus:border-neon text-xs rounded-xl pl-8 pr-36 py-3 text-[var(--text-main)] font-bold outline-none font-mono transition-colors"
                          />
                          <span className="absolute right-3 text-[10px] text-[var(--text-muted)] font-mono pointer-events-none">
                            MXN / Lead Calificado
                          </span>
                        </div>

                        {/* Botones de Ajuste Rápido (>= $350 MXN) */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] text-[var(--text-muted)] mr-1">Tarifas sugeridas:</span>
                          {[350, 450, 600, 800, 1200].map((presetPrice) => {
                            const isSelected = Number(wizardData.costPerQualifiedLead || 350) === presetPrice;
                            return (
                              <button
                                key={presetPrice}
                                type="button"
                                onClick={() =>
                                  setWizardData({ ...wizardData, costPerQualifiedLead: presetPrice })
                                }
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                                  isSelected
                                    ? 'bg-neon text-black border-neon shadow-neon-sm'
                                    : 'bg-[var(--bg-panel)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-neon/50 hover:text-[var(--text-main)]'
                                }`}
                              >
                                ${presetPrice}
                              </button>
                            );
                          })}
                        </div>

                        {wizardData.costPerQualifiedLead !== '' && Number(wizardData.costPerQualifiedLead) < 350 && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">
                            ⚠️ El costo por lead calificado debe ser igual o mayor a $350.00 MXN (se ajustará a $350 MXN).
                          </span>
                        )}
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Solo se factura al negocio cuando el prospecto cumple los 4/4 criterios AND y agenda cita.
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-bold text-[var(--text-main)]">
                            Presupuesto Publicitario Mensual Estimado (Meta Ads)
                          </label>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 font-bold">
                            Pauta Directa Meta
                          </span>
                        </div>

                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-emerald-700 dark:text-emerald-400 font-black text-sm pointer-events-none">
                            $
                          </span>
                          <input
                            type="number"
                            min={0}
                            step={500}
                            placeholder="6000"
                            value={wizardData.monthlyAdBudget || ''}
                            onChange={(e) =>
                              setWizardData({
                                ...wizardData,
                                monthlyAdBudget: e.target.value === '' ? '' : Number(e.target.value),
                              })
                            }
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] focus:border-neon text-xs rounded-xl pl-8 pr-24 py-3 text-[var(--text-main)] font-bold outline-none font-mono transition-colors"
                          />
                          <span className="absolute right-3 text-[10px] text-[var(--text-muted)] font-mono pointer-events-none">
                            MXN / Mes
                          </span>
                        </div>

                        {/* Presupuestos rápidos sugeridos */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] text-[var(--text-muted)] mr-1">Escalas Meta:</span>
                          {[3000, 6000, 15000, 30000].map((presetBudget) => {
                            const isSelected = Number(wizardData.monthlyAdBudget || 0) === presetBudget;
                            return (
                              <button
                                key={presetBudget}
                                type="button"
                                onClick={() =>
                                  setWizardData({ ...wizardData, monthlyAdBudget: presetBudget })
                                }
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                                  isSelected
                                    ? 'bg-emerald-500 text-black border-emerald-400'
                                    : 'bg-[var(--bg-panel)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-emerald-400/50 hover:text-[var(--text-main)]'
                                }`}
                              >
                                ${presetBudget.toLocaleString('es-MX')}
                              </button>
                            );
                          })}
                        </div>

                        {Number(wizardData.monthlyAdBudget) > 0 ? (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                            <span className="text-[var(--text-muted)]">
                              Pauta diaria:{' '}
                              <strong className="text-emerald-700 dark:text-emerald-400">
                                ${Math.round(Number(wizardData.monthlyAdBudget) / 30).toLocaleString('es-MX')} MXN/día
                              </strong>
                            </span>
                            <span className="text-[var(--text-muted)]">
                              Tráfico est. CAPI:{' '}
                              <strong className="text-neon">
                                ~{Math.max(1, Math.round(Number(wizardData.monthlyAdBudget) / 45))}–
                                {Math.max(2, Math.round(Number(wizardData.monthlyAdBudget) / 25))} chats/mes
                              </strong>
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[var(--text-muted)] block">
                            Inversión mensual en anuncios de Facebook/Instagram para alimentar el embudo y calcular el ROAS/MER real.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs px-4 py-2.5 rounded-xl text-[var(--text-main)] font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      id="tour-wizard-step3-next"
                      type="button"
                      onClick={() => {
                        const validLeadPrice = Math.max(350, Number(wizardData.costPerQualifiedLead) || 350);
                        setWizardData((prev) => ({
                          ...prev,
                          costPerQualifiedLead: validLeadPrice,
                        }));
                        setCurrentStep(4);
                      }}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Agenda & Horarios</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* PASO 3: Agenda & Horarios (SECCIÓN DEDICADA 100% LIMPIA)       */}
              {/* ============================================================= */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                          Paso 4 de 6
                        </span>
                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                          <Clock className="w-5 h-5 text-neon" />
                          <span>Agenda & Disponibilidad Comercial</span>
                        </h3>
                      </div>

                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Define los turnos de atención y la sincronización con Google Calendar. La atención del bot opera <strong className="text-neon">24/7/365</strong>.
                    </p>
                  </div>

                  {/* Sincronización Google Calendar */}
                  <div id="tour-wizard-step4-gcal" className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
                    <label className="block text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                      Google Calendar ID (Master Agenda para Citas)
                    </label>
                    <input
                      type="text"
                      placeholder="ej. c_tenant@group.calendar.google.com"
                      value={wizardData.googleCalendarId}
                      onChange={(e) => setWizardData({ ...wizardData, googleCalendarId: e.target.value })}
                      className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                    />
                    <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                      Introduce el ID del calendario de Google en el que se agendarán automáticamente las citas verificadas.
                    </span>
                  </div>

                  {/* Agenda Inteligente Auto-Calibrada según Giro Comercial */}
                  <div id="tour-wizard-step4-schedule" className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-neon/30 space-y-4">
                    {/* Tarjeta Ejecutiva Resumida */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neon/15 border border-neon/30 flex items-center justify-center text-neon shrink-0 mt-0.5">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs font-black font-mono text-[var(--text-main)] uppercase tracking-wide">
                              Agenda & Disponibilidad Comercial
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                              ● Auto-calibrado para {currentVerticalObj.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                              ⚡ Bot Activo 24/7 (Ventas & Leads Non-Stop)
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1 leading-relaxed">
                            <span className="text-[var(--text-main)] font-bold">Atención IA:</span> Opera 24/7/365 en WhatsApp y Web. Este horario solo restringe las citas presenciales de Google Calendar y la derivación a personal humano.
                          </p>
                          {/* Resumen dinámico libre de todos los turnos activos */}
                          <div className="text-[11px] font-mono mt-1 text-[var(--text-muted)] space-y-0.5">
                            <p>
                              <strong className="text-[var(--text-main)]">
                                {(wizardData.activeDays || []).length} días activos
                              </strong>{' '}
                              ({(wizardData.activeDays || []).map((d) => d.slice(0, 3).toUpperCase()).join(', ') || 'L-S'}) ·{' '}
                              <strong className="text-neon">
                                {Array.isArray(wizardData.shifts) && wizardData.shifts.length > 0
                                  ? wizardData.shifts.map((s) => `${s.start} a ${s.end}`).join(' · ')
                                  : 'Sin franjas de citas fijas (Agenda abierta / 24/7)'}
                              </strong>{' '}
                              · Citas de <span className="text-emerald-700 dark:text-emerald-400 font-bold">{wizardData.appointmentDuration || 30} min</span> · Capacidad: <span className="text-cyan-700 dark:text-cyan-400 font-bold">{wizardData.concurrencyLimit || 1}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Editor Libre y Sin Restricciones (Siempre Visible) */}
                    <div className="pt-4 border-t border-[var(--border-color)] space-y-5 text-xs font-mono">
                      {/* 1. Selector Libre de Días Hábiles */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-bold text-[var(--text-main)]">
                            1. Días Hábiles de Atención
                          </label>
                          <div className="flex items-center gap-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() =>
                                setWizardData({
                                  ...wizardData,
                                  activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
                                })
                              }
                              className="px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-neon"
                            >
                              L-V
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setWizardData({
                                  ...wizardData,
                                  activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
                                })
                              }
                              className="px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-neon"
                            >
                              L-S
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setWizardData({
                                  ...wizardData,
                                  activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
                                })
                              }
                              className="px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-neon"
                            >
                              Todos
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                          {[
                            { id: 'lunes', short: 'L', full: 'Lunes' },
                            { id: 'martes', short: 'M', full: 'Martes' },
                            { id: 'miercoles', short: 'X', full: 'Miércoles' },
                            { id: 'jueves', short: 'J', full: 'Jueves' },
                            { id: 'viernes', short: 'V', full: 'Viernes' },
                            { id: 'sabado', short: 'S', full: 'Sábado' },
                            { id: 'domingo', short: 'D', full: 'Domingo' },
                          ].map((day) => {
                            const currentDays = wizardData.activeDays || [
                              'lunes',
                              'martes',
                              'miercoles',
                              'jueves',
                              'viernes',
                              'sabado',
                            ];
                            const isActive = currentDays.includes(day.id);
                            return (
                              <button
                                key={day.id}
                                type="button"
                                onClick={() => {
                                  const nextDays = isActive
                                    ? currentDays.filter((d) => d !== day.id)
                                    : [...currentDays, day.id];
                                  setWizardData({
                                    ...wizardData,
                                    activeDays: nextDays.length > 0 ? nextDays : [day.id],
                                  });
                                }}
                                className={`py-1.5 rounded-lg border text-center font-bold transition-all text-xs ${
                                  isActive
                                    ? 'bg-neon/15 border-neon text-neon'
                                    : 'bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-neon/40'
                                }`}
                                title={day.full}
                              >
                                {day.short}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Turnos y Franjas Horarias Libres */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-[var(--text-main)] flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-neon" />
                            2. Turnos y Franjas Horarias (Agrega o Quita Libremente)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentShifts = Array.isArray(wizardData.shifts) ? wizardData.shifts : [];
                              const nextNum = currentShifts.length + 1;
                              const newShift = {
                                id: String(Date.now()),
                                name: nextNum === 1 ? 'Turno 1 / Corrido' : `Turno ${nextNum}`,
                                start: nextNum === 1 ? '09:00' : '15:00',
                                end: nextNum === 1 ? '18:00' : '20:00',
                              };
                              const updated = [...currentShifts, newShift];
                              setWizardData({
                                ...wizardData,
                                shifts: updated,
                                shiftMorningStart: updated[0]?.start || '',
                                shiftMorningEnd: updated[0]?.end || '',
                                shiftAfternoonStart: updated[1]?.start || '',
                                shiftAfternoonEnd: updated[1]?.end || '',
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-neon/10 hover:bg-neon/20 border border-neon/30 text-[10px] font-bold text-neon transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            + Agregar Turno
                          </button>
                        </div>

                        {(!Array.isArray(wizardData.shifts) || wizardData.shifts.length === 0) ? (
                          <div className="p-4 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-panel)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left animate-fade-in">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center text-neon shrink-0">
                                <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-[11px] font-bold text-[var(--text-main)] block">
                                  Sin franjas de turnos configuradas
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)] block">
                                  El bot responderá y resolverá dudas 24/7 en WhatsApp y Web. Pulsa "+ Agregar Turno" para habilitar reservas en Google Calendar.
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newShift = {
                                  id: String(Date.now()),
                                  name: 'Turno 1 / Corrido',
                                  start: '09:00',
                                  end: '18:00',
                                };
                                setWizardData({
                                  ...wizardData,
                                  shifts: [newShift],
                                  shiftMorningStart: '09:00',
                                  shiftMorningEnd: '18:00',
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-neon text-black font-bold text-[10px] uppercase font-mono hover:bg-[var(--neon-hover)] transition-all shrink-0 flex items-center gap-1 shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Agregar Primer Turno</span>
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {wizardData.shifts.map((shift, idx) => (
                              <div
                                key={shift.id || idx}
                                className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 relative group animate-fade-in"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    value={shift.name}
                                    onChange={(e) => {
                                      const updated = wizardData.shifts.map((s, i) =>
                                        i === idx ? { ...s, name: e.target.value } : s
                                      );
                                      setWizardData({
                                        ...wizardData,
                                        shifts: updated,
                                      });
                                    }}
                                    placeholder={`Turno ${idx + 1}`}
                                    className="bg-transparent border-b border-transparent hover:border-[var(--border-color)] focus:border-neon text-[11px] font-bold text-amber-700 dark:text-amber-400 outline-none w-full"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = wizardData.shifts.filter((_, i) => i !== idx);
                                      setWizardData({
                                        ...wizardData,
                                        shifts: updated,
                                        shiftMorningStart: updated[0]?.start || '',
                                        shiftMorningEnd: updated[0]?.end || '',
                                        shiftAfternoonStart: updated[1]?.start || '',
                                        shiftAfternoonEnd: updated[1]?.end || '',
                                      });
                                    }}
                                    className="p-1 rounded text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    title="Eliminar este turno"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[9px] text-[var(--text-muted)] block mb-0.5">Inicio</span>
                                    <input
                                      type="time"
                                      value={shift.start || '09:00'}
                                      onClick={(e) => {
                                        try {
                                          if (typeof e.target.showPicker === 'function') {
                                            e.target.showPicker();
                                          }
                                        } catch (err) {}
                                      }}
                                      onChange={(e) => {
                                        const updated = wizardData.shifts.map((s, i) =>
                                          i === idx ? { ...s, start: e.target.value } : s
                                        );
                                        setWizardData({
                                          ...wizardData,
                                          shifts: updated,
                                          shiftMorningStart: updated[0]?.start || '',
                                          shiftMorningEnd: updated[0]?.end || '',
                                          shiftAfternoonStart: updated[1]?.start || '',
                                          shiftAfternoonEnd: updated[1]?.end || '',
                                        });
                                      }}
                                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded p-2 text-center text-xs text-[var(--text-main)] outline-none focus:border-neon font-mono cursor-pointer hover:border-neon/50 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                  </div>

                                  <div>
                                    <span className="text-[9px] text-[var(--text-muted)] block mb-0.5">Fin</span>
                                    <input
                                      type="time"
                                      value={shift.end || '18:00'}
                                      onClick={(e) => {
                                        try {
                                          if (typeof e.target.showPicker === 'function') {
                                            e.target.showPicker();
                                          }
                                        } catch (err) {}
                                      }}
                                      onChange={(e) => {
                                        const updated = wizardData.shifts.map((s, i) =>
                                          i === idx ? { ...s, end: e.target.value } : s
                                        );
                                        setWizardData({
                                          ...wizardData,
                                          shifts: updated,
                                          shiftMorningStart: updated[0]?.start || '',
                                          shiftMorningEnd: updated[0]?.end || '',
                                          shiftAfternoonStart: updated[1]?.start || '',
                                          shiftAfternoonEnd: updated[1]?.end || '',
                                        });
                                      }}
                                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded p-2 text-center text-xs text-[var(--text-main)] outline-none focus:border-neon font-mono cursor-pointer hover:border-neon/50 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 3. Duración de Cada Cita / Slot Libre, Margen de Descanso & Capacidad */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">
                              Duración de Cita / Slot
                            </label>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                              {wizardData.appointmentDuration || 60} min
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-full flex items-center relative">
                              <input
                                type="number"
                                min={1}
                                max={480}
                                value={wizardData.appointmentDuration || 60}
                                onChange={(e) =>
                                  setWizardData({
                                    ...wizardData,
                                    appointmentDuration: Math.max(1, Number(e.target.value)),
                                    userEditedDuration: true,
                                  })
                                }
                                placeholder="60"
                                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2.5 text-xs text-center text-[var(--text-main)] font-mono outline-none focus:border-neon pr-12"
                              />
                              <span className="text-[11px] text-[var(--text-muted)] font-mono font-bold absolute right-3 pointer-events-none">
                                min
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] text-[var(--text-muted)] block">
                            Minutos exactos de cada espacio en agenda comercial.
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">
                              Margen de Descanso (Buffer)
                            </label>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold font-mono">
                              {wizardData.bufferBetweenAppointmentsMin ?? 0} min
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-full flex items-center relative">
                              <input
                                type="number"
                                min={0}
                                max={120}
                                step={5}
                                value={wizardData.bufferBetweenAppointmentsMin ?? 0}
                                onChange={(e) =>
                                  setWizardData({
                                    ...wizardData,
                                    bufferBetweenAppointmentsMin: Math.max(0, Number(e.target.value) || 0),
                                  })
                                }
                                placeholder="0"
                                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2.5 text-xs text-center text-[var(--text-main)] font-mono outline-none focus:border-neon pr-12"
                              />
                              <span className="text-[11px] text-[var(--text-muted)] font-mono font-bold absolute right-3 pointer-events-none">
                                min
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] text-[var(--text-muted)] block">
                            Minutos libres entre citas (0 = citas continuas sin buffer).
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">
                              Capacidad Simultánea
                            </label>
                            <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold font-mono">
                              Max {wizardData.concurrencyLimit || 1}
                            </span>
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={500}
                            value={wizardData.concurrencyLimit || 1}
                            onChange={(e) => setWizardData({ ...wizardData, concurrencyLimit: Math.max(1, Number(e.target.value)) })}
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2.5 text-xs text-center text-[var(--text-main)] font-mono outline-none focus:border-neon"
                          />
                          <span className="text-[9px] text-[var(--text-muted)] block">
                            1 para llamadas 1-on-1, o más para salas/mesas paralelas.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs px-4 py-2.5 rounded-xl text-[var(--text-main)] font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      id="tour-wizard-step4-next"
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Configurar Pilares RAG</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* PASO 4: Pilares RAG (Antes Paso 2)                            */}
              {/* ============================================================= */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                            Paso 5 de 6
                          </span>
                          <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                            <Database className="w-5 h-5 text-neon" />
                            <span>Configuración de los 4 Pilares RAG & Oferta</span>
                          </h3>
                        </div>

                      <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                        <strong className="text-cyan-500 dark:text-cyan-400">Pilar 2 (Brandbook) es obligatorio</strong>. Los demás son opcionales y adaptados a {currentVerticalObj.name}.
                      </p>
                    </div>
                  </div>

                  {/* Banner de Diagnóstico de Deficiencias & Sugerencias IA del Plan Maestro */}
                  <div id="tour-wizard-step5-audit" className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-neon/30 space-y-3.5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-mono font-black uppercase text-[var(--text-main)] flex items-center gap-2">
                            <span>Auditoría Semántica de tu Plan Maestro (IA)</span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                              DeepSeek R1
                            </span>
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">
                            {masterFile
                              ? `Analizando archivo maestro: "${masterFile.name}" (${(masterFile.size / 1024).toFixed(1)} KB)`
                              : masterDocText
                              ? 'Analizando directrices semánticas del brief ingresado'
                              : 'Detección automática de huecos o directrices faltantes en tus 4 Pilares RAG'}
                          </p>
                        </div>
                      </div>

                      {/* Health Score Badge */}
                      <div className="flex items-center gap-2 self-start sm:self-auto bg-[var(--bg-panel)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
                        <div className="text-right">
                          <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Salud del Plan</div>
                          <div className="text-xs font-mono font-black text-neon">{healthScore}% / 100%</div>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-neon/50 flex items-center justify-center font-mono font-black text-[10px] text-neon bg-neon/10">
                          {healthScore}%
                        </div>
                      </div>
                    </div>

                    {/* Deficiencias Detectadas */}
                    {detectedDeficiencies.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {detectedDeficiencies.length} punto{detectedDeficiencies.length > 1 ? 's' : ''} de mejora detectado{detectedDeficiencies.length > 1 ? 's' : ''} en tu Plan Maestro:
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">Resuelve con 1-Click asistido</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {detectedDeficiencies.map((def) => (
                            <div
                              key={def.id}
                              className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono transition-all hover:border-amber-400/40"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                      def.severity === 'critical'
                                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                        : def.severity === 'recommended'
                                        ? 'bg-neon/15 text-neon border border-neon/30'
                                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                    }`}
                                  >
                                    {def.severityLabel} · {def.pilar}
                                  </span>
                                  <span className="font-bold text-[var(--text-main)] text-[11px]">{def.title}</span>
                                </div>
                                <p className="text-[11px] text-[var(--text-muted)] font-sans">{def.description}</p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleResolveDeficiency(def)}
                                className="bg-neon/10 hover:bg-neon text-neon hover:text-black border border-neon/40 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-sm active:scale-95"
                              >
                                <Zap className="w-3 h-3" />
                                <span>{def.actionLabel}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs font-mono text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          ¡Plan Maestro Integral! Todos los pilares y reglas comerciales cuentan con directrices calibradas para <strong>{currentVerticalObj.name}</strong>.
                        </span>
                      </div>
                    )}
                  </div>

                  <div id="tour-wizard-step5-pilar2-offer" className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Pilar 2: Brandbook (Obligatorio) */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-cyan-400/80 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-500 dark:text-cyan-400 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          PILAR 2: Brandbook & Tono de Voz
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500 text-black font-black uppercase">
                          ★ OBLIGATORIO
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {currentPillarsAdaptive.pilar2.label} (ADR-002 §2.4).
                      </p>

                      {/* Opción A: Escribir o Pegar */}
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block font-mono mb-1 font-bold">
                          1. Escribir / Pegar Tono de Voz del Agente:
                        </label>
                        <input
                          type="text"
                          placeholder={currentPillarsAdaptive.pilar2.placeholder}
                          value={wizardData.brandTone || ''}
                          onChange={(e) => setWizardData({ ...wizardData, brandTone: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono focus:border-cyan-400 outline-none"
                        />
                      </div>

                      {/* Opción B: Subir Documento ADR-002 (.pdf, .docx, .md, .txt) */}
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                            <Upload className="w-3 h-3 text-cyan-700 dark:text-cyan-400" />
                            <span>2. O {currentPillarsAdaptive.pilar2.docLabel}:</span>
                          </label>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">ADR-002</span>
                        </div>

                        {!wizardData.brandbookDoc ? (
                          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-cyan-400/40 hover:border-cyan-400 bg-[var(--bg-panel)] cursor-pointer transition-all group">
                            <FileText className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                              Adjuntar archivo <strong className="text-cyan-700 dark:text-cyan-400 font-bold">.pdf, .docx, .md, .txt</strong>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.md,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setWizardData({
                                    ...wizardData,
                                    brandbookDoc: { name: file.name, size: file.size, type: file.type }
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-cyan-400/60 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400 shrink-0" />
                              <span className="text-[var(--text-main)] font-bold truncate text-[11px]">
                                {typeof wizardData.brandbookDoc === 'string' ? wizardData.brandbookDoc : wizardData.brandbookDoc?.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                {wizardData.brandbookDoc?.size ? `(${(wizardData.brandbookDoc.size / 1024).toFixed(1)} KB)` : '(Auto-extraído)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWizardData({ ...wizardData, brandbookDoc: null })}
                              className="p-1 text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2"
                              title="Quitar archivo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Propuesta Comercial & Gancho */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-neon/70 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-neon flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          PROPUESTA COMERCIAL & OFERTA
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-neon text-black font-black uppercase">
                          RECOMENDADO
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Gancho irresistible o lead magnet para captación en pauta y micro-landing.
                      </p>

                      {/* Opción A: Escribir o Pegar */}
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1 font-bold">
                          1. Escribir / Pegar Gancho del Mes:
                        </label>
                        <input
                          type="text"
                          placeholder={currentPillarsAdaptive.offer.placeholder}
                          value={wizardData.offerHook || ''}
                          onChange={(e) => setWizardData({ ...wizardData, offerHook: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono focus:border-neon outline-none"
                        />
                      </div>

                      {/* Opción B: Subir Documento ADR-002 (.pdf, .docx, .md, .txt) */}
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                            <Upload className="w-3 h-3 text-neon" />
                            <span>2. O {currentPillarsAdaptive.offer.docLabel}:</span>
                          </label>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">ADR-002</span>
                        </div>

                        {!wizardData.commercialProposalDoc ? (
                          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-neon/40 hover:border-neon bg-[var(--bg-panel)] cursor-pointer transition-all group">
                            <FileText className="w-3.5 h-3.5 text-neon group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                              Adjuntar archivo <strong className="text-neon font-bold">.pdf, .docx, .md, .txt</strong>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.md,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setWizardData({
                                    ...wizardData,
                                    commercialProposalDoc: { name: file.name, size: file.size, type: file.type }
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-neon/60 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                              <span className="text-[var(--text-main)] font-bold truncate text-[11px]">
                                {typeof wizardData.commercialProposalDoc === 'string' ? wizardData.commercialProposalDoc : wizardData.commercialProposalDoc?.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                {wizardData.commercialProposalDoc?.size ? `(${(wizardData.commercialProposalDoc.size / 1024).toFixed(1)} KB)` : '(Auto-extraído)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWizardData({ ...wizardData, commercialProposalDoc: null })}
                              className="p-1 text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2"
                              title="Quitar archivo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pilar 1 & Pilar 3: Catálogo, Precios & FAQs */}
                  <div id="tour-wizard-step5-pilar1-pilar3" className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Pilar 1: Catálogo & Precios */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-neon flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" /> {currentPillarsAdaptive.pilar1.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-color)] uppercase">
                          Opcional
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {currentVerticalObj.pillars.pilar1.label}
                      </p>

                      {/* Opción A: Escribir o Pegar */}
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1 font-bold">
                          1. Escribir / Pegar Precios o Servicios:
                        </label>
                        <input
                          type="text"
                          placeholder={currentPillarsAdaptive.pilar1.placeholder}
                          value={wizardData.pricingDetails || ''}
                          onChange={(e) => setWizardData({ ...wizardData, pricingDetails: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono focus:border-neon outline-none"
                        />
                      </div>

                      {/* Opción B: Subir Documento ADR-002 (.pdf, .docx, .md, .txt) */}
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                            <Upload className="w-3 h-3 text-neon" />
                            <span>2. O {currentPillarsAdaptive.pilar1.docLabel}:</span>
                          </label>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">ADR-002</span>
                        </div>

                        {!wizardData.pricingDoc ? (
                          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[var(--border-color)] hover:border-neon/60 bg-[var(--bg-panel)] cursor-pointer transition-all group">
                            <FileText className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-neon transition-colors" />
                            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                              Adjuntar archivo <strong className="text-neon font-bold">.pdf, .docx, .md, .txt</strong>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.md,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setWizardData({
                                    ...wizardData,
                                    pricingDoc: { name: file.name, size: file.size, type: file.type }
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/50 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                              <span className="text-[var(--text-main)] font-bold truncate text-[11px]">
                                {typeof wizardData.pricingDoc === 'string' ? wizardData.pricingDoc : wizardData.pricingDoc?.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                {wizardData.pricingDoc?.size ? `(${(wizardData.pricingDoc.size / 1024).toFixed(1)} KB)` : '(Auto-extraído)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWizardData({ ...wizardData, pricingDoc: null })}
                              className="p-1 text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2"
                              title="Quitar archivo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pilar 3: Políticas & FAQ */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> {currentPillarsAdaptive.pilar3.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-color)] uppercase">
                          Opcional
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {currentVerticalObj.pillars.pilar3.label}
                      </p>

                      {/* Opción A: Escribir o Pegar */}
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1 font-bold">
                          1. Escribir / Pegar Políticas o Preguntas Frecuentes:
                        </label>
                        <input
                          type="text"
                          placeholder={currentPillarsAdaptive.pilar3.placeholder}
                          value={wizardData.faqDetails || ''}
                          onChange={(e) => setWizardData({ ...wizardData, faqDetails: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono focus:border-amber-400 outline-none"
                        />
                      </div>

                      {/* Opción B: Subir Documento ADR-002 (.pdf, .docx, .md, .txt) */}
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                            <Upload className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                            <span>2. O {currentPillarsAdaptive.pilar3.docLabel}:</span>
                          </label>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">ADR-002</span>
                        </div>

                        {!wizardData.faqsDoc ? (
                          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[var(--border-color)] hover:border-amber-400/60 bg-[var(--bg-panel)] cursor-pointer transition-all group">
                            <FileText className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-amber-700 dark:hover:text-amber-400 transition-colors" />
                            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                              Adjuntar archivo <strong className="text-amber-700 dark:text-amber-400 font-bold">.pdf, .docx, .md, .txt</strong>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.md,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setWizardData({
                                    ...wizardData,
                                    faqsDoc: { name: file.name, size: file.size, type: file.type }
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-amber-400/50 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                              <span className="text-[var(--text-main)] font-bold truncate text-[11px]">
                                {typeof wizardData.faqsDoc === 'string' ? wizardData.faqsDoc : wizardData.faqsDoc?.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                {wizardData.faqsDoc?.size ? `(${(wizardData.faqsDoc.size / 1024).toFixed(1)} KB)` : '(Auto-extraído)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWizardData({ ...wizardData, faqsDoc: null })}
                              className="p-1 text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2"
                              title="Quitar archivo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pilar 4: Casos de Éxito & Calificación 4/4 AND */}
                  <div id="tour-wizard-step5-pilar4" className="p-5 rounded-2xl bg-[var(--bg-card)] border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> {currentPillarsAdaptive.pilar4.title} & Calificación de Leads
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPilar4Guide(!showPilar4Guide)}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] border border-neon/40 text-neon flex items-center gap-1 transition-all active:scale-95"
                            title="Haz clic para entender cómo funciona el Pilar 4"
                          >
                            <HelpCircle className="w-3 h-3 text-neon" />
                            <span>¿Qué es el Pilar 4?</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                          4/4 Criterios AND · Facturación $350 MXN
                        </span>
                      </div>

                      {/* Explicación Desplegable del Pilar 4 */}
                      {showPilar4Guide && (
                        <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/40 space-y-2 text-xs font-mono animate-fade-in">
                          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                            <span className="flex items-center gap-1.5">
                              <Info className="w-4 h-4" />
                              Guía: ¿Para qué sirve el Pilar 4 en Vector Inside?
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPilar4Guide(false)}
                              className="text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-[var(--text-muted)] font-sans">
                            <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                              <strong className="text-neon block font-mono">1. Prueba Social & Casos de Éxito</strong>
                              <p>
                                Cuando el prospecto duda (&quot;¿Es seguro?&quot;, &quot;¿Tienen resultados?&quot;), la IA no inventa: acude a este pilar y cita transformaciones reales, testimonios, reseñas o fotos de antes/después específicas de {currentVerticalObj.name}.
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                              <strong className="text-emerald-700 dark:text-emerald-400 block font-mono">2. Matriz de Calificación AND ($350 MXN)</strong>
                              <p>
                                Protege tu dinero evitando pagar por &quot;mirones&quot; o curiosos. La IA evalúa los 4 filtros comerciales en la charla. <strong>Solo cuando el prospecto confirma los 4 criterios</strong>, se transfiere a tu equipo y se genera la comisión.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Filtros de control comercial calibrados para {currentVerticalObj.name}. Solo se factura al tenant cuando el prospecto confirma todos los criterios.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                        {(currentPillarsAdaptive.criteria || []).map((crit, cIdx) => (
                          <div key={cIdx} className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/30 flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-neon shrink-0" />
                            <span className="text-[var(--text-main)] truncate">{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  <div className="flex justify-between pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs px-4 py-2.5 rounded-xl text-[var(--text-main)] font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      id="tour-wizard-step5-next"
                      type="button"
                      onClick={() => setCurrentStep(6)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Reglas & Despliegue RLS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* PASO 6: Gobernanza, Reglas Inviolables & Despliegue RLS       */}
              {/* ============================================================= */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                        Paso 6 de 6
                      </span>
                      <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                        <Shield className="w-5 h-5 text-neon" />
                        <span>Gobernanza, Reglas Inviolables & Despliegue RLS</span>
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Audita las reglas de operación, revisa el resumen ejecutivo del enjambre y activa el aislamiento RLS para el negocio.
                    </p>
                  </div>

                  {/* Bloque 1: Reglas Inviolables del Negocio */}
                  <div id="tour-wizard-step6-rules" className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <InviolableRulesEditor
                      rules={wizardData.inviolableRules}
                      onChange={(nextRules) =>
                        setWizardData((prev) => ({ ...prev, inviolableRules: nextRules }))
                      }
                      suggestedRules={currentVerticalObj.defaultRules || []}
                      suggestionLabel={`Cargar sugerencias de ejemplo de ${currentVerticalObj.name}`}
                      emptyMessage="Inicias con el lienzo 100% limpio. El bot no asumirá reglas rígidas: aprenderá de los documentos que subiste en los Pilares o de las reglas puntuales que agregues arriba."
                      placeholder="Agregar regla inviolable personalizada..."
                    />
                  </div>

                  {/* Bloque 2: Resumen Ejecutivo Integral de Auditoría & Pilares RAG */}
                  <div id="tour-wizard-step6-summary" className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-neon/30 space-y-4 font-mono text-xs shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <VectorLobo size={32} showStatus={true} status="active" />
                        <div>
                          <span className="text-[var(--text-main)] font-bold block text-sm">Auditoría Ejecutiva Pre-Despliegue</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Resumen completo del negocio, canales y 4 Pilares RAG (ADR-001 & ADR-002)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-neon/15 text-neon font-bold border border-neon/30 text-[10px]">
                          IFV Esperado: {Math.round((healthScore / 100) * 50)}/50
                        </span>
                        <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                          Salud RAG: {healthScore}%
                        </span>
                      </div>
                    </div>

                    {/* Fila 1: Entidad, Giro y Canales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {/* Entidad & Dueño */}
                      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                        <span className="text-[var(--text-muted)] block text-[9px] uppercase font-bold tracking-wider">Negocio & Contacto HITL</span>
                        <span className="text-[var(--text-main)] font-black text-sm block truncate">
                          {wizardData.businessName || 'Nuevo Negocio'}
                        </span>
                        <span className="text-[10px] text-cyan-700 dark:text-cyan-400 block truncate">
                          Dueño: {wizardData.primaryContact || wizardData.ownerName || 'No especificado'} · {wizardData.ownerPhone || 'Sin tel'}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Tax ID: {wizardData.legalNameTaxId || 'RFC en validación'}
                        </span>
                      </div>

                      {/* Giro & Metas */}
                      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                        <span className="text-[var(--text-muted)] block text-[9px] uppercase font-bold tracking-wider">Giro & Conversión</span>
                        <span className="text-neon font-black text-sm block truncate">
                          {currentVerticalObj.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Meta: {currentVerticalObj.conversionGoal?.split('/')[0]}
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block truncate">
                          Arquetipo: {wizardData.archetype || currentVerticalObj.badge}
                        </span>
                      </div>

                      {/* Canales & Agenda */}
                      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                        <span className="text-[var(--text-muted)] block text-[9px] uppercase font-bold tracking-wider">Estrategia & Calendario</span>
                        {wizardData.hasWebsite ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 text-[9px] font-bold flex items-center gap-1 shrink-0">
                              <Globe className="w-2.5 h-2.5" />
                              CON Web
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] truncate">
                              {wizardData.websiteUrl || 'Sin sitio web especificado'}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-bold inline-flex items-center gap-1">
                              <Smartphone className="w-2.5 h-2.5" />
                              SIN Web (Directo a WhatsApp)
                            </span>
                          </div>
                        )}
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Google Calendar: {wizardData.appointmentDuration || 45} min / cita
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Micro-landing: {wizardData.microLandingBillingPlan === 'disabled' ? 'Desactivada' : `Activa (${wizardData.microLandingBillingPlan})`}
                        </span>
                      </div>
                    </div>

                    {/* Resumen de los 4 Pilares RAG & Oferta Comercial */}
                    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-neon/25 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neon flex items-center gap-1.5 uppercase font-mono">
                          <Database className="w-4 h-4" />
                          Memoria RAG: Desglose de los 4 Pilares & Oferta
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {masterFile ? `Fuente: "${masterFile.name}"` : 'Configuración asistida'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
                        {/* Pilar 1 */}
                        <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
                          <span className="text-[10px] text-neon font-bold block truncate">Pilar 1: Precios / Tarifas</span>
                          <p className="text-[10px] text-[var(--text-main)] font-sans line-clamp-2">
                            {wizardData.pricingDetails || (wizardData.pricingDoc ? `Doc: ${typeof wizardData.pricingDoc === 'string' ? wizardData.pricingDoc : wizardData.pricingDoc.name}` : 'Tarifario oficial')}
                          </p>
                          {wizardData.pricingDoc && (
                            <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-mono block truncate">
                              📎 {typeof wizardData.pricingDoc === 'string' ? wizardData.pricingDoc : wizardData.pricingDoc.name}
                            </span>
                          )}
                        </div>

                        {/* Pilar 2 */}
                        <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-cyan-400/40 space-y-1">
                          <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold block truncate">Pilar 2: Brandbook & Tono</span>
                          <p className="text-[10px] text-[var(--text-main)] font-sans line-clamp-2">
                            {wizardData.brandTone || (wizardData.brandbookDoc ? `Doc: ${typeof wizardData.brandbookDoc === 'string' ? wizardData.brandbookDoc : wizardData.brandbookDoc.name}` : 'Tono empático profesional')}
                          </p>
                          {wizardData.brandbookDoc && (
                            <span className="text-[9px] text-cyan-700 dark:text-cyan-400 font-mono block truncate">
                              📎 {typeof wizardData.brandbookDoc === 'string' ? wizardData.brandbookDoc : wizardData.brandbookDoc.name}
                            </span>
                          )}
                        </div>

                        {/* Oferta */}
                        <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-neon/30 space-y-1">
                          <span className="text-[10px] text-neon font-bold block truncate">Propuesta Comercial</span>
                          <p className="text-[10px] text-[var(--text-main)] font-sans line-clamp-2">
                            {wizardData.offerHook || (wizardData.commercialProposalDoc ? `Doc: ${typeof wizardData.commercialProposalDoc === 'string' ? wizardData.commercialProposalDoc : wizardData.commercialProposalDoc.name}` : 'Oferta de captación')}
                          </p>
                          {wizardData.commercialProposalDoc && (
                            <span className="text-[9px] text-neon font-mono block truncate">
                              📎 {typeof wizardData.commercialProposalDoc === 'string' ? wizardData.commercialProposalDoc : wizardData.commercialProposalDoc.name}
                            </span>
                          )}
                        </div>

                        {/* Pilar 3 */}
                        <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-amber-400/40 space-y-1">
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block truncate">Pilar 3: Políticas / FAQs</span>
                          <p className="text-[10px] text-[var(--text-main)] font-sans line-clamp-2">
                            {wizardData.faqDetails || (wizardData.faqsDoc ? `Doc: ${typeof wizardData.faqsDoc === 'string' ? wizardData.faqsDoc : wizardData.faqsDoc.name}` : 'Reglamento y cancelaciones')}
                          </p>
                          {wizardData.faqsDoc && (
                            <span className="text-[9px] text-amber-700 dark:text-amber-400 font-mono block truncate">
                              📎 {typeof wizardData.faqsDoc === 'string' ? wizardData.faqsDoc : wizardData.faqsDoc.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pilar 4 Footer */}
                      <div className="pt-2.5 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px]">
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Pilar 4: 4/4 Criterios AND activos · Costo Lead Calificado: ${wizardData.costPerQualifiedLead || 350} MXN</span>
                        </div>
                        <div className="text-[var(--text-muted)]">
                          Reglas Inviolables: <strong className="text-neon">{wizardData.inviolableRules.length} activas</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6-Block JSON Onboarding Payload Inspector */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-neon" />
                        <div>
                          <span className="text-[var(--text-main)] font-bold block">Payload Onboarding 6-Bloques</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Endpoint API: POST /api/v1/tenants/onboard · Especificación de Arquitectura ADR-001 §2.7</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyPayload}
                          className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-neon border border-neon/40 flex items-center gap-1.5 transition-all text-xs font-bold active:scale-95 shadow-[0_0_10px_rgba(231,249,0,0.1)]"
                        >
                          {copiedPayload ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                              <span className="text-emerald-700 dark:text-emerald-400">¡Payload Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar JSON</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPayloadModal(!showPayloadModal)}
                          className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] flex items-center gap-1.5 transition-all text-xs"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>{showPayloadModal ? 'Ocultar JSON' : 'Inspeccionar JSON'}</span>
                        </button>
                      </div>
                    </div>

                    {showPayloadModal && (
                      <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-neon/30 overflow-x-auto max-h-80 text-[11px] text-[var(--text-main)] font-mono leading-relaxed select-all animate-fade-in shadow-inner">
                        <pre className="text-emerald-500 dark:text-emerald-400 whitespace-pre">
                          {JSON.stringify(getDynamicOnboardingPayload(), null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* 6 Verification Checkpoints */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[10px] text-[var(--text-muted)] pt-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>1. Tenant Core & RLS</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>2. Owner Legal E.164</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>3. Meta Credentials (WABA/IG)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>4. Web / GA4 / CAPI</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>5. Google Calendar Sync</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>6. Matriz de Oferta & Reglas</span>
                      </div>
                    </div>
                  </div>

                  {/* Navegación Final y Botón Desplegar Enjambre */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs px-4 py-2.5 rounded-xl text-[var(--text-main)] font-mono flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás: Pilares RAG</span>
                    </button>
                    <button
                      id="tour-wizard-step6-deploy"
                      type="button"
                      onClick={handleDeploySwarm}
                      className="bg-neon text-black font-mono font-black text-xs uppercase px-8 py-3.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon active:scale-95 w-full sm:w-auto justify-center"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Desplegar Enjambre & Activar RLS</span>
                    </button>
                  </div>
                </div>
              )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: CLIENTE FINAL — VISTA AMIGABLE & SOLICITUD DE CAMBIO            */}
      {/* ========================================================================= */}
      {isClient && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Card for Client */}
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-neon tracking-wider">
                Panel del Negocio / Cliente
              </span>
              <h3 className="text-2xl font-black text-[var(--text-main)] font-mono flex items-center gap-2">
                <span>{activeTenant?.name || 'Tu Negocio'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Bot Activo 24/7
                </span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Consulta el estado de tu bot. Si requieres cambiar tono, ideas o precios, solicita una actualización con 1 clic.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowChangeModal(true)}
              className="bg-neon text-black font-mono font-bold text-xs px-5 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-neon flex items-center gap-2 active:scale-95 shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Solicitar Actualización de Documento</span>
            </button>
          </div>

          {/* RAG Health Score & IFV Widget for Client (Bloque 6 & 13.9 Manual Maestro) */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-brand-primary/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <VectorLobo size={44} showStatus={true} status="active" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[var(--text-main)] font-mono">
                    Base de Conocimiento Calibrada
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon font-bold border border-neon/30">
                    IFV: {activeTenantRagMetrics.ifvScore}/50
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Lobo Vectorial supervisa identidad (Pilar 2), precios y filtros sin alucinaciones.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-mono text-neon font-black block">
                  Calibración {activeTenantRagMetrics.healthPct}%
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                  {activeTenantRagMetrics.completedCount}/4 Pilares Activos
                </span>
              </div>
            </div>
          </div>

          {/* 4 Pillars Client Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border-2 border-cyan-500/40 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-bold font-mono text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Pilar 2: Identidad & Tono de Marca</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 font-bold border border-cyan-500/30">
                  {activeTenant?.pillars?.pillar2?.enabled !== false ? 'Obligatorio • Activo' : 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Estilo de redacción, lenguaje natural y personalidad con la que tu bot interactúa con tu audiencia.
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between text-[var(--text-muted)]">
                <span>
                  Archivo activo:{' '}
                  {activeTenant?.pillars?.pillar2?.fileName ||
                    (activeTenant?.pillars?.pillar2?.brandTone || activeTenant?.toneOfVoice
                      ? 'Directrices de Tono Configuradas'
                      : 'Sin documento cargado')}
                </span>
                <span
                  className={
                    activeTenant?.pillars?.pillar2?.fileName ||
                    activeTenant?.pillars?.pillar2?.brandTone ||
                    activeTenant?.toneOfVoice
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-amber-700 dark:text-amber-400 font-bold'
                  }
                >
                  {activeTenant?.pillars?.pillar2?.fileName ||
                  activeTenant?.pillars?.pillar2?.brandTone ||
                  activeTenant?.toneOfVoice
                    ? 'Sincronizado'
                    : 'Pendiente'}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neon font-bold font-mono text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>Pilar 1: Precios & Catálogo de Ventas</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)]">
                  {activeTenant?.pillars?.pillar1?.enabled ? 'Activo' : 'Opcional'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Cotizaciones y paquetes configurables según el giro de negocio.
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between text-[var(--text-muted)]">
                <span>
                  Estado:{' '}
                  {activeTenant?.pillars?.pillar1?.fileName ||
                    (activeTenant?.pillars?.pillar1?.enabled
                      ? 'Tarifas Configuradas'
                      : 'Sin documento cargado')}
                </span>
                <span
                  className={
                    activeTenant?.pillars?.pillar1?.fileName || activeTenant?.pillars?.pillar1?.enabled
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-[var(--text-muted)] font-bold'
                  }
                >
                  {activeTenant?.pillars?.pillar1?.fileName || activeTenant?.pillars?.pillar1?.enabled
                    ? 'Sincronizado'
                    : 'Configurable'}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-bold font-mono text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pilar 3: Preguntas Frecuentes & Seguridad</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold">
                  {activeTenant?.pillars?.pillar3?.enabled ? 'Activo' : 'Opcional'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Respuestas automáticas a dudas frecuentes y filtros para evitar respuestas indebidas.
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between text-[var(--text-muted)]">
                <span>
                  Archivo activo:{' '}
                  {activeTenant?.pillars?.pillar3?.fileName ||
                    (activeTenant?.pillars?.pillar3?.enabled
                      ? 'Protocolo de Crisis Activo'
                      : 'Sin documento cargado')}
                </span>
                <span
                  className={
                    activeTenant?.pillars?.pillar3?.fileName || activeTenant?.pillars?.pillar3?.enabled
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-[var(--text-muted)] font-bold'
                  }
                >
                  {activeTenant?.pillars?.pillar3?.fileName || activeTenant?.pillars?.pillar3?.enabled
                    ? 'Activo'
                    : 'Sin configurar'}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold font-mono text-sm">
                  <History className="w-4 h-4" />
                  <span>Pilar 4: Histórico & Casos de Éxito</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)]">
                  {activeTenant?.pillars?.pillar4?.enabled ? 'Activo' : 'Opcional'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Contexto de publicaciones pasadas y aprendizajes de campañas previas.
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between text-[var(--text-muted)]">
                <span>
                  Estado:{' '}
                  {activeTenant?.pillars?.pillar4?.fileName ||
                    activeTenant?.pillars?.pillar4?.context ||
                    (activeTenant?.pillars?.pillar4?.enabled
                      ? 'En Aprendizaje Continuo'
                      : 'Sin documento cargado')}
                </span>
                <span
                  className={
                    activeTenant?.pillars?.pillar4?.fileName || activeTenant?.pillars?.pillar4?.enabled
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-[var(--text-muted)] font-bold'
                  }
                >
                  {activeTenant?.pillars?.pillar4?.fileName || activeTenant?.pillars?.pillar4?.enabled
                    ? 'Sincronizado'
                    : 'Opcional'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SOLICITUD DE CAMBIO DE DOCUMENTO (CLIENTE)                         */}
      {/* ========================================================================= */}
      {showChangeModal && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowChangeModal(false);
            }}
          >
            <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-panel)] border border-brand-primary/40 shadow-2xl p-6 sm:p-8 relative space-y-5 my-auto animate-scale-up">
            <button
              type="button"
              onClick={() => setShowChangeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[10px] font-mono font-bold uppercase">
                <Upload className="w-3.5 h-3.5" />
                Workflow de Validación
              </div>
              <h3 className="text-xl font-black text-[var(--text-main)]">
                Solicitar Actualización de Documento
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                La agencia validará los cambios de tono, ideas o políticas antes de re-indexar el bot.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (activeTenant?.id && updateTenantPolicy) {
                    const updatedPillars = {
                      ...(activeTenant.pillars || {}),
                      [selectedPillarForChange]: {
                        ...(activeTenant.pillars?.[selectedPillarForChange] || {}),
                        enabled: true,
                        fileName:
                          changeFileName ||
                          activeTenant.pillars?.[selectedPillarForChange]?.fileName ||
                          null,
                        lastChangeNotes: changeNotes,
                        updatedAt: new Date().toISOString(),
                      },
                    };
                    await updateTenantPolicy(activeTenant.id, {
                      pillars: updatedPillars,
                    });
                  }

                  await auditService.recordEvent({
                    eventCategory: 'RAG_KNOWLEDGE',
                    action: `Solicitud de actualización documental (${selectedPillarForChange})`,
                    targetResource: changeFileName || selectedPillarForChange,
                    tenantId: activeTenant?.id || null,
                    status: 'SUCCESS',
                    metadata: {
                      pillar: selectedPillarForChange,
                      fileName: changeFileName || null,
                      notes: changeNotes,
                    },
                  });

                  setShowChangeModal(false);
                  setChangeNotes('');
                  setChangeFileName('');
                  triggerModal(
                    'Solicitud Enviada y Registrada',
                    'Tu actualización documental fue registrada en auditoría y sincronizada con la política de tu negocio.'
                  );
                } catch (err) {
                  triggerModal(
                    'Error al Registrar Solicitud',
                    err?.response?.data?.message || err?.message || 'No se pudo guardar la solicitud en PostgreSQL.',
                    null,
                    'Entendido',
                    'danger'
                  );
                }
              }}
              className="space-y-4 pt-2 font-mono text-xs"
            >
              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">
                  Selecciona el Pilar que deseas actualizar
                </label>
                <select
                  value={selectedPillarForChange}
                  onChange={(e) => setSelectedPillarForChange(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-2.5 text-[var(--text-main)] focus:border-neon outline-none cursor-pointer"
                >
                  <option value="pillar2">Pilar 2: Identidad & Tono de Voz (Brandbook) — [Principal]</option>
                  <option value="pillar1">Pilar 1: Precios / Membresías / Catálogo</option>
                  <option value="pillar3">Pilar 3: Protocolos de Crisis & FAQs</option>
                  <option value="pillar4">Pilar 4: Histórico de Datos & Casos de Éxito</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">
                  Subir Nuevo Archivo (Markdown .md, PDF, Word o TXT)
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setChangeFileName(e.target.files[0]?.name || 'Nuevo_Documento.md')}
                  className="text-xs text-[var(--text-muted)] w-full file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neon file:text-black hover:file:bg-[var(--neon-hover)] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">
                  Explicación breve de los cambios realizados *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="ej. Actualizamos los precios de membresías del gimnasio y agregamos 3 nuevas preguntas frecuentes sobre clases de CrossFit."
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-neon text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-neon flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Solicitud</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
};
