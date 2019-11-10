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
            userid = str(uuid.uuid4())
            session["userid"] = str(userid)
            session["offcampus"] = 1

            print("User doesnt exist")

            cur.execute("INSERT INTO users VALUES (?,?,?,1)", (email, name, str(userid),))
            cur.execute("INSERT INTO classes VALUES (?,1)", (str(userid),))
        else:
            print("User exists")
            userid = userdata[2]
            session["userid"] = userid
            cur.execute('SELECT * FROM classes WHERE userid=?', (userid,))
            offcampus = cur.fetchone()[1]
            session["offcampus"] = offcampus
            
        session["email"] = email
        session["name"] = name
        session["usertype"] = 1
        
        conn.commit()

        print("SUCCESS")
        return "success"



@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")



@socketio.on('joinroom')
def joinroom():
    pass


@app.route("/getclasses", methods=["POST"])
def ajaxgetclasses():
    userid = session.get("userid", False)

    if userid:
        classes = getclasses(userid)
        socketio.emit('update', {'classes': classes}, room=userid)
        return "", 200
    else:
        return "", 403




@socketio.on('connect')
def connect():
    print("join room")
    userid = session.get("userid", "")

    if not userid:
        return


    if session.get("usertype", False) == 1:
        join_room("students")
        join_room(userid)

        classes = getclasses(userid)
        socketio.emit('update', {'classes': classes, 'offcampus': session.get("offcampus", 2)}, room=userid)

        print("connected and joined room students")
    elif session.get("usertype", False) == 2:
        join_room("teachers")
    print("connected")


@app.route('/changestatus', methods=["POST"])
def changestatus():
    # Add teacher auth to this func
    email = request.form.get("email")
    try:
        newstatus = int(request.form.get("newstatus"))
    except:
        return "Not valid status"

    print("status", newstatus)

    cur = conn.cursor()
    cur.execute('SELECT * FROM users WHERE email=?', (email,))
    result = cur.fetchone()

    if result:
        userid = result[2]

        cur.execute("UPDATE classes SET offcampus=? WHERE userid=?", (newstatus, userid,))

        session["offcampus"] = newstatus

        socketio.emit('update', {'classes': getclasses(userid), 'offcampus': newstatus}, room=userid)
        conn.commit()

        return "offcampus for user " + email + " has been updates"
    else:
        if "@alt.app" in email:
            return "User is not altitude user"
        return "User does not exist"

def getclasses(userid):
    cur = conn.cursor()


    return ["Calculus AB", "Calculus BC", "Statistics", "Ooga Baga"]

def getcreds(idtoken):
    try:
        idinfo = id_token.verify_oauth2_token(idtoken, requests.Request(), "203450520052-4olsv1k1uj6ditok97qncbho9n8usk36.apps.googleusercontent.com")

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        print("IDINFO", idinfo)

        return idinfo
    except ValueError:
        return False

if __name__ == "__main__":
    conn = sqlite3.connect('sqlite.db', check_same_thread=False)
    socketio.run(app, debug=True, host="localhost", port="6405")
