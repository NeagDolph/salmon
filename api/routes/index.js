var validator = require("../services/validator.js");
var data = require("../services/data.js");

var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
	let userData = req.session.userid
		? data.getCompiled(req.session.userid, true)
		: false;

	let loadData = {
		userid: req.session.userid ? req.session.userid : false,
		data: userData
	};

	res.render("home", {
		loadData: Buffer.from(JSON.stringify(loadData)).toString("base64")
	});
});

router.get("/api/data", validator.student, (req, res) => {
	let userData = data.getCompiled(req.session.userid, true);
	req.session.teacher = userData.teacher;
	res.json(userData);
});

router.get("/api/logs", validator.admin, (req, res) => {
	if (!req.body.subset) {
		res.sendStatus(400);
		return;
	}
	if (
		!Number.isInteger(req.body.subset[0]) ||
		!Number.isInteger(req.body.subset[1])
	) {
		res.sendStatus(400);
		return;
	}
});

module.exports = router;
