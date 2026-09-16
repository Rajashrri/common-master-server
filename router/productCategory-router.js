const express = require("express");
const router = express.Router();
const controller = require("../controllers/ProductCategory");
const authenticate = require("../middlewares/auth-middleware");
router.post("/", authenticate, controller.createProductCategory);
router.get("/", controller.getProductCategories);
router.get("/:id", controller.getProductCategoryById);

router.put("/:id", authenticate, controller.updateProductCategory);
router.delete("/:id", authenticate, controller.deleteProductCategory);
router.patch("/:id/status", authenticate, controller.toggleProductCategoryStatus);
module.exports = router;