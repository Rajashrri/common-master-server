const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSubCategory",
      required: true,
    },

    productName: {
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

    mainImage: {
      type: String,
      default: "",
    },

    featuredImage: {
      type: String,
      default: "",
    },

    briefIntro: {
      type: String,
      required: true,
      trim: true,
    },

    details: {
      type: String,
      required: true,
    },

    status: {
      type: Number,
      default: 1, // 1 = Active, 0 = Inactive
    },

    featured: {
      type: Number,
      default: 0, // 1 = Featured
    },
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

module.exports = mongoose.model("Product", productSchema);