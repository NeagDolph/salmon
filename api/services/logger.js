var db = require("./dbUtil.js")

module.exports.log = (email, targetEmail, actiontype, change) => {
    try {
        db.prepare("INSERT INTO changelog (actiontype, change, email, targetEmail) VALUES (?, ?, ?, ?)")
            .run(
                actiontype,
                change,
                email,
                targetEmail
            )
    }
    catch (e) {
        console.log("log error", e)
    }
}