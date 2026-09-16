const Testimonial = require("../models/Testimonial");
const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");
// ================= Add Testimonial =================

const addTestimonial = async (req, res) => {
  try {
    const { name, designation, briefIntro } = req.body;

    if (!name || !designation || !briefIntro) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!req.files || !req.files.image || !req.files.image.length) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const imageUrl = await uploadToCloudinary(
      req.files.image[0].path,
      "testimonial"
    );

    const testimonial = new Testimonial({
      name,
      designation,
      briefIntro,
      image: imageUrl,
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully.",
      data: testimonial,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= List Testimonials =================

const listTestimonials = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          designation: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Testimonial.countDocuments(filter);

    const testimonials = await Testimonial.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: testimonials,
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

// ================= Testimonial Detail =================

const testimonialDetail = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Update Testimonial =================

const updateTestimonial = async (req, res) => {
  try {
    const { name, designation, briefIntro } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    testimonial.name = name;
    testimonial.designation = designation;
    testimonial.briefIntro = briefIntro;

    if (req.file) {
      // Upload new image to Cloudinary
      const imageUrl = await uploadToCloudinary(
        req.file.path,
        "testimonial"
      );

      // Delete old image from Cloudinary
      if (testimonial.image) {
        await deleteFromCloudinary(testimonial.image);
      }

      // Save new image URL
      testimonial.image = imageUrl;
    }

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      data: testimonial,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Delete Testimonial =================

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const changeStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.status = testimonial.status === 1 ? 0 : 1;

    await testimonial.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addTestimonial,
  listTestimonials,
  testimonialDetail,
  updateTestimonial,
  deleteTestimonial,
  changeStatus
};