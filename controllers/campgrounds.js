const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({}).populate("reviews");
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
  // { campground: { title: 'hihi', location: 'hehe' } }
  // console.log(req.body);
  // if (!req.body.Campground) throw new ExpressError("Invalid Campground", 500);
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully make a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  // { id: '64276323fb2e1403d87b1e9a' }
  // console.log(req.params);
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
  // { campground: { title: 'hehe', location: 'hihi' } }
  // console.log(req.body);
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  // { id: '64276323fb2e1403d87b1e9a' }
  // console.log(req.params);
  const { id } = req.params;
  // trigger middleware findOneAndDelete
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect(`/campgrounds`);
};
