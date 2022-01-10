from flask import Flask
from flask_cors import CORS
from blueprints.ABService import abService
from blueprints.orderService import order
from blueprints.wishlistService import wishlist
from blueprints.cartService import cart
from blueprints.userService import user

app = Flask(__name__)
app.register_blueprint(order)
app.register_blueprint(abService)
app.register_blueprint(wishlist)
app.register_blueprint(cart)
app.register_blueprint(user)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

if __name__ == '__main__':
    app.run()
