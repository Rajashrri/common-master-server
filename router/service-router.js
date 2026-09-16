const express = require("express");

const router = express.Router();
const { createUpload } = require("../utils/upload");

const upload = createUpload("service");

const {
  addService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  changeServiceStatus,
  changeFeatured,
    getServiceSeoById,
  updateServiceSeo,
} = require("../controllers/service-controller");

// ==============================
// Add Service
// ==============================

router.post(
  "/add-service",
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
  addService
);

// ==============================
// Service Listing
// ==============================

router.get(
  "/list-service",
  getServices
);

// ==============================
// Get Service Detail
// ==============================

router.get(
  "/service-detail/:id",
  getServiceById
);

// ==============================
// Update Service
// ==============================

router.put(
  "/update-service/:id",
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
  updateService
);

// ==============================
// Delete Service
// ==============================

router.delete(
  "/delete-service/:id",
  deleteService
);

// ==============================
// Change Status
// ==============================

router.patch(
  "/change-status/:id",
  changeServiceStatus
);

// ==============================
// Change Featured
// ==============================

router.patch(
  "/change-featured/:id",
  changeFeatured
);
router.get(
  "/service-seo/:id",
  getServiceSeoById
);

// ==============================
// Update SEO
// ==============================

router.put(
  "/service-updateseo/:id",
  updateServiceSeo
);
module.exports = router;