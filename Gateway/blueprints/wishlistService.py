import urllib.parse

from flask import Blueprint, request
import requests

wishlist = Blueprint('wishlist', __name__)


@wishlist.route('/wishlist', methods=['POST'])
def add_item_in_wishlist():
    url = "http://localhost:8080/soapws"

    content = request.json

    payload = """<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:art="http://schemas.xmlsoap.org/soap/envelope/">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <art:addWishlistRequest>
                            <art:clientId>""" + str(content['client_id']) + """</art:clientId>
                            <art:bookISBN>""" + content['bookISBN'] + """</art:bookISBN>
                            <art:titlu>""" + content['titlu'] + """</art:titlu>
                            <art:price>""" + str(content['price']) + """</art:price>
                        </art:addWishlistRequest>
                    </soapenv:Body>
                </soapenv:Envelope> """
    headers = {
        'Content-Type': 'text/xml; charset=utf-8'
    }
    response = requests.request("POST", url, headers=headers, data=payload)

    return response.text


@wishlist.route("/wishlist", methods=['GET'])
def get_wishlist():
    url = "http://localhost:8080/soapws"

    content = request.json

    payload = """<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:art="http://schemas.xmlsoap.org/soap/envelope/">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <art:getWishlistByIdRequest>
                            <art:clientId>15</art:clientId>
                        </art:getWishlistByIdRequest>
                    </soapenv:Body>
                </soapenv:Envelope>  """

    headers = {
        'Content-Type': 'text/xml; charset=utf-8'
    }
    response = requests.request("POST", url, headers=headers, data=payload)

    return response.text
