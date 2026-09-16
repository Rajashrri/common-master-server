const express = require("express");
const router = express.Router();

const { createUpload } = require("../utils/upload");

const projectUpload = createUpload("project");

const {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  changeProjectStatus,
  changeFeatured,
  getSeoById,
  updateSeo,
} = require("../controllers/ProjectController");

// =======================================
// Featured
// =======================================

router.patch(
  "/change-featured/:id",
  changeFeatured
);

// =======================================
// Add Project
// =======================================

router.post(
  "/add-project",
  projectUpload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "featuredImage",
      maxCount: 1,
    },
  ]),
  addProject
);

// =======================================
// Update Project
// =======================================

router.put(
  "/update-project/:id",
  projectUpload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "featuredImage",
      maxCount: 1,
    },
  ]),
  updateProject
);

// =======================================
// List
// =======================================

router.get(
  "/list-project",
  getProjects
);

// =======================================
// Detail
// =======================================

router.get(
  "/project-detail/:id",
  getProjectById
);

// =======================================
// Delete
// =======================================

router.delete(
  "/delete-project/:id",
  deleteProject
);

// =======================================
// Status
// =======================================

router.patch(
  "/change-status/:id",
  changeProjectStatus
);

// =======================================
// SEO
// =======================================

router.get(
  "/project-seo/:id",
  getSeoById
);

router.put(
  "/project-updateseo/:id",
  updateSeo
);

module.exports = router;