const express = require("express");
const router = express.Router();

const {
  addJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  changeFeatured,
  changeJobStatus,
  getSeoById,
  updateSeo,
} = require("../controllers/jobController");

const { createUpload } = require("../utils/upload");

// =========================
// Multer
// =========================

const upload = createUpload("job");

// =========================
// CRUD
// =========================

router.post(
  "/add-job",
  upload.fields([
    {
      name: "featuredImage",
      maxCount: 1,
    },
  ]),
  addJob
);

router.get("/list-job", getJobs);

router.get("/job-detail/:id", getJobById);

router.put(
  "/update-job/:id",
  upload.fields([
    {
      name: "featuredImage",
      maxCount: 1,
    },
  ]),
  updateJob
);

router.delete(
  "/delete-job/:id",
  deleteJob
);

// =========================
// Status
// =========================

router.patch(
  "/change-status/:id",
  changeJobStatus
);

// =========================
// Featured
// =========================

router.patch(
  "/change-featured/:id",
  changeFeatured
);

// =========================
// SEO
// =========================

router.get(
  "/job-seo/:id",
  getSeoById
);

router.put(
  "/job-updateseo/:id",
  updateSeo
);

module.exports = router;