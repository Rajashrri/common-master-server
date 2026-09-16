const Job = require("../models/Job");
const UrlRedirection = require("../models/UrlRedirection");

const { uploadToCloudinary } = require("../utils/upload");

const deleteFromCloudinary = require("../utils/cloudinaryDelete");

// ===================================
// Add Job
// ===================================

const addJob = async (req, res) => {
  try {
    const {
      categoryId,
      title,
      slug,
      designation,
      salaryOffered,
      experience,
      briefIntro,
      details,
    } = req.body;

    if (
      !categoryId ||
      !title ||
      !slug ||
      !designation ||
      !salaryOffered ||
      !experience ||
      !briefIntro ||
      !details
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Duplicate Slug

    const exists = await Job.findOne({ slug });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    let featuredImage = "";

    // Upload Image

    if (req.files?.featuredImage?.[0]) {
      featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "job/featured",
      );
    }

    const job = await Job.create({
      categoryId,
      title,
      slug,
      designation,
      salaryOffered,
      experience,
      briefIntro,
      details,
      featuredImage,
    });
    // Save current URL in redirection table
    await UrlRedirection.create({
      itemId: job._id,
      type: "job",
      oldUrl: "",
      newUrl: slug,
    });
    return res.status(201).json({
      success: true,
      message: "Job Added Successfully",
      data: job,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Job List
// ===================================

const getJobs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: jobs,
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

// ===================================
// Get Job By Id
// ===================================

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("categoryId");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===================================
// Update Job
// ===================================

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    const oldSlug = job.slug;

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const {
      categoryId,
      title,
      slug,
      designation,
      salaryOffered,
      experience,
      briefIntro,
      details,
    } = req.body;

    // Duplicate Slug

    const duplicate = await Job.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const updateData = {
      categoryId,
      title,
      slug,
      designation,
      salaryOffered,
      experience,
      briefIntro,
      details,
    };

    // Featured Image

    if (req.files?.featuredImage?.[0]) {
      if (job.featuredImage) {
        await deleteFromCloudinary(job.featuredImage);
      }

      updateData.featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "job/featured",
      );
    }

    await Job.findByIdAndUpdate(req.params.id, updateData);
    // Update URL Redirection
    if (oldSlug !== slug) {
      await UrlRedirection.findOneAndUpdate(
        {
          itemId: job._id,
          type: "job",
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
      message: "Job Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Delete Job
// ===================================

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.featuredImage) {
      await deleteFromCloudinary(job.featuredImage);
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Job Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Change Status
// ===================================

const changeJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.status = job.status === 1 ? 0 : 1;

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      data: job,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Change Featured
// ===================================

const changeFeatured = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.featured = job.featured === 1 ? 0 : 1;

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Featured Updated Successfully",
      data: job,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Get SEO
// ===================================

const getSeoById = async (req, res) => {
  try {
    const seo = await Job.findById(req.params.id);

    return res.status(200).json({
      success: true,
      data: seo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Update SEO
// ===================================

const updateSeo = async (req, res) => {
  try {
    const {
      metaTitle,
      metaKeywords,
      metaDescription,
      featuredImageAlt,
      schemaCode,
    } = req.body;

    await Job.findByIdAndUpdate(req.params.id, {
      metaTitle,
      metaKeywords,
      metaDescription,
      featuredImageAlt,
      schemaCode,
    });

    return res.status(200).json({
      success: true,
      message: "SEO Updated Successfully",
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
  addJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  changeFeatured,
  changeJobStatus,
  getSeoById,
  updateSeo,
};
