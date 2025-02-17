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
        <a href="/forgot-password" class="forgot-password">Quên mật khẩu?</a>
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
}

/* Form login */
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

/* Logo */
.logo {
  width: 94px;
  margin-bottom: 20px;
}

/* Tiêu đề */
h2 {
  color: #2d3b8d;
  margin-bottom: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

form {
  width: 290px;
  margin-top: 50px;
}

/* Các nhóm input trên cùng một hàng */
.input-group-inline {
  display: flex;
  justify-content: space-between;
  gap: 15px;  /* Khoảng cách giữa các ô input */
  margin-bottom: 15px;
}

.input-group-inline .input-group {
  width: 48%; /* Mỗi ô input chiếm 48% chiều rộng */
}

/* Các ô input và select đều có chiều rộng 100% của ô nhóm */
.input-group input,
.input-group select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  outline: none;
  font-size: 16px;
  background-color: #f8f8f8;
  box-sizing: border-box;
}

/* Khi có focus, thêm hiệu ứng border và shadow */
.input-group input:focus,
.input-group select:focus {
  border-color: #2d3b8d;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(45, 59, 141, 0.5);
}

/* Mật khẩu */
.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
}

button {
  width: 100%;
  padding: 12px 15px;
  background-color: rgba(0, 20, 31, 0.44);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  box-sizing: border-box;
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
  display: block;
  margin-top: 10px;
}

.auth-links a:hover {
  text-decoration: underline;
}
/* Thêm position: relative cho .input-group chứa ô input */
.input-group {
  position: relative;
}

/* Đặt icon mật khẩu vào đúng vị trí */
.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
}

</style>

