const express = require("express");

const router = express.Router();

const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  changeCategoryStatus,
} = require("../controllers/newsCategory-controller");

// ==========================
// Add Category
// ==========================

router.post(
  "/add-category",
  addCategory
);

// ==========================
// Category List
// ==========================

router.get(
  "/list",
  getCategories
);

// ==========================
// Get Single Category
// ==========================

router.get(
  "/:id",
  getCategoryById
);

// ==========================
// Update Category
// ==========================

router.put(
  "/update/:id",
  updateCategory
);

// ==========================
// Delete Category
// ==========================

router.delete(
  "/delete/:id",
  deleteCategory
);

// ==========================
// Change Status
// ==========================

router.patch(
  "/change-status/:id",
  changeCategoryStatus
);

module.exports = router;