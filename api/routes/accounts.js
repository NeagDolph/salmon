var uuid4 = require("uuid4");
var sockets = require("./sockets.js").methods;

var config = require("../config.json");

var data = require("../services/data.js");
var auth = require("../services/auth.js");
var validator = require("../services/validator.js");
var db = require("../services/dbUtil.js");

var express = require("express");

var router = express.Router();

var account = {
    login(req, userData) {
        //Login user without cookies
        req.session.userid = userData.userid;
        req.session.teacher = userData.student == 2;
        req.session.email = userData.email;
        req.session.name = userData.name;

        return userData.userid;
    },

    register(req, googleData) {
        // Signup user
        userid = String(uuid4());

        req.session.userid = userid;
        req.session.teacher = false;
        req.session.email = googleData.email;
        req.session.name = googleData.name;
        req.session.save();

        data.createUser(googleData.email, googleData.name, userid, false);

        sockets.teachers();

        return userid;
    }
};

router.post("/auth/:idtoken", (req, res) => {
    if (!req.params.idtoken) {
        res.sendStatus(400);
        return;
    }

    if (req.session.userid) {
        res.json(data.getCompiled(req.session.userid));
        return;
    }

    auth(req.params.idtoken)
        .then(googleData => {
            if (
                googleData.hd !== "alt.app" &&
                !config.allowedThirdParty.includes(googleData.email)
            ) {
                console.log(
                    "Non ATI email tried signing up (Email:",
                    googleData.email + ")"
                );
                req.session.destroy();
                res
                    .status(403)
                    .send("This google account is not in the alt.app gsuite");
                return;
            }

            let userid;

            let userData = data.emailExists(googleData.email)

            if (userData) {
                userid = account.login(req, userData);
            } else userid = account.register(req, googleData);

            res.json(data.getCompiled(userid, true));
        })
        .catch(console.log);
});

router.post("/deauth", validator.student, (req, res) => {
    req.session.destroy();
    res.end();
});

module.exports = router;
