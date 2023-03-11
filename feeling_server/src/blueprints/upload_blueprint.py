from flask import Blueprint


bp = Blueprint('upload', __name__, url_prefix='/api/upload')


@bp.route('/', methods=('GET', 'POST'))
def hello_world():
    return 'Hello upload!'
