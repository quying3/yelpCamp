const express = require("express");
const router = express.Router();

const { campgroundSchema } = require("../schema.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
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

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({}).populate("reviews");
  res.render("campgrounds/index", { campgrounds });
});

router.get("/new", async (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res) => {
    // { campground: { title: 'hihi', location: 'hehe' } }
    // console.log(req.body);
    // if (!req.body.Campground) throw new ExpressError("Invalid Campground", 500);
    const campground = new Campground(req.body.campground);
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
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Cannot find campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    // { id: '64276323fb2e1403d87b1e9a' }
    // console.log(req.params);
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
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
