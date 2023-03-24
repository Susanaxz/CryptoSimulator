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
def recoger_formulario(): # hacer una funcion que recoja los datos del formulario y los devuelva en formato json
    formulario = TransactionForm()
    
    if formulario.validate_on_submit():
        from_currency = formulario.from_currency.data
        from_quantity = formulario.from_quantity.data
        to_currency = formulario.to_currency.data
        
        try:
            cripto = Cripto(from_currency, from_quantity, to_currency) # creo un objeto de la clase Cripto y le paso los datos del formulario
            # cripto.consultar_cambio()
            # to_quantity = cripto.calcular_cambio()
            resultado = {
                "status": "success",
                "from_currency": from_currency,
                "from_quantity": from_quantity,
                "to_currency": to_currency,
                
            }
            status_code = 200
        except APIError as error:
            resultado = {
                "status": "error",
                "message": str(error)
            }
            status_code = 500
    else:
        resultado = {
            "status": "error",
            "message": "Error al validar los datos del formulario",
            "errors": formulario.errors
        }
        status_code = 400

    return jsonify(resultado), status_code