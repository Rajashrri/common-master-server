const ProjectCategory = require("../models/ProjectCategory");

// =====================================
// Add Category
// =====================================

const addCategory = async (req, res) => {

  try {

    const { categoryName, slug } = req.body;

    if (!categoryName || !slug) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }

    const exists =
      await ProjectCategory.findOne({
        slug,
      });

    if (exists) {

      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });

    }

    const category =
      await ProjectCategory.create({
        categoryName,
        slug,
      });

    res.status(201).json({
      success: true,
      message:
        "Project Category added successfully",
      data: category,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// =====================================
// List Categories
// =====================================

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

    const total = await ProjectCategory.countDocuments(filter);

    const categories = await ProjectCategory.find(filter)
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
      message: "Server Error",
    });
  }
};

// =====================================
// Get Single Category
// =====================================

const getCategoryById = async (
  req,
  res
) => {

  try {

    const category =
      await ProjectCategory.findById(
        req.params.id
      );

    if (!category) {

      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });

    }

    res.status(200).json({
      success: true,
      data: category,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// =====================================
// Update Category
// =====================================

const updateCategory = async (
  req,
  res
) => {

  try {

    const {
      categoryName,
      slug,
    } = req.body;

    const duplicate =
      await ProjectCategory.findOne({
        slug,
        _id: {
          $ne: req.params.id,
        },
      });

    if (duplicate) {

      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });

    }

    const category =
      await ProjectCategory.findByIdAndUpdate(
        req.params.id,
        {
          categoryName,
          slug,
        },
        {
          new: true,
        }
      );

    if (!category) {

      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });

    }

    res.status(200).json({
      success: true,
      message:
        "Project Category updated successfully",
      data: category,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// =====================================
// Delete Category
// =====================================

const deleteCategory = async (
  req,
  res
) => {

  try {

    const category =
      await ProjectCategory.findById(
        req.params.id
      );

    if (!category) {

      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });

    }

    await ProjectCategory.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Project Category deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// =====================================
// Change Status
// =====================================

const changeCategoryStatus =
  async (req, res) => {

    try {

      const category =
        await ProjectCategory.findById(
          req.params.id
        );

      if (!category) {

        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });

      }

      category.status =
        category.status === 1
          ? 0
          : 1;

      await category.save();

      res.status(200).json({
        success: true,
        message:
          category.status === 1
            ? "Project Category Activated Successfully"
            : "Project Category Deactivated Successfully",
        data: category,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Something went wrong",
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