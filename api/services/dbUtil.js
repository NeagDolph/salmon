var sqlite = require('better-sqlite3')
var config = require("../config.json")

var db = sqlite(config.db)

module.exports = db