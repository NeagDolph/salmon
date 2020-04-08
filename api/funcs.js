const config = require('./config.json');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(config.googleAuthCode);



module.exports.data = {
  all(userid, db, extradata=false) {
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

      if (extradata) data.userlist = this.userlist(db, true)
    } else data.comments = db.prepare('SELECT class, comment FROM comments WHERE userid=?').all(userid)
  
    if (config.admins.includes(userData.email)) {
      data.teacherlist = db.prepare('SELECT email, name, userid, teacherclasses FROM users WHERE student = 2').all()
  
      if (data.userlist ? data.userlist.length : false) data.adminusers = "userlist";
      else data.adminusers = db.prepare('SELECT email, name, userid, classes, studentclasses FROM users WHERE student = 1').all()
    }
  
    return data
  },
  userlist(db, comments=false) {
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
}

module.exports.expressauth = typevalues => {
  let teacher = !!(typevalues & 1)
  let admin = !!(typevalues & 2)

  return (req, res, next) => {
    if (req.session.userid) {
      if (teacher && !req.session.teacher) {
        res.sendStatus(403);
        return;
      }

      if (admin && !config.admins.includes(req.session.email)) {
        res.sendStatus(403);
        return;
      }

      next()

    } else {res.sendStatus(403); console.log(req.session)};
  }
}


module.exports.getcreds = async(idToken) => {
  const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: config.googleAuthCode,
  });

  let payload = ticket.getPayload();

  return payload
}