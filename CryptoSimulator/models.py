
from datetime import datetime
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
        
    def realizar_venta(self, from_currency, from_quantity, to_currency, rate):
        conexion = sqlite3.connect(self.ruta)
        cursor = conexion.cursor()
        
        try:
            cripto = Cripto(from_currency, from_quantity, to_currency)
            cripto.consultar_cambio()
            to_quantity = cripto.calcular_cambio(rate)
            
            
            date = datetime.now().strftime('%Y-%m-%d')
            time = datetime.now().strftime('%H:%M:%S')
            
            self.añadir_transaccion(from_currency, from_quantity, to_currency, to_quantity, rate, date, time)
            
            self.actualizar_cartera(from_currency, -from_quantity)
            self.actualizar_cartera(to_currency, to_quantity)
            
            conexion.commit()
            
            return "success"
        
        except Exception as error:
            print(f"Error al realizar la venta: {error}")
            conexion.rollback()
            return "error"
        
        finally:
            conexion.close()
        
    
    # Calcula el saldo de euros invertidos. Diferencia entre el total invertido y el total recuperado
    def obtener_saldo_euros_invertidos(self):
        conexion = sqlite3.connect(self.ruta)
        cursor = conexion.cursor()

        consulta_total_recuperado = 'SELECT SUM(to_quantity) as total_recuperado FROM transactions WHERE to_currency = "EUR"'
        cursor.execute(consulta_total_recuperado)
        total_recuperado = cursor.fetchone()[0]

        consulta_total_invertido = 'SELECT SUM(from_quantity) as total_invertido FROM transactions WHERE from_currency = "EUR"'
        cursor.execute(consulta_total_invertido)
        total_invertido = cursor.fetchone()[0]

        saldo_euros_invertidos = total_invertido - total_recuperado
        conexion.close()
        print("Total recuperado:", total_recuperado)
        print("Total invertido:", total_invertido)
        print("Saldo euros invertidos:", saldo_euros_invertidos)

        return saldo_euros_invertidos
    
    def obtener_total_invertido_euros(self):
        conexion = sqlite3.connect(self.ruta)
        cursor = conexion.cursor()

        consulta_total_invertido = 'SELECT SUM(from_quantity) as total_invertido FROM transactions WHERE from_currency = "EUR"'
        cursor.execute(consulta_total_invertido)
        total_invertido = cursor.fetchone()[0]
        conexion.close()
        return total_invertido
    
    # Calcula el valor actual en euros de todas las criptomonedas en la cartera
    def obtener_valor_actual_cartera(self):
        conexion = sqlite3.connect(self.ruta)
        cursor = conexion.cursor()
        consulta_cryptos = 'SELECT DISTINCT to_currency FROM transactions WHERE from_currency != "EUR"'
        cursor.execute(consulta_cryptos)
        cryptos = cursor.fetchall()

        valor_actual_cartera = 0.0

        for crypto in cryptos:
            consulta_valor_actual_cartera = f'SELECT SUM(to_quantity) as valor_actual_cartera FROM transactions WHERE to_currency = "{crypto[0]}"'
            cursor.execute(consulta_valor_actual_cartera)
            total_crypto = cursor.fetchone()[0]

            consulta_total_vendido = f'SELECT SUM(from_quantity) as total_vendido FROM transactions WHERE from_currency = "{crypto[0]}"'
            cursor.execute(consulta_total_vendido)
            total_vendido = cursor.fetchone()[0] or 0.0

            crypto_saldo = total_crypto - total_vendido

            crypto_obj = Cripto(total_crypto, 0, crypto[0])
            crypto_obj.consultar_cambio()
            crypto_obj.calcular_cambio()

            valor_actual_cartera += crypto_obj.to_quantity

        conexion.close()

        return valor_actual_cartera
    
    
    def obtener_status(self):
        saldo_euros_invertidos = self.obtener_saldo_euros_invertidos()
        total_invertido_euros = self.obtener_total_invertido_euros()
        valor_actual_cartera = self.obtener_valor_actual_cartera()
        
        ganancia_perdida = valor_actual_cartera - total_invertido_euros
        
        status = {
            "saldo_euros_invertidos": saldo_euros_invertidos,
            "total_invertido_euros": total_invertido_euros,
            "valor_actual_cartera": valor_actual_cartera,
            "ganancia_perdida": ganancia_perdida
        }
        return status
    
