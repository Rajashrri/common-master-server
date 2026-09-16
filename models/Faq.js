const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FaqCategory",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
    },

    status: {
      type: Number,
      default: 1,
    },

    // SEO

    metaTitle: {
      type: String,
      default: "",
    },

    metaKeywords: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    schemaCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Faq", faqSchema);