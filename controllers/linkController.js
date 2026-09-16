const Link = require("../models/Link");

// ===============================
// Add Link
// ===============================

const addLink = async (req, res) => {
  try {
    const { linkName, link } = req.body;

    if (!linkName || !link) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const urlRegex =
      /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;

    if (!urlRegex.test(link)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid URL",
      });
    }

    const linkExists = await Link.findOne({
      link: link.trim(),
    });

    if (linkExists) {
      return res.status(400).json({
        success: false,
        message: "Link already exists",
      });
    }

    const newLink = new Link({
      linkName,
      link,
    });

    await newLink.save();

    return res.status(201).json({
      success: true,
      message: "Link added successfully",
      data: newLink,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// List
// ===============================

const getLinks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        {
          linkName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          link: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Link.countDocuments(filter);

    const links = await Link.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: links,
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
// ===============================
// Single Link
// ===============================

const getLinkById = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: link,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Update
// ===============================

const updateLink = async (req, res) => {
  try {
    const { linkName, link } = req.body;

    if (!linkName || !link) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const urlRegex =
      /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;

    if (!urlRegex.test(link)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid URL",
      });
    }

    const exists = await Link.findOne({
      link: link.trim(),
      _id: { $ne: req.params.id },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Link already exists",
      });
    }

    const updated = await Link.findByIdAndUpdate(
      req.params.id,
      {
        linkName,
        link,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Link updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Delete
// ===============================

const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    await Link.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Change Status
// ===============================

const changeLinkStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findById(id);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    link.status = link.status === 1 ? 0 : 1;

    await link.save();

    return res.status(200).json({
      success: true,
      message:
        link.status === 1
          ? "Link Activated Successfully"
          : "Link Deactivated Successfully",
      data: link,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  addLink,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
  changeLinkStatus,
};