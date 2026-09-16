const Privilege = require("../models/Privilege");
const RoleMaster = require("../models/RoleMaster");
const { RESOURCES } = require("../constants/privilege");
const User = require("../models/user-model");

// ================= ADD / UPDATE =================

const savePrivilege = async (req, res) => {
  try {
    const { roleId, permissions } = req.body;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: "Role is required.",
      });
    }

    const role = await RoleMaster.findById(roleId);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    let privilege = await Privilege.findOne({ roleId });

    if (privilege) {
      privilege.permissions = permissions;
      privilege.role = role.roleName;

      await privilege.save();

      return res.json({
        success: true,
        message: "Privilege updated successfully.",
      });
    }

    privilege = await Privilege.create({
      role: role.roleName,
      roleId,
      permissions,
    });

    res.status(201).json({
      success: true,
      message: "Privilege saved successfully.",
      data: privilege,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= LIST =================

const listPrivilege = async (req, res) => {

  try {

    const data = await Privilege.find()
      .populate("roleId", "roleName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= DETAIL =================

const privilegeDetail = async (req, res) => {

  try {

    const data = await Privilege.findOne({
      roleId: req.params.roleId,
    });

    if (!data) {

      return res.json({
        success: true,
        data: {
          permissions: Object.values(RESOURCES).map((item) => ({
            resource: item,
            operations: {
              view: false,
              add: false,
              edit: false,
              delete: false,
            },
          })),
        },
      });

    }

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= DELETE =================

const deletePrivilege = async (req, res) => {

  try {

    await Privilege.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Privilege deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
const getMyPermissions = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================
    // ADMIN -> Full Access
    // ==========================
    if (
      user.roleName &&
      user.roleName.toLowerCase() === "admin"
    ) {
      return res.json({
        success: true,
        isAdmin: true,
        permissions: [],
      });
    }

    // ==========================
    // SUB ADMIN
    // ==========================
    const privilege = await Privilege.findOne({
      roleId: user.role,
    });

    return res.json({
      success: true,
      isAdmin: false,
      permissions: privilege?.permissions || [],
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  savePrivilege,
  listPrivilege,
  privilegeDetail,
  deletePrivilege,
  getMyPermissions
};