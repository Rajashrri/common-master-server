const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoCategory",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    youtubeLink: {
      type: String,
      required: true,
    },

    briefIntro: {
      type: String,
      required: true,
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

    thumbnailAlt: {
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

module.exports = mongoose.model("Video", videoSchema);