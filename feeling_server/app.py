from dotenv import load_dotenv
from flask import Flask, jsonify
from src.blueprints import auth_blueprint, user_blueprint, notice_blueprint, post_blueprint, search_blueprint
from src.models import ServiceError, JsonEncoder
from src import database
from schema import SchemaError
app = Flask(__name__)

database.init_db()
load_dotenv(verbose=True)
app.json_encoder = JsonEncoder
app.register_blueprint(auth_blueprint.bp)
app.register_blueprint(user_blueprint.bp)
app.register_blueprint(notice_blueprint.bp)
app.register_blueprint(post_blueprint.bp)
app.register_blueprint(search_blueprint.bp)


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


if __name__ == '__main__':
    app.run(debug=True)
