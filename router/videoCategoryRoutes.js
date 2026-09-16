const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  changeCategoryStatus,
} = require("../controllers/videoCategoryController");

// Add Category
router.post("/add-category", addCategory);

// List Categories
router.get("/list", getCategories);

// Category Detail
router.get("/:id", getCategoryById);

// Update Category
router.put("/update/:id", updateCategory);

// Delete Category
router.delete("/delete/:id", deleteCategory);

// Change Status
router.patch(
  "/change-status/:id",
  changeCategoryStatus
);

module.exports = router;