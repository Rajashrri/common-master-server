const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  toggleStatus,
} = require("../controllers/productSubCategoryController");
const authenticate = require("../middlewares/auth-middleware");

const router = express.Router();

// Create
router.post("/", authenticate,createSubCategory);

// Get All
router.get("/", getSubCategories);

// Get By Id
router.get("/:id", getSubCategoryById);

// Update
router.put("/:id",authenticate, updateSubCategory);

// Delete
router.delete("/:id", authenticate,deleteSubCategory);

// Status Toggle
router.patch("/:id/status", authenticate,toggleStatus);

module.exports = router;