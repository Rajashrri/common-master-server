const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "temp/ckeditor" });
const { uploadToCloudinary } = require("../utils/upload");

router.post(
  "/upload",
  upload.single("upload"), // CKEditor sends the file in the "upload" field
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          uploaded: 0,
          error: { message: "No file uploaded" },
        });
      }

      const url = await uploadToCloudinary(
        req.file.path,
        "ckeditor"
      );

      return res.json({
        uploaded: 1,
        fileName: req.file.originalname,
        url,
      });
    } catch (err) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        uploaded: 0,
        error: { message: err.message },
      });
    }
  }
);

module.exports = router;