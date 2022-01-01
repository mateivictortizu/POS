from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from myjwt import encode_auth_token, decode_auth_token
from models import db, migrate, bcrypt, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://matteovk:admin@localhost/users'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)


@app.route('/login')
def login():
    data = request.json
    email = data['email']
    password = data['password']
    x = User.check_user(email, password)
    if x is False:
        return {"message": "User sau parola gresita!"}, 200
    else:
        jwt = encode_auth_token(x.id, x.admin)
        return {"token": jwt}, 200


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']
    newUser = User(email=email, password=password)
    db.session.add(newUser)
    db.session.commit()
    return {"message": "Userul a fost inregistrat!"}, 201


if __name__ == '__main__':
    app.run()
