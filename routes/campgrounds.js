const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const Campground = require("../models/campground");

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({}).populate("reviews");
  res.render("campgrounds/index", { campgrounds });
});

router.get("/new", isLoggedIn, async (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    // { campground: { title: 'hihi', location: 'hehe' } }
    // console.log(req.body);
    // if (!req.body.Campground) throw new ExpressError("Invalid Campground", 500);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully make a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    // { id: '6424a8ace70dc204fe9de86c' }
    // console.log(req.params);
    const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    // console.log(campground);
    if (!campground) {
      req.flash("error", "Cannot find campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    // { id: '64276323fb2e1403d87b1e9a' }
    // console.log(req.params);
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    // { campground: { title: 'hehe', location: 'hihi' } }
    // console.log(req.body);
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    // { id: '64276323fb2e1403d87b1e9a' }
    // console.log(req.params);
    const { id } = req.params;
    // trigger middleware findOneAndDelete
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect(`/campgrounds`);
  })
);

module.exports = router;
