//Import Config
var config = require('./config.json');

//Import Dependencies
var redis = require('redis')
var crypto = require('crypto')
var uuid4 = require('uuid4');
var express = require("express")
var bodyParser = require('body-parser')
var Server = require("http").Server
var session = require("express-session")
var db = require('better-sqlite3')(config.db);

var compression = require('compression');



//Initializations
var RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient()

var app = express();
var server = Server(app);
var io = require("socket.io")(server);

var sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true
});

//Import extra functions
var funcs = require('./funcs.js');

//Add middleware to app
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});
app.use(compression());
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug')

app.get("/", (req, res) => {
  let loadData = {userid: req.session.userid ? req.session.userid : false}
  res.render('home', {loadData: JSON.stringify(loadData)});
})


//Login function called after google authenticated on frontend
app.post("/api/login", (req, res) => {
  let {idtoken} = req.body

  if (!idtoken) {
    req.session.destroy();
    res.status(500).send("error");
    return
  }

  let inDB
  if (req.session.userid) inDB = db.prepare('SELECT * FROM users WHERE userid=?').get(req.session.userid)

  if (!req.session.userid || !inDB) {
    funcs.getcreds(idtoken)
    .catch(console.log)
    .then(googleData => {
      if (!googleData) {
        res.status(500).send("error")
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
        console.log("User signed in on email:", googleData.email)

        userid = userData.userid

        req.session.userid = userid
        req.session.teacher = userData.student == 2
      } else {
        // Signup user
        userid = String(uuid4())
        console.log("EY", userid)
        req.session.userid = userid
        req.session.teacher = false

        console.log("User signed up on email:", googleData.email)

        db.prepare("INSERT INTO users VALUES (?,?,?,1,'000000000000000','111111111111111','101011000000000')")
          .run(googleData.email, googleData.name, userid)

        updateteachers()
      }

      req.session.email = googleData.email
      req.session.name = googleData.name

      res.json(funcs.getdata(userid, db))

    })

  } else {
    res.json(funcs.getdata(req.session.userid, db))
  }
});

//Edit classes students are enrolled in
app.post("/api/student/enrolled", (req, res) => {
  if (req.session.userid && config.admins.includes(req.session.email)) {

    if (!req.body.userid) {res.status(400).send("No userid provided"); return}

    if (typeof req.body.class !== "number") {res.status(400).send("Class input not a number"); return}
    else if (req.body.class > 15 || req.body.class < 0) {res.status(400).send("Class input out of range"); return}
  
    if (!["0", "1"].includes(req.body.new)) {res.status(400).send("NewClass input not of correct type"); return;}

    let studentClasses = db.prepare('SELECT studentclasses FROM users WHERE userid=?').get(req.body.userid).studentclasses
    if (!studentClasses) {res.status(404).send("User not found"); return;}

    let newclasses = studentClasses.split("")
    newclasses[req.body.class] = req.body.new
    newclasses = newclasses.join("")

    db.prepare('UPDATE users SET studentclasses=? WHERE userid=?').run(newclasses, req.body.userid)

    updateteachers()
    updatereq(2)
    updateuser(req.body.userid)

    res.send("success")

  } else res.status(403).send("No permission")
})

// Edit student specific class status
app.post("/api/student/status", (req, res) => {
  if (req.session.teacher && req.session.userid) {
    if (typeof req.body.class !== "number") {res.status(400).send("Class input not a number"); return}
    else if (req.body.class > 15 || req.body.class < 0) {res.status(400).send("Class input out of range"); return}
  
    if (!["0", "1"].includes(req.body.new)) {res.status(400).send("NewClass input not of correct type"); return;}
  
    //Check teacher permission to edit class
    let teacherclasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses

    if (!teacherclasses) {res.status(500).send("Permission check error cookies may be glitched. Please logout then in"); return}


    if (teacherclasses[req.body.class] == '1') {
      //get classes of student
      let studentClasses = db.prepare('SELECT classes FROM users WHERE userid=?').get(req.body.userid).classes
      if (!studentClasses) {res.status(404).send("User not found"); return;}
      
      let newclasses = studentClasses.split("")
    
      newclasses[req.body.class] = req.body.new
      newclasses = newclasses.join("")

      db.prepare("UPDATE users SET classes=? WHERE userid=?").run(newclasses, req.body.userid)

      updateteachers()
      updateuser(req.body.userid)

      res.send("success")
    
    } else res.status(403).send("No permission to edit this class")
  } else {
    res.status(403)
    console.log("No perm", req.session)
  }
})

app.post('/api/teacher/add', (req, res) => {
  if (req.session.userid && config.admins.includes(req.session.email)) {
    if (typeof req.body.email != "string") res.status(400).end()
    //Teacher userid from email
    let userid = db.prepare('SELECT userid FROM users WHERE email=?').get(req.body.email).userid

    if (userid) {
      if (req.body.update && req.body.classes) {
        //Checks if all characters in classes are "0" or "1"
        if (req.body.classes.split("").map(e => {return ["0", "1"].includes(e)}).includes(false)) {res.status(400).send("classes are not in correct format")}
        
        db.prepare("UPDATE users SET student=2, teacherclasses=? WHERE email=?").run(req.body.classes, req.body.email)
      } else {
        db.prepare("UPDATE users SET student=2 WHERE email=?").run(req.body.email)
      }

      updatereq(2) //Request admins to rerequest data

      updateuser(userid)

      // res.json(funcs.getdata(req.session.userid, db))
      res.send("success")
    } else {
      db.prepare("INSERT INTO teacherqueue VALUES (?, ?)").run(req.body.email, req.session.userid)
    
      res.send("queue")
    }
  } else res.status(403).send("No permission")
})

app.post('/api/teacher/del', (req, res) => {
  if (req.session.userid && config.admins.includes(req.session.email)) {
    if (!req.body.email) {res.status(400).send("No email provided"); return;}

    let userid = db.prepare('SELECT userid FROM users WHERE email=?').get(req.body.email).userid

    if (!userid) {res.status(400).send("User does not exist")}

    db.prepare("UPDATE users SET student=1 WHERE userid=?").run(userid)
  
    updatereq(2)
    updateuser(userid)

    res.send("success")
  
  } else res.status(403).send("No permission")
})

app.post("/api/comment/create", (req, res) => {
  if (req.session.teacher && req.session.userid) {
    if (typeof req.body.class !== "number") {res.status(400).send("Class index not an integer"); return;}
    if (req.body.class > 15 || req.body.class < 0) {res.status(400).send("Class index out of range"); return;}
    if (typeof req.body.comment !== "string") {res.status(400).send("Comment not string"); return;}
    if (!req.body.userid) {res.status(400).send("Userid not provided"); return;}

    let selfClasses = db.prepare('SELECT teacherclasses FROM users WHERE userid=?').get(req.session.userid).teacherclasses
    if (!selfClasses) {res.status(400).send("User does not exist"); return;}
  
    // Check teacher permission
    if (selfClasses[req.body.class] !== '1') {res.status(403).send("No permission to edit this class"); return}

    let commentHash = crypto.createHash("md5").update(req.body.userid + String(req.body.class)).digest('hex')
  
    // Insert or ignore if error
    db.prepare('INSERT OR IGNORE INTO comments (userid, comment, class, commentsha) VALUES (?, ?, ?, ?)').run(req.body.userid, req.body.comment, req.body.class, commentHash)
  
    // Update with commentsha if already exists
    db.prepare('UPDATE comments SET comment=? WHERE commentsha=?').run(req.body.comment, commentHash)

    updateteachers(true)
    updateuser(req.body.userid)

    res.send("success")

  } else res.status(403).send("No permission")
})

app.get('/api/getdata', (req, res) => {
  if (req.session.userid) {
    let data = funcs.getdata(req.session.userid, db, true)
    req.session.teacher = data.teacher
    res.json(data)
  }
  else res.status(403).send("not authorized")
})

app.get('/api/logout', (req, res) => {
  req.session.destroy()
  res.end()
})

var updateteachers = (getcomments=false) => {
  let userlist = db.prepare('SELECT email, name, userid, classes FROM users WHERE student = 1').all()
  let commentlist

  if (getcomments) commentlist = db.prepare('SELECT userid, class, comment FROM comments').all()
  
  io.to("teachers").emit("users", {"users": userlist, "comments": commentlist})
}

var updateuser = (userid, extradata=false) => {
  io.to(userid).emit("update", funcs.getdata(userid, db, extradata));
}

var updatereq = usertype => {
  const types = ["student", "teacher", "admins"]

  io.to(types[usertype]).emit('updatereq')
}



io.on('connection', socket => {
  let {teacher, userid, email, name} = socket.request.session
  let isAdmin = config.admins.includes(email)

  if (!userid) return;

  // console.log(`User ${email} connected to socket`)

  socket.join(userid)

  if (teacher) socket.join("teachers");
  else {
    socket.join("students");
  }

  if (isAdmin) socket.join("admins");
});


server.listen(process.env.PORT, () => console.log(`Express server started on port ${process.env.PORT}`));