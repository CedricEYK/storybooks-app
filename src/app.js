const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const csrf = require("csurf");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const connectDataBase = require("./config/database");

//* Load configenv
dotenv.config({ path: "./config/config.env" });

//* Passport config
require("./config/passport/google")(passport);
require("./config/passport/local")(passport);

//* Initialize express
const app = express();

//* Body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//* Method override for PUT and DELETE
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//* Initialize csrf protection
const csrfProtection = csrf();

//* Create mongodb session storage
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

//* Log every requests with morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//* Session middleware
app.use(
  session({
    secret: "session secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
  })
);

//* Handlebars helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

//* Handlebars view engine
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//* Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//*Set golab var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//* Use accross all routes csrf
app.use(csrfProtection);

//* implement connect-flash through all routes
app.use(flash());

//* Serving static files
app.use(express.static(path.join(__dirname, "public")));

//*Add csrf in all rendered views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

//* Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));
app.use(require("./controllers/404").get404);

const PORT = process.env.PORT || 3000;

// * Start listening for port after DB has connected and returned
connectDataBase(() => {
  app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
});
