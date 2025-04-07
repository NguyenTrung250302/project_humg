import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useEventStore = defineStore("event", () => {
  const eventList = ref([]);
  const error = ref(null); // để lưu lỗi nếu có

  // Sử dụng lại hàm getAuthHeaders để lấy header với token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        }
      : null; // Trả về null nếu không có token
  };

  const getEventList = async () => {
    try {
      const headers = getAuthHeaders(); // Lấy headers từ hàm getAuthHeaders

      // Nếu không có token, thông báo người dùng cần đăng nhập
      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách sự kiện.";
        eventList.value = [];
        return;
      }

      const response = await axios.get(
        "https://localhost:7244/api/Controller_Event/Get_List_Event?pageSize=10&pageNumber=1",
        {
          headers: headers, // Sử dụng headers lấy từ getAuthHeaders
        }
      );

      if (response.status === 200 && response.data.items) {
        eventList.value = response.data.items;
        error.value = null; // call thành công
      } else {
        error.value = "⚠️ Không thể tải danh sách sự kiện từ máy chủ.";
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      // Phân biệt lỗi rõ ràng hơn
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

  return { eventList, getEventList, error };
});
