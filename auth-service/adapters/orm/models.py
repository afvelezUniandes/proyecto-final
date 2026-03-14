import enum
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, Enum
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class RolEnum(enum.Enum):
    USER = "user"
    HOTEL = "hotel"
    ADMIN = "admin"

class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True)
    activo = Column(Boolean)
    fecha_registro = Column(TIMESTAMP)
    nombre = Column(String(100))
    email = Column(String(150), unique=True)
    password_hash = Column(String(255))
    telefono = Column(String(20))
    pais = Column(String(50))
    idioma_preferido = Column(String(5))
    rol = Column(Enum(RolEnum), nullable=False, default=RolEnum.USER)

class AdminHotel(Base):
    __tablename__ = 'admin_hotel'
    id = Column(Integer, primary_key=True)
    activo = Column(Boolean)
    fecha_registro = Column(TIMESTAMP)
    nombre = Column(String(100))
    email = Column(String(150), unique=True)
    password_hash = Column(String(255))
    telefono = Column(String(20))
