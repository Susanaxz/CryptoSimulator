# from datetime import date
import sqlite3
from config import DEFAULT_PAG, PAG_SIZE

class DBManager:
    def __init__(self, ruta):
        self.ruta = ruta
        
    def consultaSQL(self, consulta, pag=DEFAULT_PAG, nreg=PAG_SIZE):
        conexion = sqlite3.connect(self.ruta)
        offset = nreg*(pag - 1) # calculamos el offset para la página que se pide
        consulta_limit_offset = f'{consulta} LIMIT {nreg} OFFSET {offset}' # devuelve los registros de la página que se pide
        
        cursor = conexion.cursor()
        
        cursor.execute(consulta) # ejecutamos la consulta sin limit ni offset
        
        total_transacciones = len(cursor.fetchall()) # obtiene el número total de transacciones
        cursor.execute(consulta_limit_offset) # ejecutamos la consulta con limit y offset
                
        datos = cursor.fetchall() #
        
        self.transacciones = []
        nombres_columna = []
        for columna in cursor.description:
            nombres_columna.append(columna[0])
        
        for dato in datos: 
            self.transacciones.append(dict(zip(nombres_columna, dato))) # zip une las dos listas en un diccionario
        
        conexion.close()
        
        
        num_pages = (total_transacciones + nreg - 1) // nreg #
        
        return self.transacciones, num_pages