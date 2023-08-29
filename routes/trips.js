const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const tripsController = require("../controllers/trips");
const { ensureAuth, ensureGuest } = require("../middleware/auth");


router.use("/:tripId/post", require("./posts"));

//Trip Routes - simplified for now
router.get("/:id", ensureAuth, tripsController.getTrip);

router.get("/:id/addPost", tripsController.addPost);

router.post("/createTrip", upload.single("file"), tripsController.createTrip);

router.delete("/deleteTrip/:id", tripsController.deleteTrip);


module.exports = router;
