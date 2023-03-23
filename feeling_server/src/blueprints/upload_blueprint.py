# -*- coding: utf-8 -*-
import oss2
import os
import time
from flask import Blueprint, jsonify, request
from ..models import ApiResp

bp = Blueprint('upload', __name__, url_prefix='/api/upload')


@bp.route('/<name>', methods=["GET"])
def upload(name):
    AccessKeyId = os.getenv('ALI_OSS_ACCESS_KEY_ID')
    AccessKeySecret = os.getenv('ALI_OSS_ACCESS_KEY_SECRET')
    auth = oss2.Auth(AccessKeyId, AccessKeySecret)
    bucket = oss2.Bucket(
        auth, 'https://oss-cn-hangzhou.aliyuncs.com', 'fee1ing')
    ext = name.split('.')[-1]
    filename = 'Feeling' + str(int(time.time()*1000)) + '.' + ext
    headers = dict()
    headers['Content-Type'] = 'blob'
    url = bucket.sign_url('PUT', filename, 3600,
                          slash_safe=True, headers=headers)
    return jsonify(ApiResp(data={'url': url}))
