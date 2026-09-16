const express = require("express");
const router = express.Router();

const {
  addLink,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
  changeLinkStatus,
} = require("../controllers/linkController");

// ============================
// Add Link
// ============================

router.post("/add-link", addLink);

// ============================
// List
// ============================

router.get("/list", getLinks);

// ============================
// Single Link
// ============================

router.get("/:id", getLinkById);

// ============================
// Update
// ============================

router.put("/update/:id", updateLink);

// ============================
// Delete
// ============================

router.delete("/delete/:id", deleteLink);

// ============================
// Status
// ============================

router.patch(
  "/change-status/:id",
  changeLinkStatus
);

module.exports = router;