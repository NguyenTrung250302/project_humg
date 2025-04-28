import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { urlHost } from '../UrlApiHostStore/ApiHostStore';

export const useApproveStore = defineStore("approveAdmin", () => {
  const approveList = ref([]);
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

  //Get danh sách chờ phê duyệt
  const getApproveList = async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách yêu cầu phê duyệt";
        eventList.value = [];
        return;
      }

      const response = await axios.get(
        urlHost + "/api/Controller_RewardDiscipline/Get_List_Waiting?pageSize=10&pageNumber=1",
        { headers }
      );

      if (response.status === 200 && response.data.items) {
        console.log("approve list", response.data.items);
        approveList.value = response.data.items;
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
      approveList.value = [];
    }
  };

  // API: Chấp nhận đề xuất (phê duyệt)
  const acceptProposal = async (proposeId) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để thực hiện phê duyệt.";
        return;
      }

      const formData = new FormData();
      formData.append("proposeId", proposeId);

      const response = await axios.put(
        urlHost + "/api/Controller_RewardDiscipline/Accept_Propose",
        formData,
        { headers }
      );

      if (response.status === 200 && response.data.status === 200) {
        // Cập nhật lại danh sách sau khi phê duyệt
        await getApproveList();
        alert("✅ Phê duyệt thành công:", response.data.message);
      } else {
        error.value = "⚠️ Phê duyệt không thành công.";
        console.error("Unexpected response when approving:", response);
      }
    } catch (err) {
      error.value = "❌ Có lỗi xảy ra khi phê duyệt.";
      console.error("Error while approving propose:", err);
    }
  };

  // ❌ API: Từ chối đề xuất
  const rejectProposal = async (proposeId, rejectReason) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const formData = new FormData();
      formData.append("proposeId", proposeId);

      const response = await axios.put(
        urlHost + `/api/Controller_RewardDiscipline/Reject_Propose?reject=${encodeURIComponent(
          rejectReason
        )}`,
        formData,
        { headers }
      );

      if (response.status === 200) {
        await getApproveList(); // refresh list
        alert("❌ Từ chối phê duyệt:", response.data.message);
      }
    } catch (err) {
      console.error("❌ Lỗi từ chối:", err);
    }
  };

  return {
    acceptProposal,
    rejectProposal,
    getApproveList,
    approveList,
    error,
  };
});
