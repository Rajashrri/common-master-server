require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const port = process.env.PORT || 8000;

// Database Connection
const connectDB = require("./utils/db");

const statusMointor = require("express-status-monitor");

// Routes
const authRoute = require("./router/auth-router");

const profileRoutes = require("./router/profile-router");

const ckeditorRoutes = require("./router/ckeditor-router");
const testimonialRoutes = require("./router/testimonial-router");
const clienteleRoutes = require("./router/clientele-router");
const TeamRouter = require("./router/Team-router");

const userRouter = require("./router/user-router");
const privilegeRoutes = require("./router/privilege-router");

const roleMasterRouter = require("./router/roleMaster-router");

//frontend
const blogCategoryRoutes = require("./router/blogCategoryRoutes");

const blogRoutes = require("./router/blog-router");
const productRoutes = require("./router/product-router");
const productCategoryRoutes = require("./router/productCategory-router");
const productSubCategoryRoutes = require("./router/productSubCategory-router");
const serviceCategoryRoutes = require("./router/serviceCategory-router");
const serviceRouter = require("./router/service-router");
const newsCategoryRouter = require("./router/newsCategory-router");
const newsRoute = require("./router/newsRoute");
const eventsCategoryRouter = require("./router/eventCategory-router");
const eventRoutes = require("./router/eventRoutes");
const pdfRoutes = require("./router/pdfRoutes");
const projectCategoryRoutes = require("./router/projectCategoryRoutes");
const projectRoutes = require("./router/projectRoutes");
const galleryCategoryRoutes = require("./router/galleryCategoryRoutes");
const galleryRoutes = require("./router/galleryRoutes");
const videoCategoryRoutes = require("./router/videoCategoryRoutes");
const videoRoutes = require("./router/videoRoutes");
const jobCategoryRouter = require("./router/jobCategoryRoutes");
const jobRouter = require("./router/jobRoutes");
const faqCategoryRoutes = require("./router/faqCategoryRoutes");

const faqRoutes = require("./router/faqRoutes");

const linkRoutes = require("./router/linkRoutes");

const frontRoutes = require("./router/front-router");
const listRoutes = require("./router/list-router");

console.log(process.env.WEBSITE_URL);

console.log(process.env.FRONTEND_URL);
const allowedOrigins = [process.env.FRONTEND_URL, process.env.WEBSITE_URL];

const corsOptions = {
  origin: function (origin, callback) {
    // Postman / no origin requests allow
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/profile", express.static(path.join(__dirname, "public/profile")));
app.use("/blog", express.static(path.join(__dirname, "public/blog")));
const safeTrackActivity = (req, res, next) => {
  if (req.method === "OPTIONS") return next(); // Skip preflight
  trackActivity(req, res, next);
};
app.use("/api/auth", authRoute);

app.use("/api/blog-category", blogCategoryRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/product-category", productCategoryRoutes);
app.use("/api/product-subcategory", productSubCategoryRoutes);
app.use("/api/pdf",pdfRoutes);
app.use("/api/project-category",projectCategoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/service", serviceRouter);
app.use("/api/event", eventRoutes);
app.use("/api/link", linkRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/gallery-category",galleryCategoryRoutes);
app.use("/api/job", jobRouter);
app.use("/api/video-category", videoCategoryRoutes);
app.use("/api/service-category", serviceCategoryRoutes);
app.use(
  "/api/news-category",
  newsCategoryRouter
);
app.use("/api/news", newsRoute);

app.use(
  "/api/event-category",
 eventsCategoryRouter
);
app.use(
  "/api/job-category",
 jobCategoryRouter
);
app.use(
  "/api/faq-category",
  faqCategoryRoutes
);

app.use("/api/video", videoRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/clientele", clienteleRoutes);

app.use("/api/testimonial", testimonialRoutes);

app.use("/api/team", TeamRouter);

app.use("/api/ckeditor", ckeditorRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/role-master", roleMasterRouter);

app.use("/api/user", userRouter);

app.use("/api/privilege", privilegeRoutes);

app.use("/api/front", frontRoutes);
app.use("/api/list", listRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.get("/health/details", async (req, res) => {
  try {
    res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      status: "DOWN",
      error: err.message,
    });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
});
