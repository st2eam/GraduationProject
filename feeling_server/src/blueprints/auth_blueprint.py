import os
import random
from flask import Blueprint, jsonify, request
from schema import Schema, Regex, SchemaError
from ..models import ApiResp, JsonResp, ServiceError
from ..utils.email import sendEmail
from ..services import user_service, session_service


bp = Blueprint('auth', __name__, url_prefix='/api/auth')


# =====================================
# @description 登录
# =====================================
@bp.route('/login', methods=["POST"])
def login():
    data = Schema({
        'username': str,
        'password': str,
    }).validate(request.json)
    token = request.cookies.get('token')
    session = session_service.getSessionBySid(token)
    result = user_service.login(
        username=data['username'], password=data['password'], ip=request.remote_addr)
    if not session or result != session['sid']:
        resp = jsonify(ApiResp(data=result, status=200, message="ok"))
        resp.set_cookie(key='token',
                        value=result,
                        httponly=True,
                        max_age=1000 * 3600 * 24 * 14)
        return resp
    else:
        return jsonify(ApiResp(data=session['sid'], status=200, message="ok"))


# =====================================
# @description 注册
# =====================================
@bp.route('/register', methods=["POST"])
def register():
    data = Schema({
        'username': str,
        'password': str,
        'email': str,
        "avatar": str,
        "banner": str
    }).validate(request.json)
    res = user_service.register(username=data['username'],
                                password=data['password'],
                                email=data['email'],
                                avatar=data['avatar'],
                                banner=data['banner'])
    return jsonify(ApiResp(data=res, status=200, message="ok"))


# =====================================
# @description 登出
# =====================================
@bp.route('/logout', methods=["GET"])
def logout():
    token = request.cookies.get('token')
    result = user_service.logout(token)
    if result:
        resp = jsonify(JsonResp(status=200, message="ok"))
        resp.delete_cookie('token')
        return resp
    else:
        response = jsonify(ServiceError(message="退出失败", status=400))
        response.status_code = 400
        return response


# =====================================
# @description 发送注册邮件
# =====================================
@bp.route('/email', methods=["GET"])
def email():
    num = str(random.randint(1, 999999)).zfill(6)
    email_regex = Regex(
        r'^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$')
    try:
        user_email = email_regex.validate(request.json['email'])
    except SchemaError:
        response = jsonify(ServiceError(message="邮箱格式不正确", status=400))
        response.status_code = 400
        return response
    sendEmail(os.getenv('EMAIL_USERNAME'), num, user_email)
    return jsonify(ApiResp(data=num, status=200, message="ok"))
