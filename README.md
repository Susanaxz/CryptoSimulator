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

 1. Clone el repositorio en su máquina local con git bash o desde su consola de su editor de código:
  
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
 
4. Instale las dependencias del proyecto:
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
6. Editar el archivo .env y cambiar el valor de DEBUG (True/False). por motivos de seguridad dejar con el valor False
   
7. Ejecute la aplicación:
    ```cmd
    c:\su_ruta\CryptoSimulator> flask run
    ```
8. Abrir el navegador y visitar:
    ```console
    http://127.0.0.1:5000 para acceder a la aplicación.
    ```


## Como utilizar

Falta descripción!!

## Contacto
Si tienes preguntas, sugerencias o deseas contribuir al proyecto, no dudes en contactar:

Nombre: Susana 
Email: riberasusana@gmail.com
GitHub: @Susanaxz
LinkedIn: https://www.linkedin.com/in/susana-ribera-46191272/