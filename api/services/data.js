var db = require("./dbUtil.js");
var config = require('../config.json');

function emailExists(email) { //If user exists under specified email
    if (email) {
        return db.prepare('SELECT * FROM users WHERE email=?').get(email)
    } else return false
}

function useridExists(userid) { //if user exists under specified userid
    if (userid) {
        return db.prepare('SELECT * FROM users WHERE userid=?').get(userid)
    } else return false
}

function createUser(email, name, userid, teacher=false) {
    db.prepare("INSERT INTO users VALUES (?,?,?,?,'000000000000000','111111111111111','101011000000000')").run(email, name, userid, teacher ? 2 : 1)
}

function getCompiled(userid, extraData = false) {
    if (!userid) {
        console.log("GetData no userid")
        return "error"
    }

    let userData = db.prepare('SELECT classes, student, teacherclasses, email, studentclasses FROM users WHERE userid=?').get(userid)

    if (!userData) {
        console.log("GetData no userdata")
        return "error"
    }

    let data = {
        classes: userData.classes,
        teacher: userData.student == 2,
        admin: config.admins.includes(userData.email),
        tclasses: userData.student == 2 ? userData.teacherclasses : "000000000000000",
        email: userData.email,
        userid: userid,
        studentclasses: userData.studentclasses
    }

    if (!userData) return "error"

    if (userData.student == 2) {
        if (extraData) data.userlist = this.getStudentList(true)
    } else data.comments = db.prepare('SELECT class, comment FROM comments WHERE userid=?').all(userid)

    if (config.admins.includes(userData.email)) {
        data.teacherlist = db.prepare('SELECT email, name, userid, teacherclasses FROM users WHERE student = 2').all()

        if (extraData) data.userlist = this.getStudentList(true)
    }

    return data
}

function getStudentList(comments = false) {
    let userlist = db.prepare('SELECT email, name, userid, classes, studentclasses FROM users WHERE student = 1').all()

    if (comments) {
        let commentlist = db.prepare('SELECT userid, class, comment FROM comments').all()

        return userlist.map(user => {
            let objcomments = commentlist.filter(e => e.userid == user.userid)
            let arrcomments = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            objcomments.forEach(el => {
                arrcomments[el.class] = el.comment
            });
            user.comments = arrcomments
            return user
        })
    } else return userlist
}

module.exports = {
    getStudentList,
    getCompiled,
    emailExists,
    useridExists
}