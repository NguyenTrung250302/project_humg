import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useManagerStore = defineStore("manager", () => {
  const loading = ref(false);
  const error = ref(null);
  const members = ref([]); // Mảng để lưu danh sách thành viên

  // Truyền token vào Bearer (token)
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage 
    return {
      Authorization: `Bearer ${token}`,
      accept: '*/*',
    };
  };

  const getMemberList = async (pageNumber = 1) => {
    loading.value = true;
    error.value = null;

    try {
        const response = await axios.get(
            `https://localhost:7244/api/Controller_MemberInfo/Get_List_Menber_Info?pageSize=10&pageNumber=${pageNumber}`,
            {
                headers: getAuthHeaders(),
            }
        );

        if (response.status === 200 && response.data && Array.isArray(response.data)) {
            // Lọc member
            const filteredMembers = response.data.filter(member => 
                member.roleName && 
                member.roleName !== "Liên chi đoàn khoa" && 
                member.roleName !== "Bí thư đoàn viên"
            );

            if (filteredMembers.length === 0) {
                console.log("Không có thành viên hợp lệ.");
            }

            members.value = filteredMembers;

            return { success: true, message: "Lấy danh sách thành viên thành công!", data: members.value };
        } else {
            return { success: false, message: "Không có dữ liệu từ API." };
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Không thể kết nối tới server!";
        return { success: false, message: error.value };
    } finally {
        loading.value = false;
    }
};



  return {
    loading,
    error,
    members,
    getMemberList,
  };
});
