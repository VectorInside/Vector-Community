'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { driver } from 'driver.js';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Sparkles,
  Play,
  X,
  CheckCircle2,
  Layers,
  Compass,
  ArrowRight,
  Search,
  Bot,
  Calendar,
  DollarSign,
  Activity,
  Shield,
  Building2,
  ExternalLink,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Sliders,
  Flame,
  Check,
} from 'lucide-react';

import {
  GLOBAL_SHELL_TOURS,
  WIZARD_6_STEPS_TOUR,
  WIZARD_STEP_TOURS,
  SYSTEM_CONFIG_TABS_TOUR,
  ROUTE_OPERATIONAL_TOURS,
} from '@/utils/toursCatalog';

export const OnboardingTour = () => {
  const { currentUser, role, isSuperAdmin, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const driverInstanceRef = useRef(null);

  // Estados del Tutor Hub Modal
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Disparar celebración con confeti al finalizar un tour
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c3f400', '#aa8bfb', '#80b8ff', '#ffffff'],
      });
    } catch (e) {
      // Fallback si canvas-confetti no está disponible
    }
  }, []);

  /**
   * Ejecutor Universal de Tours con soporte reactivo para pasos dinámicos
   */
  const launchTour = useCallback((tourKey, options = {}) => {
    if (typeof window === 'undefined') return;

    // Cerrar modal de guías si está abierto
    setIsTutorModalOpen(false);

    // Destruir instancia previa si existe
    if (driverInstanceRef.current) {
      try {
        driverInstanceRef.current.destroy();
      } catch (e) {}
    }

    const { isInitial = false, allowClose = true } = options;

    // 1. TOUR: ALTA DE NEGOCIO EN 6 PASOS (RAGWizard Multi-Paso)
    if (tourKey === 'wizard_6_steps') {
      const startWizardTour = () => {
        // Asegurar que el componente esté en modo Wizard y en Paso 1
        window.dispatchEvent(
          new CustomEvent('vector_config_set_tab', { detail: { tab: 'rag', mode: 'wizard' } })
        );
        window.dispatchEvent(
          new CustomEvent('vector_wizard_control', { detail: { action: 'set_step', step: 1, ensureWizardMode: true } })
        );

        setTimeout(() => {
          const steps = [...WIZARD_6_STEPS_TOUR];

          const driverObj = driver({
            animate: true,
            allowClose: true,
            overlayClickNext: false,
            stagePadding: 6,
            stageRadius: 12,
            popoverClass: 'vector-tour-popover',
            nextBtnText: 'Siguiente Paso →',
            prevBtnText: '← Paso Previo',
            doneBtnText: '¡Listo para Desplegar! 🚀',
            progressText: 'Paso {{current}} de {{total}}',
            steps,
            onNextClick: () => {
              const activeIndex = driverObj.getActiveIndex();
              const currentTourStep = steps[activeIndex];

              if (currentTourStep?.targetStep) {
                // Notificar al RAGWizard que cambie reactivamente al siguiente paso
                window.dispatchEvent(
                  new CustomEvent('vector_wizard_control', {
                    detail: { action: 'set_step', step: currentTourStep.targetStep, ensureWizardMode: true },
                  })
                );

                // Esperar a que React renderice los nodos DOM del nuevo paso
                setTimeout(() => {
                  driverObj.moveNext();
                }, 200);
                return;
              }

              driverObj.moveNext();
            },
            onPrevClick: () => {
              const activeIndex = driverObj.getActiveIndex();
              const prevTourStep = steps[activeIndex - 1];

              if (prevTourStep?.stepNum) {
                window.dispatchEvent(
                  new CustomEvent('vector_wizard_control', {
                    detail: { action: 'set_step', step: prevTourStep.stepNum, ensureWizardMode: true },
                  })
                );

                setTimeout(() => {
                  driverObj.movePrevious();
                }, 200);
                return;
              }

              driverObj.movePrevious();
            },
            onDestroyed: () => {
              triggerCelebration();
            },
          });

          driverInstanceRef.current = driverObj;
          driverObj.drive();
        }, 280);
      };

      if (!pathname?.includes('/connections')) {
        router.push('/connections');
        setTimeout(startWizardTour, 500);
      } else {
        startWizardTour();
      }
      return;
    }

    // 2. TOURS DE PASO ESPECÍFICO DEL WIZARD (wizard_step_1 .. wizard_step_6)
    if (tourKey.startsWith('wizard_step_')) {
      const stepIndex = parseInt(tourKey.replace('wizard_step_', ''), 10) || 1;
      const stepKey = `step_${stepIndex}`;
      const steps = WIZARD_STEP_TOURS[stepKey];

      if (!steps || steps.length === 0) return;

      const runStepTour = () => {
        window.dispatchEvent(
          new CustomEvent('vector_config_set_tab', { detail: { tab: 'rag', mode: 'wizard' } })
        );
        window.dispatchEvent(
          new CustomEvent('vector_wizard_control', { detail: { action: 'set_step', step: stepIndex, ensureWizardMode: true } })
        );

        setTimeout(() => {
          const validSteps = steps.filter((st) => !st.element || document.querySelector(st.element));

          const driverObj = driver({
            animate: true,
            allowClose: true,
            overlayClickNext: false,
            stagePadding: 6,
            stageRadius: 12,
            popoverClass: 'vector-tour-popover',
            nextBtnText: 'Siguiente →',
            prevBtnText: '← Anterior',
            doneBtnText: 'Entendido 🎯',
            progressText: `Paso ${stepIndex} · {{current}} de {{total}}`,
            steps: validSteps.length > 0 ? validSteps : steps,
            onDestroyed: () => {
              triggerCelebration();
            },
          });

          driverInstanceRef.current = driverObj;
          driverObj.drive();
        }, 220);
      };

      if (!pathname?.includes('/connections')) {
        router.push('/connections');
        setTimeout(runStepTour, 500);
      } else {
        runStepTour();
      }
      return;
    }

    // 3. TOUR: LAS 4 SUBPESTAÑAS DE SystemConfigHub (/connections)
    if (tourKey === 'system_config_tabs') {
      const runTabsTour = () => {
        // Asegurar que esté en vista de tabs ('list')
        window.dispatchEvent(
          new CustomEvent('vector_config_set_tab', { detail: { mode: 'list' } })
        );

        setTimeout(() => {
          const steps = [...SYSTEM_CONFIG_TABS_TOUR];

          const driverObj = driver({
            animate: true,
            allowClose: true,
            overlayClickNext: false,
            stagePadding: 6,
            stageRadius: 12,
            popoverClass: 'vector-tour-popover',
            nextBtnText: 'Siguiente Subpestaña →',
            prevBtnText: '← Anterior',
            doneBtnText: '¡Configuración Explorada! 🚀',
            progressText: 'Submódulo {{current}} de {{total}}',
            steps,
            onNextClick: () => {
              const activeIndex = driverObj.getActiveIndex();
              const currentStep = steps[activeIndex];

              if (currentStep?.targetTab) {
                window.dispatchEvent(
                  new CustomEvent('vector_config_set_tab', {
                    detail: { tab: currentStep.targetTab, mode: 'list' },
                  })
                );
                setTimeout(() => {
                  driverObj.moveNext();
                }, 160);
                return;
              }

              driverObj.moveNext();
            },
            onDestroyed: () => {
              triggerCelebration();
            },
          });

          driverInstanceRef.current = driverObj;
          driverObj.drive();
        }, 220);
      };

      if (!pathname?.includes('/connections')) {
        router.push('/connections');
        setTimeout(runTabsTour, 500);
      } else {
        runTabsTour();
      }
      return;
    }

    // 4. TOURS OPERATIVOS POR RUTA (/dashboard, /crm, /inbox, /agenda, /team, etc.)
    const normalizedKey = tourKey.startsWith('/') ? tourKey : `/${tourKey}`;
    if (ROUTE_OPERATIONAL_TOURS[normalizedKey]) {
      const targetRoute = normalizedKey;
      const steps = ROUTE_OPERATIONAL_TOURS[targetRoute];

      const runRouteTour = () => {
        setTimeout(() => {
          const validSteps = steps.filter((st) => !st.element || document.querySelector(st.element));

          const driverObj = driver({
            animate: true,
            allowClose: true,
            overlayClickNext: false,
            stagePadding: 6,
            stageRadius: 12,
            popoverClass: 'vector-tour-popover',
            nextBtnText: 'Siguiente →',
            prevBtnText: '← Anterior',
            doneBtnText: '¡Submódulo Dominado! 🎯',
            progressText: 'Paso {{current}} de {{total}}',
            steps: validSteps.length > 0 ? validSteps : steps,
            onDestroyed: () => {
              triggerCelebration();
            },
          });

          driverInstanceRef.current = driverObj;
          driverObj.drive();
        }, 250);
      };

      if (pathname !== targetRoute) {
        router.push(targetRoute);
        setTimeout(runRouteTour, 550);
      } else {
        runRouteTour();
      }
      return;
    }

    // 5. TOUR GLOBAL DE MENÚ Y CABECERA (Shell Tour por Rol)
    const userRoleKey = isSuperAdmin ? 'SUPER_ADMIN' : isAdmin ? 'ADMIN' : 'CLIENT_OWNER';
    const shellSteps = GLOBAL_SHELL_TOURS[userRoleKey] || GLOBAL_SHELL_TOURS.SUPER_ADMIN;

    const validSteps = shellSteps.filter((st) => {
      if (!st.element) return true;
      return !!document.querySelector(st.element);
    });

    if (validSteps.length === 0) return;

    const userKey = currentUser?.id || currentUser?.email || role || 'user';
    const storageKey = `vector_tour_completed_${userKey}`;

    const driverObj = driver({
      animate: true,
      allowClose: allowClose,
      overlayClickNext: false,
      stagePadding: 6,
      stageRadius: 12,
      popoverClass: 'vector-tour-popover',
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Comenzar a Operar! 🚀',
      progressText: 'Paso {{current}} de {{total}}',
      steps: validSteps,
      onDestroyed: () => {
        localStorage.setItem(storageKey, 'true');
        triggerCelebration();
      },
    });

    driverInstanceRef.current = driverObj;
    driverObj.drive();
  }, [currentUser, role, isSuperAdmin, isAdmin, pathname, router, triggerCelebration]);

  // Escuchar eventos globales del bus del sistema
  useEffect(() => {
    // 1. Abrir Modal del Centro de Guías
    const handleOpenTutorHub = () => {
      setIsTutorModalOpen(true);
    };

    // 2. Iniciar Tour directamente
    const handleStartTour = (e) => {
      const { tourId, options } = e.detail || {};
      if (tourId) {
        launchTour(tourId, options);
      }
    };

    // 3. Reiniciar Tour de Bienvenida
    const handleRestartTour = () => {
      launchTour('shell', { allowClose: true });
    };

    window.addEventListener('vector_open_tutor_hub', handleOpenTutorHub);
    window.addEventListener('vector_start_tour', handleStartTour);
    window.addEventListener('vector_restart_tour', handleRestartTour);

    // 4. Comprobación de Onboarding por primera vez al iniciar sesión
    const userKey = currentUser?.id || currentUser?.email || role || 'user';
    const storageKey = `vector_tour_completed_${userKey}`;

    const timer = setTimeout(() => {
      if (localStorage.getItem(storageKey) !== 'true') {
        launchTour('shell', { isInitial: true, allowClose: false });
      }
    }, 1400);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('vector_open_tutor_hub', handleOpenTutorHub);
      window.removeEventListener('vector_start_tour', handleStartTour);
      window.removeEventListener('vector_restart_tour', handleRestartTour);
      if (driverInstanceRef.current) {
        try {
          driverInstanceRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [currentUser, role, launchTour]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isTutorModalOpen) {
        setIsTutorModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTutorModalOpen]);

  // Catálogo de tarjetas de tutoriales para renderizar en el Modal
  const ALL_TUTORIALS = useMemo(() => {
    return [
      {
        id: 'wizard_6_steps',
        category: 'wizard',
        title: 'Alta de Negocio en 6 Pasos con IA',
        badge: 'Playbook Maestro',
        badgeColor: 'neon',
        description: 'Paso a paso interactivo: selección de giro, Micro-landing, píxeles GA4/Meta, sincronización Google Calendar, 4 Pilares RAG y despliegue RLS.',
        icon: Sparkles,
        routeContext: '/connections',
        isPrimary: true,
      },
      {
        id: 'system_config_tabs',
        category: 'submodules',
        title: 'Las 4 Subpestañas de Conexión & RAG',
        badge: 'Submódulos',
        badgeColor: 'cyan',
        description: 'Aprende qué hace cada pestaña en Conexiones: Multi-Tenant RAG, Motores IA & Sub-Bots, Reglas/Precios y Canales oficiales.',
        icon: Sliders,
        routeContext: '/connections',
        isPrimary: true,
      },
      {
        id: '/crm',
        category: 'operations',
        title: 'CRM Comercial & Reactivación 24h',
        badge: 'Operación',
        badgeColor: 'emerald',
        description: 'Kanban comercial de prospectos, protocolo de calificación 4/4 y reactivación autónoma a las 24h para prospectos fríos.',
        icon: Activity,
        routeContext: '/crm',
      },
      {
        id: '/inbox',
        category: 'operations',
        title: 'Bandeja Omnicanal & Takeover HITL',
        badge: 'Conversaciones',
        badgeColor: 'purple',
        description: 'Supervisa los chats en vivo de WhatsApp/Meta, monitorea el reloj de SLA de 5 min y toma el control humano instantáneo.',
        icon: Bot,
        routeContext: '/inbox',
      },
      {
        id: '/agenda',
        category: 'operations',
        title: 'Master Agenda & Google Calendar',
        badge: 'Citas',
        badgeColor: 'cyan',
        description: 'Calendario centralizado de citas generadas por la IA, sincronización móvil 2-way y configuración de turnos semanales.',
        icon: Calendar,
        routeContext: '/agenda',
      },
      {
        id: '/results',
        category: 'operations',
        title: 'Soberanía Financiera & ROAS Real',
        badge: 'Finanzas',
        badgeColor: 'emerald',
        description: 'Conciliación matemática sin vanidad: MER real, CAC exacto, desglose de pauta contra citas ganadas en base de datos.',
        icon: DollarSign,
        routeContext: '/results',
      },
      {
        id: '/team',
        category: 'operations',
        title: 'Consola de Equipo & Accesos 1:1',
        badge: 'Gobernanza',
        badgeColor: 'amber',
        description: 'Despacha credenciales seguras a clientes por WhatsApp/Email, gestiona el staff de la agencia y revisa logs forenses.',
        icon: Shield,
        routeContext: '/team',
      },
      {
        id: '/dashboard',
        category: 'operations',
        title: 'Deck de Negocios & Cohortes Vitales',
        badge: 'Supervisión',
        badgeColor: 'neon',
        description: 'Monitorea las 4 cohortes vitales (Contactos, Contactabilidad, Leads y Ventas) y el Kill-Switch de IA en 1 clic.',
        icon: Building2,
        routeContext: '/dashboard',
      },
      {
        id: 'shell',
        category: 'global',
        title: 'Tour General del Menú y Cabecera',
        badge: 'Shell Base',
        badgeColor: 'slate',
        description: 'Recorrido completo por la barra lateral de navegación, selector de empresas, notificaciones y menú de perfil para tu rol.',
        icon: Compass,
        routeContext: 'all',
      },
    ];
  }, []);

  // Filtrado de tutoriales
  const filteredTutorials = useMemo(() => {
    return ALL_TUTORIALS.filter((t) => {
      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'recommended' && (t.routeContext === pathname || t.routeContext === 'all')) ||
        t.category === activeCategory;

      const matchesSearch =
        !searchFilter ||
        t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.description.toLowerCase().includes(searchFilter.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [ALL_TUTORIALS, activeCategory, searchFilter, pathname]);

  // Recomendados prioritarios para la pantalla actual
  const recommendedForCurrentRoute = useMemo(() => {
    return ALL_TUTORIALS.filter((t) => t.routeContext === pathname);
  }, [ALL_TUTORIALS, pathname]);

  return (
    <>
      {/* MODAL: Centro de Guías & Tutor IA */}
      {isTutorModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] bg-[#121316] border border-[#2b2d35] rounded-3xl shadow-2xl overflow-hidden flex flex-col font-mono text-[var(--text-main)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="p-5 sm:p-6 border-b border-[#202126] flex items-center justify-between gap-4 bg-[#16171c]/60">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-neon/15 border border-neon/40 flex items-center justify-center text-neon shadow-[0_0_15px_rgba(231,249,0,0.2)]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <span>Tutor IA & Centro de Guías</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 uppercase font-bold">
                        Vector OS 2.0
                      </span>
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    Aprende el funcionamiento de cada submódulo y domina el alta de negocios con IA.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTutorModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-[#1c1d22] hover:bg-[#25272e] border border-[#2e303b] text-[var(--text-muted)] hover:text-white flex items-center justify-center transition-all active:scale-95"
                title="Cerrar ventana (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="p-4 sm:px-6 border-b border-[#202126] bg-[#14151a] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Categorías */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'recommended', label: `🎯 En esta pantalla (${recommendedForCurrentRoute.length})` },
                  { id: 'wizard', label: '🚀 Alta de Negocio' },
                  { id: 'submodules', label: '⚙️ Submódulos' },
                  { id: 'operations', label: '🏢 Operaciones' },
                  { id: 'global', label: '🌐 Tour Menú' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-neon text-black shadow-neon-sm'
                        : 'bg-[#1a1b21] hover:bg-[#22242b] text-[var(--text-muted)] hover:text-white border border-[#2b2d35]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Input de Búsqueda */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar guía o flujo..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-[#1a1b21] border border-[#2b2d35] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[var(--text-muted)] focus:border-neon outline-none font-mono"
                />
              </div>
            </div>

            {/* Contenido Scrolleable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
              {/* Sección A: Recomendado en la pantalla actual si coincide */}
              {recommendedForCurrentRoute.length > 0 && activeCategory === 'all' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-neon/10 via-neon/5 to-transparent border border-neon/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neon flex items-center gap-1.5 uppercase">
                      <Flame className="w-4 h-4 text-neon animate-pulse" />
                      Recomendado para esta pantalla ({pathname})
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      Contextual en vivo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recommendedForCurrentRoute.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#14151a]/90 border border-neon/30 hover:border-neon transition-all flex flex-col justify-between gap-3 group shadow-sm"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon font-bold uppercase border border-neon/30">
                              {item.badge}
                            </span>
                            <item.icon className="w-4 h-4 text-neon" />
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-neon transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed font-sans">
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => launchTour(item.id)}
                          className="w-full py-2 px-3 rounded-lg bg-neon text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-neon active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Iniciar Este Tour Ahora</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección B: Catálogo de Tutoriales Filtrados */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="font-bold uppercase tracking-wider">
                    Guías Disponibles ({filteredTutorials.length})
                  </span>
                  <span>Selecciona cualquiera para iniciar el recorrido guiado</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredTutorials.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-[#15161b] border border-[#2b2d35] hover:border-neon/60 transition-all flex flex-col justify-between gap-3.5 group shadow-sm hover:shadow-[0_0_20px_rgba(231,249,0,0.08)]"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border ${
                                item.badgeColor === 'neon'
                                  ? 'bg-neon/15 text-neon border-neon/30'
                                  : item.badgeColor === 'cyan'
                                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                                  : item.badgeColor === 'emerald'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : item.badgeColor === 'purple'
                                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                                  : 'bg-[#22242b] text-[var(--text-muted)] border-[#333642]'
                              }`}
                            >
                              {item.badge}
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-[#1c1d24] border border-[#2c2e39] flex items-center justify-center text-[var(--text-muted)] group-hover:text-neon group-hover:border-neon/40 transition-colors">
                              <IconComponent className="w-4 h-4" />
                            </div>
                          </div>

                          <h3 className="text-sm font-bold text-white group-hover:text-neon transition-colors flex items-center gap-1.5">
                            <span>{item.title}</span>
                          </h3>

                          <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#202127] flex items-center justify-between gap-2">
                          <span className="text-[10px] text-[var(--text-muted)] truncate">
                            Ruta: {item.routeContext}
                          </span>
                          <button
                            type="button"
                            onClick={() => launchTour(item.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#1e2027] hover:bg-neon hover:text-black text-[var(--text-main)] border border-[#333644] hover:border-neon text-xs font-bold font-mono transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                          >
                            <Play className="w-3 h-3" />
                            <span>Iniciar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sección C: Acceso Rápido a Pasos del Asistente (Paso 1 al 6) */}
              <div className="p-4 rounded-2xl bg-[#15161b] border border-[#282a33] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-neon" />
                    <span className="text-xs font-bold uppercase text-white">
                      Guías Directas por Paso del Wizard de Alta de Negocio
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Salta al paso y aprende cada detalle
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { num: 1, title: '1. Giro & IA', id: 'wizard_step_1' },
                    { num: 2, title: '2. Entidad & Web', id: 'wizard_step_2' },
                    { num: 3, title: '3. Tracking', id: 'wizard_step_3' },
                    { num: 4, title: '4. Agenda', id: 'wizard_step_4' },
                    { num: 5, title: '5. Pilares RAG', id: 'wizard_step_5' },
                    { num: 6, title: '6. Reglas & RLS', id: 'wizard_step_6' },
                  ].map((step) => (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => launchTour(step.id)}
                      className="p-2.5 rounded-xl bg-[#191a20] hover:bg-neon/15 border border-[#2b2d35] hover:border-neon text-left transition-all group active:scale-95"
                    >
                      <span className="block text-[10px] text-[var(--text-muted)] group-hover:text-neon font-bold uppercase">
                        Paso {step.num}
                      </span>
                      <span className="block text-xs font-bold text-white group-hover:text-neon truncate">
                        {step.title.split('. ')[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Informativo */}
            <div className="p-4 sm:px-6 border-t border-[#202126] bg-[#14151a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Tip: Puedes abrir este Centro de Guías en cualquier momento pulsando el botón{' '}
                  <strong className="text-neon">🎓 Tutor IA</strong> en la barra superior.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTutorModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#1c1d22] hover:bg-[#25272e] border border-[#2e303b] text-white text-xs font-bold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
