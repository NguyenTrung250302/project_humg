import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useEventAdminStore = defineStore("eventAdmin", () => {
  const error = ref(null);
  const success = ref(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        }
      : null;
  };

  // Post API thêm Event
  const AddNewEvent = async (eventData, imageFile) => {
    error.value = null;
    success.value = null;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để thêm sự kiện";
        return;
      }

      if (!imageFile) {
        error.value = "🔴 Bạn cần chọn ảnh cho sự kiện!";
        return;
      }

      const formData = new FormData();
      formData.append("EventName", eventData.eventName);
      formData.append("Description", eventData.description);
      formData.append("EventStartDate", eventData.eventStartDate);
      formData.append("EventEndDate", eventData.eventEndDate);
      formData.append("EventLocation", eventData.eventLocation);
      formData.append("UrlAvatar", imageFile || "");

      const response = await axios.post(
        "https://localhost:7244/api/Controller_Event/Add_Event",
        formData,
        { headers }
      );

      success.value = "🎉 Thêm sự kiện thành công!";
      return response.data;
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        error.value = Object.values(errors).flat().join(" | ");
      } else {
        error.value = "Đã xảy ra lỗi khi thêm sự kiện!";
      }
    }
  };

  //Put api sửa Even
  const UpdateEvent = async (eventData) => {
    error.value = null;
    success.value = null;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để cập nhật sự kiện";
        return;
      }

      const formData = new FormData();
      formData.append("Id", eventData.id); // ID là bắt buộc
      formData.append("EventName", eventData.eventName);
      formData.append("Description", eventData.description);
      formData.append("EventStartDate", eventData.eventStartDate);
      formData.append("EventEndDate", eventData.eventEndDate);
      formData.append("EventLocation", eventData.eventLocation);

      // Check if urlAvatar is a File object (new image uploaded)
      if (eventData.urlAvatar instanceof File) {
        formData.append("UrlAvatar", eventData.urlAvatar);
      } else {
        formData.append("UrlAvatar", eventData.urlAvatar || "");
      }

      formData.append("UrlImg", eventData.urlImg || ""); // Add urlImg to the form data

      const response = await axios.put(
        "https://localhost:7244/api/Controller_Event/Update_event",
        formData,
        { headers }
      );

      success.value = "✅ Cập nhật sự kiện thành công!";
      return response.data;
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        error.value = Object.values(errors).flat().join(" | ");
      } else {
        error.value = "⚠️ Đã xảy ra lỗi khi cập nhật sự kiện!";
      }
    }
  };

  //Delete api
  const DeleteEvent = async (eventId) => {
    error.value = null;
    success.value = null;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xóa sự kiện";
        return;
      }

      const formData = new FormData();
      formData.append("eventId", eventId);

      const response = await axios.delete(
        "https://localhost:7244/api/Controller_Event/Delete_Event",
        {
          headers,
          data: formData, // 💡 axios cần `data` trong options khi gửi body cho DELETE
        }
      );

      success.value = "🗑️ Xóa sự kiện thành công!";
      return response.data;
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        error.value = Object.values(errors).flat().join(" | ");
      } else {
        error.value = "⚠️ Đã xảy ra lỗi khi xóa sự kiện!";
      }
    }
  };

  return {
    DeleteEvent,
    UpdateEvent,
    AddNewEvent,
    error,
    success,
  };
});
