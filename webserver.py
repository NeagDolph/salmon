from flask import *
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_session import Session
import uuid
import json
import sys

app = Flask(__name__)
app.config['SECRET_KEY'] = 'schloop'
socketio = SocketIO(app)

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

users = {}


@app.route("/")
def slash():
    return render_template("home.html")


# @socketio.on("location")
# def msg(obj):
#     token = session.get("token", False)

#     emit(
#         "usermove", {
#             'token': token,
#             'x': obj["x"],
#             'y': obj["y"]
#         },
#         room="main",
#         json=True)


# @socketio.on('connect')
# def connect():
#     token = session.get("token", False)

#     if token:
#         join_room("main")


if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0")
