var uuid4 = require('uuid4');
var sockets = require("./sockets.js").methods

var config = require('../config.json');

var data = require("../services/data.js")
var auth = require("../services/auth.js")
var validator = require("../services/validator.js")
var db = require("../services/dbUtil.js")

var express = require('express')
    , router = express.Router()


var account = {
    login(req, userData) {
        //Login user without cookies
        console.log("EEP")
        req.session.userid = userData.userid;
        req.session.teacher = userData.student == 2;
        req.session.email = userData.email;
        req.session.name = userData.name;

        return userData.userid
    }, 
    
    register(req, googleData) {
        // Signup user
        userid = String(uuid4())

        req.session.userid = userid
        req.session.teacher = false
        req.session.email = googleData.email
        req.session.name = googleData.name

        db.prepare("INSERT INTO users VALUES (?,?,?,1,'000000000000000','111111111111111','101011000000000')")
            .run(googleData.email, googleData.name, userid)

        sockets.teachers()

        return userid
    }
}


router.post("/auth/:idtoken", (req, res) => {
    if (!req.params.idtoken) { res.sendStatus(400); return; }

    if (req.session.userid) { res.json(data.all(req.session.userid)); return; }

    auth(req.params.idtoken)
        .then(googleData => {
            if (googleData.hd !== "alt.app" && !config.allowedThirdParty.includes(googleData.email)) {
                console.log("Non ATI email tried signing up (Email:", googleData.email + ")")
                req.session.destroy()
                res.status(403).send("This google account is not in the alt.app gsuite")
                return
            }

            let userData = db.prepare('SELECT * FROM users WHERE email=?').get(googleData.email)

            let userid

            if (userData) userid = account.login(req, userData);
            else userid = account.register(req, googleData)

            res.json(data.all(userid, true))
        })
        .catch(console.log)
});

router.post('/deauth', validator.student, (req, res) => {
    req.session.destroy()
    res.end()
})
  

module.exports = router