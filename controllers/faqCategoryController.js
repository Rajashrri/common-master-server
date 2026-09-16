const FaqCategory = require("../models/FaqCategory");

// ==========================
// Add Category
// ==========================

const addCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    if (!categoryName || !slug) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryExists = await FaqCategory.findOne({ slug });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const category = new FaqCategory({
      categoryName,
      slug,
    });

    await category.save();

    return res.status(201).json({
      success: true,
      message: "FAQ Category added successfully",
      data: category,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ==========================
// List Category
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

    const total = await FaqCategory.countDocuments(filter);

    const categories = await FaqCategory.find(filter)
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
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ==========================
// Get Single Category
// ==========================

const getCategoryById = async (req, res) => {
  try {

    const category = await FaqCategory.findById(req.params.id);

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

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ==========================
// Update Category
// ==========================

const updateCategory = async (req, res) => {
  try {

    const { categoryName, slug } = req.body;

    const category = await FaqCategory.findByIdAndUpdate(
      req.params.id,
      {
        categoryName,
        slug,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "FAQ Category updated successfully",
      data: category,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ==========================
// Delete Category
// ==========================

const deleteCategory = async (req, res) => {
  try {

    const category = await FaqCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await FaqCategory.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "FAQ Category deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ==========================
// Change Status
// ==========================

const changeCategoryStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const category = await FaqCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.status = category.status === 1 ? 0 : 1;

    await category.save();

    return res.status(200).json({
      success: true,
      message:
        category.status === 1
          ? "FAQ Category Activated Successfully"
          : "FAQ Category Deactivated Successfully",
      data: category,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
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