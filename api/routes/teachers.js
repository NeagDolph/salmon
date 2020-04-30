var db = require("../services/dbUtil.js")
var logger = require("../services/logger.js")
var sockets = require("./sockets.js").methods
var validator = require("../services/validator.js")

var express = require('express')
    , router = express.Router()

router.put('/', validator.admin, (req, res) => {
    if (typeof req.body.email != "string" || !req.body.classes) { res.sendStatus(400); return; }

    //Teacher userid from email
    let userData = db.prepare('SELECT userid FROM users WHERE email=?').get(req.body.email)
    let userid = userData.userid

    if (!userid) { res.status(404).send("User not found"); return; }

    //Checks if all characters in classes are "0" or "1"
    if (req.body.classes.split("").map(e => { return ["0", "1"].includes(e) }).includes(false)) { res.sendStatus(400); return }

    db.prepare("UPDATE users SET student=2, teacherclasses=? WHERE email=?").run(req.body.classes, req.body.email)

    logger.log(req.session.email, req.body.email, "modteacher", `classes set to ${req.body.classes}`)

    sockets.request(2, req.session.userid) //Request admins to rerequest data

    sockets.user(userid)

    // res.json(getData.all(req.session.userid, db))
    res.sendStatus(200)
})


router.post('/', validator.admin, (req, res) => {
    if (typeof req.body.email != "string") { res.sendStatus(400); return; }

    //Teacher userid from email
    let userData = db.prepare('SELECT userid, email FROM users WHERE email=?').get(req.body.email)
    let userid = userData.userid

    if (userid) {
        db.prepare("UPDATE users SET student=2 WHERE email=?").run(req.body.email)

        logger.log(req.session.email, userData.email, "addteacher", '')

        sockets.request(2, req.session.userid) //Request admins to rerequest data
        sockets.user(userid)

        res.sendStatus(200)
    } else {
        db.prepare("INSERT INTO teacherqueue VALUES (?, ?)").run(req.body.email, req.session.userid)

        res.send("queue")
    }
})

router.delete('/:email', validator.admin, (req, res) => {
    if (!req.params.email) { res.sendStatus(400); return; }

    let userData = db.prepare('SELECT userid, email FROM users WHERE email=?').get(req.params.email)
    let userid = userData.userid

    if (!userid) { res.status(404).send("User not found") }

    db.prepare("UPDATE users SET student=1 WHERE userid=?").run(userid)

    logger.log(req.session.email, userData.email, 'delteacher', '')

    sockets.request(2, req.session.userid)
    sockets.user(userid)

    res.send()
})


module.exports = router