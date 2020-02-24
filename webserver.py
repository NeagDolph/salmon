# -*- coding: utf-8 -*-

import uuid
import json
import sys
import sqlite3
import os
import hashlib

from flask import *
from jinja2 import TemplateNotFound
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_session import Session
from google.oauth2 import id_token
from google.auth.transport import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'schloopy'
socketio = SocketIO(app, logger=False, async_mode='eventlet', engineio_logger=False, ping_timeout=60, cors_allowed_origins="*")

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)

Session(app)

users = {}

userids = []

allowedThirdParty = ["neilagrawal1990@gmail.com"]


admins = ["0cd38e5c-d75a-4990-84ce-ceb3b4beb1cb", "2dcdaab7-4f08-4f62-9ad1-488c5799cf54", "8e579d65-04a3-479c-9268-4ab928237ee5"]

classlist = ["Socratic", "Writing", "Geometry", "Statistics", "Life Design", "Problem Solving", "Physics", "HRI", "Creative Writing", "Urban Movement", "Makerspace", "Practicum"]

conn = sqlite3.connect('sqlite.db', check_same_thread=False)


@app.route("/api/glogin", methods=["POST"])
def login():
    try:
        idtoken = request.json.get('idtoken', False)
        email = request.json.get('email', False)
    except:
        idtoken = request.form.get('idtoken', False)

    if not idtoken:
        session.clear()
        return "error", 500

    userid = session.get("userid", False)

    print("USER ID", userid)

    if userid:
        teacher = session.get("teacher")

        if teacher:
            data = getdata(userid, True)
            print("User: " + data.get("email", "") + ",  Connected as teacher")

            return jsonify(data)
        else:
            cur = conn.cursor()
            cur.execute('SELECT student, name FROM users WHERE userid=?', (userid,))
            data = cur.fetchone()
            session["teacher"] = True if 2 == data[0] else False

            print("User: " + data[1] + ",  Connected as student")

            return jsonify(getdata(userid, True))
    else:
        credentials = getcreds(idtoken)
        hd = credentials.get("hd", False)
        email = credentials.get("email", False)
        name = credentials.get("name", False)

        cur = conn.cursor()

        if hd != "alt.app" and email not in allowedThirdParty:
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

            cur.execute("INSERT INTO users VALUES (?,?,?,1,'000000000000','111111111111')", (email, name, str(userid),))

            updateteachers()
        else:
            print("User exists")
            userid = userdata[2]
            studenttype = userdata[3]
            offcampus = userdata[4]
            session["userid"] = userid
            session["teacher"] = False
            if studenttype == 2:
                session["teacher"] = True
            session["offcampus"] = offcampus
            
        session["email"] = email
        session["name"] = name
        
        conn.commit()

        return jsonify(getdata(userid, True))



@app.route("/api/logout")
def logout():
    try:
        session['userid'] = False
        session.clear()
        print("LOGGING OUT")
        return "success"
    except:
        return "error", 500


@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)
    

@app.route("/api/getdata", methods=["POST"])
def ajaxgetclasses():
    userid = session.get("userid", False)
    print("User requested data")

    if userid:
        emitupdate(userid)
        return "", 200
    else:
        return "", 403


@socketio.on('connect')
def connect():
    teacher = session.get("teacher")
    userid = session.get("userid", "")
    admin = userid in admins

    if not userid:
        return

    join_room(userid)

    if teacher or admin:
        join_room("teachers")

    if not session.get("teacher"):
        join_room("students")

        # userdata = getdata(userid)
        emitupdate(userid)
        # socketio.emit('update', {'classes': userdata["classes"], 'offcampus': session.get("offcampus", 2), "teacher": userdata["teacher"], "admin": userid in admins}, room=userid)


@app.route('/api/editclasses', methods=["POST"])
def editclasses():
    teacher = session.get("teacher")
    teacherid = session.get("userid")
    dataform = request.json or request.form

    if teacher and teacherid:
        userid = dataform.get("userid")
        changeclass = dataform.get("class")
        new = dataform.get("new")
        cur = conn.cursor()

        if not isinstance(changeclass, int):
            return "errora", 500
        elif changeclass > 12 or changeclass < 0:
            return "errorb", 500
        
        if not isinstance(new, str):
            return "errorc", 500
        elif len(new) != 1 or new not in ["0", "1"]:
            return "errord", 500

        cur.execute('SELECT teacherclasses FROM users WHERE userid=?', (teacherid,))
        result = cur.fetchone()

        if len(result) < 1:
            return "error", 500

        print("EEK", result)

        if result[0][changeclass] != '1':
            return "No permission", 403

        
        
        cur.execute('SELECT classes FROM users WHERE userid=?', (userid,))
        classes = cur.fetchone()

        if len(classes) < 1:
            return "error", 500

        newclasses = list(classes[0])
        newclasses[changeclass] = str(new)
        newclasses = "".join(newclasses)

        cur.execute("UPDATE users SET classes=? WHERE userid=?", (newclasses, userid,))
        conn.commit()

        updateteachers()
        print("emitting update to userid")
        emitupdate(userid)

        return "success", 200
    else:
        return "No permission", 403


@app.route('/api/teacher/del', methods=["POST"])
def removeteacher():
    adminid = session.get("userid", "")
    dataform = request.json or request.form
    if adminid in admins:
        email = dataform.get("email")

        if not email:
            return "error", 500

        cur = conn.cursor()
        cur.execute('SELECT userid FROM users WHERE email=?', (email,))
        result = cur.fetchone()

        if result:
            cur.execute("UPDATE users SET student=1 WHERE userid=?", (result[0], ))
            conn.commit()
            updatereq()
            emitupdate(result[0])

            return "success", 200
        else:
            return "User does not exist", 500
    else: 
        return "No permission", 403
        

@app.route('/api/teacher/add', methods=["POST"])
def addteacher():
    adminid = session.get("userid", "")
    dataform = request.json or request.form

    if adminid in admins:
        email = dataform.get("email")
        classes = dataform.get("classes")
        update = dataform.get("update")

        if not email or not classes: 
            print("ADD teacher error", dataform, classes)
            return "error", 500
        else:
            if not isinstance(classes, str):
                print("ADD teacher error", dataform, classes)
                return "error", 500
            else:
                if not all([i in ["0", "1"] for i in list(classes)]):
                    print("ADD teacher error", dataform, classes)
                    return "error", 500

        cur = conn.cursor()
        cur.execute('SELECT userid FROM users WHERE email=?', (email,))
        result = cur.fetchone()
        print("ERM", result)

        if result:
            cur.execute("UPDATE users SET student=2, teacherclasses=? WHERE email=?", (classes, email))
            conn.commit()

            updatereq()

            emitupdate(result[0])

            return "success", 200
        else:
            cur.execute("INSERT INTO teacherqueue VALUES (?, ?)", (email, adminid))
            conn.commit()

            return "queue", 200
    else: 
        return "No permission", 403


@app.route('/api/comment/create', methods=["POST"])
def comment():
    teacher = session.get("teacher")
    teacherid = session.get("userid")
    dataform = request.json or request.form

    if teacher and teacherid:
        userid = dataform.get("userid")
        classidx = dataform.get("class")
        comment = dataform.get("comment")

        cur = conn.cursor()

        #Check if input datatypes are correct
        if not isinstance(classidx, int):
            return "bad request a", 400
        elif classidx > 12 or classidx < 0:
            return "bad request b", 400
        
        if not isinstance(comment, str):
            print("COMM", comment, classidx, userid, dataform, dataform.get("comment"), comment)
            return "bad request c", 400


        #check if teacher has auth for class
        cur.execute('SELECT teacherclasses FROM users WHERE userid=?', (teacherid,))
        result = cur.fetchone()

        if len(result) < 1:
            return "error", 500

        if result[0][classidx] != '1':
            return "No permission", 403

        
        #Add comment
        commentsha = hashlib.md5((userid + str(classidx)).encode()).hexdigest() #calculate sha of userid and class

        cur.execute(
            'INSERT OR IGNORE INTO comments (userid, comment, class, commentsha) VALUES (?, ?, ?, ?)'
        ,(userid, comment, classidx, commentsha)) #Insert comment
        
        cur.execute(
            'UPDATE comments SET comment=? WHERE commentsha=?' #Update comment in case insert threw PK error
        ,(comment, commentsha))

        conn.commit()

        updateteachers(True)
        emitupdate(userid)

        return "success", 200
    else:
        return "No permission", 403

@app.route('/api/comment/delete', methods=["POST"])
def delcomment():
    pass

@app.route('/api/comment/get', methods=["POST"])
def getcomment():
    pass

@app.route('/api/getusers', methods=["GET"])
def getusers():
    teacher = session.get("teacher")
    userid = session.get("userid", "")

    if teacher or userid in admins:
        cur = conn.cursor()
        cur.execute('SELECT * FROM users')
        users = cur.fetchall()

        return jsonify(users)
    else:
        return "No permission", 403


def updateteachers(getcomments=False):
    cur = conn.cursor()

    cur.execute('SELECT email, name, userid, classes FROM users')
    userlist = cur.fetchall()
    commentlist = []

    if getcomments:
        cur.execute('SELECT userid, class, comment FROM comments')
        commentlist = cur.fetchall()

    socketio.emit('users', {"users": userlist, "comments": commentlist}, room="teachers")


def emitupdate(userid):
    print("emitting")
    socketio.emit('update', getdata(userid), room=userid)


def updatereq():
    socketio.emit('updatereq', room="students")


def getdata(userid, extradata=False):
    cur = conn.cursor()
    cur.execute('SELECT classes, student, teacherclasses, email, studentclasses FROM users WHERE userid=?', (userid, ))
    data = cur.fetchone()
    print(data)
    if not data:
        return "error"
    
    if len(data) >= 1:
        classes = data[0]
        student = data[1]
        teacherclasses = ""
        userlist = []
        teacherlist = []
        commentlist = []

        cur.execute('SELECT class, comment FROM comments WHERE userid=?', (userid, ))
        comments = cur.fetchall()

        if student == 2:
            # cur.execute('SELECT email, name, userid, classes FROM users WHERE student = 1')
            cur.execute('SELECT email, name, userid, classes FROM users')
            userlist = cur.fetchall()

            # users = [{"email": i[0], "name": i[1], "userid": i[2], "classes": i[3]} for i in userlist]
            
            teacherclasses = data[2]
            

            if extradata:
                cur.execute('SELECT userid, class, comment FROM comments')
                commentlist = cur.fetchall()

        if userid in admins:
            cur.execute('SELECT email, name, userid, teacherclasses FROM users WHERE student=2')
            teacherlist = cur.fetchall()

            cur.execute('SELECT email, name, userid, classes, studentclasses, student FROM users')
            adminusers = cur.fetchall()
    

        return {'adminusers': adminusers, 'classes': classes, "teacher": student == 2, "users": userlist, "admin": userid in admins, "tclasses": teacherclasses, "teacherlist": teacherlist, "comments": comments if len(comments) >= 1 else [], "tcomments": commentlist if extradata else [], "email": data[3]}
    else:
        return "error"


def getcreds(idtoken):
    try:
        idinfo = id_token.verify_oauth2_token(idtoken, requests.Request(), "203450520052-4olsv1k1uj6ditok97qncbho9n8usk36.apps.googleusercontent.com")

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        return idinfo
    except ValueError:
        return False

if __name__ == "__main__":

    cur = conn.cursor()
    cur.execute('SELECT userid FROM users')
    userids = [item for t in cur.fetchall() for item in t]
    print("USERIDS", userids)

    socketio.run(app, debug=True, host="localhost", port=8080)
