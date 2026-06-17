const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dn5h9ervo/image/upload";
const UPLOAD_PRESET = "hr-lifestylehr-lifestyle";

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url;
};

export const uploadMultipleToCloudinary = async (files) => {
  const urls = [];
  for (const file of files) {
    const url = await uploadImageToCloudinary(file);
    urls.push(url);
  }
  return urls;
};

export const uploadImageToBackend = async (file) => {
  return uploadImageToCloudinary(file);
};

export const uploadMultipleImages = async (files) => {
  return uploadMultipleToCloudinary(files);
};

export const uploadImageToFirebase = uploadImageToBackend;
