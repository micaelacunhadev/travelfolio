const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const tripsController = require("../controllers/trips");
const { ensureAuth, ensureGuest } = require("../middleware/auth");


router.use("/:tripId/post", require("./posts"));

//Trip Routes - simplified for now
router.get("/:id", ensureAuth, tripsController.getTrip);

router.get("/:id/addPost", ensureAuth, tripsController.addPost);

router.post("/createTrip", ensureAuth, upload.single("file"), tripsController.createTrip);

router.delete("/deleteTrip/:id", ensureAuth, tripsController.deleteTrip);


module.exports = router;
