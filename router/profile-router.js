const express = require("express");
const router = express.Router();
const profilecontrollers = require("../controllers/profile-controller");
const authenticate = require("../middlewares/auth-middleware");
const { createUpload } = require("../utils/upload");

const websiteUpload = createUpload("website");

const profileUpload = createUpload("profile");
router.get(
  "/website-setting",

  profilecontrollers.getWebsiteSetting,
);

// All routes require authentication
router.use(authenticate);

// Get current user profile - GET /api/profile
router.get("/getprofile", profilecontrollers.getProfile);

// Update current user profile - PUT /api/profile
router.put(
  "/update",
  profileUpload.single("pic"),
  profilecontrollers.updateProfile,
);
// Update current user password - PUT /api/profile/password
router.put("/password", profilecontrollers.updatePassword);

router.put(
  "/website-setting",
  authenticate,
  websiteUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  profilecontrollers.updateWebsiteSetting,
);
module.exports = router;
