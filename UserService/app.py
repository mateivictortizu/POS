from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from myjwt import encode_auth_token, decode_auth_token
from models import db, migrate,bcrypt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://matteovk:admin@localhost/users'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()


if __name__ == '__main__':
    app.run()
