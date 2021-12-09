const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const passport = require("passport");
const morgan = require("morgan");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const { Session } = require("inspector");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db")();
const PORT = process.env.PORT || 80;

//Logging
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

//fav icon
const favicon = require("serve-favicon");
app.use(favicon(path.join(__dirname, "favicon.png")));

//static folder setup
app.use(express.static(path.join(__dirname, "/public")));

// Load config

//Passport Config
require("./config/passport")(passport);

// Handlebars Setup
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//sessions
app.use(
  session({
    secret: "story book",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

//Passpot middlewares
app.use(passport.initialize());
app.use(passport.session());

//Body Config
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes Config
const router = require("./routes");
const auth = require("./routes/auth");
const story = require("./routes/story");

//routes

app.use(router);
app.use("/auth", auth);
app.use(story);
app.use((req, res) => {
  res.status(404).render("errors/error404", { layout: "layout2" });
});

app.listen(PORT, () =>
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
