const cloudinary = require("../middleware/cloudinary");
const Trip = require("../models/Trip");
const Post = require("../models/Post");
const { post } = require("../routes/posts");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const trips = await Trip.find({ user: req.user.id });
      res.render("profile.ejs", { trips: trips, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const trips = await Trip.find().sort({ createdOn: "desc" }).lean();
      res.render("feed.ejs", { trips: trips });
    } catch (err) {
      console.log(err);
    }
  },
  getTrip: async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
      const posts = await Post.find({tripId: req.params.id}).sort({ createdOn: "desc" }).lean();
      console.log("posts:", posts)
      res.render("trip.ejs", { trip: trip, posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  addPost: async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
      res.render("addPost.ejs", { trip: trip, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  tripTimeline: async (req, res) => {
    try {
      const tripPosts = await Post.findById( {_id: req.params.id}).sort({ createdOn: "asc" }).lean();
      res.render("tripTimeline.ejs", { tripPosts: tripPosts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createTrip: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Trip.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
        user: req.user.id,
      });
      console.log("Trip has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  deleteTrip: async (req, res) => {
    try {
        // Find post by id
      let trip = await Trip.findById({ _id: req.params.id });
      console.log("Trip", trip, "trip id", req.params.id)

      // Delete trip image from cloudinary
      await cloudinary.uploader.destroy(trip.cloudinaryId);

      // Get all posts from this trip
      let posts = await Post.find({tripId: req.params.id});
      

      // Delete post images from cloudinary
      for ( let i = 0; i < posts.length; i++){
          await cloudinary.uploader.destroy(posts[i].cloudinaryId);
      }

      // Delete posts from database
      await Post.deleteMany({ tripId: req.params.id })
            
      // Delete trip from database
      await Trip.deleteOne({ _id: req.params.id }, function (err, result) {
          if (err){
            console.log(err)
          }else{
            console.log("Result :", result) 
          }
      });

      console.log("Deleted Trip");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
