const express = require("express");

const router = express.Router();

const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  changeCategoryStatus,
} = require("../controllers/eventCategory-controller");

// Add
router.post(
  "/add-category",
  addCategory
);

// List
router.get(
  "/list",
  getCategories
);

// Detail
router.get(
  "/:id",
  getCategoryById
);

// Update
router.put(
  "/update/:id",
  updateCategory
);

// Delete
router.delete(
  "/delete/:id",
  deleteCategory
);

// Status
router.patch(
  "/change-status/:id",
  changeCategoryStatus
);

module.exports = router;