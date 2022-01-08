import urllib.parse
from urllib import parse

from flask import Blueprint, request
import requests

cart = Blueprint('cart', __name__)

URL = "http://127.0.0.1:8093/"


# COMPLETED

@cart.route('/cart')
def get_cart_by_client_id():
    client_id = request.args['clientid']
    r = requests.get(parse.urljoin(URL, "cart?clientid=" + client_id))
    return r.content


@cart.route('/cart', methods=['POST'])
def add_item_in_cart():
    client_id = request.args['clientid']
    json = request.json
    r = requests.post(parse.urljoin(URL, "cart?clientid=" + client_id), json=json)
    return r.content


@cart.route('/cart', methods=['DELETE'])
def delete_all_cart():
    client_id = request.args['clientid']
    r = requests.delete(parse.urljoin(URL, "cart?clientid=" + client_id))
    return r.content


@cart.route('/addCart', methods=['PUT'])
def add_quantity():
    client_id = request.args['clientid']
    isbn = request.args['ISBN']
    r = requests.put(parse.urljoin(URL, "addCart?clientid=" + client_id + "&ISBN=" + isbn), json=None)
    return r.content


@cart.route('/downCart', methods=['PUT'])
def down_quantity():
    client_id = request.args['clientid']
    isbn = request.args['ISBN']
    r = requests.put(parse.urljoin(URL, "downCart?clientid=" + client_id + "&ISBN=" + isbn), json=None)
    return r.content


@cart.route('/removeItem', methods=['DELETE'])
def remove_item():
    client_id = request.args['clientid']
    isbn = request.args['ISBN']
    r = requests.delete(parse.urljoin(URL, "removeItem?clientid=" + client_id + "&ISBN=" + isbn), json=None)
    return r.content
