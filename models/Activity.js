const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    module: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "STATUS_CHANGE",
        "LOGIN",
        "LOGOUT",
      ],
      required: true,
    },
    recordId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);