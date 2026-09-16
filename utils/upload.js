// ===============================
// utils/upload.js
// LOCAL + CLOUDINARY SUPPORT
// ===============================
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("./cloudinary");

const PROJECT_ROOT = path.resolve(__dirname, "..");

const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(PROJECT_ROOT, "temp", folderName);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },

    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
};

const createUpload = (folderName, options = {}) => {
  return multer({
    storage: createStorage(folderName),

    limits: {
      fileSize: options.maxSize || 5 * 1024 * 1024,
    },

    fileFilter:
      options.fileFilter ||
      function (req, file, cb) {
        const allowed = /jpeg|jpg|png|gif|webp/;

        const valid =
          allowed.test(path.extname(file.originalname).toLowerCase()) &&
          allowed.test(file.mimetype);

        cb(valid ? null : new Error("Only images allowed"), valid);
      },
  });
};

// ===============================
// CLOUDINARY UPLOAD FUNCTION
// ===============================
const uploadToCloudinary = async (
  filePath,
  folder,
  resourceType = "image"
) => {

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
  });

  fs.unlinkSync(filePath);

  return result.secure_url;
};

module.exports = {
  createUpload,
  uploadToCloudinary, // add this

};