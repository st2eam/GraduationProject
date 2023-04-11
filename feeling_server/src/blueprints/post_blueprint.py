from flask import Blueprint, jsonify, request, json
import requests
from schema import Schema, Optional, Use
from ..models import ApiResp, IPagination, JsonResp
from ..services import post_service
from ..word2vec import Word2VecModel
bp = Blueprint('post', __name__, url_prefix='/api/post')


# =====================================
# @description 帖子推荐
# =====================================
@bp.route('/recommend', methods=["GET"])
def recommend():
    res = post_service.get_recommend(request.cookies['token'])
    return jsonify(ApiResp(data=res))


# =====================================
# @description 历史推荐帖子
# =====================================
@bp.route('/history', methods=["GET"])
def history():
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    res = post_service.get_historical_recommend(
        request.cookies['token'],
        IPagination(
            prev=props.get('prev'),
            next=props.get('next'),
            limit=props.get('limit', 10)
        ))
    return jsonify(ApiResp(data=res))

# =====================================
# @description 获取关注列表文章
# =====================================


@bp.route('/following', methods=["GET"])
def following():
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    res = post_service.get_following(
        request.cookies['token'],
        IPagination(
            prev=props.get('prev'),
            next=props.get('next'),
            limit=props.get('limit', 10)
        ))
    return jsonify(ApiResp(data=res))


# =====================================
# @description 个人中心帖子列表
# =====================================
@bp.route('/get_user_post', methods=["GET"])
@bp.route('/get_user_post/<id>', methods=["GET"])
def get_user_post(id=None):
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    token = request.cookies.get('token')
    res = post_service.get_user_post(token=token,
                                     relationId=id,
                                     options=IPagination(
                                         prev=props.get('prev'),
                                         next=props.get('next'),
                                         limit=props.get('limit', 10)
                                     ))
    return jsonify(ApiResp(data=res))


# =====================================
# @description 个人中心图片帖子列表
# =====================================
@bp.route('/get_user_img_post', methods=["GET"])
@bp.route('/get_user_img_post/<id>', methods=["GET"])
def get_user_img_post(id=None):
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    token = request.cookies.get('token')
    res = post_service.get_user_img_post(token=token,
                                         relationId=id,
                                         options=IPagination(
                                             prev=props.get('prev'),
                                             next=props.get('next'),
                                             limit=props.get('limit', 10)
                                         ))
    return jsonify(ApiResp(data=res))


# =====================================
# @description 个人中心喜欢帖子列表
# =====================================
@bp.route('/get_user_like_post', methods=["GET"])
@bp.route('/get_user_like_post/<id>', methods=["GET"])
def get_user_like_post(id=None):
    props = Schema({
        Optional('prev'): str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    token = request.cookies.get('token')
    res = post_service.get_user_like_post(token=token,
                                          relationId=id,
                                          options=IPagination(
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
        Optional('labels'): [str]
    }).validate(request.json)
    token = request.cookies.get('token')
    res = post_service.create_post(
        token=token, content=data['content'], imgs=data['imgs'], labels=data.get('labels'))
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


# =====================================
# @description word2vec
# =====================================
@bp.route('/word2vec', methods=["POST"])
def word2vec():
    data = Schema({
        'word': [str],
        Optional('word2'): [str]
    }).validate(request.json)
    model = Word2VecModel.get_instance()
    if data.get('word2'):
        res = model.wv.n_similarity(
            data.get('word'), data.get('word2'))
        res = str(res)
    else:
        res = model.wv.most_similar(data.get('word'))
    return jsonify(ApiResp(data=res))


# =====================================
# @description update
# =====================================
@bp.route('/update', methods=["POST"])
def update():
    response = requests.get('https://api.vvhan.com/api/60s?type=json')
    result = response.json()
    post_service.create_daily_posts(result['data'])
    return jsonify(ApiResp(data=result))


# =====================================
# @description similar
# =====================================
@bp.route('/similar', methods=["GET"])
def similar():
    props = Schema({
        '_id': str,
    }).validate(dict(request.args))
    token = request.cookies.get('token')
    res = post_service.similar(id=props.get('_id'), token=token)
    return jsonify(ApiResp(data=res))
