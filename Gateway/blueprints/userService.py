import urllib.parse
from urllib import parse

from flask import Blueprint, request
import requests

user = Blueprint('user', __name__)

URL = "http://127.0.0.1:5001/"


@user.route('/login', methods=['POST'])
def login():
    client_id = request.args['clientid']
    r = requests.get(parse.urljoin(URL, "orders?clientid=" + client_id))
    return r.content, r.status_code


@user.route('/register', methods=['POST'])
def register():
    client_id = request.args['clientid']
    json = request.json
    r = requests.post(parse.urljoin(URL, "orders?clientid=" + client_id), json=json)
    return r.content, r.status_code


@user.route('/check-token', methods=['GET'])
def check_token():
    headers = request.headers
    r = requests.get(parse.urljoin(URL, "check-token"), headers=headers)
    return r.content, r.status_code
