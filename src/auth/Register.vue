<template>
  <div id="container_login">
    <div id="form_login">
      <!-- Logo -->
      <img src="/src/assets/imgs/auth_imgs/logo.png" alt="Logo" class="logo" />
  
      <!-- Tiêu đề -->
      <h2>HỆ THỐNG QUẢN LÝ ĐOÀN VIÊN HUMG</h2>
  
      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Hàng đầu tiên: Tên người dùng và Email -->
        <div class="input-group-inline">
          <div class="input-group">
            <input type="text" placeholder="Tên người dùng" v-model="username" />
          </div>
          <div class="input-group">
            <input type="email" placeholder="Email" v-model="email" />
          </div>
        </div>

        <!-- Hàng thứ hai: Số điện thoại và Địa chỉ -->
        <div class="input-group-inline">
          <div class="input-group">
            <input type="tel" placeholder="Số điện thoại" v-model="phoneNumber" />
          </div>
          <div class="input-group">
            <input type="text" placeholder="Địa chỉ" v-model="address" />
          </div>
        </div>

        <!-- Hàng thứ ba: Ngày sinh và Giới tính -->
        <div class="input-group-inline">
          <div class="input-group">
            <input type="date" v-model="dob" />
          </div>
          <div class="input-group">
            <select v-model="gender">
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>
        </div>

        <!-- Hàng thứ tư: Số CMND và Mật khẩu -->
        <div class="input-group-inline">
          <div class="input-group">
            <input type="text" placeholder="Số CMND" v-model="identityNumber" />
          </div>
          <div class="input-group password-group">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              placeholder="Mật khẩu"
              v-model="password"
              id="password-input"
            />
            <span class="password-toggle" @click="togglePasswordVisibility">
              {{ passwordVisible ? "🙈" : "👁️" }}
            </span>
          </div>
        </div>

        <!-- Nút đăng ký -->
        <button type="submit">ĐĂNG KÝ</button>
      </form>
  
      <!-- Các nút quên mật khẩu và đăng ký -->
      <div class="auth-links">
        <a href="/forgot-password" class="forgot-password">Quên mật khẩu? &nbsp;</a>
        <a href="/register" class="register">Đăng nhập</a>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";

// Thêm state cho các trường mới
const username = ref("");
const email = ref("");
const phoneNumber = ref("");
const address = ref("");
const dob = ref("");
const gender = ref("");
const identityNumber = ref("");
const password = ref("");
const passwordVisible = ref(false);

// Hàm chuyển đổi trạng thái hiển thị mật khẩu
function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

// Hàm xử lý form submit
function handleSubmit() {
  console.log("Tên người dùng:", username.value);
  console.log("Email:", email.value);
  console.log("Số điện thoại:", phoneNumber.value);
  console.log("Địa chỉ:", address.value);
  console.log("Ngày sinh:", dob.value);
  console.log("Giới tính:", gender.value);
  console.log("Số CMND:", identityNumber.value);
  console.log("Mật khẩu:", password.value);
}
</script>

<style scoped>
/* Container chính */
#container_login {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url("/src/assets/imgs/auth_imgs/background-login-humg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Form login */
#form_login {
  width: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* Logo */
.logo {
  width: 100px;
  margin-bottom: 20px;
}

/* Tiêu đề */
h2 {
  color: #2d3b8d;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 20px;
}

/* Form */
form {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

/* Các nhóm input trên cùng một hàng */
.input-group-inline {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  width: 100%;
}

/* Định dạng input group để input rộng đều */
.input-group {
  flex: 1;
  position: relative;
}

/* Định dạng input và select */
.input-group input,
.input-group select {
  width: 100%;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

/* Hiệu ứng focus */
.input-group input:focus,
.input-group select:focus {
  border-color: #2d3b8d;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(45, 59, 141, 0.5);
  outline: none;
}

/* Định dạng riêng cho nhóm mật khẩu */
.password-group {
  display: flex;
  align-items: center;
  position: relative;
}

.password-group input {
  padding-right: 40px; /* Chừa khoảng trống cho icon */
}

/* Nút hiển thị mật khẩu */
.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
}

/* Nút đăng ký */
button {
  width: 100%;
  padding: 14px;
  background-color: #2d3b8d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s;
}

button:hover {
  background-color: #1e285a;
}

/* Các liên kết quên mật khẩu và đăng ký */
.auth-links {
  margin-top: 20px;
}

.auth-links a {
  color: #2d3b8d;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
}

.auth-links a:hover {
  text-decoration: underline;
}


</style>

