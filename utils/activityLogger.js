const Activity = require("../models/Activity");

const logActivity = async ({
  user,
  module,
  action,
  recordId,
  title,
  description,
  req,
}) => {
  try {
    await Activity.create({
      user,
      module,
      action,
      recordId,
      title,
      description,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (err) {
    console.log("Activity Log Error:", err.message);
  }
};

module.exports = logActivity;