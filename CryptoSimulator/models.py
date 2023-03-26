
# from datetime import date
import sqlite3
import requests
from CryptoSimulator import app
from config import DEFAULT_PAG, PAG_SIZE, COINS, APIKEY


url = 'https://rest.coinapi.io/v1/exchangerate/'
headers = {'X-CoinAPI-Key' : APIKEY}

class APIError(Exception): # Creo una clase para manejar los errores
    pass


# conexion a la API de CoinAPI
class Cripto:
    def __init__(self, from_currency, from_quantity, to_currency):
        self.monedas = COINS
        self.from_currency = from_currency
        self.from_quantity = from_quantity
        self.to_currency = to_currency
        self.to_quantity = 0.0
        self.rate = 0.0
        
    def consultar_cambio(self):
        url_cambio = f'{url}{self.from_currency}/{self.to_currency}'
        response = requests.get(url_cambio, headers=headers)
        
        if response.status_code == 200:
            exchange = response.json()
            self.rate = 1 / exchange.get('rate') # devuelve el valor de la tasa de cambio
        
        else:
            raise APIError(f'Error al consultar la API, status code: {response.status_code}, por el motivo {response.reason}')
        
    def calcular_cambio(self):
        self.to_quantity = self.from_quantity / self.rate
        return self.from_quantity
        
    
        
        
class DBManager:
    def __init__(self, ruta):
        self.ruta = ruta
        
    def consultaSQL(self, consulta, pag=DEFAULT_PAG, nreg=PAG_SIZE):
        conexion = sqlite3.connect(self.ruta)
        offset = nreg*(pag - 1) # calculamos el offset para la página que se pide
        consulta_total = f'SELECT COUNT(*) FROM ({consulta})'
        consulta_limit_offset = f'{consulta} LIMIT {nreg} OFFSET {offset}' # devuelve los registros de la página que se pide
        
        cursor = conexion.cursor()
        
        cursor.execute(consulta_total) # ejecutamos la consulta sin limit ni offset
        
        total_transacciones = cursor.fetchone()[0] # obtiene el número total de transacciones
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
    
    def añadir_transaccion(self, from_currency, from_quantity, to_currency, to_quantity, rate, date, time):
        conexion = sqlite3.connect(self.ruta)
        cursor = conexion.cursor()
        consulta = f'INSERT INTO transactions (date, time, from_currency, from_quantity, to_currency, to_quantity, rate) VALUES ("{date}", "{time}", "{from_currency}", {from_quantity}, "{to_currency}", {to_quantity}, {rate})'
        cursor.execute(consulta)
        conexion.commit()
        conexion.close()