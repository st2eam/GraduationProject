from dotenv import load_dotenv
from flask import Flask, jsonify, request
from src.services.user_service import validate_token
from src.blueprints import auth_blueprint, user_blueprint, notice_blueprint, post_blueprint, search_blueprint, upload_blueprint
from src.models import ServiceError, JsonEncoder
from src.utils.check import BodyErrorStat
from src.word2vec import Word2VecModel
from src import database
from schema import SchemaError


def create_app():
    app = Flask(__name__)
    app.debug = True
    database.init_db()
    Word2VecModel.init()
    load_dotenv(verbose=True)
    app.json_encoder = JsonEncoder
    app.register_blueprint(auth_blueprint.bp)
    app.register_blueprint(user_blueprint.bp)
    app.register_blueprint(post_blueprint.bp)
    app.register_blueprint(notice_blueprint.bp)
    app.register_blueprint(upload_blueprint.bp)
    app.register_blueprint(search_blueprint.bp)
    return app


app = create_app()


@app.before_request
def before_request():
    authWhiteList = ['/api/auth/login',
                     '/api/auth/register', '/api/auth/email']
    if request.path not in authWhiteList:
        validate_token(request.cookies.get('token'))


@app.errorhandler(ServiceError)
def handle_service_error(err):
    response = jsonify({
        "message": err.message,
        "status": err.status,
        "code": err.code
    })
    response.status_code = err.status
    return response


@app.errorhandler(SchemaError)
def handle_schema_error(error):
    response = jsonify({
        "message": str(error.code),
        "status": 400,
    })
    response.status_code = 400
    return response


@app.errorhandler(KeyError)
def handle_key_error(error):
    error = BodyErrorStat.ERR_BAD_BODY_PARAMS.value
    response = jsonify({
        "message": error.message,
        "status": error.status,
        "code": error.code
    })
    response.status_code = error.status
    return response


if __name__ == '__main__':
    app.run()
