import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { urlHost } from '../UrlApiHostStore/ApiHostStore';

export const useManagerStore = defineStore("manager", () => {
  const loading = ref(false);
  const error = ref(null);
  const members = ref([]);
  const totalItems = ref(0);
  const totalPages = ref(0);
  const currentPage = ref(1);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        }
      : null;
  };

  // get danh sách member
  const getMemberList = async (pageNumber = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách thành viên.";
        members.value = [];
        return { success: false, message: error.value };
      }

      const response = await axios.get(
        urlHost + `/api/Controller_MemberInfo/Get_List_Menber_Info?pageSize=12&pageNumber=${pageNumber}`,
        { headers }
      );

      if (
        response.status === 200 &&
        response.data.items &&
        Array.isArray(response.data.items)
      ) {
        members.value = response.data.items;
        console.log("member list", members.value);
        totalItems.value = response.data.totalItems;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;

        return {
          success: true,
          message: "Lấy danh sách thành viên thành công!",
          data: members.value,
        };
      } else {
        error.value = "⚠️ Không thể tải danh sách thành viên từ máy chủ.";
        console.error("Unexpected response:", response);
        return { success: false, message: error.value };
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
      console.error("Error while fetching member list:", err);
      members.value = [];
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Tìm kiếm thành viên
  const searchMembers = async (searchParams) => {
    loading.value = true;
    error.value = null;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để tìm kiếm thành viên.";
        members.value = [];
        return { success: false, message: error.value };
      }

      const params = new URLSearchParams();
      if (searchParams.MaSV) params.append("MaSV", searchParams.MaSV);
      if (searchParams.FullName)
        params.append("FullName", searchParams.FullName);
      if (searchParams.Email) params.append("Email", searchParams.Email);
      if (searchParams.PhoneNumber)
        params.append("PhoneNumber", searchParams.PhoneNumber);
      if (searchParams.Status) params.append("Status", searchParams.Status);

      const response = await axios.get(
        urlHost + `/api/Controller_MemberInfo/Search_Member?${params.toString()}`,
        { headers }
      );

      if (response.data.status === 200) {
        members.value = response.data.data; // Cập nhật danh sách thành viên
        return {
          success: true,
          message: response.data.message || "Tìm kiếm thành công!",
          data: members.value,
        };
      } else {
        error.value = response.data.message || "Tìm kiếm thất bại!";
        console.error("Unexpected response:", response);
        return { success: false, message: error.value };
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
      console.error("Error while searching members:", err);
      members.value = [];
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Chuyển trang
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      getMemberList(page);
    }
  };

  return {
    loading,
    error,
    members,
    totalItems,
    totalPages,
    currentPage,
    getMemberList,
    goToPage,
    searchMembers,
  };
});
