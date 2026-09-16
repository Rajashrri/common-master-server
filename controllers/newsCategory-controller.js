const NewsCategory = require("../models/NewsCategory");

// ===============================
// Add Category
// ===============================

const addCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    if (!categoryName || !slug) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await NewsCategory.findOne({
      slug,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const category =
      await NewsCategory.create({
        categoryName,
        slug,
      });

    return res.status(201).json({
      success: true,
      message: "News Category Added Successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Category List
// ===============================

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

    const total = await NewsCategory.countDocuments(filter);

    const categories = await NewsCategory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: categories,
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

// ===============================
// Get By Id
// ===============================

const getCategoryById = async (req, res) => {
  try {
    const category =
      await NewsCategory.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Category
// ===============================

const updateCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    const category = await NewsCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check Duplicate Slug
    const duplicate = await NewsCategory.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    category.categoryName = categoryName;
    category.slug = slug;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "News Category Updated Successfully",
      data: category,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Category
// ===============================

const deleteCategory = async (req, res) => {
  try {
    const category = await NewsCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await NewsCategory.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "News Category Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Change Status
// ===============================

const changeCategoryStatus = async (req, res) => {
  try {
    const category = await NewsCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.status =
      category.status === 1 ? 0 : 1;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      data: category,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
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