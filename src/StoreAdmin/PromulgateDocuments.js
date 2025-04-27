import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const usePromulgateDocuments = defineStore("PromulgateDocuments", () => {
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
