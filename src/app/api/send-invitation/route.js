import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Vector Inside <onboarding@resend.dev>';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, roleLabel, assignedSummary, tempPassword, loginUrl } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'El correo del destinatario es obligatorio.' },
        { status: 400 }
      );
    }

    const fallbackLogin = loginUrl || 'https://vector-community.vercel.app/login';
    const cleanRole = roleLabel || 'Colaborador Autorizado';
    const cleanAssigned = assignedSummary || 'Todos los Negocios';
    const cleanPassword = tempPassword || 'Vec#Auth2026!';

    const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Invitación Oficial - Vector Inside OS</title>
  <style>
    body { margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff; }
    .container { max-width: 580px; margin: 40px auto; background-color: #0c0d0e; border: 1px solid #27272a; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    .header { padding: 36px 36px 20px 36px; border-bottom: 1px solid #1f2023; text-align: left; }
    .logo-badge { display: inline-block; background-color: #E7F900; color: #000000; font-weight: 900; font-size: 13px; letter-spacing: 1px; padding: 5px 12px; border-radius: 8px; margin-bottom: 16px; }
    .title { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0; }
    .subtitle { font-size: 13px; color: #a1a1aa; margin: 0; }
    .content { padding: 32px 36px; line-height: 1.6; }
    .greeting { font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 14px; }
    .intro { font-size: 14px; color: #d4d4d8; margin-bottom: 24px; }
    .credentials-box { background-color: #121316; border: 1px solid #27272a; border-radius: 14px; padding: 20px; margin-bottom: 28px; }
    .cred-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1f2023; font-size: 13px; }
    .cred-row:last-child { border-bottom: none; }
    .cred-label { color: #71717a; font-family: monospace; }
    .cred-val { color: #E7F900; font-weight: 700; font-family: monospace; }
    .cta-container { text-align: center; margin: 32px 0 20px 0; }
    .cta-button { display: inline-block; background-color: #E7F900; color: #000000 !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 0 20px rgba(231,249,0,0.3); }
    .security-notice { background-color: rgba(231,249,0,0.05); border: 1px solid rgba(231,249,0,0.2); border-radius: 12px; padding: 14px; font-size: 12px; color: #d4d4d8; margin-top: 24px; }
    .footer { padding: 24px 36px; border-top: 1px solid #1f2023; font-size: 11px; color: #71717a; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">VECTOR INSIDE // OS</div>
      <h1 class="title">Acceso Oficial Autorizado</h1>
      <p class="subtitle">Despacho de Credenciales Corporativas</p>
    </div>
    <div class="content">
      <div class="greeting">Hola, ${name || 'Colaborador'}:</div>
      <p class="intro">
        Has sido dado de alta en la plataforma de <strong>Vector Inside OS</strong>. Tu cuenta se encuentra configurada y lista para iniciar operaciones.
      </p>

      <div class="credentials-box">
        <div class="cred-row">
          <span class="cred-label">Rol Asignado:</span>
          <span class="cred-val">${cleanRole}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Alcance Negocios:</span>
          <span class="cred-val" style="color: #ffffff;">${cleanAssigned}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Usuario / Correo:</span>
          <span class="cred-val" style="color: #38bdf8;">${email}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Contraseña Temporal:</span>
          <span class="cred-val">${cleanPassword}</span>
        </div>
      </div>

      <div class="cta-container">
        <a href="${fallbackLogin}" class="cta-button" target="_blank">INGRESAR AL SISTEMA OPERATIVO &rarr;</a>
      </div>

      <div class="security-notice">
        <strong>⚠️ Protocolo de Seguridad Criptográfica:</strong> Por política corporativa, al ingresar a tu cuenta por primera vez se te solicitará definir tu contraseña personal definitiva. Ningún otro miembro del equipo conocerá tu nueva clave.
      </div>
    </div>
    <div class="footer">
      &copy; 2026 Vector Inside Inc. Plataforma de Operaciones Autónomas.<br>
      Si no esperabas este correo, por favor comunícalo al área de TI.
    </div>
  </div>
</body>
</html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [email],
        subject: `Invitación oficial: Acceso a Vector Inside OS (${cleanRole})`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      // Manejar error específico de sandbox (solo permite enviar al correo del dueño hasta verificar dominio)
      if (resendResponse.status === 403 && resendData.message?.includes('testing emails')) {
        return NextResponse.json({
          success: false,
          code: 'RESEND_SANDBOX_RESTRICTION',
          message: 'Modo Sandbox de Resend activo: Por seguridad, Resend sólo entrega correos directos a la cuenta registrada (edgar.gonzalez@syborx.com) hasta verificar el dominio corporativo en resend.com/domains.',
          details: resendData.message,
        }, { status: 403 });
      }

      return NextResponse.json({
        success: false,
        message: resendData.message || 'Error al despachar el correo con Resend.',
        details: resendData,
      }, { status: resendResponse.status });
    }

    return NextResponse.json({
      success: true,
      messageId: resendData.id,
      recipient: email,
      message: `Correo despachado con éxito a ${email} (ID de entrega: ${resendData.id})`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Error interno al procesar el despacho de correo.',
    }, { status: 500 });
  }
}

