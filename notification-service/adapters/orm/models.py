from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone

Base = declarative_base()


class Notificacion(Base):
    __tablename__ = 'notificaciones'
    __table_args__ = {'schema': 'notifications'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    tipo = Column(String(50), nullable=False)   # reserva_creada, reserva_cancelada, etc.
    titulo = Column(String(200), nullable=False)
    mensaje = Column(Text, nullable=False)
    leida = Column(Boolean, default=False, nullable=False)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))
