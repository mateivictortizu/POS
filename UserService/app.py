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


@app.route('/login')
def login():
    data = request.json
    email = data['email']
    password = data['password']
    x = User.check_user(email, password)
    if x is False:
        return {"message": "User sau parola gresita!"}, 200
    else:
        jwt_token = encode_auth_token(x.id, x.admin)
        token = Token(token=jwt_token)
        db.session.add(token)
        db.session.commit()
        response = flask.Response()
        response.headers["Authorization"] = jwt_token
        return response, 200


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']
    newUser = User(email=email, password=password)
    db.session.add(newUser)
    db.session.commit()
    return {"message": "Userul a fost inregistrat!"}, 201


@app.route('/check-token', methods=['GET'])
def check_token():
    check = check_token(request.headers["Authorization"])
    if check is False:
        return {"message": "Token is not in list"}, 401
    decode = decode_auth_token(request.headers["Authorization"])
    return str(decode), 202


@app.route('/logout')
def logout():
    pass


if __name__ == '__main__':
    app.run()
