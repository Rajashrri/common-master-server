const mongoose = require("mongoose");

const websiteSettingSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: "",
    },
    favicon: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "WebsiteSetting",
  websiteSettingSchema
);