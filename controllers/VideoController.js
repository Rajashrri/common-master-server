const Video = require("../models/Video");
const UrlRedirection = require("../models/UrlRedirection");

const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");

/* ===========================
   Add Video
=========================== */
const addVideo = async (req, res) => {
  try {
    const { categoryId, title, slug, youtubeLink, briefIntro } = req.body;

    let thumbnail = "";

    if (req.files?.thumbnail?.[0]) {
      thumbnail = await uploadToCloudinary(
        req.files.thumbnail[0].path,
        "video/thumbnail",
      );
    }
    const video = new Video({
      categoryId,
      title,
      slug,
      youtubeLink,
      briefIntro,
      thumbnail,
    });

    await video.save();
    // Save current URL in redirection table
    await UrlRedirection.create({
      itemId: video._id,
      type: "video",
      oldUrl: "",
      newUrl: slug,
    });
    return res.status(201).json({
      success: true,
      message: "Video Added Successfully",
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Video List
=========================== */
const getVideos = async (req, res) => {
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
          videoUrl: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Video.countDocuments(filter);

    const videos = await Video.find(filter)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: videos,
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

/* ===========================
   Single Video
=========================== */
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("categoryId");

    return res.json({
      success: true,
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Update Video
=========================== */
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }
    const oldSlug = video.slug;
    const slug = req.body.slug;
    const updateData = {
      categoryId: req.body.categoryId,
      title: req.body.title,
      slug,
      youtubeLink: req.body.youtubeLink,
      briefIntro: req.body.briefIntro,
    };

    if (req.files?.thumbnail?.[0]) {
      if (video.thumbnail) {
        await deleteFromCloudinary(video.thumbnail);
      }

      updateData.thumbnail = await uploadToCloudinary(
        req.files.thumbnail[0].path,
        "video/thumbnail",
      );
    }

    await Video.findByIdAndUpdate(req.params.id, updateData);
    // Update URL Redirection
    if (oldSlug !== slug) {
      await UrlRedirection.findOneAndUpdate(
        {
          itemId: video._id,
          type: "video",
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
    return res.json({
      success: true,
      message: "Video Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Delete Video
=========================== */
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (video.thumbnail) {
      await deleteFromCloudinary(video.thumbnail);
    }

    await Video.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Video Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Change Featured
=========================== */

const changeFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    video.featured = video.featured === 1 ? 0 : 1;

    await video.save();

    return res.status(200).json({
      success: true,
      message:
        video.featured === 1
          ? "Video marked as Featured"
          : "Video removed from Featured",
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Change Status
=========================== */

const changeVideoStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    video.status = video.status === 1 ? 0 : 1;

    await video.save();

    return res.status(200).json({
      success: true,
      message:
        video.status === 1
          ? "Video Activated Successfully"
          : "Video Deactivated Successfully",
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Get SEO
=========================== */

const getSeoById = async (req, res) => {
  try {
    const seo = await Video.findById(req.params.id);

    return res.status(200).json({
      success: true,
      data: seo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/* ===========================
   Update SEO
=========================== */

const updateSeo = async (req, res) => {
  try {
    const {
      metaTitle,
      metaKeywords,
      metaDescription,
      thumbnailAlt,
      schemaCode,
    } = req.body;

    await Video.findByIdAndUpdate(req.params.id, {
      metaTitle,
      metaKeywords,
      metaDescription,
      thumbnailAlt,
      schemaCode,
    });

    return res.status(200).json({
      success: true,
      message: "SEO Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,

  changeFeatured,
  changeVideoStatus,

  getSeoById,
  updateSeo,
};
