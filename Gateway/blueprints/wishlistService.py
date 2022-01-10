import urllib.parse

import xmltodict
from flask import Blueprint, request
import requests

wishlist = Blueprint('wishlist', __name__)


@wishlist.route('/wishlist', methods=['POST'])
def add_item_in_wishlist():
    url = "http://localhost:8080/soapws"

    content = request.json

    # TODO: check if I have permission to add wishlist for client_id
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

    data_dict = xmltodict.parse(response.text)
    return data_dict

@wishlist.route("/wishlist", methods=['GET'])
def get_wishlist():
    url = "http://localhost:8080/soapws"

    # TODO: check if I have permission to client id wishlist
    client_id = request.args['client_id']

    payload = """<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:art="http://schemas.xmlsoap.org/soap/envelope/">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <art:getWishlistByIdRequest>
                            <art:clientId>""" + str(client_id) + """</art:clientId>
                        </art:getWishlistByIdRequest>
                    </soapenv:Body>
                </soapenv:Envelope>  """

    headers = {
        'Content-Type': 'text/xml; charset=utf-8'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    data_dict = xmltodict.parse(response.text)
    return data_dict


@wishlist.route("/wishlist", methods=['DELETE'])
def delete_item_from_wishlist():
    url = "http://localhost:8080/soapws"

    wishlist_id = request.args['wishlist_id']

    payload = """<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:art="http://schemas.xmlsoap.org/soap/envelope/">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <art:deleteWishlistRequest>
                            <art:wishlistId>"""+str(wishlist_id)+"""</art:wishlistId>
                        </art:deleteWishlistRequest>
                    </soapenv:Body>
                </soapenv:Envelope> """

    headers = {
        'Content-Type': 'text/xml; charset=utf-8'
    }
    response = requests.request("POST", url, headers=headers, data=payload)

    data_dict = xmltodict.parse(response.text)
    return data_dict
