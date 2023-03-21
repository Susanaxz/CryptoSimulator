from flask_wtf import FlaskForm
from wtforms import DateField, TimeField, FloatField, RadioField, StringField, SubmitField, IntegerField
from wtforms.widgets import HiddenInput
from wtforms.validators import DataRequired

class TransactionForm(FlaskForm):
    id = IntegerField(default=0, widget=HiddenInput())
    from_currency = StringField('Moneda origen', validators=[DataRequired(message="Debes introducir una moneda origen")])
    from_quantity = FloatField('Cantidad en Euros', validators=[DataRequired(message="Debes introducir una cantidad en Euros")])
    to_currency = StringField('Moneda destino', validators=[DataRequired(message="Debes introducir una moneda destino")])
    submit = SubmitField('Realizar transacción')