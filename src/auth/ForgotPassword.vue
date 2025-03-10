<template>
  <div id="forgot-password-container">
    <div id="forgot-password-form">
      <!-- Logo -->
      <img src="/src/assets/imgs/auth_imgs/logo.png" alt="Logo" class="logo" />

      <!-- Tiêu đề -->
      <h2 class="title">QUÊN MẬT KHẨU</h2>

      <!-- Form -->
      <form @submit.prevent="handleForgotPassword">
        <div class="input-group">
          <input type="email" placeholder="Email" v-model="email" required />
        </div>
        <button type="submit">GỬI YÊU CẦU</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/userStore";

const userStore = useUserStore();
const email = ref("");
const router = useRouter();

const handleForgotPassword = async () => {
  if (!email.value.trim()) {
    alert("Vui lòng nhập email!");
    return;
  }

  try {
    const result = await userStore.forgotPassword(email.value);

    console.log("Kết quả quên mật khẩu:", result);

    if (!result) {
      alert(userStore.error || "Gửi yêu cầu thất bại!");
      return;
    }

    alert("Yêu cầu quên mật khẩu đã được gửi!");
    router.push("/OtpForgotPassword"); // Chuyển hướng sang trang OtpForgotPassword
  } catch (error) {
    console.error("Chi tiết lỗi:", error.response?.data || error.message);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
};
</script>

<style scoped>
#forgot-password-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url("/src/assets/imgs/auth_imgs/background-login-humg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#forgot-password-form {
  width: 50%;
  height: 100%;
  background-color: #ffffffc5;
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.logo {
  width: 94px;
  margin-bottom: 20px;
}

.title {
  color: #007bff; /* Màu xanh */
  margin-bottom: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

form {
  width: 290px; /* Đảm bảo form có chiều rộng 290px */
  margin-top: 50px;
}

.input-group {
  margin-bottom: 15px;
  width: 100%; /* Đảm bảo input-group chiếm toàn bộ chiều rộng form */
  position: relative;
}

.input-group input {
  width: 100%; /* Đảm bảo input chiếm toàn bộ chiều rộng của .input-group (290px) */
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  outline: none;
  font-size: 16px;
  background-color: #f8f8f8;
  box-sizing: border-box; /* Đảm bảo padding không làm thay đổi chiều rộng */
}

.input-group input:focus {
  border-color: #2d3b8d;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(45, 59, 141, 0.5);
}

button {
  width: 100%; /* Đảm bảo button chiếm toàn bộ chiều rộng của form */
  padding: 12px 15px;
  background-color: rgba(0, 20, 31, 0.44);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  box-sizing: border-box; /* Đảm bảo padding không làm thay đổi chiều rộng */
}

button:hover {
  background-color: #1e285a;
}
</style>
