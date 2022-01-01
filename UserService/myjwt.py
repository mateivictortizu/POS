import datetime
import uuid

import jwt


def encode_auth_token(user_id, role):

    try:
        payload = {
            # iss
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=80),
            'sub': user_id,
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
    """
    Validates the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, "ZZZ", algorithms='HS256')
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'
