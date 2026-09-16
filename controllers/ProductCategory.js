const ProductCategory = require("../models/ProductCategory");
const logActivity = require("../utils/activityLogger");
const createProductCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const existing = await ProductCategory.findOne({ slug });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists.",
      });
    }

    const category = await ProductCategory.create({ name, slug });
    await logActivity({
      user: req.userId,
      module: "Product Category",
      action: "CREATE",
      recordId: category._id,
      title: category.name,
      description: `Created Product Category "${category.name}"`,
      req,
    });
    res.status(201).json({
      success: true,
      message: "Product category created successfully.",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getProductCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.categoryName = {
        $regex: search,
        $options: "i",
      };
    }

    const total = await ProductCategory.countDocuments(filter);

    const categories = await ProductCategory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getProductCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Product category not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const updateProductCategory = async (req, res) => {
  try {
    const { name, slug, status } = req.body;

    const category = await ProductCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Product category not found.",
      });
    }

    category.name = name ?? category.name;
    category.slug = slug ?? category.slug;
    category.status = status ?? category.status;

    await category.save();
    await logActivity({
      user: req.userId,
      module: "Product Category",
      action: "UPDATE",
      recordId: category._id,
      title: category.name,
      description: `Updated Product Category "${category.name}"`,
      req,
    });
    res.status(200).json({
      success: true,
      message: "Product category updated successfully.",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const deleteProductCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Product category not found.",
      });
    }

    await ProductCategory.findByIdAndDelete(req.params.id);

    await logActivity({
      user: req.userId,
      module: "Product Category",
      action: "DELETE",
      recordId: category._id,
      title: category.name,
      description: `Deleted Product Category "${category.name}"`,
      req,
    });

    res.status(200).json({
      success: true,
      message: "Product category deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const toggleProductCategoryStatus = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Product category not found.",
      });
    }

    category.status = category.status === 1 ? 0 : 1;
    await category.save();

    // Activity Log
    await logActivity({
      user: req.userId,
      module: "Product Category",
      action: "STATUS_CHANGE",
      recordId: category._id,
      title: category.name,
      description:
        category.status === 1
          ? `Activated Product Category "${category.name}"`
          : `Deactivated Product Category "${category.name}"`,
      req,
    });

    res.status(200).json({
      success: true,
      message:
        category.status === 1
          ? "Product category activated successfully."
          : "Product category deactivated successfully.",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  createProductCategory,
  getProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
  toggleProductCategoryStatus,
};
