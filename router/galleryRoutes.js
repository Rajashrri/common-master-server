const express = require("express");
const router = express.Router();

const { createUpload } = require("../utils/upload");

const galleryUpload = createUpload("gallery");

const {
  addGallery,
  listGallery,
  galleryDetail,
  updateGallery,
  deleteGallery,
  changeStatus,
} = require("../controllers/galleryController");

// ==========================
// Add Gallery
// ==========================
router.post(
  "/add-gallery",
  galleryUpload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  addGallery
);

// ==========================
// Gallery List
// ==========================
router.get("/list-gallery", listGallery);

// ==========================
// Gallery Detail
// ==========================
router.get("/gallery-detail/:id", galleryDetail);

// ==========================
// Update Gallery
// ==========================
router.put(
  "/update-gallery/:id",
  galleryUpload.single("image"),
  updateGallery
);

// ==========================
// Delete Gallery
// ==========================
router.delete("/delete-gallery/:id", deleteGallery);

// ==========================
// Change Status
// ==========================
router.patch("/change-status/:id", changeStatus);

module.exports = router;