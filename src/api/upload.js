import request from "@/utils/request.js";

export const UploadService = (formData) => request.post('/upload/single', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
