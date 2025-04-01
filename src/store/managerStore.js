import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useManagerStore = defineStore("manager", () => {
  const loading = ref(false);
  const error = ref(null);
  const members = ref([]);
  const totalItems = ref(0);
  const totalPages = ref(0);
  const currentPage = ref(1);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    };
  };

  // get danh sách member
  const getMemberList = async (pageNumber = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(
        `https://localhost:7244/api/Controller_MemberInfo/Get_List_Menber_Info?pageSize=12&pageNumber=${pageNumber}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (
        response.status === 200 &&
        response.data.items &&
        Array.isArray(response.data.items)
      ) {
        const filteredMembers = response.data.items.filter(
          (member) =>
            member.roleName &&
            member.roleName !== "Liên chi đoàn khoa" &&
            member.roleName !== "Bí thư đoàn viên"
        );

        members.value = filteredMembers;
        totalItems.value = response.data.totalItems;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;

        return {
          success: true,
          message: "Lấy danh sách thành viên thành công!",
          data: members.value,
        };
      } else {
        return { success: false, message: "Không có dữ liệu từ API." };
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Không thể kết nối tới server!";
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
      const params = new URLSearchParams();
      if (searchParams.MaSV) params.append("MaSV", searchParams.MaSV);
      if (searchParams.FullName)
        params.append("FullName", searchParams.FullName);
      if (searchParams.Email) params.append("Email", searchParams.Email);
      if (searchParams.PhoneNumber)
        params.append("PhoneNumber", searchParams.PhoneNumber);
      if (searchParams.Status) params.append("Status", searchParams.Status);

      const response = await axios.get(
        `https://localhost:7244/api/Controller_MemberInfo/Search_Member?${params.toString()}`,
        {
          headers: {
            // ...getAuthHeaders(),
          },
        }
      );

      if (response.data.status === 200) {
        members.value = response.data.data; // Cập nhật danh sách thành viên
        return {
          success: true,
          message: response.data.message || "Tìm kiếm thành công!",
          data: members.value,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Tìm kiếm thất bại!",
        };
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Không thể kết nối tới server!";
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
