import ProductSubCategory from "../models/ProductSubCategory.js";
import logActivity from "../utils/activityLogger.js";
export const createSubCategory = async (req, res) => {
  try {
    const { category, name, slug } = req.body;

    const exist = await ProductSubCategory.findOne({ slug });

    if (exist) {
      return res.json({
        success: false,
        message: "Slug already exists",
      });
    }

    const data = await ProductSubCategory.create({
      category,
      name,
      slug,
    });
    await logActivity({
      user: req.userId,
      module: "Product SubCategory",
      action: "CREATE",
      recordId: data._id,
      title: data.name,
      description: `Created Product SubCategory "${data.name}"`,
      req,
    });
    res.json({
      success: true,
      message: "Sub Category Created",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const total = await ProductSubCategory.countDocuments(filter);

    const data = await ProductSubCategory.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data,
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
export const getSubCategoryById = async (req, res) => {
  try {
    const data = await ProductSubCategory.findById(req.params.id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { category, name, slug } = req.body;

    const subCategory = await ProductSubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      });
    }

    subCategory.category = category;
    subCategory.name = name;
    subCategory.slug = slug;

    await subCategory.save();

    await logActivity({
      user: req.userId, // From authenticate middleware
      module: "Product Sub Category",
      action: "UPDATE",
      recordId: subCategory._id,
      title: subCategory.name,
      description: `Updated Product Sub Category "${subCategory.name}"`,
      req,
    });

    return res.json({
      success: true,
      message: "Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    await ProductSubCategory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const item = await ProductSubCategory.findById(req.params.id);

    item.status = item.status === 1 ? 0 : 1;

    await item.save();

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
