from flask import Blueprint


bp = Blueprint('search', __name__, url_prefix='/api/search')


@bp.route('/', methods=('GET', 'POST'))
def hello_world():
    return 'Hello search!'
