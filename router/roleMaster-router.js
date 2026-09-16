const express = require("express");

const router = express.Router();

const {
  addRole,
  listRole,
  roleDetail,
  updateRole,
  deleteRole,
  changeStatus,
} = require("../controllers/roleMasterController");

// Add
router.post("/add-role", addRole);

// List
router.get("/list-role", listRole);

// Detail
router.get("/role-detail/:id", roleDetail);

// Update
router.put("/update-role/:id", updateRole);

// Delete
router.delete("/delete-role/:id", deleteRole);

// Status
router.patch("/change-status/:id", changeStatus);

module.exports = router;