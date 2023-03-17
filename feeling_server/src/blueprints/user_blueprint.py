from flask import Blueprint, jsonify, request
from schema import Schema, Optional, Use

from ..models import ApiResp, IPagination
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


@bp.route('/follower_list', methods=["GET"])
@bp.route('/follower_list/<id>', methods=["GET"])
def follow_list(id=None):
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    token = request.cookies.get('token')
    res = follow_service.follower_list(token=token,
                                       relationId=id,
                                       options=IPagination(
                                           prev=props.get('prev'),
                                           next=props.get('next'),
                                           limit=props.get('limit', 10)
                                       ))
    return jsonify(ApiResp(data=res))


@bp.route('/subscriber_list', methods=["GET"])
@bp.route('/subscriber_list/<id>', methods=["GET"])
def subscriber_list(id=None):
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    token = request.cookies.get('token')
    res = follow_service.subscriber_list(token=token,
                                         relationId=id,
                                         options=IPagination(
                                             prev=props.get('prev'),
                                             next=props.get('next'),
                                             limit=props.get('limit', 10)
                                         ))
    return jsonify(ApiResp(data=res))
