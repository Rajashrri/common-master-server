const UserModel = require("../models/user-model");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

    } catch (err) {

      return res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Session expired. Please login again."
            : "Invalid token",
      });

    }

    // ===========================
    // USER
    // ===========================

    const user = await UserModel.findById(decoded.sub)
      .populate("role")
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account inactive",
      });
    }

    // ===========================
    // LEGACY ADMIN
    // ===========================

    const isLegacyAdmin =
      !user.role &&
      user.roleName &&
      user.roleName.toLowerCase() === "admin";

    let roleId = null;
    let roleName = "admin";

    if (!isLegacyAdmin) {
      roleId = user.role?._id || null;
      roleName =
        user.role?.roleName ||
        user.roleName ||
        "";
    }

    // ===========================
    // REQUEST DATA
    // ===========================

    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,

      role: roleId,

      roleName,

      isLegacyAdmin,

      isActive: user.isActive,

      isVerified: user.isVerified,
    };

    req.userId = user._id;

    req.role = roleId;

    req.roleName = roleName;

    next();

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });

  }
};

module.exports = authenticate;