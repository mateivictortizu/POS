import urllib.parse
from urllib import parse

from flask import Blueprint, request
import requests

user = Blueprint('user', __name__)

URL = "http://127.0.0.1:5001/"


@user.route('/login', methods=['POST'])
def login():
    json_body = request.json
    r = requests.post(parse.urljoin(URL, "login"), json=json_body)
    return r.content, r.status_code


@user.route('/register', methods=['POST'])
def register():
    json = request.json
    r = requests.post(parse.urljoin(URL, "register"), json=json)
    return r.content, r.status_code


@user.route('/check-token', methods=['GET'])
def check_token():
    headers = request.headers
    r = requests.get(parse.urljoin(URL, "check-token"), headers=headers)
    return r.content, r.status_code


@user.route('/logout', methods=['POST'])
def logout():
    headers = request.headers
    r = requests.post(parse.urljoin(URL, "logout"), headers=headers)
    return r.content, r.status_code
