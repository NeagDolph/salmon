const config = require('./config.json');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(config.googleAuthCode);



module.exports.getdata = (userid, db, extradata=false) => {
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
    teacherlist: "", adminusers: "", comments: "", userlist: "", commentlist: "",
  }

  if (!userData) return "error"

  if (userData.student == 2) {
    data.userlist = db.prepare('SELECT email, name, userid, classes FROM users WHERE student = 1').all()

    if (extradata) data.commentlist = db.prepare('SELECT userid, class, comment FROM comments').all()
  } else data.comments = db.prepare('SELECT class, comment FROM comments WHERE userid=?').all(userid)

  if (config.admins.includes(userData.email)) {
    data.teacherlist = db.prepare('SELECT email, name, userid, teacherclasses FROM users WHERE student=2').all()

    data.adminusers = db.prepare('SELECT email, name, userid, classes, studentclasses, student FROM users WHERE student=1').all()
  }

  return data

}

module.exports.getcreds = async(idToken) => {
  const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: config.googleAuthCode,
  });

  let payload = ticket.getPayload();

  return payload
}