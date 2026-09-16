const Service = require("../models/Service");
const UrlRedirection = require("../models/UrlRedirection");

const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");

// ======================================
// Add Service
// ======================================

const addService = async (req, res) => {
  try {
    const { categoryId, serviceName, slug, briefIntro, details } = req.body;

    const exists = await Service.findOne({ slug });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    let mainImage = "";
    let featuredImage = "";

    if (req.files?.mainImage?.length) {
      mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "service",
      );
    }

    if (req.files?.featuredImage?.length) {
      featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "service",
      );
    }

    const service = await Service.create({
      categoryId,
      serviceName,
      slug,
      mainImage,
      featuredImage,
      briefIntro,
      details,
    });
    // Save current URL in redirection table
    await UrlRedirection.create({
      itemId: service._id,
      type: "service",
      oldUrl: "",
      newUrl: slug,
    });
    return res.status(201).json({
      success: true,
      message: "Service Added Successfully",
      data: service,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Service Listing
// ======================================

const getServices = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        { serviceName: { $regex: search, $options: "i" } }, // Change if field name is different
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Service.countDocuments(filter);

    const services = await Service.find(filter)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: services,
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
// ======================================
// Get Service By Id
// ======================================

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "categoryId",
      "categoryName",
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Service
// ======================================

const updateService = async (req, res) => {
  try {
    const { categoryId, serviceName, slug, briefIntro, details } = req.body;

    const service = await Service.findById(req.params.id);
    const oldSlug = service.slug;

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const duplicateSlug = await Service.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (duplicateSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // Main Image
    if (req.files?.mainImage?.length) {
      if (service.mainImage) {
        await deleteFromCloudinary(service.mainImage);
      }

      service.mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "service",
      );
    }

    // Featured Image
    if (req.files?.featuredImage?.length) {
      if (service.featuredImage) {
        await deleteFromCloudinary(service.featuredImage);
      }

      service.featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "service",
      );
    }

    service.categoryId = categoryId;
    service.serviceName = serviceName;
    service.slug = slug;
    service.briefIntro = briefIntro;
    service.details = details;

    await service.save();
    // Update URL Redirection
    if (oldSlug !== slug) {
      await UrlRedirection.findOneAndUpdate(
        {
          itemId: service._id,
          type: "service",
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
      message: "Service Updated Successfully",
      data: service,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Service
// ======================================

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (service.mainImage) {
      await deleteFromCloudinary(service.mainImage);
    }

    if (service.featuredImage) {
      await deleteFromCloudinary(service.featuredImage);
    }

    await Service.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Service Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Change Status
// ======================================

const changeServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.status = service.status === 1 ? 0 : 1;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Change Featured
// ======================================

const changeFeatured = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.featured = service.featured === 1 ? 0 : 1;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Featured Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get SEO
// ======================================

const getServiceSeoById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update SEO
// ======================================

const updateServiceSeo = async (req, res) => {
  try {
    const {
      metaTitle,
      metaKeywords,
      metaDescription,
      mainImageAlt,
      featuredImageAlt,
      schemaCode,
    } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.metaTitle = metaTitle;
    service.metaKeywords = metaKeywords;
    service.metaDescription = metaDescription;
    service.mainImageAlt = mainImageAlt;
    service.featuredImageAlt = featuredImageAlt;
    service.schemaCode = schemaCode;

    await service.save();

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

// ======================================
// Exports
// ======================================

module.exports = {
  addService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  changeServiceStatus,
  changeFeatured,

  getServiceSeoById,
  updateServiceSeo,
};
