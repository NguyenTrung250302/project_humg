<template>
  <div id="container_login">
    <div id="form_login">
      <!-- Logo -->
      <img src="/src/assets/imgs/auth_imgs/logo.png" alt="Logo" class="logo" />

      <!-- Tiêu đề -->
      <h2>HỆ THỐNG QUẢN LÝ ĐOÀN VIÊN HUMG</h2>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input type="text" placeholder="Tên người dùng" v-model="username" />
        </div>

        <div class="input-group">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Mật khẩu"
            v-model="password"
            id="password-input"
          />
          <!-- Icon cho việc hiển thị và ẩn mật khẩu -->
          <span class="password-toggle" @click="togglePasswordVisibility">
            {{ passwordVisible ? "🙈" : "👁️" }}
          </span>
        </div>
        <button type="submit">ĐĂNG NHẬP</button>
      </form>

      <!-- Các nút quên mật khẩu và đăng ký -->
      <div class="auth-links">
        <a href="/forgot-password" class="forgot-password">Quên mật khẩu?</a>
        <a href="/register" class="register">Đăng ký</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// State để theo dõi giá trị của mật khẩu và tình trạng hiển thị mật khẩu
const username = ref("");
const password = ref("");
const passwordVisible = ref(false);

// Hàm để chuyển đổi trạng thái hiển thị mật khẩu
function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

// Hàm xử lý form submit
function handleSubmit() {
  console.log("Tên người dùng:", username.value);
  console.log("Mật khẩu:", password.value);
}
//----------------------------------------------------------------------
</script>

<style scoped>
#container_login {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url("/src/assets/imgs/auth_imgs/background-login-humg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#form_login {
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

h2 {
  color: #2d3b8d;
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

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
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

/* Thêm style cho các liên kết quên mật khẩu và đăng ký */
.auth-links {
  margin-top: 20px;
}

.auth-links a {
  color: #2d3b8d;
  font-size: 14px;
  text-decoration: none;
  display: block;
  margin-top: 10px;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
