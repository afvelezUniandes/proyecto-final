from sqlalchemy import Column, Integer, String, Boolean, Text, SmallInteger, TIMESTAMP, ForeignKey, Numeric
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Hotel(Base):
    __tablename__ = 'hoteles'
    __table_args__ = {'schema': 'catalog'}
    
    id = Column(Integer, primary_key=True)
    admin_id = Column(Integer)
    descripcion = Column(Text)
    estrellas = Column(SmallInteger)
    activo = Column(Boolean)
    fecha_creacion = Column(TIMESTAMP)
    nombre = Column(String(200))
    direccion = Column(String(300))
    ciudad = Column(String(100))
    pais = Column(String(50))
    image_url = Column(String(500))

class Habitacion(Base):
    __tablename__ = 'habitaciones'
    __table_args__ = {'schema': 'catalog'}
    
    id = Column(Integer, primary_key=True)
    hotel_id = Column(Integer, ForeignKey('catalog.hoteles.id'))
    capacidad = Column(SmallInteger)
    disponible = Column(Boolean)
    nombre = Column(String(100))
    tipo = Column(String(50))
    precio_noche = Column(Numeric(10,2))
    moneda = Column(String(3))
    imagen_url = Column(String(500))
