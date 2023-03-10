from flask import Blueprint, jsonify, request
from schema import Schema, Optional, Use
from ..models import ApiResp, IPagination, JsonResp
from ..services import post_service


bp = Blueprint('post', __name__, url_prefix='/api/post')


# =====================================
# @description 帖子推荐
# =====================================
@bp.route('/recommend', methods=["GET"])
def recommend():
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    res = post_service.get_recommend(
        request.cookies['token'],
        IPagination(
            prev=props.get('prev'),
            next=props.get('next'),
            limit=props.get('limit', 10)
        ))
    return jsonify(ApiResp(data=res))


# =====================================
# @description 创建帖子
# =====================================
@bp.route('/create_post', methods=["POST"])
def create_post():
    data = Schema({
        'content': str,
        'imgs': [str],
        Optional('label'): [str]
    }).validate(request.json)
    token = request.cookies.get('token')
    res = post_service.create_post(
        token=token, content=data['content'], imgs=data['imgs'], label=data.get('label'))
    return jsonify(ApiResp(data=res))


# =====================================
# @description 创建评论
# =====================================
@bp.route('/create_comment', methods=["POST"])
def create_comment():
    data = Schema({
        'relationId': str,
        'content': str,
        'imgs': [str]
    }).validate(request.json)
    token = request.cookies.get('token')
    res = post_service.create_comment(
        token=token, relationId=data['relationId'], content=data['content'], imgs=data['imgs'])
    return jsonify(ApiResp(data=res))


# =====================================
# @description 创建转发
# =====================================
@bp.route('/create_forward', methods=["POST"])
def create_forward():
    data = Schema({
        'relationId': str,
        'content': str,
        'imgs': [str]
    }).validate(request.json)
    token = request.cookies.get('token')
    res = post_service.create_forward(
        token=token, relationId=data['relationId'], content=data['content'], imgs=data['imgs'])
    return jsonify(ApiResp(data=res))


# =====================================
# @description 获取帖子详情
# =====================================
@bp.route('/get_detail', methods=["GET"])
def get_detail():
    props = Schema({
        '_id': str,
    }).validate(dict(request.args))
    token = request.cookies.get('token')
    res = post_service.get_detail(token=token, id=props.get('_id'))
    return jsonify(ApiResp(data=res))


# =====================================
# @description 获取帖子评论
# =====================================
@bp.route('/get_comments', methods=["GET"])
def get_comments():
    props = Schema({
        '_id': str,
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    res = post_service.get_comments(
        props.get('_id'),
        request.cookies['token'],
        IPagination(
            prev=props.get('prev'),
            next=props.get('next'),
            limit=props.get('limit', 10)
        ))
    return jsonify(ApiResp(data=res))


# =====================================
# @description 点赞
# =====================================
@bp.route('/like', methods=["POST"])
def like():
    data = Schema({
        'id': str
    }).validate(request.json)
    token = request.cookies.get('token')
    res = post_service.like(id=data['id'], token=token)
    return jsonify(ApiResp(data=res))


# =====================================
# @description 取消点赞
# =====================================
@bp.route('/unlike', methods=["POST"])
def unlike():
    data = Schema({
        'id': str
    }).validate(request.json)
    token = request.cookies.get('token')
    res = post_service.unlike(id=data['id'], token=token)
    return jsonify(ApiResp(data=res))


# =====================================
# @description 删除帖子以及它的评论
# =====================================
@bp.route('/delete', methods=["POST"])
def delete():
    data = Schema({
        'id': str
    }).validate(request.json)
    token = request.cookies.get('token')
    post_service.delete(id=data['id'], token=token)
    return jsonify(JsonResp())
