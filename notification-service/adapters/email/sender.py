import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Content

SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')
SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@travelhub.com')

logger = logging.getLogger(__name__)

TRAVELHUB_LOGO = "https://travelhub-images-proyecto.s3.amazonaws.com/logo.png"

_RESERVATION_CREATED_TEMPLATE = """
<html>
<body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:0;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
        <!-- Header -->
        <tr>
          <td style="background:#1e40af;padding:28px 32px;text-align:center;">
            <span style="font-size:28px;font-weight:bold;color:#fff;letter-spacing:1px;">✈ TravelHub</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h2 style="color:#1e40af;margin-top:0;">¡Reserva Confirmada!</h2>
            <p style="color:#374151;">Hola, tu reserva ha sido creada exitosamente. Aquí están los detalles:</p>
            <table width="100%" cellpadding="8" cellspacing="0"
                   style="background:#eff6ff;border-radius:8px;margin:20px 0;">
              <tr>
                <td style="color:#6b7280;width:45%;">Código de reserva</td>
                <td style="font-weight:bold;color:#1e40af;font-size:18px;">{codigo}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Hotel</td>
                <td style="color:#111827;">{nombre_hotel}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Tipo de habitación</td>
                <td style="color:#111827;">{tipo_habitacion}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Check-in</td>
                <td style="color:#111827;">{fecha_checkin}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Check-out</td>
                <td style="color:#111827;">{fecha_checkout}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Huéspedes</td>
                <td style="color:#111827;">{num_huespedes}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Monto total</td>
                <td style="font-weight:bold;color:#059669;">{monto_total} {moneda}</td>
              </tr>
            </table>
            <p style="color:#6b7280;font-size:13px;">
              Guarda este correo como comprobante de tu reserva.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:18px 32px;text-align:center;color:#9ca3af;font-size:12px;">
            © 2026 TravelHub · Este es un mensaje automático, no respondas a este correo.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""

_RESERVATION_CANCELLED_TEMPLATE = """
<html>
<body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:0;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
        <!-- Header -->
        <tr>
          <td style="background:#1e40af;padding:28px 32px;text-align:center;">
            <span style="font-size:28px;font-weight:bold;color:#fff;letter-spacing:1px;">✈ TravelHub</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h2 style="color:#dc2626;margin-top:0;">Reserva Cancelada</h2>
            <p style="color:#374151;">Tu reserva ha sido cancelada. Aquí están los detalles de la cancelación:</p>
            <table width="100%" cellpadding="8" cellspacing="0"
                   style="background:#fff5f5;border-radius:8px;margin:20px 0;border:1px solid #fecaca;">
              <tr>
                <td style="color:#6b7280;width:45%;">Código de reserva</td>
                <td style="font-weight:bold;color:#dc2626;font-size:18px;">{codigo}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Hotel</td>
                <td style="color:#111827;">{nombre_hotel}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Tipo de habitación</td>
                <td style="color:#111827;">{tipo_habitacion}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Check-in</td>
                <td style="color:#111827;">{fecha_checkin}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Check-out</td>
                <td style="color:#111827;">{fecha_checkout}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;">Monto total</td>
                <td style="color:#111827;">{monto_total} {moneda}</td>
              </tr>
            </table>
            <p style="color:#6b7280;font-size:13px;">
              Si tienes dudas sobre esta cancelación, contacta a soporte.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:18px 32px;text-align:center;color:#9ca3af;font-size:12px;">
            © 2026 TravelHub · Este es un mensaje automático, no respondas a este correo.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""


def _send(to_email: str, subject: str, html_body: str) -> tuple[bool, str | None]:
    """
    Envía un correo via SendGrid.
    Retorna (True, None) si fue exitoso, (False, mensaje_error) si falló.
    """
    if not SENDGRID_API_KEY:
        logger.warning("SENDGRID_API_KEY no configurada — email no enviado")
        return False, "SENDGRID_API_KEY no configurada"
    try:
        message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            html_content=Content("text/html", html_body),
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        if response.status_code in (200, 202):
            logger.info("Email enviado a %s (status %s)", to_email, response.status_code)
            return True, None
        else:
            err = f"SendGrid status {response.status_code}"
            logger.warning("Email no enviado a %s: %s", to_email, err)
            return False, err
    except Exception as exc:
        logger.exception("Error enviando email a %s", to_email)
        return False, str(exc)


def send_reservation_created(
    to_email: str,
    codigo: str,
    nombre_hotel: str,
    tipo_habitacion: str,
    fecha_checkin: str,
    fecha_checkout: str,
    num_huespedes: int,
    monto_total: str,
    moneda: str = "COP",
) -> tuple[bool, str | None]:
    html = _RESERVATION_CREATED_TEMPLATE.format(
        codigo=codigo,
        nombre_hotel=nombre_hotel,
        tipo_habitacion=tipo_habitacion,
        fecha_checkin=fecha_checkin,
        fecha_checkout=fecha_checkout,
        num_huespedes=num_huespedes,
        monto_total=monto_total,
        moneda=moneda,
    )
    return _send(to_email, f"✅ Reserva confirmada — {codigo} | TravelHub", html)


def send_reservation_cancelled(
    to_email: str,
    codigo: str,
    nombre_hotel: str,
    tipo_habitacion: str,
    fecha_checkin: str,
    fecha_checkout: str,
    monto_total: str,
    moneda: str = "COP",
) -> tuple[bool, str | None]:
    html = _RESERVATION_CANCELLED_TEMPLATE.format(
        codigo=codigo,
        nombre_hotel=nombre_hotel,
        tipo_habitacion=tipo_habitacion,
        fecha_checkin=fecha_checkin,
        fecha_checkout=fecha_checkout,
        monto_total=monto_total,
        moneda=moneda,
    )
    return _send(to_email, f"❌ Reserva cancelada — {codigo} | TravelHub", html)


_WELCOME_TEMPLATE = """
<html>
<body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:0;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
        <!-- Header -->
        <tr>
          <td style="background:#1e40af;padding:28px 32px;text-align:center;">
            <span style="font-size:28px;font-weight:bold;color:#fff;letter-spacing:1px;">✈ TravelHub</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h2 style="color:#1e40af;margin-top:0;">¡Bienvenido a TravelHub, {nombre}!</h2>
            <p style="color:#374151;">Tu cuenta ha sido creada exitosamente. Ya puedes buscar y reservar hospedajes en todo el mundo.</p>
            <div style="background:#eff6ff;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
              <p style="color:#1e40af;font-weight:bold;font-size:16px;margin:0;">Tu correo registrado</p>
              <p style="color:#111827;font-size:18px;margin:8px 0 0;">{email}</p>
            </div>
            <p style="color:#374151;">Explora destinos, compara precios y reserva tu próxima estadía con total seguridad.</p>
            <p style="color:#6b7280;font-size:13px;margin-top:24px;">
              Si no creaste esta cuenta, ignora este mensaje o contáctanos a soporte.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:18px 32px;text-align:center;color:#9ca3af;font-size:12px;">
            © 2026 TravelHub · Este es un mensaje automático, no respondas a este correo.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""


def send_welcome_email(
    to_email: str,
    nombre: str,
) -> tuple[bool, str | None]:
    html = _WELCOME_TEMPLATE.format(nombre=nombre, email=to_email)
    return _send(to_email, "¡Bienvenido a TravelHub! Tu cuenta ha sido creada", html)
