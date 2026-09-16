const express = require("express");

const router = express.Router();

const controller = require("../controllers/privilegeController");
const authenticate = require("../middlewares/auth-middleware");

router.post("/save", controller.savePrivilege);

router.get("/list", controller.listPrivilege);

router.get("/detail/:roleId", controller.privilegeDetail);

router.delete("/delete/:id", controller.deletePrivilege);


router.get(
  "/my-permissions",
  authenticate,
  controller.getMyPermissions
);

module.exports = router;