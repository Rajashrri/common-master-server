const mongoose = require("mongoose");

const privilegeSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoleMaster",
      required: true,
    },

    permissions: [
      {
        resource: String,
        operations: {
          view: {
            type: Boolean,
            default: false,
          },
          add: {
            type: Boolean,
            default: false,
          },
          edit: {
            type: Boolean,
            default: false,
          },
          delete: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Privilege", privilegeSchema);