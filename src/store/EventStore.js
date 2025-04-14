import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useEventStore = defineStore("event", () => {
  const eventList = ref([]);
  const documentList = ref([]);
  const error = ref(null);

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
  const getEventList = async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách sự kiện.";
        eventList.value = [];
        return;
      }

      const response = await axios.get(
        "https://localhost:7244/api/Controller_Event/Get_List_Event?pageSize=10&pageNumber=1",
        { headers }
      );

      console.log("event list", response.data);

      if (response.status === 200 && response.data.items) {
        eventList.value = response.data.items;
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
  const getDocumentList = async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách tài liệu.";
        documentList.value = [];
        return;
      }

      const response = await axios.get(
        "https://localhost:7244/api/Controller_Document/Get_List_Document?pageSize=10&pageNumber=1",
        { headers }
      );

      if (response.status === 200 && response.data.items) {
        documentList.value = response.data.items;
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

  return {
    eventList,
    getEventList,
    documentList,
    getDocumentList,
    error,
  };
});
