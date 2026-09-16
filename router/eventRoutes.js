const express = require("express");

const router = express.Router();

const {
  addEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  changeEventStatus,
  changeFeatured,
  getSeoById,
  updateSeo,
} = require("../controllers/eventController");

const { createUpload } = require("../utils/upload");

const upload = createUpload("events");

// ==========================
// CRUD
// ==========================

router.post(
  "/add-event",
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
  addEvent
);

router.get("/list-event", getEvents);

router.get("/event-detail/:id", getEventById);

router.put(
  "/update-event/:id",
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
  updateEvent
);

router.delete("/delete-event/:id", deleteEvent);

// ==========================
// Status
// ==========================

router.patch("/change-status/:id", changeEventStatus);

// ==========================
// Featured
// ==========================

router.patch("/change-featured/:id", changeFeatured);

// ==========================
// SEO
// ==========================

router.get("/event-seo/:id", getSeoById);

router.put("/event-updateseo/:id", updateSeo);

module.exports = router;