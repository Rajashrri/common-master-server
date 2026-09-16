const Product = require("../models/Product");
const UrlRedirection = require("../models/UrlRedirection");
const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");
// ==============================
// Add Product
// ==============================

const addProduct = async (req, res) => {
  try {
    const {
      categoryId,
      subCategoryId,
      productName,
      slug,
      briefIntro,
      details,
    } = req.body;

    const exists = await Product.findOne({ slug });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    let mainImage = "";
    let featuredImage = "";

    if (req.files?.mainImage?.length) {
      mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "product",
      );
    }

    if (req.files?.featuredImage?.length) {
      featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "product",
      );
    }
    const product = await Product.create({
      categoryId,
      subCategoryId,
      productName,
      slug,
      mainImage,
      featuredImage,
      briefIntro,
      details,
    });
    // Save current URL in redirection table
    await UrlRedirection.create({
      itemId: product._id,
      type: "product",
      oldUrl: "",
      newUrl: slug,
    });
    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Product Listing
// ==============================

const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },          // Product Name
        { productCode: { $regex: search, $options: "i" } },   // Product Code (optional)
        { slug: { $regex: search, $options: "i" } },          // Slug (optional)
      ];
    }

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Get Product By Id
// ==============================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Product
// ==============================

const updateProduct = async (req, res) => {
  try {
    const {
      categoryId,
      subCategoryId,
      productName,
      slug,
      briefIntro,
      details,
    } = req.body;

    const product = await Product.findById(req.params.id);
    const oldSlug = product.slug;
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check Duplicate Slug
    const duplicateSlug = await Product.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (duplicateSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // Main Image
    if (req.files?.mainImage?.length) {
      if (product.mainImage) {
        await deleteFromCloudinary(product.mainImage);
      }

      product.mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "product",
      );
    }

    if (req.files?.featuredImage?.length) {
      if (product.featuredImage) {
        await deleteFromCloudinary(product.featuredImage);
      }

      product.featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "product",
      );
    }

    product.categoryId = categoryId;
    product.subCategoryId = subCategoryId;
    product.productName = productName;
    product.slug = slug;
    product.briefIntro = briefIntro;
    product.details = details;

    await product.save();
    // Slug changed? Save redirection history

    // Update URL Redirection
    if (oldSlug !== slug) {
      await UrlRedirection.findOneAndUpdate(
        {
          itemId: product._id,
          type: "product",
        },
        {
          $set: {
            oldUrl: oldSlug,
            newUrl: slug,
          },
        },
        {
          upsert: true, // agar record na ho to create kar de
          new: true,
        },
      );
    }
    return res.json({
      success: true,
      message: "Product Updated Successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Product
// ==============================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete Main Image from Cloudinary
    if (product.mainImage) {
      await deleteFromCloudinary(product.mainImage);
    }

    // Delete Featured Image from Cloudinary
    if (product.featuredImage) {
      await deleteFromCloudinary(product.featuredImage);
    }

    // Delete Product
    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Change Product Status
// ==============================

const changeProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.status = product.status === 1 ? 0 : 1;

    await product.save();

    return res.json({
      success: true,
      message: "Product Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Change Featured Status
// ==============================

const changeFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.featured = product.featured === 1 ? 0 : 1;

    await product.save();

    return res.json({
      success: true,
      message: "Featured Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSeoById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        metaTitle: product.metaTitle || "",
        metaKeywords: product.metaKeywords || "",
        metaDescription: product.metaDescription || "",
        mainImageAlt: product.mainImageAlt || "",
        featuredImageAlt: product.featuredImageAlt || "",
        schemaCode: product.schemaCode || "",
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Product SEO
// ==============================
const updateSeo = async (req, res) => {
  try {
    console.log(req.body);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      },
    );

    console.log(product);

    return res.json({
      success: true,
      data: product,
      message: "Seo Update Suceessfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Exports
// ==============================

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  changeProductStatus,
  changeFeatured,

  getSeoById,
  updateSeo,
};
