from flask import *
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_session import Session
import uuid
import json
import sys
import sqlite3
from sqlite3 import Error

app = Flask(__name__)
app.config['SECRET_KEY'] = 'schloop'
socketio = SocketIO(app)

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

users = {}


@app.route("/")
def slash():
    token = session.get("token", False)
    count = session.get("token", False)

    if not token:
        token = str(uuid.uuid4())
        session["token"] = token

    if not count:
        session["count"] = 0

    return render_template("home.html")

@app.route("/update")
def update():
    count = session.get("count", False)
    token = session.get("token", False)

    print(count, token)

    if token is False or count is False:
        return redirect("/", 302)
    else:
        session["count"] = session.get("count") + 1
        socketio.emit(
            "update", {
                "count": count
            },
            room=token,
            json=True)


    return "done"


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


@socketio.on('connect')
def connect():
    token = session.get("token", False)

    if token:
        join_room(token)


def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    create_connection(r"sqlite.db")
    socketio.run(app, debug=True, host="localhost")
