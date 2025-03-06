import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
    const loading = ref(false);
    const error = ref(null);
    const user = ref(null);

    // 🛠 Hàm đăng ký người dùng
    const register = async (username, maTV, password, email) => {
        loading.value = true;
        error.value = null; // Reset lỗi trước khi gửi request

        try {
            const formData = new FormData();
            formData.append("Username", username);
            formData.append("MaTV", maTV);
            formData.append("Password", password);
            formData.append("Email", email);

            const response = await axios.post(
                "https://localhost:7244/api/Controller_Authenic/Register",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            return response.data; // Trả về dữ liệu từ BE nếu thành công
        } catch (err) {
            console.error("❌ Lỗi đăng ký:", err.response?.data || err.message);
            error.value = err.response?.data?.message || "Không thể kết nối tới server!";
            return null; // Trả về null khi có lỗi
        } finally {
            loading.value = false;
        }
    };

    return { 
        loading, 
        error,
        user,
        register
    };
});
