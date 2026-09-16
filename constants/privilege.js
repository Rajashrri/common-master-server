const OPERATIONS = Object.freeze({
  VIEW: "view",
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete",
});

const RESOURCES = Object.freeze({
  PRODUCTCATEGORY: "productcategory",
  PRODUCTSUBCATEGORY: "productsubcategory",
  PRODUCT: "product",
  PROJECTCATEGORY: "projectcategory",

  PROJECT: "project",

  BLOGCATEGORY: "blogcategory",

  BLOG: "blog",

  SERVICECATEGORY: "servicecategory",
  SERVICE: "service",
  FAQCATEGORY: "faqcategory",
  FAQ: "faq",

  EVENTCATEGORY: "eventcategory",
  EVENT: "event",
  JOBCATEGORY: "jobcategory",
  JOB: "job",

  NEWSCATEGORY: "newscategory",

  NEWS: "news",

  VIDEOCATEGORY: "videocategory",

  VIDEO: "video",

  GALLERYCATEGORY: "gallerycategory",
  GALLERY: "gallery",

  TEAM: "team",
  TESTIMONIAL: "testimonial",
  CLIENTELE: "clientele",
  PDF: "pdf",
  LINKS: "links",
});

module.exports = {
  OPERATIONS,
  RESOURCES,
};
