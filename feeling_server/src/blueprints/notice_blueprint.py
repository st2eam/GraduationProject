from flask import Blueprint, jsonify, request
from schema import Schema, Optional, Use
from ..models import ApiResp, IPagination
from ..services import notice_service

bp = Blueprint('notice', __name__, url_prefix='/api/notice')


# =====================================
# @description 获取通知列表
# =====================================
@bp.route('/get', methods=["GET"])
def get_notice():
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    res = notice_service.get_notice_list(
        request.cookies['token'],
        IPagination(
            prev=props.get('prev'),
            next=props.get('next'),
            limit=props.get('limit', 10)
        )
    )
    return jsonify(ApiResp(data=res))
