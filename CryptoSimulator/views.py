from . import app
from flask import jsonify
from flask import render_template
# from config import DEFAULT_PAG, PAG_SIZE
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
        transacciones = db.consultaSQL(sql)
        if len(transacciones) > 0:
            resultado = {
                "status": "success",
                "results": transacciones
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