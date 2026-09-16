const express = require("express");
const router = express.Router();

const { createUpload } = require("../utils/upload");

const videoUpload = createUpload("video");

const {
  addVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  changeFeatured,
  changeVideoStatus,
  getSeoById,
  updateSeo,
} = require("../controllers/VideoController");

/* ===========================
   Add Video
=========================== */

router.post(
  "/add-video",
  videoUpload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  addVideo
);

/* ===========================
   Update Video
=========================== */

router.put(
  "/update-video/:id",
  videoUpload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateVideo
);

/* ===========================
   List
=========================== */

router.get("/list-video", getVideos);

/* ===========================
   Detail
=========================== */

router.get("/video-detail/:id", getVideoById);

/* ===========================
   Delete
=========================== */

router.delete("/delete-video/:id", deleteVideo);

/* ===========================
   Status
=========================== */

router.patch(
  "/change-status/:id",
  changeVideoStatus
);

/* ===========================
   Featured
=========================== */

router.patch(
  "/change-featured/:id",
  changeFeatured
);

/* ===========================
   SEO
=========================== */

router.get(
  "/video-seo/:id",
  getSeoById
);

router.put(
  "/video-updateseo/:id",
  updateSeo
);

module.exports = router;