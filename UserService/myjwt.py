import datetime
import uuid

import jwt

from models import Token


def encode_auth_token(user_id, email, role):
    try:
        payload = {
            # iss
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=10000000000),
            'sub': user_id,
            'email': email,
            'jti': user_id,
            'role': role
        }
        return jwt.encode(
            payload,
            "ZZZ",
            algorithm='HS256'
        )
    except Exception as e:
        return e


def decode_auth_token(auth_token):
    try:
        payload = jwt.decode(auth_token, "ZZZ", algorithms='HS256')
        return payload['sub'], payload['role']
    except jwt.ExpiredSignatureError:
        return -1, "EXPIRED"
    except jwt.InvalidTokenError:
        return -2, "INVALID"
