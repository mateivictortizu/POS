import json

import flask
import jwt
from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from myjwt import encode_auth_token, decode_auth_token
from models import db, migrate, bcrypt, User, Token

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://matteovk:admin@localhost/users'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    x = User.check_user(email, password)
    if x is False or x is None:
        return {"message": "User sau parola gresita!"}, 403
    else:
        if x.admin:
            jwt_token = encode_auth_token(x.id, x.email, "ADMIN")
        else:
            jwt_token = encode_auth_token(x.id, x.email, "STANDARD")
        token = Token(token=jwt_token)
        db.session.add(token)
        db.session.commit()
        response = flask.Response()
        response.headers["Authorization"] = jwt_token
        return {"jwt": jwt_token}, 200


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']
    check = User.check_if_email_exists(email)
    if check:
        return {"message": "Userul este deja inregistrat"}, 400
    newUser = User(email=email, password=password)
    db.session.add(newUser)
    db.session.commit()
    return {"message": "Userul a fost inregistrat!"}, 201


@app.route('/check-token', methods=['GET'])
def check_token_route():
    check = Token.check_token(request.headers["Authorization"])
    if check is False:
        return {"error": "Token is not in list"}, 401
    x, y = decode_auth_token(request.headers["Authorization"])
    if x == -1 or x == -2:
        return {"error": y}, 401
    return json.dumps({
        "client_id": x,
        "role": y}), 200


@app.route('/logout')
def logout():
    pass


if __name__ == '__main__':
    app.run()
