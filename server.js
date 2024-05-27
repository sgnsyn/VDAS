const express = require("express");
const path = require("path");
const session = require("express-session");
const error_handler = require("./middlewares/error-handler");
const db_connection = require("./config/db-connection");
const bodyParser = require("body-parser");
const is_authenticated = require("./middlewares/authenticate");
const is_authorized = require("./middlewares/authorize");
const dotenv = require("dotenv").config();
const MySQLStore = require("express-mysql-session")(session);

const port = process.env.PORT || 5000;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});

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
    cookie: { maxAge: 1000 * 60 * 30 }, // 30 minutes
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(is_authenticated);

app.use("/", require("./routes/auth"));
//admin routes
app.use("/users", is_authorized("admin"), require("./routes/admin/users"));
app.use("/admin", is_authorized("admin"), require("./routes/admin/dashboard"));
app.use("/alert-logs", is_authorized("admin"), require("./routes/admin/alert-logs"));
app.use("/cctv", is_authorized("admin"), require("./routes/admin/cctv"));
app.use("/locations", is_authorized("admin"), require("./routes/admin/locations"));
app.use("/reports", is_authorized("admin"), require("./routes/admin/reports"));

//groupnd personnel routes
app.use("/ground_personnel", require("./routes/ground_personnel/dashboard"));
