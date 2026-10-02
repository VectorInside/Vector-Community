'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquareWarning,
  Send,
  ShieldAlert,
  User,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileText,
  Clock,
  Sparkles,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TriageProtocol = () => {
  const { triggerModal } = useAuth();
  const [activeContact, setActiveContact] = useState('ana');
  const [inputMessage, setInputMessage] = useState('');
  const [isBotPaused, setIsBotPaused] = useState(false);

  // Chat threads state
  const [threads, setThreads] = useState({
    ana: {
      name: 'Ana Martínez',
      phone: '+52 55 1234 5678',
      channel: 'WhatsApp Business API',
      status: 'Cita Agendada',
      statusType: 'success',
      dictamen: '<b>Interés:</b> Implantes Dentales.<br><b>Objeción superada:</b> Pagos a meses sin intereses.<br><b>Estatus:</b> Cita confirmada en Google Calendar para el próximo martes a las 14:00 hrs.',
      messages: [
        {
          id: 1,
          sender: 'Ana Martínez',
          text: 'Hola, vi su anuncio en Instagram. ¿Tienen disponibilidad para la próxima semana?',
          isUser: true,
          time: '11:42 AM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Closer (IA)',
          text: '¡Hola Ana! Claro que sí. Tenemos espacio el próximo martes a las 14:00 hrs. ¿Te agendamos?',
          isBot: true,
          time: '11:43 AM',
        },
      ],
    },
    roberto: {
      name: 'Roberto Sánchez',
      phone: 'DM Instagram / WhatsApp',
      channel: 'ALERTA HITL: Malas palabras detectadas',
      status: 'Riesgo / Insulto',
      statusType: 'danger',
      dictamen: '<b>Alerta:</b> Lenguaje agresivo y descontento.<br><b>Causa:</b> Retraso en confirmación de pedido.<br><b>Acción:</b> El Lobo Vectorial pausó el bot para evitar respuestas inapropiadas.',
      messages: [
        {
          id: 1,
          sender: 'Roberto Sánchez',
          text: '¡Su servicio es pésimo, devuélvanme mi dinero!',
          isUser: true,
          isDanger: true,
          time: '12:15 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Moderador (IA)',
          text: '[PAUSADO] Intención de riesgo alto. Chat derivado al operador de la agencia.',
          isWarning: true,
          time: '12:15 PM',
        },
      ],
    },
    rodrigo: {
      name: 'Lic. Rodrigo Elizondo (B2B)',
      phone: '+52 55 4120 7890',
      channel: 'LinkedIn B2B Ads / WhatsApp',
      status: 'Lead BANT Calificado ($50k USD)',
      statusType: 'b2b',
      dictamen: '<b>Empresa:</b> Logística Global Monterrey S.A. (180 colaboradores).<br><b>BANT Scoring:</b> 97/100 (Presupuesto $50k USD asignado, decisión inmediata).<br><b>Destino:</b> HubSpot CRM Enterprise.<br><b>Estatus:</b> Discovery Call confirmada vía Zoom para el próximo miércoles a las 10:00 hrs.',
      messages: [
        {
          id: 1,
          sender: 'Rodrigo Elizondo',
          text: 'Buenas tardes, vimos su infraestructura de IA para gestión comunitaria y queremos integrarla en 4 subsidiarias.',
          isUser: true,
          time: '12:30 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot SDR B2B (IA)',
          text: '¡Mucho gusto Lic. Rodrigo! Con gusto. Para asignar al especialista adecuado, ¿tienen un presupuesto estimado asignado para este despliegue?',
          isBot: true,
          time: '12:31 PM',
        },
        {
          id: 3,
          sender: 'Rodrigo Elizondo',
          text: 'Sí, tenemos $50,000 USD aprobados para Q4 y buscamos arrancar de inmediato.',
          isUser: true,
          time: '12:32 PM',
        },
        {
          id: 4,
          sender: 'Sub-Bot Closer (IA)',
          text: 'Excelente. Cuentan con calificación prioritaria BANT. He reservado la Discovery Call con el Director de Soluciones el próximo miércoles a las 10:00 hrs vía Zoom.',
          isBot: true,
          time: '12:33 PM',
        }
      ],
    },
    mariana: {
      name: 'Mariana Valenzuela (Sony PR)',
      phone: 'Instagram DM @sonymexico_pr',
      channel: 'Instagram Direct Graph API',
      status: 'Oferta Patrocinio ($3,500 USD)',
      statusType: 'creator',
      dictamen: '<b>Marca:</b> Sony Electronics México.<br><b>Entregables:</b> 1 Reel Dedicado + 3 Stories.<br><b>Presupuesto:</b> $3,500 USD (Aprobado).<br><b>Estatus:</b> Media Kit entregado por IA. Pendiente de aprobación 1-clic de la agencia para enviar contrato y fechas.',
      messages: [
        {
          id: 1,
          sender: 'Mariana Valenzuela',
          text: 'Hola Alex! Somos de la agencia de PR de Sony. Nos encantó tu último Reel de tecnología y queremos pautar una integración para los nuevos audífonos.',
          isUser: true,
          time: '01:10 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Deal Hunter (IA)',
          text: '¡Hola Mariana! Gracias por contactar al equipo de Alex Rivera. ¿Cuál es el presupuesto asignado y los entregables requeridos?',
          isBot: true,
          time: '01:11 PM',
        },
        {
          id: 3,
          sender: 'Mariana Valenzuela',
          text: 'Presupuestamos $3,500 USD para 1 Reel dedicado y 3 Stories con link de afiliado para finales de este mes.',
          isUser: true,
          time: '01:12 PM',
        },
        {
          id: 4,
          sender: 'Sub-Bot Deal Hunter (IA)',
          text: 'Excelente. El presupuesto cumple con las tarifas oficiales. He transferido la propuesta a la Agencia Vector para confirmación y firma.',
          isBot: true,
          time: '01:13 PM',
        }
      ],
    },
    sofia_story: {
      name: 'Sofía Valdés (@sofia.valdes)',
      phone: 'Instagram Story Mention #419',
      channel: 'Instagram Story Mention Engine',
      status: 'Mención en Story Agradecida (Cupón 10%)',
      statusType: 'success',
      dictamen: '<b>Tipo de Interacción:</b> Mención en Story de Instagram (6.8k seguidores).<br><b>Acción Automática:</b> El bot detectó la etiqueta de la marca en la Story, respondió al DM en 8 segundos con un agradecimiento personalizado y entregó un cupón VIP de 10% de descuento.',
      messages: [
        {
          id: 1,
          sender: 'Instagram Story Engine',
          text: '📸 @sofia.valdes te mencionó en su Story: "Amando mi tratamiento en @odontologiaintegral ✨🦷"',
          isUser: true,
          time: '02:15 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Story Nurture (IA)',
          text: '¡Hola Sofía! Muchísimas gracias por compartir tu experiencia en tus Stories. Nos alegra mucho verte feliz con tu sonrisa. 💖 Como agradecimiento, aquí tienes un cupón del 10% en tu próxima sesión: SOFIA-VIP10.',
          isBot: true,
          time: '02:15 PM',
        },
        {
          id: 3,
          sender: 'Sofía Valdés',
          text: '¡Ay qué lindos! Muchísimas gracias, se lo voy a pasar a mi hermana que también necesita cita 😍',
          isUser: true,
          time: '02:18 PM',
        }
      ],
    },
  });

  const currentChat = threads[activeContact];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'Operador Humano',
      text: inputMessage,
      isHumanOperator: true,
      time: 'Justo ahora',
    };

    setThreads((prev) => ({
      ...prev,
      [activeContact]: {
        ...prev[activeContact],
        messages: [...prev[activeContact].messages, newMsg],
      },
    }));

    setInputMessage('');
    triggerModal(
      'Mensaje Enviado',
      `El mensaje ha sido despachado vía WhatsApp Business Cloud API hacia <strong>${currentChat.name}</strong>.`
    );
  };

  const handleAssumeControl = () => {
    setIsBotPaused(true);
    triggerModal(
      'Soberanía Humana',
      'Has tomado el control manual de este chat. El Lobo Vectorial pausó el bot automático para que intervengas directamente.',
      () => {
        try {
          confetti({ particleCount: 30, spread: 50, colors: ['#E5FF00', '#10B981'] });
        } catch (e) {}
      },
      'Entendido'
    );
  };

  const handleShowDictamen = () => {
    triggerModal(
      `Dictamen Pre-Cita: ${currentChat.name}`,
      currentChat.dictamen,
      null,
      'Cerrar Dictamen'
    );
  };

  return (
    <div className="p-8 block animate-fade-in">
      <header className="mb-6 border-b border-[var(--border-color)] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
          Protocolo de <span className="text-neon">Triage & HITL</span>
        </h2>
        <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
          Supervisión en tiempo real. La IA filtra spam y bloquea insultos, cediendo el cierre al humano.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Chat List */}
        <div className="vector-bg-card vector-border rounded-lg p-4 flex flex-col h-[560px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center justify-between">
            <span>Conversaciones Activas</span>
            <span className="text-[9px] font-mono bg-neon text-black px-1.5 py-0.5 rounded font-bold">
              5 EN COLA
            </span>
          </h3>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {/* Contact: Sofia Story Mention */}
            <div
              onClick={() => setActiveContact('sofia_story')}
              className={`p-3 rounded cursor-pointer transition-all ${
                activeContact === 'sofia_story'
                  ? 'bg-[var(--bg-panel)] border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-[var(--bg-panel)] vector-border hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[var(--text-main)]">
                  Sofía Valdés
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  📸 Story Mention
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate">
                📸 @sofia.valdes te mencionó en su Story...
              </p>
            </div>

            {/* Contact: Mariana Creator */}
            <div
              onClick={() => setActiveContact('mariana')}
              className={`p-3 rounded cursor-pointer transition-all ${
                activeContact === 'mariana'
                  ? 'bg-[var(--bg-panel)] border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                  : 'bg-[var(--bg-panel)] vector-border hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[var(--text-main)]">
                  Mariana (Sony PR)
                </span>
                <span className="text-[9px] font-mono text-pink-400 font-bold flex items-center gap-1">
                  🎬 Brand Deal $3.5k
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate">
                Hola Alex! Nos encantó tu último Reel de tecnología...
              </p>
            </div>

            {/* Contact: Rodrigo B2B */}
            <div
              onClick={() => setActiveContact('rodrigo')}
              className={`p-3 rounded cursor-pointer transition-all ${
                activeContact === 'rodrigo'
                  ? 'bg-[var(--bg-panel)] border border-neon shadow-[0_0_10px_var(--neon-glow)]'
                  : 'bg-[var(--bg-panel)] vector-border hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[var(--text-main)]">
                  Lic. Rodrigo Elizondo
                </span>
                <span className="text-[9px] font-mono text-neon font-bold flex items-center gap-1">
                  💼 B2B High-Ticket
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate">
                Buenas tardes, vimos su infraestructura de IA para...
              </p>
            </div>

            {/* Contact: Ana */}
            <div
              onClick={() => setActiveContact('ana')}
              className={`p-3 rounded cursor-pointer transition-all ${
                activeContact === 'ana'
                  ? 'bg-[var(--bg-panel)] border border-neon shadow-[0_0_10px_var(--neon-glow)]'
                  : 'bg-[var(--bg-panel)] vector-border hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[var(--text-main)]">
                  Ana Martínez
                </span>
                <span className="text-[9px] font-mono text-[var(--success)] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Cita Agendada
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate">
                Hola, vi su anuncio en Instagram. ¿Tienen disponibilidad...
              </p>
            </div>

            {/* Contact: Roberto */}
            <div
              onClick={() => setActiveContact('roberto')}
              className={`p-3 rounded cursor-pointer transition-all ${
                activeContact === 'roberto'
                  ? 'bg-[var(--bg-panel)] border border-neon shadow-[0_0_10px_var(--neon-glow)]'
                  : 'bg-[var(--bg-panel)] vector-border hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[var(--text-main)]">
                  Roberto Sánchez
                </span>
                <span className="text-[9px] font-mono text-[var(--danger)] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Riesgo / Insulto
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate">
                ¡Su servicio es pésimo, devuélvanme mi dinero!
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Viewer */}
        <div className="lg:col-span-2 vector-bg-card vector-border rounded-lg p-6 flex flex-col h-[560px]">
          {/* Chat Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-[var(--border-color)] mb-4 gap-2">
            <div>
              <h4 className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <span>{currentChat.name}</span>
                {isBotPaused && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger)]">
                    BOT PAUSADO (CONTROL MANUAL)
                  </span>
                )}
              </h4>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">
                {currentChat.phone} • {currentChat.channel}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleShowDictamen}
                className="text-[10px] bg-[var(--bg-base)] border border-[var(--border-color)] px-3 py-1.5 rounded hover:border-neon text-[var(--text-main)] transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-neon" />
                <span>Ver Dictamen IA</span>
              </button>

              <button
                type="button"
                onClick={handleAssumeControl}
                className="text-[10px] bg-[var(--danger)] text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors font-bold shadow-sm"
              >
                Asumir Control
              </button>
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-[var(--bg-base)] border border-[var(--border-color)] rounded mb-4 text-xs">
            {currentChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg max-w-[80%] leading-relaxed ${
                  msg.isUser
                    ? msg.isDanger
                      ? 'bg-[var(--danger-bg)] border border-[var(--danger)]/50 text-white'
                      : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]'
                    : msg.isBot
                    ? 'bg-[var(--success-bg)] border border-[var(--success)]/30 text-white ml-auto text-right'
                    : msg.isWarning
                    ? 'bg-[var(--bg-panel)] border border-[var(--warning)] text-white ml-auto text-right'
                    : 'bg-neon/15 border border-neon text-[var(--text-main)] ml-auto text-right'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span
                    className={`text-[9px] font-mono uppercase ${
                      msg.isUser
                        ? msg.isDanger
                          ? 'text-[var(--danger)] font-bold'
                          : 'text-[var(--text-muted)]'
                        : msg.isBot
                        ? 'text-[var(--success)] font-bold'
                        : msg.isWarning
                        ? 'text-[var(--warning)] font-bold'
                        : 'text-neon font-bold'
                    }`}
                  >
                    {msg.sender}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">
                    {msg.time}
                  </span>
                </div>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Response Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe un mensaje como operador de la agencia o dueño..."
              className="flex-1 bg-[var(--bg-base)] border border-[var(--border-color)] text-xs text-[var(--text-main)] rounded px-3.5 py-2.5 outline-none focus:border-neon font-sans"
            />
            <button
              type="submit"
              className="bg-neon text-black text-xs font-bold px-4 py-2.5 rounded hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_10px_var(--neon-glow)] flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
