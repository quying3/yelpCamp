const express = require("express");
const router = express.Router({ mergeParams: true });
// app.use("/campgrounds/:id/reviews", reviews);
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");

// const Campground = require("../models/campground");
// const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
// Reviews Route

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
