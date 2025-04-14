import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useRewardDisciplineStore = defineStore(
  "rewardDisciplineStore",
  () => {
    const listReward = ref([]);
    const listDiscipline = ref([]);
    const listApprovalHistory = ref([]);

    const getAuthHeaders = () => {
      const token = localStorage.getItem("accessToken");
      return token
        ? {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          }
        : null;
    };
    //Lấy danh sách khen thưởng
    const GetListReward = async () => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách sự kiện.";
        listReward.value = [];
        return;
      }

      try {
        const response = await axios.get(
          "https://localhost:7244/api/Controller_RewardDiscipline/Get_List_Reward?pageSize=10&pageNumber=1",
          { headers }
        );

        listReward.value = response.data.items;
        console.log("✅ Lấy danh sách khen thưởng thành công:", response.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách khen thưởng:", err);
        error.value = "❌ Lấy danh sách khen thưởng thất bại.";
      }
    };

    //Lấy danh sách kỷ luật
    const GetListDiscipline = async () => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách sự kiện.";
        listDiscipline.value = [];
        return;
      }

      try {
        const response = await axios.get(
          "https://localhost:7244/api/Controller_RewardDiscipline/Get_List_Discipline?pageSize=10&pageNumber=1",
          { headers }
        );

        listDiscipline.value = response.data.items;
        console.log("✅ Lấy danh sách kỷ luật thành công:", response.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách kỷ luật:", err);
        error.value = "❌ Lấy danh sách kỷ luật thất bại.";
      }
    };

    //Gửi đề xuất Khen thưởng
    const PostListReward = async (description, recipientMaSV) => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để thực hiện đề xuất.";
        return;
      }

      try {
        const formData = new FormData();
        formData.append("Description", description);
        formData.append("RecipientMaSV", recipientMaSV);

        const response = await axios.post(
          "https://localhost:7244/api/Controller_RewardDiscipline/Propose_Reward",
          formData,
          { headers }
        );

        alert("✅ Gửi đề xuất thành công!");
        return response.data;
      } catch (err) {
        alert("❌ Lỗi khi gửi đề xuất:", err);
        error.value = "❌ Gửi đề xuất thất bại.";
      }
    };

    //Gửi đề xuất kỷ luật
    const PostListDiscipline = async (description, recipientMaSV) => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để thực hiện đề xuất.";
        return;
      }

      try {
        const formData = new FormData();
        formData.append("Description", description);
        formData.append("RecipientMaSV", recipientMaSV);

        const response = await axios.post(
          "https://localhost:7244/api/Controller_RewardDiscipline/Propose_Discipline",
          formData,
          { headers }
        );

        alert("✅ Gửi đề xuất kỷ luật thành công!");
        return response.data;
      } catch (err) {
        alert("❌ Lỗi khi gửi đề xuất kỷ luật:", err);
        error.value = "❌ Gửi đề xuất kỷ luật thất bại.";
      }
    };

    // Lấy lịch sử phê duyệt
    const GetApprovalHistory = async () => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem lịch sử phê duyệt.";
        listApprovalHistory.value = [];
        return;
      }

      try {
        const response = await axios.get(
          "https://localhost:7244/api/Controller_ApprovalHistory/Get_List_ApprovalHistories?pageSize=10&pageNumber=1",
          { headers }
        );

        listApprovalHistory.value = response.data.items;
        console.log("✅ Lấy lịch sử phê duyệt thành công:", response.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử phê duyệt:", err);
        error.value = "❌ Lấy lịch sử phê duyệt thất bại.";
      }
    };

    return {
      GetListReward,
      GetListDiscipline,
      PostListReward,
      PostListDiscipline,
      GetApprovalHistory,
      listReward,
      listDiscipline,
      listApprovalHistory,
    };
  }
);
