const RoleMaster = require("../models/RoleMaster");
const Privilege = require("../models/Privilege");
const { RESOURCES } = require("../constants/privilege");
// ================= ADD =================

const addRole = async (req, res) => {
  try {

    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({
        success: false,
        message: "Role Name is required.",
      });
    }

    const exists = await RoleMaster.findOne({
      roleName: roleName.trim(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Role already exists.",
      });
    }

 const role = await RoleMaster.create({
  roleName,
});

const permissions = Object.values(RESOURCES).map((resource) => ({
  resource,
  operations: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
}));

await Privilege.create({
  role: role.roleName,
  roleId: role._id,
  permissions,
});

res.status(201).json({
  success: true,
  message: "Role added successfully.",
  data: role,
});

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= LIST =================

const listRole = async (req, res) => {

  try {

    const roles = await RoleMaster.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: roles,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= DETAIL =================

const roleDetail = async (req, res) => {

  try {

    const role = await RoleMaster.findById(req.params.id);

    res.json({
      success: true,
      data: role,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= UPDATE =================

const updateRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    const role = await RoleMaster.findByIdAndUpdate(
      req.params.id,
      { roleName },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    // Privilege table me bhi role name update karo
    await Privilege.updateOne(
      { roleId: role._id },
      {
        $set: {
          role: role.roleName,
        },
      }
    );

    res.json({
      success: true,
      message: "Role updated successfully.",
      data: role,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE =================

const deleteRole = async (req, res) => {

  try {

    await RoleMaster.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Role deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= STATUS =================

const changeStatus = async (req, res) => {

  try {

    const role = await RoleMaster.findById(req.params.id);

    role.status = role.status === 1 ? 0 : 1;

    await role.save();

    res.json({
      success: true,
      message: "Status updated successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  addRole,
  listRole,
  roleDetail,
  updateRole,
  deleteRole,
  changeStatus,
};