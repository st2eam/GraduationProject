from flask import Blueprint


bp = Blueprint('notify', __name__, url_prefix='/api/notify')


@bp.route('/', methods=('GET', 'POST'))
def hello_world():
    return 'Hello notify!'
