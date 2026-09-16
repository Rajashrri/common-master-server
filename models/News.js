const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewsCategory",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    postedBy: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    mainImage: {
      type: String,
      default: "",
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

    mainImageAlt: {
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

module.exports = mongoose.model("News", newsSchema);