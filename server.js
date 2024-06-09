const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const MySQLStore = require("express-mysql-session")(session);
const http = require("http");

const db_connection = require("./config/db-connection");
const is_authenticated = require("./middlewares/authenticate");
const is_authorized = require("./middlewares/authorize");

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

server.listen(port, () => {
  console.log(`listening on port ${port} `);
});

//  socket stuff
app.io = io;
io.session_map = {};
io.on("connection", (socket) => {
  socket.emit("request_id");
  socket.on("get_id", (id) => {
    io.session_map[id] = socket.id;
  });

  socket.on("disconnect", () => {
    for (let key of Object.keys(io.session_map)) {
      if (io.session_map[key] === socket.id) {
        delete io.session_map[key];
      }
    }
  });
});
// socket stuff

const sessionConnection = db_connection;
const sessionStore = new MySQLStore(
  {
    expiration: 864000000,
    createDatabaseTable: true,
    schema: {
      tableName: "session",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  sessionConnection
);

app.use(
  session({
    key: process.env.COOKIE_KEY,
    secret: "process.env.SESSION_SECRET",
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 }, // 30 minutes
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50  mb" }));

app.use(is_authenticated);

app.use("/", require("./routes/auth"));
//admin routes
app.use("/users", is_authorized("admin"), require("./routes/admin/users"));
app.use("/admin", is_authorized("admin"), require("./routes/admin/dashboard"));
app.use("/alert-logs", is_authorized("admin"), require("./routes/admin/alert-logs"));
app.use("/cctv", is_authorized("admin"), require("./routes/admin/cctv"));
app.use("/locations", is_authorized("admin"), require("./routes/admin/locations"));
app.use("/reports", is_authorized("admin"), require("./routes/admin/reports"));

//ground personnel routes
app.use("/ground_personnel", require("./routes/ground_personnel/dashboard"));

//office routes
app.use("/office", require("./routes/office_personnel/office"));
