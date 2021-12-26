from flask import Blueprint

abService = Blueprint('asService', __name__)


@abService.route('/')
def test():
    pass
