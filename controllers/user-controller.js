const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const RoleMaster = require("../models/RoleMaster");

// ================= ADD USER =================

const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const exists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Get Role Details
    const roleData = await RoleMaster.findById(role);

    if (!roleData) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: roleData._id,
      roleName: roleData.roleName,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User added successfully.",
      data: user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= USER LIST =================

const listUser = async (req, res) => {
  try {
    const users = await User.find({
      roleName: { $ne: "admin" },
    })
      .populate("role", "roleName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= USER DETAIL =================

const userDetail = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("+password")
      .populate("role", "roleName");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      data: user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= UPDATE USER =================

const updateUser = async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const emailExists = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.params.id },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

// Get Role Details
const roleData = await RoleMaster.findById(role);

if (!roleData) {
  return res.status(404).json({
    success: false,
    message: "Role not found.",
  });
}

// Update User
user.name = name;
user.email = email;
user.role = roleData._id;
user.roleName = roleData.roleName;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= DELETE USER =================

const deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= CHANGE STATUS =================

const changeStatus = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.json({
      success: true,
      message: "Status updated successfully.",
      status: user.isActive,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  addUser,
  listUser,
  userDetail,
  updateUser,
  deleteUser,
  changeStatus,
};