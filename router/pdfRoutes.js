const express = require("express");
const router = express.Router();

const { createUpload } = require("../utils/upload");

const {
  addPdf,
  getPdfs,
  getPdfById,
  updatePdf,
  deletePdf,
  changePdfStatus,
} = require("../controllers/pdfController");

// PDF Upload
const uploadPdf = createUpload("pdf", {
  maxSize: 20 * 1024 * 1024, // 20MB

  fileFilter: (req, file, cb) => {

    if (file.mimetype === "application/pdf") {

      cb(null, true);

    } else {

      cb(
        new Error("Only PDF files are allowed."),
        false
      );

    }

  },

});

// ==========================
// Routes
// ==========================

// Add PDF
router.post(
  "/add-pdf",
  uploadPdf.single("pdfFile"),
  addPdf
);

// List
router.get(
  "/list",
  getPdfs
);

// Single
router.get(
  "/:id",
  getPdfById
);

// Update
router.put(
  "/update/:id",
  uploadPdf.single("pdfFile"),
  updatePdf
);

// Delete
router.delete(
  "/delete/:id",
  deletePdf
);

// Status
router.patch(
  "/change-status/:id",
  changePdfStatus
);

module.exports = router;