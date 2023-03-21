from . import app
from flask import jsonify, request, render_template
from config import DEFAULT_PAG, PAG_SIZE
from .models import DBManager


RUTA = app.config.get('RUTA')


@app.route('/')
def home():
    return render_template('index.html')


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