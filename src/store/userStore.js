import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
    const loading = ref(false);
    const error = ref(null);
    const user = ref(null);

    
    // truyền token vào Bearear (token)
    const getAuthHeaders = () => {
        const token = localStorage.getItem("accessToken");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };


    // 🛠 Hàm quên mật khẩu
    const forgetPassword = async (email) => {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            formData.append("Email", email);

            const response = await axios.put(
                "https://localhost:7244/api/Controller_Authenic/Forget_Password",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            // console.log(response.data);

            if (response.data.status === 200) {
                return { success: true, message: response.data.message || "Kiểm tra email của bạn để lấy lại mật khẩu!" };
            } else {
                return { success: false, message: response.data.message || "Quên mật khẩu thất bại!" };
            }
        } catch (err) {
            error.value = err.response?.data?.message || "Không thể kết nối tới server!";
            return { success: false, message: error.value };
        } finally {
            loading.value = false;
        }
    };

    const activatePassword = async (email, code) => {
        loading.value = true;
        error.value = null;
    
        try {
            const formData = new FormData();
            formData.append("code", code);
    
            const response = await axios.put(
                `https://localhost:7244/api/Controller_Authenic/Activate_Password?email=${encodeURIComponent(email)}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
    
            console.log("✅ Phản hồi từ API:", response.data);
    
            if (response.data.status === 200) {
                return { success: true, message: response.data.message || "Kích hoạt mật khẩu thành công!" };
            } else {
                return { success: false, message: response.data.message || "Kích hoạt mật khẩu thất bại!" };
            }
        } catch (err) {
            console.error("❌ Lỗi kích hoạt mật khẩu:", err.response?.data || err.message);
            error.value = err.response?.data?.message || "Kích hoạt mật khẩu thất bại!";
            return { success: false, message: error.value };
        } finally {
            loading.value = false;
        }
    };
    
    
    
    

    // 🛠 Hàm đăng ký người dùng
    const register = async (username, maTV, password, email) => {
        loading.value = true;
        error.value = null;

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

                // console.log(response.data);

            if (response.data.status === 200) {
                return { success: true, message: response.data.message || "Đăng kí thành công!" };
            } else {
                return { success: false, message: response.data.message || "Đăng kí thất bại!" };
            }
        } catch (err) {
            error.value = err.response?.data?.message || "Không thể kết nối tới server!";
            return { success: false, message: error.value };
        } finally {
            loading.value = false;
        }
    };


    const activateAccount = async (otp) => {
    if (!otp || otp.length !== 6) {
        return { success: false, message: "Vui lòng nhập đúng 6 chữ số OTP!" };
    }

    loading.value = true;
    error.value = null;

    try {
        const formData = new FormData();
        formData.append("Opt", otp);

        const response = await axios.put(
            "https://localhost:7244/api/Controller_Authenic/Active_Account",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.status === 200) {
            return { success: true, message: response.data.message || "Kích hoạt tài khoản thành công!" };
        } else {
            return { success: false, message: response.data.message || "Kích hoạt tài khoản thất bại!" };
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Kích hoạt tài khoản thất bại!";
        return { success: false, message: error.value };
    } finally {
        loading.value = false;
    }
};


    // 🛠 Hàm đăng nhập
    const login = async (username, password) => {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            formData.append("Username", username);
            formData.append("Password", password);

            const response = await axios.post(
                "https://localhost:7244/api/Controller_Authenic/Login",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.status === 200 && response.data.data) {
                localStorage.setItem("accessToken", response.data.data.accessToken);
                user.value = response.data.data;

                return { success: true, message: response.data.message || "Đăng nhập thành công!" };
            } else {
                return { success: false, message: response.data.message || "Đăng nhập thất bại!" };
            }
        } catch (err) {
            error.value = err.response?.data?.message || "Đăng nhập thất bại!";
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
        activateAccount,
        login,
        forgetPassword, 
        activatePassword,
    };
});
