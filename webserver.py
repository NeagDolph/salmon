from flask import *
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_session import Session
import uuid
import json
import sys
import sqlite3
from sqlite3 import Error
from google.oauth2 import id_token
from google.auth.transport import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'schloop'
socketio = SocketIO(app)

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

users = {}

conn = None


@app.route("/")
def slash():
    return render_template("home.html")


@app.route("/glogin", methods=["POST"])
def login():
    idtoken = request.form.get('idtoken', False)
    userid = session.get("userid", False)

    if not idtoken:
        session.clear()
        return "error", 500

    if userid:
        return "success"
    else:
        cur = conn.cursor()
        credentials = getcreds(idtoken)
        hd = credentials.get("hd", False)
        email = credentials.get("email", False)
        name = credentials.get("name", False)


        if hd != "alt.app":
            print("Not ATI google account")
            session.clear()
            return "notati", 403

        if not credentials:
            console.log("loginerr")
            return "loginerror", 403

        cur.execute('SELECT * FROM users WHERE email=?', (email,))

        userdata = cur.fetchone()

        if not userdata:
            userid = uuid.uuid4()
            session["userid"] = str(userid)

            print("User doesnt exist")

            cur.execute("INSERT INTO users VALUES (?,?,?,1)", (email, name, str(userid),))
        else:
            print("User exists")
            session["userid"] = userdata[2]
            
        session["email"] = email
        session["name"] = name
        
        conn.commit()

        print("SUCCESS")
        return "success"


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


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

def getcreds(idtoken):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(idtoken, requests.Request(), "203450520052-4olsv1k1uj6ditok97qncbho9n8usk36.apps.googleusercontent.com")

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        print("IDINFO", idinfo)

        return idinfo
    except ValueError:
        return False
        # Invalid token
        pass

if __name__ == "__main__":
    conn = sqlite3.connect('sqlite.db', check_same_thread=False)
    socketio.run(app, debug=True, host="localhost", port="6405")
