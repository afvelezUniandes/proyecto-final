from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, Date, SmallInteger, Numeric, ForeignKey, text
from sqlalchemy.ext.declarative import declarative_base
import os

Base = declarative_base()

# SQLite (usado en tests) no soporta schemas
_use_schema = 'sqlite' not in os.getenv('RESERVATION_DATABASE_URL', 'postgresql://')
_schema = 'reservation' if _use_schema else None


class Reserva(Base):
    __tablename__ = 'reservas'
    __table_args__ = ({'schema': _schema} if _schema else {})

    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, nullable=False)          # ref a auth.usuarios.id (cross-schema)
    habitacion_id = Column(Integer, nullable=False)       # ref a catalog.habitaciones.id
    hotel_id = Column(Integer, nullable=False)            # ref a catalog.hoteles.id
    fecha_checkin = Column(Date, nullable=False)
    fecha_checkout = Column(Date, nullable=False)
    num_huespedes = Column(SmallInteger, nullable=False, default=1)
    fecha_creacion = Column(TIMESTAMP, server_default=text('NOW()'))
    fecha_cancelacion = Column(TIMESTAMP, nullable=True)
    codigo = Column(String(20), unique=True, nullable=False)
    monto_total = Column(Numeric(10, 2), nullable=False)
    moneda = Column(String(3), default='COP')
    estado = Column(String(20), default='confirmada')     # confirmada | cancelada | completada


class Pago(Base):
    __tablename__ = 'pagos'
    __table_args__ = ({'schema': _schema} if _schema else {})

    id = Column(Integer, primary_key=True)
    reserva_id = Column(Integer, ForeignKey(f'{_schema}.reservas.id' if _schema else 'reservas.id'), nullable=False)
    fecha_pago = Column(TIMESTAMP, server_default=text('NOW()'))
    monto = Column(Numeric(10, 2), nullable=False)
    metodo_pago = Column(String(50), default='tarjeta')
    estado = Column(String(20), default='completado')
