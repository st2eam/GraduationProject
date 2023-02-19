import hashlib


SALT = b'f7b44cfafd5c52223d5498196c8a2e7b'


def md5(password: str):
    obj = hashlib.md5(SALT)
    obj.update(password.encode('utf-8'))
    secret = obj.hexdigest()
    return secret
