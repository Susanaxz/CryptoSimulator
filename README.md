# CryptoSimulator # 
Simulador de inversiones en cryptos utilizando la API coinApi

# Descripción:
Simulador de Inversiones en Cryptos es una aplicación web diseñada para ayudar a los usuarios a explorar y aprender sobre la inversión en criptomonedas. La aplicación permite a los usuarios simular operaciones de compra y venta, realizar seguimiento de sus inversiones y visualizar el rendimiento de sus carteras en tiempo real.


## Contenido
1. Características
2. Tecnologías utilizadas
3. Instalación y configuración
4. Cómo utilizar
5. Contacto

## Características
- Simulación de compra y venta de criptomonedas
- Lista de las 10 criptomonedas más populares y su cotización a tiempo real


## Tecnologías Utilizadas
- Frontend: HTML, CSS, JavaScript
- Backend: Flask, WTForms
- API: CoinAPI para datos de criptomonedas
- Base de datos: SQLite
- Bibliotecas adicionales: requests



## Instalación y configuración

 1. Clona el repositorio en tu máquina local con git bash o desde tu consola de tu editor de código:
  
```bash
git clone https://github.com/Susanaxz/CryptoSimulator.git
```

2. Crear un entorno virtual:
   
    **2.1 Windows**

    ```python
      python -m venv env
      ```
    
    **2.2 Mac / Linux**
    ```python
    python3 -m venv env
    ```

3. Activar el entorno virtual

    **3.1 Windows**

    ```cmd
      env\Scripts\activate
      ```
    
    **3.2 Mac / Linux**
    ```bash
    source ./env/bin/activate
    ```
 
4. Instala las dependencias del proyecto:
    ```
    pip install -r requirements.txt
    ```
5. Configurar las variables de entorno en el archivo '.env':
    ```ini
    FLASK_APP = 'app.py'
    SECRET_KEY = 'your_secret_key'
    API_KEY = 'your_coinapi_key'
    DATABASE_URL = 'transactions.db'
    ```
6. Editar el archivo .env y cambiar el valor de DEBUG (True/False). Por motivos de seguridad dejar con el valor False
   
7. Ejecuta la aplicación:
    ```cmd
    c:\su_ruta\CryptoSimulator> flask run
    ```
8. Abrir el navegador y visitar:
    ```console
    http://127.0.0.1:5000 para acceder a la aplicación.
    ```


## Como utilizar

Una vez hayas instalado y configurado la aplicación siguiendo las anteriores instrucciones, puede comenzar
a utilizar el simulador de criptomonedas

1. Simular operaciones de compra y venta

Para simular una operación de compra/venta o intercambio de criptomonedas, selecciona la criptomoneda que deseas e ingresa la cantidad que deseas comprar/vender o intercambiar.
Verás en tiempo real el precio de la crypto de destino que deseas adquirir operación.
La aplicación calculará automáticamente el costo en función del precio actual de la criptomoneda seleccionada y de la cantidad que deseas invertir.

2. Visualizar Operaciones   

En la página principal, tendrás una tabla donde te muestra en todo momento todas las transacciones realizadas para poder llevar un control. 

3. Status

Dispones de una página de Status donde encontrarás un resumen de tu cartera de criptomonedas, incluyendo el rendimiento y la evolución de tus inversiones en tiempo real.

4. Recuerda!!
   
CryptoSimulator es una herramienta educativa y no debe utilizarse para tomar decisiones de inversión en el mercado real.

## Contacto
Si tienes preguntas, sugerencias o deseas contribuir al proyecto, no dudes en contactar:

Nombre: Susana 
Email: riberasusana@gmail.com
GitHub: @Susanaxz
LinkedIn: https://www.linkedin.com/in/susana-ribera-46191272/