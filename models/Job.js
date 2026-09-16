const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    salaryOffered: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    briefIntro: {
      type: String,
      required: true,
    },

    details: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
      default: "",
    },

    status: {
      type: Number,
      default: 1,
    },

    featured: {
      type: Number,
      default: 0,
    },

    // ==========================
    // SEO
    // ==========================

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

    featuredImageAlt: {
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

module.exports = mongoose.model("Job", jobSchema);