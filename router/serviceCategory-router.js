const express = require("express");
const router = express.Router();
const {
  addServiceCategory,
  getServiceCategories,
  getServiceCategoryById,
  updateServiceCategory,
  deleteServiceCategory,
  changeStatus,
} = require("../controllers/serviceCategoryController");

// Add
router.post("/add-service-category", addServiceCategory);

// List
router.get("/list-service-category", getServiceCategories);

// Detail
router.get("/service-category-detail/:id", getServiceCategoryById);

// Update
router.put("/update-service-category/:id", updateServiceCategory);

// Delete
router.delete("/delete-service-category/:id", deleteServiceCategory);

// Change Status
router.patch(
  "/change-status/:id",
  changeStatus
);

module.exports = router;