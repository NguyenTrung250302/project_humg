import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { urlHost } from '../UrlApiHostStore/ApiHostStore';


export const usePromulgateDocuments = defineStore("PromulgateDocuments", () => {
  const error = ref(null);
  const success = ref(null);
  const documentList = ref([]);

  // Pagination cho Document
  const documentPagination = {
    totalItems: ref(0),
    totalPages: ref(0),
    currentPage: ref(1),
  };

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

  // Get danh sách tài liệu
  const getDocumentList = async (pageNumber = 1) => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách tài liệu.";
        documentList.value = [];
        return;
      }

      const response = await axios.get(
        urlHost + `/api/Controller_Document/Get_List_Document?pageSize=10&pageNumber=${pageNumber}`,
        { headers }
      );

      if (response.status === 200 && response.data.items) {
        documentList.value = response.data.items;
        documentPagination.totalItems.value = response.data.totalItems;
        documentPagination.totalPages.value = response.data.totalPages;
        documentPagination.currentPage.value = response.data.currentPage;
        error.value = null;
        console.log(response.data)
      } else {
        error.value = "⚠️ Không thể tải danh sách tài liệu từ máy chủ.";
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error.value =
          "❌ Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (err.response && err.response.status >= 500) {
        error.value = "🔥 Lỗi máy chủ! Vui lòng thử lại sau.";
      } else {
        error.value = "🚫 Có lỗi xảy ra khi tải dữ liệu.";
      }
      console.error("Error while fetching document list:", err);
      documentList.value = [];
    }
  };

  // Chuyển trang cho Document
  const goToDocumentPage = (page) => {
    if (page >= 1 && page <= documentPagination.totalPages.value) {
      getDocumentList(page);
    }
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
        urlHost + "/api/Controller_Document/Add_Document",
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
        urlHost + "/api/Controller_Document/Delete_Document",
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
        urlHost + "/api/Controller_Document/Update_Document",
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
    getDocumentList,
    documentPagination,
    documentList,
    goToDocumentPage,
  };
});
