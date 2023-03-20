# from datetime import date
import sqlite3
from config import DEFAULT_PAG, PAG_SIZE

class DBManager:
    def __init__(self, ruta):
        self.ruta = ruta
        
    def consultaSQL(self, consulta, pag=DEFAULT_PAG, nreg=PAG_SIZE):
        conexion = sqlite3.connect(self.ruta)
        offset = nreg*(pag - 1)
        consulta = f'{consulta} LIMIT {nreg} OFFSET {offset}'
        
        cursor = conexion.cursor()
        
        cursor.execute(consulta)
        
        datos = cursor.fetchall()
        
        self.transacciones = []
        nombres_columna = []
        for columna in cursor.description:
            nombres_columna.append(columna[0])
        
        for dato in datos: 
            self.transacciones.append(dict(zip(nombres_columna, dato))) # zip une las dos listas en un diccionario
        
        conexion.close()
        
        return self.transacciones