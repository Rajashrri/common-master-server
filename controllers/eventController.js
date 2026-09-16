const Event = require("../models/Event");
const UrlRedirection = require("../models/UrlRedirection");

const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");

// =====================================
// ADD EVENT
// =====================================

const addEvent = async (req, res) => {
  try {
    const {
      categoryId,
      title,
      slug,
      fromDate,
      endDate,
      timing,
      entryFee,
      ticketLink,
      briefIntro,
      details,
    } = req.body;

    // Validation

    if (
      !categoryId ||
      !title ||
      !slug ||
      !fromDate ||
      !endDate ||
      !timing ||
      !entryFee ||
      !ticketLink ||
      !briefIntro ||
      !details
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Date Validation

    if (new Date(endDate) < new Date(fromDate)) {
      return res.status(400).json({
        success: false,
        message: "End Date cannot be earlier than From Date",
      });
    }

    // Duplicate Slug

    const slugExists = await Event.findOne({ slug });

    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    let mainImage = "";
    let featuredImage = "";

    // Upload Main Image

    if (req.files?.mainImage?.[0]) {
      mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "events/main",
      );
    }

    // Upload Featured Image

    if (req.files?.featuredImage?.[0]) {
      featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "events/featured",
      );
    }

    const event = new Event({
      categoryId,
      title,
      slug,
      fromDate,
      endDate,
      timing,
      entryFee,
      ticketLink,
      briefIntro,
      details,
      mainImage,
      featuredImage,
    });

    await event.save();
    // Save current URL in redirection table
    await UrlRedirection.create({
      itemId: event._id,
      type: "event",
      oldUrl: "",
      newUrl: slug,
    });
    return res.status(201).json({
      success: true,
      message: "Event Added Successfully",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// EVENT LIST
// =====================================

const getEvents = async (req, res) => {
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
          slug: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: events,
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

// =====================================
// EVENT DETAIL
// =====================================

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("categoryId");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// UPDATE EVENT
// =====================================

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const oldSlug = event.slug;

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const {
      categoryId,
      title,
      slug,
      fromDate,
      endDate,
      timing,
      entryFee,
      ticketLink,
      briefIntro,
      details,
    } = req.body;

    // Date Validation

    if (new Date(endDate) < new Date(fromDate)) {
      return res.status(400).json({
        success: false,
        message: "End Date cannot be earlier than From Date",
      });
    }

    // Duplicate Slug

    const slugExists = await Event.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const updateData = {
      categoryId,
      title,
      slug,
      fromDate,
      endDate,
      timing,
      entryFee,
      ticketLink,
      briefIntro,
      details,
    };

    // ==========================
    // Main Image
    // ==========================

    if (req.files?.mainImage?.[0]) {
      if (event.mainImage) {
        await deleteFromCloudinary(event.mainImage);
      }

      updateData.mainImage = await uploadToCloudinary(
        req.files.mainImage[0].path,
        "events/main",
      );
    }

    // ==========================
    // Featured Image
    // ==========================

    if (req.files?.featuredImage?.[0]) {
      if (event.featuredImage) {
        await deleteFromCloudinary(event.featuredImage);
      }

      updateData.featuredImage = await uploadToCloudinary(
        req.files.featuredImage[0].path,
        "events/featured",
      );
    }

    await Event.findByIdAndUpdate(req.params.id, updateData);
    // Update URL Redirection
    if (oldSlug !== slug) {
      await UrlRedirection.findOneAndUpdate(
        {
          itemId: event._id,
          type: "event",
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
      message: "Event Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// DELETE EVENT
// =====================================

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.mainImage) {
      await deleteFromCloudinary(event.mainImage);
    }

    if (event.featuredImage) {
      await deleteFromCloudinary(event.featuredImage);
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Event Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// CHANGE STATUS
// =====================================

const changeEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.status = event.status === 1 ? 0 : 1;

    await event.save();

    return res.status(200).json({
      success: true,
      message:
        event.status === 1
          ? "Event Activated Successfully"
          : "Event Deactivated Successfully",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// CHANGE FEATURED
// =====================================

const changeFeatured = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.featured = event.featured === 1 ? 0 : 1;

    await event.save();

    return res.status(200).json({
      success: true,
      message:
        event.featured === 1
          ? "Event Marked as Featured"
          : "Event Removed From Featured",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET SEO
// =====================================

const getSeoById = async (req, res) => {
  try {
    const seo = await Event.findById(req.params.id);

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

// =====================================
// UPDATE SEO
// =====================================

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

    await Event.findByIdAndUpdate(req.params.id, {
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
      message: error.message,
    });
  }
};

module.exports = {
  addEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  changeEventStatus,
  changeFeatured,
  getSeoById,
  updateSeo,
};
