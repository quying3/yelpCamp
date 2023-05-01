const { campgroundSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

// reviews
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    // if do not return, it will execute what is next anyway.
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//users
module.exports.isLoggedIn = (req, res, next) => {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    // req.session.returnTo = req.originalUrl;
    console.log(req.query._method);
    req.session.returnTo = req.query._method
      ? `/campgrounds/${id}`
      : req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// campgrounds
module.exports.validateCampground = (req, res, next) => {
  // client side
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    // map: copy array
    // join: join element in array
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
  // console.log(result);
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    // if do not return, it will execute what is next anyway.
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
