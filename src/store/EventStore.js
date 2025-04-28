import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { urlHost } from '../UrlApiHostStore/ApiHostStore';

export const useEventStore = defineStore("event", () => {
  const eventList = ref([]);
  const documentList = ref([]);
  const error = ref(null);
  // Pagination cho Event
  const eventPagination = {
    totalItems: ref(0),
    totalPages: ref(0),
    currentPage: ref(1),
  };

  // Pagination cho Document
  const documentPagination = {
    totalItems: ref(0),
    totalPages: ref(0),
    currentPage: ref(1),
  };


  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        }
      : null;
  };

  // Get danh sách sự kiện
  const getEventList = async (pageNumber = 1) => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách sự kiện.";
        eventList.value = [];
        return;
      }

      const response = await axios.get(
        urlHost + `/api/Controller_Event/Get_List_Event?pageSize=10&pageNumber=${pageNumber}`,
        { headers }
      );

      console.log("event list", response.data);

      if (response.status === 200 && response.data.items) {
        eventList.value = response.data.items;
        eventPagination.totalItems.value = response.data.totalItems;
        eventPagination.totalPages.value = response.data.totalPages;
        eventPagination.currentPage.value = response.data.currentPage;
        error.value = null;
      } else {
        error.value = "⚠️ Không thể tải danh sách sự kiện từ máy chủ.";
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
      console.error("Error while fetching event list:", err);
      eventList.value = [];
    }
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
        urlHost + `/api/Controller_Document/Get_List_Document?pageSize=1&pageNumber=${pageNumber}`,
        { headers }
      );

      if (response.status === 200 && response.data.items) {
        documentList.value = response.data.items;
        documentPagination.totalItems.value = response.data.totalItems;
        documentPagination.totalPages.value = response.data.totalPages;
        documentPagination.currentPage.value = response.data.currentPage;
        error.value = null;
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

  // Đăng ký tham gia sự kiện
  const signUpForEvent = async (eventId) => {
    try {
      const headers = getAuthHeaders();
  
      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để đăng ký sự kiện.";
        return;
      }
  
      const formData = new FormData();
      formData.append("eventId", eventId); 
  
      const response = await axios.post(
        urlHost + "/api/Controller_Event/Sign_up_for_the_activity",
        formData,
        { headers }
      );
  
      if (response.data.status === 200) {
        return {
          success: true,
          message: response.data.message || "Đăng ký sự kiện thành công!",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Đăng ký sự kiện thất bại!",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Không thể kết nối tới server!",
      };
    }
  };


  // Hủy đăng ký tham gia sự kiện
  const unsubscribeFromEvent = async (eventId) => {
    try {
      const headers = getAuthHeaders();
  
      if (!headers) {
        return {
          success: false,
          message: "🔒 Bạn cần đăng nhập để hủy tham gia sự kiện.",
        };
      }
  
      const formData = new FormData();
      formData.append("eventId", eventId);
  
      const response = await axios.delete(
        urlHost + "/api/Controller_Event/Unsubscribe_from_activities",
        {
          headers,
          data: formData,   
        }
      );
  
      if (response.data.status === 200) {
        return {
          success: true,
          message: response.data.message || "Hủy tham gia thành công!",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Hủy tham gia thất bại!",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Không thể kết nối tới server!",
      };
    }
  };
  

  // Chuyển trang cho Event
  const goToEventPage = (page) => {
    if (page >= 1 && page <= eventPagination.totalPages.value) {
      getEventList(page);
    }
  };

  // Chuyển trang cho Document
  const goToDocumentPage = (page) => {
    if (page >= 1 && page <= documentPagination.totalPages.value) {
      getDocumentList(page);
    }
  };

  return {
    eventList,
    getEventList,
    documentList,
    getDocumentList,
    signUpForEvent,
    signUpForEvent,
    unsubscribeFromEvent,
    error,
    goToEventPage,
    goToDocumentPage,
    eventPagination,
    documentPagination,
  };
});
