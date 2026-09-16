const ServiceCategory = require("../models/ServiceCategory");

// ==============================
// Add Service Category
// ==============================

const addServiceCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    if (!categoryName || !slug) {
      return res.status(400).json({
        success: false,
        message: "Category Name and Slug are required",
      });
    }

    const exists = await ServiceCategory.findOne({
      $or: [{ categoryName }, { slug }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category Name or Slug already exists",
      });
    }

    const category = await ServiceCategory.create({
      categoryName,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Service Category Added Successfully",
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

// ==============================
// Service Category Listing
// ==============================

const getServiceCategories = async (req, res) => {
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

    const total = await ServiceCategory.countDocuments(filter);

    const categories = await ServiceCategory.find(filter)
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

// ==============================
// Get Service Category By ID
// ==============================

const getServiceCategoryById = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service Category not found",
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

// ==============================
// Update Service Category
// ==============================

const updateServiceCategory = async (req, res) => {
  try {
    const { categoryName, slug } = req.body;

    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service Category not found",
      });
    }

    // Duplicate Check
    const duplicate = await ServiceCategory.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { categoryName },
        { slug },
      ],
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Category Name or Slug already exists",
      });
    }

    category.categoryName = categoryName;
    category.slug = slug;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Service Category Updated Successfully",
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

// ==============================
// Delete Service Category
// ==============================

const deleteServiceCategory = async (req, res) => {
  try {

    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service Category not found",
      });
    }

    await ServiceCategory.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Service Category Deleted Successfully",
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
// Change Status
// ==============================

const changeStatus = async (req, res) => {
  try {

    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service Category not found",
      });
    }

    category.status = category.status === 1 ? 0 : 1;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
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
  addServiceCategory,
  getServiceCategories,
  getServiceCategoryById,
  updateServiceCategory,
  deleteServiceCategory,
  changeStatus,
};