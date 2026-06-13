const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const urls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json(`/uploads/${req.file.filename}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMultiple, uploadSingle };
