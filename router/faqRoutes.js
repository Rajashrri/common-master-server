const express = require("express");

const router = express.Router();

const {
  addFaq,
  getFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
  getSeoById,
  updateSeo,
  changeFaqStatus,
} = require("../controllers/faqController");

// ==========================
// FAQ CRUD
// ==========================

router.post(
  "/add-faq",
  addFaq
);

router.get(
  "/list-faq",
  getFaqs
);

router.get(
  "/faq-detail/:id",
  getFaqById
);

router.put(
  "/update-faq/:id",
  updateFaq
);

router.delete(
  "/delete-faq/:id",
  deleteFaq
);

// ==========================
// SEO
// ==========================

router.get(
  "/faq-seo/:id",
  getSeoById
);

router.put(
  "/faq-updateseo/:id",
  updateSeo
);

// ==========================
// Status
// ==========================

router.patch(
  "/change-status/:id",
  changeFaqStatus
);

module.exports = router;