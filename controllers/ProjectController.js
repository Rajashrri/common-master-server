const Project = require("../models/Project");
const UrlRedirection = require("../models/UrlRedirection");

const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");

// =======================================
// Add Project
// =======================================

const addProject = async (req, res) => {
  try {
    const { categoryId, name, slug, briefIntro, details } = req.body;

    let mainImage = "";
    let featuredImage = "";

    if (req.files?.mainImage?.[0]) {
      mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "project/main",
      );
    }

    if (req.files?.featuredImage?.[0]) {
      featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "project/featured",
      );
    }

    const project = new Project({
      categoryId,
      name,
      slug,
      briefIntro,
      details,
      mainImage,
      featuredImage,
    });

    await project.save();
    // Save current URL in redirection table
    await UrlRedirection.create({
      itemId: project._id,
      type: "project",
      oldUrl: "",
      newUrl: slug,
    });
    return res.status(201).json({
      success: true,
      message: "Project Added Successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Project List
// =======================================

const getProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        { projectName: { $regex: search, $options: "i" } }, // Change if your field name is different
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: projects,
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
      message: error.message,
    });
  }
};
// =======================================
// Single Project
// =======================================

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "categoryId",
    );

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Update Project
// =======================================

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    const oldSlug = project.slug;

    const { categoryId, name, slug, briefIntro, details } = req.body;

    const updateData = {
      categoryId,
      name,
      slug,
      briefIntro,
      details,
    };
    // Main Image

    if (req.files?.mainImage?.[0]) {
      if (project.mainImage) {
        await deleteFromCloudinary(project.mainImage);
      }

      updateData.mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "project/main",
      );
    }

    // Featured Image

    if (req.files?.featuredImage?.[0]) {
      if (project.featuredImage) {
        await deleteFromCloudinary(project.featuredImage);
      }

      updateData.featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "project/featured",
      );
    }

    await Project.findByIdAndUpdate(req.params.id, updateData);
    // Update URL Redirection
    if (oldSlug !== slug) {
      await UrlRedirection.findOneAndUpdate(
        {
          itemId: project._id,
          type: "project",
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
    return res.status(200).json({
      success: true,
      message: "Project Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================================
// Delete Project
// =======================================

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.mainImage) {
      await deleteFromCloudinary(project.mainImage);
    }

    if (project.featuredImage) {
      await deleteFromCloudinary(project.featuredImage);
    }

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Project Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Change Status
// =======================================

const changeProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.status = project.status === 1 ? 0 : 1;

    await project.save();

    return res.status(200).json({
      success: true,
      message:
        project.status === 1
          ? "Project Activated Successfully"
          : "Project Deactivated Successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// =======================================
// Change Featured
// =======================================

const changeFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.featured = project.featured === 1 ? 0 : 1;

    await project.save();

    return res.status(200).json({
      success: true,
      message:
        project.featured === 1
          ? "Project Marked as Featured"
          : "Project Removed from Featured",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// =======================================
// Get SEO
// =======================================

const getSeoById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// =======================================
// Update SEO
// =======================================

const updateSeo = async (req, res) => {
  try {
    const {
      metaTitle,
      metaKeywords,
      metaDescription,
      mainImageAlt,
      featuredImageAlt,
      schemaCode,
    } = req.body;

    await Project.findByIdAndUpdate(req.params.id, {
      metaTitle,
      metaKeywords,
      metaDescription,
      mainImageAlt,
      featuredImageAlt,
      schemaCode,
    });

    return res.status(200).json({
      success: true,
      message: "SEO Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  changeProjectStatus,
  changeFeatured,
  getSeoById,
  updateSeo,
};
