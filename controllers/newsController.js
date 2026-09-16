const News = require("../models/News");
const UrlRedirection = require("../models/UrlRedirection");

const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");

const addNews = async (req, res) => {
  try {
    const {
      categoryId,
      title,
      slug,
      postedBy,
      date,
      shortDescription,
      description,
    } = req.body;

    let mainImage = "";
    let featuredImage = "";

    if (req.files?.mainImage?.[0]) {
      mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "news/main",
      );
    }

    if (req.files?.featuredImage?.[0]) {
      featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "news/featured",
      );
    }

    const news = new News({
      categoryId,
      title,
      slug,
      postedBy,
      date,
      shortDescription,
      description,
      mainImage,
      featuredImage,
    });

    await news.save();
    // Save current URL in redirection table
    await UrlRedirection.create({
      itemId: news._id,
      type: "news",
      oldUrl: "",
      newUrl: slug,
    });
    return res.status(201).json({
      success: true,
      message: "News added successfully",
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getNews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    // Search Filter
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const total = await News.countDocuments(filter);

    const news = await News.find(filter)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: news,
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
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("categoryId");

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    if (news.mainImage) {
      await deleteFromCloudinary(news.mainImage);
    }

    if (news.featuredImage) {
      await deleteFromCloudinary(news.featuredImage);
    }

    await News.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }
    const oldSlug = news.slug;
    const slug = req.body.slug;
    const updateData = {
      categoryId: req.body.categoryId,
      title: req.body.title,
      slug,
      postedBy: req.body.postedBy,
      date: req.body.date,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
    };

    // Main Image
    if (req.files?.mainImage?.[0]) {
      if (news.mainImage) {
        await deleteFromCloudinary(news.mainImage);
      }

      updateData.mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "news/main",
      );
    }

    // Featured Image
    if (req.files?.featuredImage?.[0]) {
      if (news.featuredImage) {
        await deleteFromCloudinary(news.featuredImage);
      }

      updateData.featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "news/featured",
      );
    }

    await News.findByIdAndUpdate(req.params.id, updateData);

    // URL Redirection
    if (oldSlug !== slug) {
      await UrlRedirection.findOneAndUpdate(
        {
          itemId: news._id,
          type: "news",
        },
        {
          $set: {
            oldUrl: oldSlug,
            newUrl: slug,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );
    }
    return res.status(200).json({
      success: true,
      message: "News updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    news.featured = news.featured === 1 ? 0 : 1;

    await news.save();

    return res.status(200).json({
      success: true,
      message:
        news.featured === 1
          ? "News marked as Featured"
          : "News removed from Featured",
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const changeNewsStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    news.status = news.status === 1 ? 0 : 1;

    await news.save();

    return res.status(200).json({
      success: true,
      message:
        news.status === 1
          ? "News Activated Successfully"
          : "News Deactivated Successfully",
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getSeoById = async (req, res) => {
  try {
    const seo = await News.findById(req.params.id);

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

    await News.findByIdAndUpdate(req.params.id, {
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
  addNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews,
  changeFeatured,
  changeNewsStatus,
  getSeoById,
  updateSeo,
};
