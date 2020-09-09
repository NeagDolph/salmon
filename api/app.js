//Import Config
var config = require("./config.json");

//Import Dependencies
var express = require("express");
var Server = require("http").Server;
var helmet = require("helmet");
var compression = require("compression");
var session = require("express-session");
var redis = require("redis");
var socket = require("./routes/sockets.js");

//Initialize express
var app = express();
var server = Server(app);

//Initialize Redis
var redisClient = redis.createClient();
var redisStore = require("connect-redis")(session);
app.use(
	session({
		secret: config.Secret,
		resave: false,
		saveUninitialized: false,
		store: new redisStore({
			host: "localhost",
			port: 6379,
			client: redisClient,
			ttl: 86400
		})
	})
);

//Configure express
app.set("trust proxy", "1");
app.set("view engine", "pug");

//Add middleware to app
app.use(helmet());
app.use(compression());
app.use(express.json());

//Load sockets before loading routes
socket
	.load(server)
	.then(() => {
		//Load routes
		var studentRoutes = require("./routes/students.js");
		var teacherRoutes = require("./routes/teachers.js");
		var accountRoutes = require("./routes/accounts.js");
		var indexRoutes = require("./routes/index.js");

		//Use routes
		app.use("/", indexRoutes);
		app.use("/api/student", studentRoutes);
		app.use("/api/teacher", teacherRoutes);
		app.use("/api", accountRoutes);

		var port = process.env.PORT ? process.env.PORT : 8083;
		server.listen(port, () =>
			console.log(`Express server started on port ${port}`)
		);
	});
