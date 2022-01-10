import urllib.parse
from urllib import parse

from flask import Blueprint, request
import requests

order = Blueprint('order', __name__)

URL = "http://127.0.0.1:8091/"


@order.route('/orders')
def get_order_by_client_id():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    r = requests.get(parse.urljoin(URL, "orders?clientid=" + client_id))
    return r.content, r.status_code


@order.route('/orders', methods=['POST'])
def add_book_orders_for_client():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    json = request.json
    r = requests.post(parse.urljoin(URL, "orders?clientid=" + client_id), json=json)
    return r.content, r.status_code


@order.route('/cancelOrder', methods=['PUT'])
def cancel_order():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    json = request.json
    r = requests.put(parse.urljoin(URL, "cancelOrder?clientid=" + client_id), json=json)
    return r.content, r.status_code
