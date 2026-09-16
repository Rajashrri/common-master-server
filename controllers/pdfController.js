const Pdf = require("../models/Pdf");

const { uploadToCloudinary } = require("../utils/upload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");

// ====================================
// Add PDF
// ====================================

const addPdf = async (req, res) => {
  try {

    const { pdfName } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF is required",
      });
    }

    const pdfFile = await uploadToCloudinary(
  req.file.path,
  "pdf",
  "raw"
);

    const pdf = new Pdf({
      pdfName,
      pdfFile,
    });

    await pdf.save();

    res.status(201).json({
      success: true,
      message: "PDF Added Successfully",
      data: pdf,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ====================================
// List PDF
// ====================================

const getPdfs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {};

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          pdfName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Pdf.countDocuments(filter);

    const pdfs = await Pdf.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: pdfs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================================
// Get Single PDF
// ====================================

const getPdfById = async (req, res) => {

  try {

    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pdf,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ====================================
// Update PDF
// ====================================

const updatePdf = async (req, res) => {

  try {

    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    const updateData = {
      pdfName: req.body.pdfName,
    };

    // Upload New PDF

    if (req.file) {

      if (pdf.pdfFile) {
        await deleteFromCloudinary(pdf.pdfFile);
      }

      updateData.pdfFile =
       await uploadToCloudinary(
  req.file.path,
  "pdf",
  "raw"
);

    }

    await Pdf.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "PDF Updated Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ====================================
// Delete PDF
// ====================================

const deletePdf = async (req, res) => {

  try {

    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {

      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });

    }

    if (pdf.pdfFile) {

      await deleteFromCloudinary(
        pdf.pdfFile
      );

    }

    await Pdf.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "PDF Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ====================================
// Change Status
// ====================================

const changePdfStatus = async (
  req,
  res
) => {

  try {

    const pdf = await Pdf.findById(
      req.params.id
    );

    if (!pdf) {

      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });

    }

    pdf.status =
      pdf.status === 1 ? 0 : 1;

    await pdf.save();

    res.status(200).json({
      success: true,
      message:
        pdf.status === 1
          ? "PDF Activated Successfully"
          : "PDF Deactivated Successfully",
      data: pdf,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  addPdf,
  getPdfs,
  getPdfById,
  updatePdf,
  deletePdf,
  changePdfStatus,
};