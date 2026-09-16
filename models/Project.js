const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectCategory",
      required: true,
    },

    name: {
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

    // SEO Fields

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

module.exports = mongoose.model("Project", projectSchema);