import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useEliteMemberStore = defineStore("eliteMemberAdmin", () => {
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

  return {};
});
