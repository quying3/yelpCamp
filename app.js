const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
// const Joi = require("joi");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const usersRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; // short
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: "false",
  saveUninitialized: "true",
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    MaxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Don't have to pass anything to routes
app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get("/fakeUser", async (req, res) => {
//   const user = new User({ email: "colttttt@gmail.com", username: "coltttt" });
//   const newUser = await User.register(user, "chiken");
//   res.send(newUser);
// });

app.use("/", usersRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  // res.send("404!!!");
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statuscode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statuscode).render("error", { err });
  // const { statuscode = 500, message = "Something went wrong" } = err;
  // res.status(statuscode).send(message);

  // res.send("Oh Boy, something went wrong");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
