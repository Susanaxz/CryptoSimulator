from . import app
from flask import jsonify, request, render_template
from config import DEFAULT_PAG, PAG_SIZE, COINS
from .models import DBManager, Cripto, APIError
from .forms import TransactionForm


RUTA = app.config.get('RUTA')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/purchase')
def form_nuevo():
    formulario = TransactionForm()
    monedas = COINS
    return render_template('purchase.html', form=formulario, coins=monedas)

@app.route('/status')
def status():
    return render_template('status.html')


@app.route('/api/v1/transacciones')
def listar_transacciones():
    try:
        db = DBManager(RUTA)
        sql = 'SELECT * FROM transactions'
        page = int(request.args.get('p', DEFAULT_PAG)) # devuelve el valor de la página que se pide, si no se pide ninguna devuelve la página por defecto
        nreg = int(request.args.get('r', PAG_SIZE))
        transacciones, num_pages = db.consultaSQL(sql, page, nreg) 
        
        if len(transacciones) > 0:
            resultado = {
                "status": "success",
                "results": transacciones, 
                "page" : page,
                "num_pages": num_pages
            }
           
            status_code = 200
        
        else:
            resultado = {
                'status': 'error',
                'message': f'No hay transacciones en el sistema'
            }
            status_code = 404
    except Exception as error:
        resultado = {
            "status": "error",
            "message": str(error)
        }
        status_code = 500
        
    return jsonify(resultado), status_code

@app.route('/api/v1/transacciones' , methods=['POST'])
def realizar_transaccion():
    form = TransactionForm(request.form)
    
    if form.validate():
        try:
            """ obtenemos los datos del formulario y los convertimos a mayúsculas"""
            from_currency = form.from_currency.data.upper()
            from_quantity = form.from_quantity.data
            to_currency = form.to_currency.data.upper()
            to_quantity = 0.0
            
            cripto = Cripto(from_currency, from_quantity, to_currency, to_quantity)
            cripto.consultar_cambio()
            to_quantity = cripto.calcular_cambio() # calculamos la cantidad de la moneda de destino 
            
            db = DBManager(RUTA)
            db.añadir_transaccion(from_currency, from_quantity, to_currency, to_quantity)
            
            resultado = {
                "status": "success",
                "message": f"La transacción se ha realizado correctamente"
            }
            status_code = 200
            
            
        except Exception as error:
            resultado = {
                "status": "error",
                "message": "Error al realizar la transacción de compra"
            }
            status_code = 500
         
        
    else:
        resultado = {
            "status": "error",
            "message": "Error al validar los datos del formulario",
            "errors": form.errors
        }
        status_code = 400
        
        
    print(resultado)     
    return jsonify(resultado), status_code