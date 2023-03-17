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


# =====================================
# @description 切换通知已读和未读状态
# =====================================
@bp.route('/update_status', methods=["POST"])
def update_status():
    data = Schema({'id': str}).validate(request.json)
    res = notice_service.update_status(request.cookies['token'], data['id'])
    return jsonify(ApiResp(data=res))


# =====================================
# @description 逻辑删除一条通知
# =====================================
@bp.route('/delete', methods=["POST"])
def delete():
    data = Schema({'id': str}).validate(request.json)
    res = notice_service.delete(request.cookies['token'], data['id'])
    return jsonify(ApiResp(data=res))


# =====================================
# @description 获取未读通知条数
# =====================================
@bp.route('/get_unread', methods=["GET"])
def get_unread():
    res = notice_service.get_unread(request.cookies['token'])
    return jsonify(ApiResp(data=res))


# =====================================
# @description 全部设为已读
# =====================================
@bp.route('/read_all', methods=["POST"])
def read_all():
    res = notice_service.read_all(request.cookies['token'])
    return jsonify(ApiResp(data=res))


# =====================================
# @description 删除全部通知
# =====================================
@bp.route('/delete_all', methods=["POST"])
def delete_all():
    res = notice_service.delete_all(request.cookies['token'])
    return jsonify(ApiResp(data=res))
