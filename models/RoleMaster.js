const mongoose = require("mongoose");

const roleMasterSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      trim: true,
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

module.exports = mongoose.model(
  "RoleMaster",
  roleMasterSchema
);