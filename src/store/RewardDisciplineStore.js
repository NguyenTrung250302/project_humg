import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { urlHost } from '../UrlApiHostStore/ApiHostStore';

export const useRewardDisciplineStore = defineStore(
  "rewardDisciplineStore",
  () => {
    const listReward = ref([]);
    const listDiscipline = ref([]);
    const listApprovalHistory = ref([]);
    const listWaiting = ref([]);
    const error = ref(null);
    
    const rewardPagination = {
      totalItems: ref(0),
      totalPages: ref(0),
      currentPage: ref(1),
    };
    
    const disciplinePagination = {
      totalItems: ref(0),
      totalPages: ref(0),
      currentPage: ref(1),
    };
    
    const waitingPagination = {
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
    //Lấy danh sách khen thưởng
    const GetListReward = async (pageNumber = 1) => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách thông tin.";
        listReward.value = [];
        return;
      }

      try {
        const response = await axios.get(
          urlHost + `/api/Controller_RewardDiscipline/Get_List_Reward?pageSize=10&pageNumber=${pageNumber}`,
          { headers }
        );

        listReward.value = response.data.items;
        rewardPagination.totalItems.value = response.data.totalItems;
        rewardPagination.totalPages.value = response.data.totalPages;
        rewardPagination.currentPage.value = response.data.currentPage;
        console.log("✅ Lấy danh sách khen thưởng thành công:", response.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách khen thưởng:", err);
        error.value = "❌ Lấy danh sách khen thưởng thất bại.";
      }
    };

    //Lấy danh sách kỷ luật
    const GetListDiscipline = async (pageNumber = 1) => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách thông tin.";
        listDiscipline.value = [];
        return;
      }

      try {
        const response = await axios.get(
          urlHost + `/api/Controller_RewardDiscipline/Get_List_Discipline?pageSize=10&pageNumber=${pageNumber}`,
          { headers }
        );

        listDiscipline.value = response.data.items;
        disciplinePagination.totalItems.value = response.data.totalItems;
        disciplinePagination.totalPages.value = response.data.totalPages;
        disciplinePagination.currentPage.value = response.data.currentPage;
        console.log("✅ Lấy danh sách kỷ luật thành công:", response.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách kỷ luật:", err);
        error.value = "❌ Lấy danh sách kỷ luật thất bại.";
      }
    };
    
    //Lấy danh sách đề xuất đang chờ phê duyệt
    const GetListWaiting = async (pageNumber = 1, pageSize = 10) => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem danh sách đề xuất đang chờ.";
        listWaiting.value = [];
        return;
      }

      try {
        const response = await axios.get(
          urlHost + `/api/Controller_RewardDiscipline/Get_List_Waiting?pageSize=${pageSize}&pageNumber=${pageNumber}`,
          { headers }
        );

        listWaiting.value = response.data.items;
        waitingPagination.totalItems.value = response.data.totalItems;
        waitingPagination.totalPages.value = response.data.totalPages;
        waitingPagination.currentPage.value = response.data.currentPage;
        console.log("✅ Lấy danh sách đề xuất đang chờ thành công:", response.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách đề xuất đang chờ:", err);
        error.value = "❌ Lấy danh sách đề xuất đang chờ thất bại.";
      }
    };

    //Gửi đề xuất Khen thưởng
    const PostListReward = async (description, recipientMaSV, classValue, excelFile) => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để thực hiện đề xuất.";
        return;
      }

      // Validate file is Excel
      if (excelFile) {
        if (!isExcelFile(excelFile)) {
          error.value = "❌ Chỉ chấp nhận file Excel (.xlsx, .xls)";
          return;
        }
      } else {
        error.value = "❌ Vui lòng chọn file Excel";
        return;
      }

      try {
        const formData = new FormData();
        formData.append("Description", description);
        formData.append("RecipientMaSV", recipientMaSV || "");
        formData.append("Class", classValue);
        formData.append("Url", excelFile);

        const response = await axios.post(
          urlHost + "/api/Controller_RewardDiscipline/Propose_Reward",
          formData,
          { 
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        console.log("✅ Gửi đề xuất khen thưởng thành công:", response.data);
        return response.data;
      } catch (err) {
        console.error("❌ Lỗi khi gửi đề xuất:", err);
        error.value = "❌ Gửi đề xuất thất bại.";
        throw err;
      }
    };

    //Gửi đề xuất kỷ luật
    const PostListDiscipline = async (description, recipientMaSV, classValue, excelFile) => {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để thực hiện đề xuất.";
        return;
      }

      // Validate file is Excel
      if (excelFile) {
        if (!isExcelFile(excelFile)) {
          error.value = "❌ Chỉ chấp nhận file Excel (.xlsx, .xls)";
          return;
        }
      } else {
        error.value = "❌ Vui lòng chọn file Excel";
        return;
      }

      try {
        const formData = new FormData();
        formData.append("Description", description);
        formData.append("RecipientMaSV", recipientMaSV || "");
        formData.append("Class", classValue);
        formData.append("Url", excelFile);

        const response = await axios.post(
          urlHost + "/api/Controller_RewardDiscipline/Propose_Discipline",
          formData,
          { 
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        console.log("✅ Gửi đề xuất kỷ luật thành công:", response.data);
        return response.data;
      } catch (err) {
        console.error("❌ Lỗi khi gửi đề xuất kỷ luật:", err);
        error.value = "❌ Gửi đề xuất kỷ luật thất bại.";
        throw err;
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
          urlHost + "/api/Controller_ApprovalHistory/Get_List_ApprovalHistories?pageSize=100&pageNumber=1",
          { headers }
        );

        listApprovalHistory.value = response.data.items;
        console.log("✅ Lấy lịch sử phê duyệt thành công:", response.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử phê duyệt:", err);
        error.value = "❌ Lấy lịch sử phê duyệt thất bại.";
      }
    };

    // Lấy urlDecodeFile từ khen thưởng hoặc kỷ luật
    const getUrlDecodeFile = (item) => {
      return item.urlDecodeFile || "";
    };

    // Chuyển trang
    const goToPageReward = (page) => {
      if (page >= 1 && page <= rewardPagination.totalPages.value) {
        GetListReward(page);
      }
    };
    
    const goToPageDiscipline = (page) => {
      if (page >= 1 && page <= disciplinePagination.totalPages.value) {
        GetListDiscipline(page);
      }
    };
    
    const goToPageWaiting = (page) => {
      if (page >= 1 && page <= waitingPagination.totalPages.value) {
        GetListWaiting(page);
      }
    };
    
    // Helper function to validate Excel files
    const isExcelFile = (file) => {
      if (!file) return false;
      
      // Check by file type
      if (file.type === 'application/vnd.ms-excel' || 
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return true;
      }
      
      // Check by file extension
      const fileName = file.name || '';
      return fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    };

    return {
      GetListReward,
      GetListDiscipline,
      GetListWaiting,
      PostListReward,
      PostListDiscipline,
      GetApprovalHistory,
      getUrlDecodeFile,
      listReward,
      listDiscipline,
      listWaiting,
      listApprovalHistory,
      error,
      rewardPagination,
      disciplinePagination,
      waitingPagination,
      goToPageReward,
      goToPageDiscipline,
      goToPageWaiting,
    };
  }
);
