import request from "@/utils/request.js";

export const UploadService = (formData) => request.post('/upload/single', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadChunk = (formData) => request.post('/upload/chunk', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadMerge = (data) => request.post('/upload/merge', data);