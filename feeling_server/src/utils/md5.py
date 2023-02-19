import hashlib
from ...env import MD5_SALT


def md5(password: str):
    obj = hashlib.md5(MD5_SALT)
    obj.update(password.encode('utf-8'))
    secret = obj.hexdigest()
    return secret
