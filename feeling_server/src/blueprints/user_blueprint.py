from flask import Blueprint, jsonify, request
from schema import Schema, Optional

from ..models import ApiResp
from ..services import user_service, follow_service

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


@bp.route('/set_info', methods=["POST"])
def set_info():
    data = Schema({
        Optional('bio'): str,
        Optional('userId'): str,
        Optional('avatar'): str,
        Optional('banner'): str
    }).validate(request.json)
    res = user_service.set_user_info(
        token=request.cookies.get('token'),
        newUserId=data.get('userId'),
        avatar=data.get('avatar'),
        banner=data.get('banner'),
        bio=data.get('bio')
    )
    return jsonify(ApiResp(data=res))


@bp.route('/follow', methods=["POST"])
def follow():
    data = Schema({
        'id': str
    }).validate(request.json)
    token = request.cookies.get('token')
    res = follow_service.follow(token=token, followId=data['id'])
    return jsonify(ApiResp(data=res))


@ bp.route('/unfollow', methods=["POST"])
def unfollow():
    data = Schema({
        'id': str
    }).validate(request.json)
    token = request.cookies.get('token')
    res = follow_service.unfollow(token=token, followId=data['id'])
    return jsonify(ApiResp(data=res))
