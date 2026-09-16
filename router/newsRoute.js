const express = require("express");
const router = express.Router();

const {
  addNews,
  getNews,
  deleteNews,
  getNewsById,
  updateNews,
  getSeoById,
  updateSeo,
  changeFeatured,
  changeNewsStatus,
} = require("../controllers/newsController");
const { createUpload } = require("../utils/upload");

const upload = createUpload("news");

// =========================
// CRUD
// =========================

router.post(
  "/add-news",
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "featuredImage",
      maxCount: 1,
    },
  ]),
  addNews
);

router.get("/list-news", getNews);

router.get("/news-detail/:id", getNewsById);

router.put(
  "/update-news/:id",
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "featuredImage",
      maxCount: 1,
    },
  ]),
  updateNews
);

router.delete("/delete-news/:id", deleteNews);

// =========================
// Status
// =========================

router.patch("/change-status/:id", changeNewsStatus);

// =========================
// Featured
// =========================

router.patch("/change-featured/:id", changeFeatured);

// =========================
// SEO
// =========================

router.get("/news-seo/:id", getSeoById);

router.put("/news-updateseo/:id", updateSeo);

module.exports = router;