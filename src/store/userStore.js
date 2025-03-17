import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
    const loading = ref(false);
    const error = ref(null);
    const user = ref(null);
    
    
    // truyền token vào Bearear (token)
    const getAuthHeaders = () => {
        const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage 
        return {
            Authorization: `Bearer ${token}`,
            accept: '*/*',
        };
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
    const register = async (username, maSV, password, email, fullName) => {
        loading.value = true;
        error.value = null;
        
        try {
            const formData = new FormData();
            formData.append("Username", username);
            formData.append("MaSV", maSV);
            formData.append("Password", password);
            formData.append("Email", email);
            formData.append("FullName", fullName);
            
            const response = await axios.post(
                "https://localhost:7244/api/Controller_Authenic/Register",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            
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
    
    
    const activateAccount = async (email, otp) => {
        if (!otp || otp.length !== 6) {
            return { success: false, message: "Vui lòng nhập đúng 6 chữ số OTP!" };
        }
        
        loading.value = true;
        error.value = null;
        
        try {
            const formData = new FormData();
            formData.append("Opt", otp);
            
            const response = await axios.put(
                `https://localhost:7244/api/Controller_Authenic/Active_Account?email=${encodeURIComponent(email)}`,
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
    

    const logout = () => {
        localStorage.removeItem("accessToken");
        memberInfo.value = null;
    }
    
    const memberInfo = ref(null); 
    const getMemberInfo = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await axios.get(
                "https://localhost:7244/api/Controller_MemberInfo/Get_Menber_Info",
                { headers: getAuthHeaders() } 
            );
            console.log(response.data);
            
            if (response.data.status === 200) {
                memberInfo.value = response.data.data; 
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || "Không tìm thấy thông tin người dùng!" };
            }
            
        } catch (err) {
            error.value = err.response?.data?.message || "Không thể kết nối tới server!";
            return { success: false, message: error.value };
        } finally {
            loading.value = false;
        }
    };

    
    const changePassword = async (password, newpassword, renewpassword) => {
        loading.value = true;
        error.value = null;
    
        try {
            const formData = new FormData();
            formData.append("Password", password);
            formData.append("newpassword", newpassword);
            formData.append("renewpassword", renewpassword);
    
            const response = await axios.put(
                "https://localhost:7244/api/Controller_Authenic/Change_Password", 
                formData,
                { 
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "multipart/form-data"
                    } 
                }
            );
            console.log(response.data);
    
            if (response.data.status === 200) {
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (err) {
            error.value = err.response?.data?.message || "Không thể kết nối tới server!";
            return { success: false, message: error.value };
        } finally {
            loading.value = false;
        }
    };


    const updateProfile = async (
        { politicalTheory, nation, birthdate, religion, dateOfJoining, phoneNumber, classValue, fullName, placeOfJoining }) => {
        loading.value = true;
        error.value = null;
    
        try {
            const formData = new FormData();
    
            // Chỉ thêm vào FormData nếu giá trị không null hoặc undefined
            if (politicalTheory) formData.append('PoliticalTheory', politicalTheory);
            if (nation) formData.append('Nation', nation);
            if (birthdate) formData.append('Birthdate', birthdate);
            if (religion) formData.append('Religion', religion);
            if (dateOfJoining) formData.append('DateOfJoining', dateOfJoining);
            if (phoneNumber) formData.append('PhoneNumber', phoneNumber);
            if (classValue) formData.append('Class', classValue);
            if (fullName) formData.append('FullName', fullName);
            if (placeOfJoining) formData.append('PlaceOfJoining', placeOfJoining);
    
            const response = await axios.put(
                "https://localhost:7244/api/Controller_MemberInfo/Update_member_info", 
                formData,
                { 
                    headers: {
                        ...getAuthHeaders(), 
                        "Content-Type": "multipart/form-data"
                    } 
                }
            );
            console.log(response.data);
            if (response.data.status === 200) {
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (err) {
            error.value = err.response?.data?.message || "Không thể kết nối tới server!";
            return { success: false, message: error.value };
        } finally {
            loading.value = false;
        }
    };
    
    
    // Hàm cập nhật ảnh người dùng
    const updateUserImage = async (urlAvatar) => {
        loading.value = true;
        error.value = null;
        
        try {
            const formData = new FormData();
            formData.append("UrlAvatar", urlAvatar);  
            
            const response = await axios.put(
                "https://localhost:7244/api/Controller_MemberInfo/Update_user_img", 
                formData,
                { 
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "multipart/form-data"
                    } 
                }
            );
            
            console.log(response.data);
            
            if (response.data.status === 200) {
                return { success: true, message: response.data.message || "Cập nhật ảnh thành công!" };
            } else {
                return { success: false, message: response.data.message || "Cập nhật ảnh thất bại!" };
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
        user,
        register,
        activateAccount,
        login,
        logout,
        forgetPassword, 
        activatePassword,
        memberInfo,
        getMemberInfo,
        changePassword,
        updateProfile,
        updateUserImage,
    };
});
