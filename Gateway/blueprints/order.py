import urllib.parse

from flask import Blueprint
import requests

order = Blueprint('order', __name__)


@order.route('/')
def test():
    pass

