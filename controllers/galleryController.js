const Gallery = require("../models/Gallery");
const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");

// ==========================
// Add Gallery
// ==========================
const addGallery = async (req, res) => {
  try {
    const { categoryId, imageName } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Gallery Category is required.",
      });
    }

    if (!imageName) {
      return res.status(400).json({
        success: false,
        message: "Image Name is required.",
      });
    }

    if (!req.files?.image?.length) {
      return res.status(400).json({
        success: false,
        message: "Gallery Image is required.",
      });
    }

    const image = await uploadToCloudinary(
      req.files.image[0].path,
      "gallery"
    );

    const gallery = await Gallery.create({
      categoryId,
      imageName,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Gallery added successfully.",
      data: gallery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Gallery List
// ==========================
const listGallery = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        {
          imageName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Gallery.countDocuments(filter);

    const data = await Gallery.find(filter)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================
// Gallery Detail
// ==========================
const galleryDetail = async (req, res) => {
  try {
    const data = await Gallery.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found.",
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Gallery
// ==========================
const updateGallery = async (req, res) => {
  try {
    const { categoryId, imageName } = req.body;

    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found.",
      });
    }

    gallery.categoryId = categoryId;
    gallery.imageName = imageName;

    if (req.file) {
      const image = await uploadToCloudinary(
        req.file.path,
        "gallery"
      );

      if (gallery.image) {
        await deleteFromCloudinary(gallery.image);
      }

      gallery.image = image;
    }

    await gallery.save();

    return res.json({
      success: true,
      message: "Gallery updated successfully.",
      data: gallery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Gallery
// ==========================
const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found.",
      });
    }

    if (gallery.image) {
      await deleteFromCloudinary(gallery.image);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Gallery deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Change Status
// ==========================
const changeStatus = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found.",
      });
    }

    gallery.status = gallery.status === 1 ? 0 : 1;

    await gallery.save();

    return res.json({
      success: true,
      message:
        gallery.status === 1
          ? "Gallery Activated Successfully."
          : "Gallery Deactivated Successfully.",
      data: gallery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addGallery,
  listGallery,
  galleryDetail,
  updateGallery,
  deleteGallery,
  changeStatus,
};