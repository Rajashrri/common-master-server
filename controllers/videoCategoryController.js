const VideoCategory = require("../models/VideoCategory");

// ==========================
// Add Category
// ==========================

const addCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category Name is required",
      });
    }

    const exist = await VideoCategory.findOne({
      slug,
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await VideoCategory.create({
      categoryName,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Video Category added successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// List Categories
// ==========================

const getCategories = async (req, res) => {
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

    const total = await VideoCategory.countDocuments(filter);

    const data = await VideoCategory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Category Detail
// ==========================

const getCategoryById = async (req, res) => {
  try {
    const data = await VideoCategory.findById(
      req.params.id
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Category
// ==========================

const updateCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    const category = await VideoCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Video Category not found",
      });
    }

    const exist = await VideoCategory.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    category.categoryName = categoryName;
    category.slug = slug;

    await category.save();

    res.json({
      success: true,
      message: "Video Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Category
// ==========================

const deleteCategory = async (req, res) => {
  try {
    const category = await VideoCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Video Category not found",
      });
    }

    await VideoCategory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Video Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Change Status
// ==========================

const changeCategoryStatus = async (req, res) => {
  try {
    const category = await VideoCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Video Category not found",
      });
    }

    category.status = category.status === 1 ? 0 : 1;

    await category.save();

    res.json({
      success: true,
      message:
        category.status === 1
          ? "Video Category Activated Successfully"
          : "Video Category Deactivated Successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  changeCategoryStatus,
};