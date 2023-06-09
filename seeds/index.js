const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.DB_URL;
// || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; // short
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "645ee3f10ef250e2dbcfa3e0",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/drm8ig2nd/image/upload/v1683151075/YelpCamp/hiss5jplazo4yjy3zzf8.jpg",

          filename: "YelpCamp/hiss5jplazo4yjy3zzf8",
        },
        {
          url: "https://res.cloudinary.com/drm8ig2nd/image/upload/v1683151079/YelpCamp/bnf6bdcuihmz1mgvuos5.jpg",

          filename: "YelpCamp/bnf6bdcuihmz1mgvuos5",
        },
        {
          url: "https://res.cloudinary.com/drm8ig2nd/image/upload/v1683151083/YelpCamp/w10fjxhdglo5r2joiqq1.jpg",

          filename: "YelpCamp/w10fjxhdglo5r2joiqq1",
        },
      ],
      description:
        " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, repellat doloribus quaerat nesciunt dolores beatae iure voluptatum minima doloremque rem explicabo aliquid amet fugiat error unde alias obcaecati debitis mollitia?",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
