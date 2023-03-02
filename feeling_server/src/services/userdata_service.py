from pymongo import ReturnDocument
from ..database import get_collection

weight = {
    'post': 5,
    'comment': 3,
    'forward': 4,
    'delete_post': -5,
    'delete_forward': -4,
    'delete_comment': -3,
    'like': 2,
    'unlike': -2,
    'follow': 2,
    'search': 2,
    'short_reading': 1,
    'middle_reading': 2,
    'long_reading': 3,
}


def update_label(userId: str, label: list[str], type: str):
    # 查询指定 userId 的文档
    query = {'userId': userId}
    update = {}
    document = get_collection('userdata').find_one(query)

    if document:
        # 如果文档存在，查找是否已存在指定标签
        labels = document.get('labels', {})
        for l in label:
            index = labels.get(l)
            if index is not None:
                # 如果标签已存在，将其值加weight[type]
                labels[l] += weight[type]
            else:
                # 如果标签不存在，插入新标签，初值为weight[type]
                labels[l] = weight[type]
        update['$set'] = {'labels': labels}
    else:
        # 如果文档不存在，插入新文档
        labels = {l: weight[type] for l in label}
        update['$set'] = {'userId': userId, 'labels': labels}
        document = get_collection('userdata').insert_one(update['$set'])

    # 执行更新操作
    res = get_collection('userdata').find_one_and_update(
        query, update, return_document=ReturnDocument.AFTER)
    return res
