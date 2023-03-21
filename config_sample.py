import os

RUTA = os.path.join('data', 'transactions.db')
SECRET_KEY ='por aquí tu secret key'
APIKEY= 'pon aquí tu api key de coinAPI'

# preparar la paginación
DEFAULT_PAG = 1
PAG_SIZE = 10


# listado de monedas
COINS = ['EUR', 'BTC', 'ETH', 'USDT', 'ADA', 'SOL', 'XRP', 'DOT', 'DOGE', 'SHIB']