const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    pdfName: {
      type: String,
      required: true,
      trim: true,
    },

    pdfFile: {
      type: String,
      required: true,
    },

    status: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pdf", pdfSchema);