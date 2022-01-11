import json

import flask
from flask import Flask, request
from flask_cors import CORS

from models import db, migrate, bcrypt, User, Token, BlacklistToken
from myjwt import encode_auth_token, decode_auth_token

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
        return {"error": "Token is not in list"}, 403
    x, y = decode_auth_token(request.headers["Authorization"])
    if x == -1 or x == -2:
        return {"error": y}, 403
    return json.dumps({
        "client_id": x,
        "role": y}), 200


@app.route('/logout', methods=['POST'])
def logout():
    blacklist = BlacklistToken(token=request.headers["Authorization"])
    db.session.add(blacklist)
    db.session.commit()
    return {"message": "Token was blacklisted!"}, 200


if __name__ == '__main__':
    app.run(port=5001)
