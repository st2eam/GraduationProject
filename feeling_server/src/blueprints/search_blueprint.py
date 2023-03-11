from flask import Blueprint, jsonify, request
from schema import Schema, Optional, Use
from ..models import ApiResp, ISearch
from ..services import search_service

bp = Blueprint('search', __name__, url_prefix='/api/search')


@bp.route('/post', methods=["GET"])
def search_post():
    props = Schema({
        'keyword': str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    res = search_service.search_post(
        request.cookies['token'],
        ISearch(
            keyword=props.get('keyword'),
            next=props.get('next'),
            limit=props.get('limit', 10)
        )
    )
    return jsonify(ApiResp(data=res))


@bp.route('/img', methods=["GET"])
def search_img():
    props = Schema({
        'keyword': str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    res = search_service.search_img(
        request.cookies['token'],
        ISearch(
            keyword=props.get('keyword'),
            next=props.get('next'),
            limit=props.get('limit', 10)
        )
    )
    return jsonify(ApiResp(data=res))


@bp.route('/user', methods=["GET"])
def search_user():
    props = Schema({
        'keyword': str,
        Optional('next'): str,
        Optional('limit'): Use(int)
    }).validate(dict(request.args))
    res = search_service.search_user(
        request.cookies['token'],
        ISearch(
            keyword=props.get('keyword'),
            next=props.get('next'),
            limit=props.get('limit', 10)
        )
    )
    return jsonify(ApiResp(data=res))
