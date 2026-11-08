'use client';

import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { driver } from 'driver.js';
import confetti from 'canvas-confetti';

export const OnboardingTour = () => {
  const { currentUser, role, isSuperAdmin, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const driverInstanceRef = useRef(null);

  // Helper to trigger confetti celebration upon completing tour
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c3f400', '#aa8bfb', '#80b8ff', '#ffffff'],
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  const startTour = (isManualRestart = false) => {
    if (typeof window === 'undefined') return;

    const userKey = currentUser?.id || currentUser?.email || role || 'user';
    const storageKey = `vector_tour_completed_${userKey}`;

    if (!isManualRestart && localStorage.getItem(storageKey) === 'true') {
      return;
    }

    // Determine role persona
    let steps = [];

    if (isSuperAdmin) {
      // 1. SUPER ADMIN: Edgar Lobo Vectorial / Dirección General
      steps = [
        {
          element: '#tour-brand-header',
          popover: {
            title: '⚡ Centro de Mando Maestro',
            description: 'Bienvenido, Edgar Lobo Vectorial. Como Super Admin tienes la dirección completa y supervisión global de todos los negocios, la agencia y la gobernanza del sistema.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-tenant-switcher',
          popover: {
            title: '🏢 Conmutador Multi-Tenant Universal',
            description: 'Supervisa y conéctate instantáneamente al espacio de cualquier cliente registrado, visualizando el estado operativo de su IA (Activa / Pausada) en tiempo real.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-overview',
          popover: {
            title: '📊 Pulso Operativo & Deck de Negocios',
            description: 'Monitorea las 4 cohortes vitales (Contactos, Contactabilidad, Leads Calificados y Ventas Ganadas), junto con el Kill-Switch de IA 1-Click.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-crm',
          popover: {
            title: '🎯 Suite Comercial & Re-contacto 24h',
            description: 'Kanban comercial de prospectos, valor proyectado del pipeline y motor autónomo de reactivación a las 24 horas para prospectos inactivos.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-inbox',
          popover: {
            title: '💬 Conversaciones & Triaje HITL',
            description: 'Bandeja omnicanal en vivo (WhatsApp, Meta). Supervisa la cuenta regresiva de SLA y activa el Takeover humano cuando se requiera.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-agenda',
          popover: {
            title: '📅 Master Agenda & Sincronización Móvil',
            description: 'Calendario centralizado de citas generadas por la IA, sincronización con Google Calendar y turnos semanales de atención.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-campaigns',
          popover: {
            title: '📢 Campañas & Copilot IA',
            description: 'Supervisión del gasto publicitario, ofertas activas y generación instantánea de creativos alineados al ADN de cada marca.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-results',
          popover: {
            title: '📈 Soberanía Financiera & ROAS Real',
            description: 'Conciliación transparente de inversión Meta/Google contra ventas reales ganadas en base de datos. Sin métricas infladas.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-connections',
          popover: {
            title: '🔌 Conexiones, Webhooks & RAG',
            description: 'Salud de Meta CAPI, Webhooks de WhatsApp, base vectorial de conocimiento y orquestación técnica.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-team',
          popover: {
            title: '🛡️ Consola de Equipo, Clientes & Auditoría',
            description: 'Gestión de Staff de la Agencia, entrega de accesos 1:1 a Dueños de Negocio y Registro Inmutable de Auditoría forense.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-notifications',
          popover: {
            title: '🔔 Centro de Notificaciones Cross-Tenant',
            description: 'Alertas inmediatas de todas las empresas. Un clic en una alerta te traslada automáticamente al negocio y chat correspondiente.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#tour-user-menu',
          popover: {
            title: '👤 Perfil Ejecutivo & Ajustes',
            description: 'Configura tus credenciales maestras, teléfono de escalación humana y repite este tour en cualquier momento desde tu menú.',
            side: 'bottom',
            align: 'end',
          },
        },
      ];
    } else if (isAdmin) {
      // 2. ADMIN: Administrador de Negocios / Staff Operativo
      steps = [
        {
          element: '#tour-brand-header',
          popover: {
            title: '🚀 Consola Operativa de Negocios',
            description: 'Bienvenido a tu consola operativa. Aquí administras y supervisas la cartera de empresas que tienes asignadas.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-tenant-switcher',
          popover: {
            title: '🏢 Tus Negocios Asignados',
            description: 'Alterna entre tus negocios autorizados. Tu entorno está estrictamente aislado para proteger la confidencialidad de cada empresa.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-overview',
          popover: {
            title: '📊 Centro de Mando & Supervisión',
            description: 'Control de captación en vivo, leads calificados y botón de pausa inmediata de IA (Kill-Switch) en caso de contingencia.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-crm',
          popover: {
            title: '🎯 CRM Comercial & Re-contacto 24h',
            description: 'Embudo de ventas con protocolo de calificación y motor de reactivación automática de prospectos fríos.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-inbox',
          popover: {
            title: '💬 Conversaciones & Intervención Humana',
            description: 'Atiende de inmediato los chats que la IA escala cuando un prospecto solicita hablar con un asesor o requiere atención especializada.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-agenda',
          popover: {
            title: '📅 Agenda & Citas Confirmadas',
            description: 'Revisa las citas agendadas por el asistente y sincronízalas con tu teléfono o Google Calendar.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-campaigns',
          popover: {
            title: '📢 Campañas & Ofertas de la Empresa',
            description: 'Revisa las ofertas comerciales y utiliza el Copilot IA para sugerir optimizaciones de copy y creativos.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-team',
          popover: {
            title: '🔑 Gestión de Accesos 1:1 a Clientes',
            description: 'Emite y despacha las credenciales provisionales al dueño del negocio por WhatsApp o Correo electrónico con un solo clic.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-user-menu',
          popover: {
            title: '👤 Tu Perfil & Teléfono de Guardia',
            description: 'Mantén actualizado tu número de WhatsApp para que el sistema te notifique cuando un lead calificado solicite llamada.',
            side: 'bottom',
            align: 'end',
          },
        },
      ];
    } else {
      // 3. CLIENT_OWNER: Dueño de Negocio (Entorno RLS Aislado)
      steps = [
        {
          element: '#tour-brand-header',
          popover: {
            title: '✨ Bienvenido al Portal de tu Negocio',
            description: 'Este es tu centro privado de operaciones. Tu entorno está 100% blindado y dedicado en exclusiva a los datos de tu empresa.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-overview',
          popover: {
            title: '📊 Centro de Mando en Tiempo Real',
            description: 'Consulta el estado de tu agente de IA (operando 24/7) y las métricas clave de captación de clientes de hoy.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-crm',
          popover: {
            title: '🎯 Prospectos & Clientes Potenciales',
            description: 'Revisa cada contacto que ha mostrado interés, su etapa en el embudo y el valor estimado de las oportunidades.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-inbox',
          popover: {
            title: '💬 Conversaciones en Vivo',
            description: 'Supervisa los chats que tu asistente de IA mantiene con los prospectos en WhatsApp e Instagram en tiempo real.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-agenda',
          popover: {
            title: '📅 Citas Agendadas & Calendario',
            description: 'Consulta tus citas confirmadas por la IA y sincronízalas en tu teléfono móvil con un solo escaneo QR.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-results',
          popover: {
            title: '📈 Resultados & Retorno de Inversión',
            description: 'Revisa de forma transparente el rendimiento de tu inversión publicitaria, tu ROAS real y descarga reportes mensuales.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-nav-profile',
          popover: {
            title: '🏢 Perfil de tu Empresa & ADN',
            description: 'Consulta la información de tu marca, catálogo y reglas comerciales que la IA utiliza para atender a tus clientes.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-user-menu',
          popover: {
            title: '🔒 Seguridad & Contraseña',
            description: 'Gestiona tu contraseña personal y seguridad de tu cuenta con total privacidad.',
            side: 'bottom',
            align: 'end',
          },
        },
      ];
    }

    // Filter out steps whose DOM element doesn't exist on screen
    const validSteps = steps.filter((step) => {
      if (!step.element) return true;
      const el = document.querySelector(step.element);
      return !!el;
    });

    if (validSteps.length === 0) return;

    // Instantiate driver.js with strict non-skippable config for first-time onboarding
    const driverObj = driver({
      animate: true,
      allowClose: false, // Mandatory: cannot be skipped or closed early
      overlayClickNext: false, // Cannot skip by clicking backdrop
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
  };

  useEffect(() => {
    // Slight delay so all header & sidebar DOM elements are fully mounted
    const timer = setTimeout(() => {
      startTour(false);
    }, 1200);

    const handleRestart = () => {
      startTour(true);
    };

    window.addEventListener('vector_restart_tour', handleRestart);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('vector_restart_tour', handleRestart);
      if (driverInstanceRef.current) {
        try {
          driverInstanceRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [currentUser?.id, role, pathname]);

  return null;
};

