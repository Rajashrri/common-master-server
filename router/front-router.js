const express = require("express");

const router = express.Router();

const {
  getBlogs,
  getBlogDetails,
  getBlogCategories,
  addContact,
  addCareer,
  subscribeNewsletter,
} = require("../controllers/front-controller");


router.get("/blogs", getBlogs);
router.get("/blog/:slug", getBlogDetails);
router.get("/blog-categories", getBlogCategories);
router.post("/add-contact", addContact);
router.post("/subscribe", subscribeNewsletter);

module.exports = router;
