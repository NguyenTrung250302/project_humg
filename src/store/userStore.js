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

                console.log(response.data);

            if (response.data.status === 200) {
                return { success: true, message: response.data.message || "Đăng kí thành công!" };
            } else {
                return { success: false, message: response.data.message || "Đăng kí thất bại!" };
            }
        } catch (err) {
            console.error("Lỗi API:", err.response?.data);
            error.value = err.response?.data?.message || "Không thể kết nối tới server!";
            return { success: false, message: error.value };
        } finally {
            loading.value = false;
        }
    };
    // 🛠 Hàm kích hoạt tài khoản
    const activateAccount = async (otp) => {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            formData.append("Otp", otp);

            const response = await axios.put(
                "https://localhost:7244/api/Controller_Authenic/Activate_Account",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            console.log(response.data);

            if (response.data.status === 200) {
                return { success: true, message: response.data.message || "Kích hoạt tài khoản thành công!" };
            } else {
                return { success: false, message: response.data.message || "Kích hoạt tài khoản thất bại!" };
            }
        } catch (err) {
            console.error("❌ Lỗi kích hoạt tài khoản:", err.response?.data || err.message);
            error.value = err.response?.data?.message || "Kích hoạt tài khoản thất bại!";
            return { success: false, message: error.value };
        } finally {
            loading.value = false;
        }
    };

    return { 
        loading, 
        error,
        user,
        register,
        forgotPassword,
        verifyOtp,
        activateAccount,
    };
});
