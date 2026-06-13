const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadMultiple, uploadSingle } = require("../controllers/uploadController");

router.post("/multiple", protect, admin, upload.array("images", 5), uploadMultiple);
router.post("/single", protect, admin, upload.single("image"), uploadSingle);

module.exports = router;
