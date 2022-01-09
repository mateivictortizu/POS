import urllib.parse
from urllib import parse

from flask import Blueprint, request
import requests

order = Blueprint('order', __name__)

URL = "http://127.0.0.1:8091/"


@order.route('/orders')
def get_order_by_client_id():
    client_id = request.args['clientid']
    r = requests.get(parse.urljoin(URL, "orders?clientid=" + client_id))
    return r.content, r.status_code


@order.route('/orders', methods=['POST'])
def add_book_orders_for_client():
    client_id = request.args['clientid']
    json = request.json
    r = requests.post(parse.urljoin(URL, "orders?clientid=" + client_id), json=json)
    return r.content, r.status_code


@order.route('/cancelOrder', methods=['PUT'])
def cancel_order():
    client_id = request.args['clientid']
    json = request.json
    r = requests.put(parse.urljoin(URL, "cancelOrder?clientid=" + client_id), json=json)
    return r.content, r.status_code
