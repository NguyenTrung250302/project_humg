import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const usePromulgateDocuments = defineStore("PromulgateDocuments", () => {
  const error = ref(null);
  const success = ref(null);

  // Hàm lấy headers Authorization từ localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        }
      : null;
  };

  // Hàm thêm tài liệu
  const addDocument = async (documentData, imageFile) => {
    error.value = null;
    success.value = null;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để thêm tài liệu!";
        return;
      }

      if (!imageFile) {
        error.value = "🔴 Bạn cần chọn ảnh cho tài liệu!";
        return;
      }

      const formData = new FormData();
      formData.append("DocumentTitle", documentData.documentTitle);
      formData.append("DocumentContent", documentData.documentContent);
      formData.append("UrlAvatar", imageFile || "");

      const response = await axios.post(
        "https://localhost:7244/api/Controller_Document/Add_Document",
        formData,
        { headers }
      );

      success.value = "🎉 Thêm tài liệu thành công!";
      return response.data;
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        error.value = Object.values(errors).flat().join(" | ");
      } else {
        error.value = "Đã xảy ra lỗi khi thêm tài liệu!";
      }
    }
  };

  // Hàm xóa tài liệu
  const deleteDocument = async (documentId) => {
    error.value = null;
    success.value = null;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xóa tài liệu!";
        return;
      }

      // Thêm Content-Type vào headers
      const requestHeaders = {
        ...headers,
        'Content-Type': 'multipart/form-data'
      };

      const formData = new FormData();
      formData.append('Id', documentId);

      const response = await axios.delete(
        "https://localhost:7244/api/Controller_Document/Delete_Document",
        {
          headers: requestHeaders,
          data: formData
        }
      );

      if (response.data.status === 200) {
        success.value = "🎉 Xóa tài liệu thành công!";
        return response.data;
      } else {
        error.value = response.data.message || "Đã xảy ra lỗi khi xóa tài liệu!";
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        error.value = Object.values(errors).flat().join(" | ");
      } else {
        error.value = "Đã xảy ra lỗi khi xóa tài liệu!";
      }
    }
  };

  // Hàm sửa tài liệu
  const updateDocument = async (documentData, imageFile) => {
    error.value = null;
    success.value = null;

    try {
      const headers = getAuthHeaders();
  
      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để sửa tài liệu!";
        return;
      }

      // Thêm Content-Type vào headers
      const requestHeaders = {
        ...headers,
        'Content-Type': 'multipart/form-data'
      };
  
      const formData = new FormData();
      formData.append("Id", documentData.id);
      formData.append("DocumentTitle", documentData.documentTitle);
      formData.append("DocumentContent", documentData.documentContent);
      
      // Chỉ append file nếu có file mới được chọn
      if (imageFile) {
        formData.append("UrlAvatar", imageFile);
      }
  
      const response = await axios.put(
        "https://localhost:7244/api/Controller_Document/Update_Document",
        formData,
        { headers: requestHeaders }
      );

      if (response.data.status === 200) {
        success.value = "🎉 Sửa tài liệu thành công!";
        return response.data;
      } else {
        error.value = response.data.message || "Đã xảy ra lỗi khi sửa tài liệu!";
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        error.value = Object.values(errors).flat().join(" | ");
      } else if (err.response?.data?.message) {
        error.value = err.response.data.message;
      } else {
        error.value = "Đã xảy ra lỗi khi sửa tài liệu!";
      }
    }
  };
  

  return {
    addDocument,
    deleteDocument,
    updateDocument, 
    error,
    success,
  };
});
