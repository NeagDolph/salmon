# -*- coding: utf-8 -*-

import uuid
import json
import sys
import sqlite3
import os

from flask import *
from jinja2 import TemplateNotFound
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_session import Session
from google.oauth2 import id_token
from google.auth.transport import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'schloopy'
socketio = SocketIO(app)

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)

Session(app)

users = {}

admins = ["0cd38e5c-d75a-4990-84ce-ceb3b4beb1cb", "d826f81e-3854-4d1b-9c4f-1539d663b865"]

conn = sqlite3.connect('sqlite.db', check_same_thread=False)


@app.route("/")
def slash():
    email = session.get("email", False)
    userid = session.get("userid", "")
    teacher = session.get("teacher")


    if userid:
        cur = conn.cursor()
        cur.execute('SELECT student FROM users WHERE userid=?', (userid,))

        student = cur.fetchone()

        if 2 in student:
            session["teacher"] = True
            teacher = True
        else:
            session["teacher"] = False
            teacher = False

    if userid in admins:
        return render_template("home.html", admin=True, teacher=True)


    if teacher:
        return render_template("home.html", teacher=True)

    return render_template("home.html")


@app.route("/glogin", methods=["POST"])
def login():
    try:
        idtoken = request.json.get('idtoken', False)
    except:
        idtoken = request.form.get('idtoken', False)


    userid = session.get("userid", False)
    print("DS", idtoken, list(request.form))

    if not idtoken:
        session.clear()
        return "error", 500

    if userid:
        return jsonify({'classes': getclasses(userid)})
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
            session["teacher"] = False

            print("User doesnt exist")

            cur.execute("INSERT INTO users VALUES (?,?,?,1,0)", (email, name, str(userid),))

            updateusers()
        else:
            print("User exists")
            userid = userdata[2]
            student = userdata[3]
            offcampus = userdata[4]
            session["userid"] = userid
            if student == 2:
                session["teacher"] = True
            else:
                session["teacher"] = False
            session["offcampus"] = offcampus
            
        session["email"] = email
        session["name"] = name
        session["usertype"] = 1
        
        conn.commit()

        print("SUCCESS")

        return jsonify({'classes': getclasses(userid)})



@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)

@app.route('/scripts/<path:filename>')
def custom_script(filename):
    return send_from_directory("/root/salmon/scripts", filename)

@app.route('/styles/<path:filename>')
def custom_style(filename):
    return send_from_directory("/root/salmon/styles", filename)

@app.route("/getclasses", methods=["POST"])
def ajaxgetclasses():
    userid = session.get("userid", False)

    if userid:
        classes = getclasses(userid)
        print("EMITTING")
        socketio.emit('update', {'classes': classes}, room=userid)
        return "", 200
    else:
        return "", 403


@socketio.on('connect')
def connect():
    teacher = session.get("teacher")
    userid = session.get("userid", "")
    admin = userid in admins
    print("CONNM")

    if not userid:
        return

    if teacher or admin:
        join_room("teachers")

    if not session.get("teacher"):
        join_room("students")
        join_room(userid)

        classes = getclasses(userid)
        socketio.emit('update', {'classes': classes, 'offcampus': session.get("offcampus", 2)}, room=userid)


@app.route('/changestatus', methods=["POST"])
def changestatus():
    # Add teacher auth to this func
    teacher = session.get("teacher")
    adminid = session.get("userid", "")

    if teacher or adminid in admins:

        email = request.form.get("email")
        try:
            newstatus = int(request.form.get("newstatus"))
        except:
            return "Invalid status", 500

        if newstatus in [0,1]:

            print("status", newstatus)

            cur = conn.cursor()
            cur.execute('SELECT * FROM users WHERE email=?', (email,))
            result = cur.fetchone()

            if result:
                userid = result[2]

                cur.execute("UPDATE users SET offcampus=? WHERE userid=?", (newstatus, userid,))

                session["offcampus"] = newstatus

                print("sent changestatus update")
                socketio.emit('update', {'classes': getclasses(userid), 'offcampus': newstatus}, room=userid)
                conn.commit()

                updateusers()

                return "offcampus for user " + email + " has been updates"
            else:
                if "@alt.app" not in email:
                    return "User is not altitude user", 500
                return "User does not exist", 500
        else:
            return "Invalid status", 500
    else:
        return "No permission", 403


@app.route('/addteacher', methods=["POST"])
def addteacher():
    adminid = session.get("userid", "")

    if adminid in admins:
        email = request.form.get("teacher")
        try:
            newstatus = int(request.form.get("newstatus"))
        except:
            return "Invalid status", 500

        if newstatus in [1,2]:

            cur = conn.cursor()
            cur.execute('SELECT * FROM users WHERE email=?', (email,))
            result = cur.fetchone()

            if result:
                userid = result[2]

                cur.execute("UPDATE users SET student=? WHERE userid=?", (newstatus, userid,))
                
                if newstatus == 2:
                    session["teacher"] = True
                else:
                    session["teacher"] = False

                conn.commit()

                updateusers()

                return email + " has been made a teacher"
            else:
                if "@alt.app" not in email:
                    return "User is not altitude user", 500
                return "User does not exist", 500
        else:
            return "Invalid Status", 500

    else: 
        return "No permission", 403


@app.route('/getusers', methods=["GET"])
def getusers():
    teacher = session.get("teacher")
    userid = session.get("userid", "")
    cur = conn.cursor()


    if teacher or userid in admins:
        cur.execute('SELECT * FROM users')
        users = cur.fetchall()

        return jsonify(users)
    else:
        return "No permission", 403


def updateusers():
    cur = conn.cursor()
    cur.execute('SELECT * FROM users')
    users = cur.fetchall()
    socketio.emit('updateusers', {"users": users}, room="teachers")


def getclasses(userid):
    # cur = conn.cursor()
    return [{"name": "Writing", "status": 1}, {"name": "Calculus AB", "status": 1}, {"name": "Calculus BC", "status": 1}, {"name": "Statistics", "status": 0}, {"name": "English", "status": 1}]
    # return [{"name": "Writing", "status": 0}, {"name": "Writing", "status": 0}, {"name": "Calculus AB", "status": 0}, {"name": "Calculus BC", "status": 1}, {"name": "Statistics", "status": 0}, {"name": "English", "status": 1}, {"name": "Writing", "status": 1}, {"name": "Calculus AB", "status": 0}, {"name": "Calculus BC", "status": 1}, {"name": "Statistics", "status": 0}, {"name": "English", "status": 1}, {"name": "Writing", "status": 1}, {"name": "Calculus AB", "status": 0}, {"name": "Calculus BC", "status": 1}, {"name": "Statistics", "status": 0}, {"name": "English", "status": 1}]

def getcreds(idtoken):
    try:
        idinfo = id_token.verify_oauth2_token(idtoken, requests.Request(), "203450520052-4olsv1k1uj6ditok97qncbho9n8usk36.apps.googleusercontent.com")

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        return idinfo
    except ValueError:
        return False

if __name__ == "__main__":
    socketio.run(app, debug=True, host="localhost", port=8080)
