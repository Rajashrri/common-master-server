const Faq = require("../models/Faq");

// ===================================
// Add FAQ
// ===================================

const addFaq = async (req, res) => {
  try {
    const {
      categoryId,
      question,
      answer,
    } = req.body;

    if (
      !categoryId ||
      !question ||
      !answer
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await Faq.findOne({
      question: question.trim(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Question already exists",
      });
    }

    const faq = new Faq({
      categoryId,
      question,
      answer,
    });

    await faq.save();

    return res.status(201).json({
      success: true,
      message: "FAQ added successfully",
      data: faq,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================
// FAQ List
// ===================================

const getFaqs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        {
          question: {
            $regex: search,
            $options: "i",
          },
        },
        {
          answer: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Faq.countDocuments(filter);

    const faqs = await Faq.find(filter)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: faqs,
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
      message: "Server Error",
    });
  }
};

// ===================================
// Get FAQ By Id
// ===================================

const getFaqById = async (req, res) => {
  try {

    const faq = await Faq.findById(req.params.id)
      .populate("categoryId");

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faq,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ===================================
// Update FAQ
// ===================================

const updateFaq = async (req, res) => {
  try {

    const {
      categoryId,
      question,
      answer,
    } = req.body;

    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    await Faq.findByIdAndUpdate(
      req.params.id,
      {
        categoryId,
        question,
        answer,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ===================================
// Delete FAQ
// ===================================

const deleteFaq = async (req, res) => {
  try {

    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    await Faq.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
// ===================================
// Get SEO
// ===================================

const getSeoById = async (req, res) => {
  try {

    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faq,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
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
      schemaCode,
    } = req.body;

    await Faq.findByIdAndUpdate(
      req.params.id,
      {
        metaTitle,
        metaKeywords,
        metaDescription,
        schemaCode,
      }
    );

    return res.status(200).json({
      success: true,
      message: "SEO Updated Successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });

  }
};

// ===================================
// Change Status
// ===================================

const changeFaqStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const faq = await Faq.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    faq.status = faq.status === 1 ? 0 : 1;

    await faq.save();

    return res.status(200).json({
      success: true,
      message:
        faq.status === 1
          ? "FAQ Activated Successfully"
          : "FAQ Deactivated Successfully",
      data: faq,
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
  addFaq,
  getFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
  getSeoById,
  updateSeo,
  changeFaqStatus,
};