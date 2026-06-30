const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/ /g, "-");
  }
  next();
});

categorySchema.index({ name: 1 });

module.exports = mongoose.model("Category", categorySchema);
