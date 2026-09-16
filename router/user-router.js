const express = require("express");
const router = express.Router();

const {
  addUser,
  listUser,
  userDetail,
  updateUser,
  deleteUser,
  changeStatus,
} = require("../controllers/user-controller");

router.post("/add", addUser);
router.get("/list", listUser);
router.get("/detail/:id", userDetail);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.patch("/status/:id", changeStatus);

module.exports = router;