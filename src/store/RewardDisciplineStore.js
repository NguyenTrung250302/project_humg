import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const RewardDisciplineStore = defineStore("event", () => {
  const listReward = ref([]);
  const listDiscipline = ref([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        }
      : null;
  };

  const GetListReward = async () => {
    const headers = getAuthHeaders();

    if (!headers) {
      error.value = "🔒 Bạn cần đăng nhập để xem danh sách sự kiện.";
      eventList.value = [];
      return;
    }
  };

  const GetListDiscipline = async () => {
    const headers = getAuthHeaders();

    if (!headers) {
      error.value = "🔒 Bạn cần đăng nhập để xem danh sách sự kiện.";
      eventList.value = [];
      return;
    }
  };

  return {
    GetListReward,
    GetListDiscipline,
    listReward,
    listDiscipline,
  };
});
