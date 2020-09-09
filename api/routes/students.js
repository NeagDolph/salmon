var db = require("../services/dbUtil.js")
var logger = require("../services/logger.js")
var validator = require("../services/validator.js")

var sockets = require("./sockets.js").methods

var express = require('express')
var router = express.Router()

router.put("/enroll", validator.admin, (req, res) => {
    if (!req.body.userid) { res.sendStatus(400); return }

    if (typeof req.body.class !== "number") { res.sendStatus(400); return }
    else if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return }

    if (req.body.new !== true && req.body.new !== false) { res.sendStatus(400); return; }

    let studentData = db.prepare('SELECT studentclasses, email FROM users WHERE userid=?').get(req.body.userid)

    let studentClasses = studentData.studentclasses
    if (!studentClasses) { res.status(404).send("User not found"); return; }
X
    let newclasses = studentClasses.split("")
    newclasses[req.body.class] = req.body.new ? "1" : "0"
    newclasses = newclasses.join("")

    db.prepare('UPDATE users SET studentclasses=? WHERE userid=?').run(newclasses, req.body.userid)

    logger.log(req.session.email, studentData.email, "enroll", `${req.body.class} set to ${req.body.new}`)

    sockets.user(req.body.userid)

    res.send()
})

router.put("/status", validator.teacher, (req, res) => {
    if (typeof req.body.class !== "number") { res.sendStatus(400); return }
    else if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return }

    if (req.body.new !== true && req.body.new !== false) { res.sendStatus(400); return; }

    //Check teacher permission to edit class
    let teacherclasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses

    if (!teacherclasses) { res.sendStatus(500); return }

    //get Studentclasses and classes data of student
    let studentData = db.prepare('SELECT studentclasses, classes, email FROM users WHERE userid=?').get(req.body.userid)

    if (!studentData) { res.status(404).send("User not found"); return; }

    if (teacherclasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return; }
    if (studentData.studentclasses[req.body.class] !== '1') { res.sendStatus(400); return; }

    let newclasses = studentData.classes.split("")
    newclasses[req.body.class] = req.body.new ? "1" : "0"
    newclasses = newclasses.join("")

    db.prepare("UPDATE users SET classes=? WHERE userid=?").run(newclasses, req.body.userid)

    logger.log(req.session.email, studentData.email, "status", `${req.body.class} set to ${req.body.new}`)

    sockets.teachers()
    sockets.user(req.body.userid)

    res.send()
});


router.post("/comment", validator.teacher, (req, res) => {
    if (typeof req.body.class !== "number") { res.sendStatus(400); return; }
    if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return; }
    if (typeof req.body.comment !== "string" || !req.body.userid) { res.sendStatus(400); return; }

    // Get teacher classes
    let selfClasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses
    if (!selfClasses) { res.sendStatus(500); return; }

    // Check teacher permission
    if (selfClasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return }

    // Get student enrolled classes
    let userData = db.prepare('SELECT studentclasses, name FROM users WHERE userid=?').get(req.body.userid)

    if (!userData.studentclasses) { res.sendStatus(400); return; }

    // Check student classes
    if (userData.studentclasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return }

    // Update comment
    let commentChanges = db.prepare('UPDATE comments SET comment=? WHERE userid=? AND class=?').run(req.body.comment, req.body.userid, req.body.class).changes

    // Insert if no changes made
    if (!Boolean(commentChanges)) db.prepare('INSERT INTO comments (userid, comment, class) VALUES (?, ?, ?)').run(req.body.userid, req.body.comment, req.body.class)

    sockets.teachers(true)
    sockets.user(req.body.userid)

    res.send()
})

module.exports = router
var db = require("../services/dbUtil.js")
var logger = require("../services/logger.js")
var validator = require("../services/validator.js")

var sockets = require("./sockets.js").methods

var express = require('express')
var router = express.Router()

router.put("/enroll", validator.admin, (req, res) => {
    if (!req.body.userid) { res.sendStatus(400); return }

    if (typeof req.body.class !== "number") { res.sendStatus(400); return }
    else if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return }

    if (req.body.new !== true && req.body.new !== false) { res.sendStatus(400); return; }

    let studentData = db.prepare('SELECT studentclasses, email FROM users WHERE userid=?').get(req.body.userid)

    let studentClasses = studentData.studentclasses
    if (!studentClasses) { res.status(404).send("User not found"); return; }
X
    let newclasses = studentClasses.split("")
    newclasses[req.body.class] = req.body.new ? "1" : "0"
    newclasses = newclasses.join("")

    db.prepare('UPDATE users SET studentclasses=? WHERE userid=?').run(newclasses, req.body.userid)

    logger.log(req.session.email, studentData.email, "enroll", `${req.body.class} set to ${req.body.new}`)

    sockets.user(req.body.userid)

    res.send()
})

router.put("/status", validator.teacher, (req, res) => {
    if (typeof req.body.class !== "number") { res.sendStatus(400); return }
    else if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return }

    if (req.body.new !== true && req.body.new !== false) { res.sendStatus(400); return; }

    //Check teacher permission to edit class
    let teacherclasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses

    if (!teacherclasses) { res.sendStatus(500); return }

    //get Studentclasses and classes data of student
    let studentData = db.prepare('SELECT studentclasses, classes, email FROM users WHERE userid=?').get(req.body.userid)

    if (!studentData) { res.status(404).send("User not found"); return; }

    if (teacherclasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return; }
    if (studentData.studentclasses[req.body.class] !== '1') { res.sendStatus(400); return; }

    let newclasses = studentData.classes.split("")
    newclasses[req.body.class] = req.body.new ? "1" : "0"
    newclasses = newclasses.join("")

    db.prepare("UPDATE users SET classes=? WHERE userid=?").run(newclasses, req.body.userid)

    logger.log(req.session.email, studentData.email, "status", `${req.body.class} set to ${req.body.new}`)

    sockets.teachers()
    sockets.user(req.body.userid)

    res.send()
});


router.post("/comment", validator.teacher, (req, res) => {
    if (typeof req.body.class !== "number") { res.sendStatus(400); return; }
    if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return; }
    if (typeof req.body.comment !== "string" || !req.body.userid) { res.sendStatus(400); return; }

    // Get teacher classes
    let selfClasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses
    if (!selfClasses) { res.sendStatus(500); return; }

    // Check teacher permission
    if (selfClasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return }

    // Get student enrolled classes
    let userData = db.prepare('SELECT studentclasses, name FROM users WHERE userid=?').get(req.body.userid)

    if (!userData.studentclasses) { res.sendStatus(400); return; }

    // Check student classes
    if (userData.studentclasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return }

    // Update comment
    let commentChanges = db.prepare('UPDATE comments SET comment=? WHERE userid=? AND class=?').run(req.body.comment, req.body.userid, req.body.class).changes

    // Insert if no changes made
    if (!Boolean(commentChanges)) db.prepare('INSERT INTO comments (userid, comment, class) VALUES (?, ?, ?)').run(req.body.userid, req.body.comment, req.body.class)

    sockets.teachers(true)
    sockets.user(req.body.userid)

    res.send()
})

module.exports = router
var db = require("../services/dbUtil.js")
var logger = require("../services/logger.js")
var validator = require("../services/validator.js")

var sockets = require("./sockets.js").methods

var express = require('express')
var router = express.Router()

router.put("/enroll", validator.admin, (req, res) => {
    if (!req.body.userid) { res.sendStatus(400); return }

    if (typeof req.body.class !== "number") { res.sendStatus(400); return }
    else if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return }

    if (req.body.new !== true && req.body.new !== false) { res.sendStatus(400); return; }

    let studentData = db.prepare('SELECT studentclasses, email FROM users WHERE userid=?').get(req.body.userid)

    let studentClasses = studentData.studentclasses
    if (!studentClasses) { res.status(404).send("User not found"); return; }
X
    let newclasses = studentClasses.split("")
    newclasses[req.body.class] = req.body.new ? "1" : "0"
    newclasses = newclasses.join("")

    db.prepare('UPDATE users SET studentclasses=? WHERE userid=?').run(newclasses, req.body.userid)

    logger.log(req.session.email, studentData.email, "enroll", `${req.body.class} set to ${req.body.new}`)

    sockets.user(req.body.userid)

    res.send()
})

router.put("/status", validator.teacher, (req, res) => {
    if (typeof req.body.class !== "number") { res.sendStatus(400); return }
    else if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return }

    if (req.body.new !== true && req.body.new !== false) { res.sendStatus(400); return; }

    //Check teacher permission to edit class
    let teacherclasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses

    if (!teacherclasses) { res.sendStatus(500); return }

    //get Studentclasses and classes data of student
    let studentData = db.prepare('SELECT studentclasses, classes, email FROM users WHERE userid=?').get(req.body.userid)

    if (!studentData) { res.status(404).send("User not found"); return; }

    if (teacherclasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return; }
    if (studentData.studentclasses[req.body.class] !== '1') { res.sendStatus(400); return; }

    let newclasses = studentData.classes.split("")
    newclasses[req.body.class] = req.body.new ? "1" : "0"
    newclasses = newclasses.join("")

    db.prepare("UPDATE users SET classes=? WHERE userid=?").run(newclasses, req.body.userid)

    logger.log(req.session.email, studentData.email, "status", `${req.body.class} set to ${req.body.new}`)

    sockets.teachers()
    sockets.user(req.body.userid)

    res.send()
});


router.post("/comment", validator.teacher, (req, res) => {
    if (typeof req.body.class !== "number") { res.sendStatus(400); return; }
    if (req.body.class > 15 || req.body.class < 0) { res.sendStatus(400); return; }
    if (typeof req.body.comment !== "string" || !req.body.userid) { res.sendStatus(400); return; }

    // Get teacher classes
    let selfClasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses
    if (!selfClasses) { res.sendStatus(500); return; }

    // Check teacher permission
    if (selfClasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return }

    // Get student enrolled classes
    let userData = db.prepare('SELECT studentclasses, name FROM users WHERE userid=?').get(req.body.userid)

    if (!userData.studentclasses) { res.sendStatus(400); return; }

    // Check student classes
    if (userData.studentclasses[req.body.class] !== '1') { res.status(403).send("Class not editable"); return }

    // Update comment
    let commentChanges = db.prepare('UPDATE comments SET comment=? WHERE userid=? AND class=?').run(req.body.comment, req.body.userid, req.body.class).changes

    // Insert if no changes made
    if (!Boolean(commentChanges)) db.prepare('INSERT INTO comments (userid, comment, class) VALUES (?, ?, ?)').run(req.body.userid, req.body.comment, req.body.class)

    sockets.teachers(true)
    sockets.user(req.body.userid)

    res.send()
})

module.exports = router