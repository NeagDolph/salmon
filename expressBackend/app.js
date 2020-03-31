//Import Config
var config = require('./config.json');

//Import Dependencies
var redis = require('redis')
var uuid4 = require('uuid4');
var express = require("express")
var bodyParser = require('body-parser')
var Server = require("http").Server
var session = require("express-session")
var db = require('better-sqlite3')(config.db);


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
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

        req.session.userid = userData.userid
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

      res.json(funcs.getdata(userData.userid, db))

    })

  } else {
    res.json(funcs.getdata(req.session.userid, db))
  }
});

app.get('/api/getdata', (req, res) => {
  if (req.session.userid) res.json(funcs.getdata(req.session.userid, db));
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

var updateuser = (userid) => {
  io.to(userid).emit("update", funcs.getdata(userid, db));
}



io.on('connection', socket => {
  let {teacher, userid, email, name} = socket.request.session
  let isAdmin = config.admins.includes(email)

  if (!userid) return;

  console.log(`User ${email} connected to socket`)

  socket.join(userid)

  if (teacher) socket.join("teachers");
  else {
    socket.join("students");
    updateuser(userid)
  }

  if (isAdmin) socket.join("admins");
});


server.listen(8083, () => console.log("Express server started"));