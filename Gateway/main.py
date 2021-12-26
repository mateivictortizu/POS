from flask import Flask
from blueprints.ABService import abService
from blueprints.order import order

app = Flask(__name__)
app.register_blueprint(order)
app.register_blueprint(abService)

if __name__ == '__main__':
    app.run()
