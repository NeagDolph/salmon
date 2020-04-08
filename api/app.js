//Import Config
var config = require('./config.json');

//Import Dependencies
var redis = require('redis')
var uuid4 = require('uuid4');
var express = require("express")
var bodyParser = require('body-parser')
var Server = require("http").Server
var db = require('better-sqlite3')(config.db);
var helmet = require('helmet');
var compression = require('compression');
var session = require("express-session")

const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);

var app = express();
var server = Server(app);
var io = require("socket.io")(server);

redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

//Initializations
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.Secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 }),
}))

//Import extra functions
var funcs = require('./funcs.js');
var getData = funcs.data
var expressauth = funcs.expressauth

//Add middleware to app
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug')

app.get("/", (req, res) => {
  let loadData = {userid: req.session.userid ? req.session.userid : false, data: req.session.userid ? getData.all(req.session.userid, db, true) : false}
  res.render('home', {loadData: Buffer.from((JSON.stringify(loadData))).toString('base64')});
})

/**
 * @api {post} /api/auth/:idtoken Authenticates user using Google ID token
 * @apiGroup Auth
 * @apiParam {String} idtoken Google ID token
 * @apiError {String} 403 This google account is not in the alt.app gsuite
 * @apiError {String} 400 Bad request
 */
app.post("/api/auth/:idtoken", (req, res) => {
  let {idtoken} = req.params

  if (!idtoken) {
    req.session.destroy();
    res.sendStatus(400);
    return
  }

  let inDB
  if (req.session.userid) inDB = db.prepare('SELECT * FROM users WHERE userid=?').get(req.session.userid)

  if (!req.session.userid || !inDB) {
    funcs.getcreds(idtoken)
    .catch(console.log)
    .then(googleData => {
      if (!googleData) {
        res.sendStatus(500)
        return
      }

      if (googleData.hd !== "alt.app" && !config.allowedThirdParty.includes(googleData.email)) {
        console.log("Non ATI email tried signing up (Email:", googleData.email + ")")
        req.session.destroy()
        res.status(403).send("This google account is not in the alt.app gsuite")
        return
      }

      let userData = db.prepare('SELECT * FROM users WHERE email=?').get(googleData.email)
      let userid

      if (userData) {
        //Login user without cookies
        userid = userData.userid

        req.session.userid = userid
        req.session.teacher = userData.student == 2
      } else {
        // Signup user
        userid = String(uuid4())
        req.session.userid = userid
        req.session.teacher = false

        db.prepare("INSERT INTO users VALUES (?,?,?,1,'000000000000000','111111111111111','101011000000000')")
          .run(googleData.email, googleData.name, userid)

        updateteachers()
      }

      req.session.email = googleData.email
      req.session.name = googleData.name

      res.json(getData.all(userid, db))

    })

  } else {
    res.json(getData.all(req.session.userid, db))
  }
});

/**
 * @api {put} /api/student/enroll Modify classes a student is enrolled in
 * @apiGroup Students
 * @apiParam {String} userid Salmon user identifier
 * @apiParam {Int} class Index of class to change enroll status of
 * @apiParam {Boolean} new New enrollment status of class
 * @apiError {String} 404 User not found
 * @apiError {String} 400 Bad request
 * @apiError {String} 403 No permission
 */
app.put("/api/student/enroll", expressauth(2), (req, res) => {
  if (!req.body.userid) {res.sendStatus(400); return}

  if (typeof req.body.class !== "number") {res.sendStatus(400); return}
  else if (req.body.class > 15 || req.body.class < 0) {res.sendStatus(400); return}

  if (req.body.new !== true && req.body.new !== false) {res.sendStatus(400); return;}

  let studentData = db.prepare('SELECT studentclasses, email FROM users WHERE userid=?').get(req.body.userid)
  
  let studentClasses = studentData.studentclasses
  if (!studentClasses) {res.status(404).send("User not found"); return;}

  let newclasses = studentClasses.split("")
  newclasses[req.body.class] = req.body.new ? "1" : "0"
  newclasses = newclasses.join("")

  db.prepare('UPDATE users SET studentclasses=? WHERE userid=?').run(newclasses, req.body.userid)

  logchange(req.session.email, studentData.email, "enroll", `${req.body.class} set to ${req.body.new}`)

  updateuser(req.body.userid)

  res.send()
})

/**
 * @api {put} /api/student/status Edit student specific class status
 * @apiGroup Students
 * @apiParam {String} userid Salmon user identifier
 * @apiParam {Int} class Index of class to change status of
 * @apiParam {Boolean} new New status of class
 * @apiError {String} 404 User not found
 * @apiError {String} 400 Bad request
 * @apiError {String} 403 No permission
 * @apiError {String} 403 Class not editable
 */
app.put("/api/student/status", expressauth(1), (req, res) => {
  if (typeof req.body.class !== "number") {res.sendStatus(400); return}
  else if (req.body.class > 15 || req.body.class < 0) {res.sendStatus(400); return}

  if (req.body.new !== true && req.body.new !== false) {res.sendStatus(400); return;}

  //Check teacher permission to edit class
  let teacherclasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses

  if (!teacherclasses) {res.sendStatus(500); return}

  //get Studentclasses and classes data of student
  let studentData = db.prepare('SELECT studentclasses, classes, email FROM users WHERE userid=?').get(req.body.userid)

  if (!studentData) {res.status(404).send("User not found"); return;}

  if (teacherclasses[req.body.class] !== '1') {res.status(403).send("Class not editable"); return;}
  if (studentData.studentclasses[req.body.class] !== '1') {res.sendStatus(400); return;}
      
  let newclasses = studentData.classes.split("")
  newclasses[req.body.class] = req.body.new ? "1" : "0"
  newclasses = newclasses.join("")

  db.prepare("UPDATE users SET classes=? WHERE userid=?").run(newclasses, req.body.userid)

  logchange(req.session.email, studentData.email, "status", `${req.body.class} set to ${req.body.new}`)

  updateteachers()
  updateuser(req.body.userid)

  res.send()
})

/**
 * @api {put} /api/teacher Edit teacher classes
 * @apiGroup Teachers
 * @apiParam {String} email Email of teacher
 * @apiError {String} 404 User not found
 * @apiError {String} 400 Bad request
 * @apiError {String} 403 No permission
 */
app.put('/api/teacher', expressauth(2), (req, res) => {
  if (typeof req.body.email != "string" || !req.body.classes) {res.sendStatus(400); return;}
  
  //Teacher userid from email
  let userData = db.prepare('SELECT userid FROM users WHERE email=?').get(req.body.email)
  let userid = userData.userid

  if (!userid) {res.status(404).send("User not found"); return;}

  //Checks if all characters in classes are "0" or "1"
  if (req.body.classes.split("").map(e => {return ["0", "1"].includes(e)}).includes(false)) {res.sendStatus(400); return}
    
  db.prepare("UPDATE users SET student=2, teacherclasses=? WHERE email=?").run(req.body.classes, req.body.email)

  logchange(req.session.email, req.body.email, "modteacher", `classes set to ${req.body.classes}`)

  updatereq(2, req.session.userid) //Request admins to rerequest data

  updateuser(userid)

  // res.json(getData.all(req.session.userid, db))
  res.send()
})

/**
 * @api {post} /api/teacher Add a new teacher
 * @apiGroup Teachers
 * @apiParam {String} email Email of user
 * @apiError {String} 404 User not found
 * @apiError {String} 400 Bad request
 * @apiError {String} 403 No permission
 * @apiSuccess (200) {String} success Successfully made user a teacher
 * @apiSuccess (200) {String} queue Added email to teacher queue
 */
app.post('/api/teacher', expressauth(2), (req, res) => {
  if (typeof req.body.email != "string") {res.sendStatus(400); return;}
  //Teacher userid from email
  let userData = db.prepare('SELECT userid, email FROM users WHERE email=?').get(req.body.email)
  let userid = userData.userid

  if (userid) {
    db.prepare("UPDATE users SET student=2 WHERE email=?").run(req.body.email)

    logchange(req.session.email, userData.email, "addteacher", '')

    updatereq(2, req.session.userid) //Request admins to rerequest data

    updateuser(userid)

    res.send()
  } else {
    db.prepare("INSERT INTO teacherqueue VALUES (?, ?)").run(req.body.email, req.session.userid)
  
    res.send("queue")
  }
})

app.delete('/api/teacher/:email', expressauth(2), (req, res) => {
  if (!req.params.email) {res.sendStatus(400); return;}

  let userData = db.prepare('SELECT userid, email FROM users WHERE email=?').get(req.params.email)
  let userid = userData.userid

  if (!userid) {res.status(404).send("User not found")}

  db.prepare("UPDATE users SET student=1 WHERE userid=?").run(userid)

  logchange(req.session.email, userData.email, 'delteacher', '')

  updatereq(2, req.session.userid)
  updateuser(userid)

  res.send()
})

app.post("/api/comment/:userid", expressauth(1), (req, res) => {
  if (typeof req.body.class !== "number") {res.sendStatus(400); return;}
  if (req.body.class > 15 || req.body.class < 0) {res.sendStatus(400); return;}
  if (typeof req.body.comment !== "string" || !req.params.userid) {res.sendStatus(400); return;}

  // Get teacher classes
  let selfClasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses
  if (!selfClasses) {res.sendStatus(500); return;}

  // Check teacher permission
  if (selfClasses[req.body.class] !== '1') {res.status(403).send("Class not editable"); return}
  
  // Get student enrolled classes
  let userData = db.prepare('SELECT studentclasses, name FROM users WHERE userid=?').get(req.params.userid)

  if (!userData.studentclasses) {res.sendStatus(400); return;}

  // Check student classes
  if (userData.studentclasses[req.body.class] !== '1') {res.status(403).send("Class not editable"); return}

  // Update comment
  let commentChanges = db.prepare('UPDATE comments SET comment=? WHERE userid=? AND class=?').run(req.body.comment, req.params.userid, req.body.class).changes

  // Insert if no changes made
  if (!Boolean(commentChanges)) db.prepare('INSERT INTO comments (userid, comment, class) VALUES (?, ?, ?)').run(req.params.userid, req.body.comment, req.body.class)

  // logchange(req.session.userid, req.body.userid, 'comment', `Added comment on ${config.classnames[req.body.class]}: '${req.body.comment}'`, req.session.name, userData.name)

  updateteachers(true)
  updateuser(req.body.userid)

  res.send() 
})

app.get('/api/data', expressauth(), (req, res) => {
  let userData = getData.all(req.session.userid, db, true)
  req.session.teacher = userData.teacher
  res.json(userData)
})

app.get('/api/logs', expressauth(2), (req, res) => {
  if (!req.body.subset) {res.sendStatus(400); return;}
  if (!Number.isInteger(req.body.subset[0]) || !Number.isInteger(req.body.subset[1])) {res.sendStatus(400); return;}
})

app.post('/api/deauth', expressauth(), (req, res) => {
  req.session.destroy()
  res.end()
})

var updateteachers = () => {
  let userlist = getData.userlist(db, true)
  
  io.to("teachers").emit("users", {"userlist": userlist})
}

var updateuser = (userid, extradata=false) => {
  io.to(userid).emit("update", getData.all(userid, db, extradata));
  console.log("send off to", userid)
}

var logchange = (email, targetEmail, actiontype, change ) => {
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

var updatereq = (usertype, exception) => {
  const types = ["student", "teacher", "admins"]

  io.to(types[usertype]).emit('updatereq', {exception: exception})
}


io.on('connection', socket => {
  socket.on('room', async room => {
    socket.join(room);
    console.log('join', room)
  })
});

var port = process.env.PORT ? process.env.PORT : 8083
server.listen(port, () => console.log(`Express server started on port ${port}`));