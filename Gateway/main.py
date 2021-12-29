from flask import Flask
from blueprints.ABService import abService
from blueprints.orderService import order
from blueprints.wishlistService import wishlist

app = Flask(__name__)
app.register_blueprint(order)
app.register_blueprint(abService)
app.register_blueprint(wishlist)

if __name__ == '__main__':
    app.run()
