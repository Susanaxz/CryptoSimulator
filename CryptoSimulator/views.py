from flask import render_template

from . import app

RUTA = app.config.get('RUTA')


@app.route('/')
def home():
    return render_template('index.html')
