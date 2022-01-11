from urllib import parse

from flask import Blueprint, request
import requests

cart = Blueprint('cart', __name__)

URL = "http://127.0.0.1:8093/"

@cart.route('/cart')
def get_cart_by_client_id():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    r = requests.get(parse.urljoin(URL, "cart?clientid=" + client_id))
    return r.content,r.status_code


@cart.route('/cart', methods=['POST'])
def add_item_in_cart():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    json = request.json
    r = requests.post(parse.urljoin(URL, "cart?clientid=" + client_id), json=json)
    return r.content,r.status_code


@cart.route('/cart', methods=['DELETE'])
def delete_all_cart():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    r = requests.delete(parse.urljoin(URL, "cart?clientid=" + client_id))
    return r.content,r.status_code


@cart.route('/addCart', methods=['PUT'])
def add_quantity():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    isbn = request.args['ISBN']
    r = requests.put(parse.urljoin(URL, "addCart?clientid=" + client_id + "&ISBN=" + isbn), json=None)
    return r.content,r.status_code


@cart.route('/downCart', methods=['PUT'])
def down_quantity():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    isbn = request.args['ISBN']
    r = requests.put(parse.urljoin(URL, "downCart?clientid=" + client_id + "&ISBN=" + isbn), json=None)
    return r.content,r.status_code


@cart.route('/removeItem', methods=['DELETE'])
def remove_item():

    head = request.headers
    r = requests.get(parse.urljoin("http://127.0.0.1:5000/", "check-token"), headers=head)

    if r.status_code != 200:
        return r.content, r.status_code

    client_id = request.args['clientid']
    isbn = request.args['ISBN']
    r = requests.delete(parse.urljoin(URL, "removeItem?clientid=" + client_id + "&ISBN=" + isbn), json=None)
    return r.content,r.status_code
