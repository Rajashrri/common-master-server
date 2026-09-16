const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventCategory",
      required: true,
    },

    title: {
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

    fromDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    timing: {
      type: String,
      required: true,
      trim: true,
    },

    entryFee: {
      type: String,
      required: true,
      trim: true,
    },

    ticketLink: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Event", eventSchema);