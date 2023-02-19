from flask import Blueprint


bp = Blueprint('user', __name__, url_prefix='/api/user')


@bp.route('/', methods=('GET', 'POST'))
def hello_world():
    return 'Hello user!'
