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
    studentclasses: userData.studentclasses,
    teacherlist: "", adminusers: "", comments: "", userlist: "", commentlist: "",
  }

  if (!userData) return "error"

  if (userData.student == 2) {
    if (extradata) {
      let commentlist = db.prepare('SELECT userid, class, comment FROM comments').all()
      data.userlist = db.prepare('SELECT email, name, userid, classes, studentclasses FROM users WHERE student = 1').all().map(user => {
        let objcomments = commentlist.filter(e => e.userid == user.userid)
        let arrcomments = []
        objcomments.forEach(el => {
          arrcomments[el.class] = el.comment
        });
        user.comments = arrcomments
        return user
      })
    } else {
      data.userlist = db.prepare('SELECT email, name, userid, classes, studentclasses FROM users WHERE student = 1').all()
    }
  } else data.comments = db.prepare('SELECT class, comment FROM comments WHERE userid=?').all(userid)

  if (config.admins.includes(userData.email)) {
    data.teacherlist = db.prepare('SELECT email, name, userid, teacherclasses FROM users WHERE student = 2').all()

    if (data.userlist.length) data.adminusers = "userlist";
    else data.adminusers = db.prepare('SELECT email, name, userid, classes, studentclasses FROM users WHERE student = 1').all()
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