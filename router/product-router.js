const express = require("express");
const router = express.Router();

const { createUpload } = require("../utils/upload");

const productUpload = createUpload("product");

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  changeProductStatus,
  changeFeatured,

  getSeoById,
  updateSeo,

} = require("../controllers/ProductController");

// Featured
router.patch("/change-featured/:id", changeFeatured);

// Add Product
router.post(
  "/add-product",
  productUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "featuredImage", maxCount: 1 },
  ]),
  addProduct
);

// Update Product
router.put(
  "/update-product/:id",
  productUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "featuredImage", maxCount: 1 },
  ]),
  updateProduct
);

// List
router.get("/list-product", getProducts);

// Detail
router.get("/product-detail/:id", getProductById);

// Delete
router.delete("/delete-product/:id", deleteProduct);

// Status
router.patch("/change-status/:id", changeProductStatus);

router.get(
  "/product-seo/:id",
  getSeoById
);

router.put(
  "/product-updateseo/:id",
  updateSeo
);
module.exports = router;