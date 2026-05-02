from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone
import os

Base = declarative_base()

_use_schema = 'sqlite' not in os.getenv('NOTIFICATION_DATABASE_URL', 'postgresql://')
_schema = 'notifications' if _use_schema else None


class Notificacion(Base):
    __tablename__ = 'notificaciones'
    __table_args__ = ({'schema': _schema} if _schema else {})

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    tipo = Column(String(50), nullable=False)   # reserva_creada, reserva_cancelada, etc.
    titulo = Column(String(200), nullable=False)
    mensaje = Column(Text, nullable=False)
    leida = Column(Boolean, default=False, nullable=False)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    # Campos de seguimiento de email
    email_enviado = Column(Boolean, default=False, nullable=False)
    email_error = Column(Text, nullable=True)
