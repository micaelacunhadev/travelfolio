const express = require("express");
const router = express.Router({mergeParams: true});
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");


//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.get("/", ensureAuth, postsController.getPost);

router.post("/createPost", ensureAuth, upload.single("file"), postsController.createPost);

router.put("/:id/likePost", ensureAuth, postsController.likePost);

router.delete("/:id/deletePost", ensureAuth, postsController.deletePost);



module.exports = router;