const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const storiesController = require("../controllers/stories");

//* Show add page
//* GET /stories/add
router.get("/add", ensureAuth, storiesController.getAddStories);

//* Show all stories
//* GET/stories
router.get("/", ensureAuth, storiesController.getShowStories);

//* Show a single story
//* GET/stories/:id
router.get("/:id", ensureAuth, storiesController.getShowStory);

//* Post a story
//* POST /stories
router.post("/", ensureAuth, storiesController.postStory);

//* Show edit story form
//* GET/stories/edit/:storyId
router.get("/edit/:id", ensureAuth, storiesController.getEditStory);

//* Post edited story
//* PUT/stories/storyId
router.put("/:id", ensureAuth, storiesController.putEditStory);

//* Post edited story
//* DELETE/stories/storyId
router.delete("/:id", ensureAuth, storiesController.deleteStory);

module.exports = router;
