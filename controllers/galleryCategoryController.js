const GalleryCategory = require("../models/GalleryCategory");

// ==========================
// Add Category
// ==========================

const addCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    const exists = await GalleryCategory.findOne({
      $or: [
        { categoryName: categoryName.trim() },
        { slug: slug.trim() },
      ],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Gallery Category already exists",
      });
    }

    const category = await GalleryCategory.create({
      categoryName,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Gallery Category added successfully",
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
// Get Categories
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

    const total = await GalleryCategory.countDocuments(filter);

    const categories = await GalleryCategory.find(filter)
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================
// Get Single Category
// ==========================

const getCategoryById = async (req, res) => {
  try {
    const category = await GalleryCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Gallery Category not found",
      });
    }

    res.status(200).json({
      success: true,
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
// Update Category
// ==========================

const updateCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    const category = await GalleryCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Gallery Category not found",
      });
    }

    const exists = await GalleryCategory.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { categoryName: categoryName.trim() },
        { slug: slug.trim() },
      ],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Gallery Category already exists",
      });
    }

    category.categoryName = categoryName;
    category.slug = slug;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Gallery Category updated successfully",
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
    const category = await GalleryCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Gallery Category not found",
      });
    }

    await GalleryCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gallery Category deleted successfully",
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
    const { id } = req.params;

    const category = await GalleryCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Gallery Category not found",
      });
    }

    category.status = category.status === 1 ? 0 : 1;

    await category.save();

    res.status(200).json({
      success: true,
      message:
        category.status === 1
          ? "Gallery Category Activated Successfully"
          : "Gallery Category Deactivated Successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
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