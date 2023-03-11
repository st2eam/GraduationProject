from flask import Blueprint, jsonify, request
from schema import Schema, Optional
from ..models import ApiResp
from ..services import user_service

bp = Blueprint('user', __name__, url_prefix='/api/user')


@bp.route('/info', methods=["GET"])
def info():
    props = Schema({
        Optional('id'): str
    }).validate(dict(request.args))
    res = user_service.get_user_info(
        token=request.cookies['token'],
        otherUserId=props.get('id'))
    return jsonify(ApiResp(data=res))
