from flask import Blueprint
bp = Blueprint('post', __name__, url_prefix='/api/post')


# =====================================
# @description 聚合查询关注的人的帖子，按时间排序
# =====================================
@bp.route('/get_follow_post', methods=["GET"])
def get_follow_post():
    return 'Hello get_follow_post!'


# =====================================
# @description 创建帖子
# =====================================
@bp.route('/create_post', methods=["POST"])
def create_post():
    return 'Hello create_post!'


# =====================================
# @description 创建评论
# =====================================
@bp.route('/create_comment', methods=["POST"])
def create_comment():
    return 'Hello create_comment!'


# =====================================
# @description 创建转发
# =====================================
@bp.route('/create_forward', methods=["POST"])
def create_forward():
    return 'Hello create_forward!'


# =====================================
# @description 获取帖子详情
# =====================================
@bp.route('/get_post_detail', methods=["GET"])
def get_post_detail():
    return 'Hello get_post_detail!'


# =====================================
# @description 获取帖子评论
# =====================================
@bp.route('/get_comments', methods=["GET"])
def get_comments():
    return 'Hello get_comments!'


# =====================================
# @description 点赞
# =====================================
@bp.route('/like', methods=["POST"])
def like():
    return 'Hello like!'


# =====================================
# @description 取消点赞
# =====================================
@bp.route('/unlike', methods=["POST"])
def unlike():
    return 'Hello unlike!'


# =====================================
# @description 删除帖子以及它的评论
# =====================================
@bp.route('/delete', methods=["POST"])
def delete():
    return 'Hello delete!'
