import os
import hashlib


def md5(password: str):
    obj = hashlib.md5(os.getenv('MD5_SALT').encode())
    obj.update(password.encode('utf-8'))
    secret = obj.hexdigest()
    return secret
