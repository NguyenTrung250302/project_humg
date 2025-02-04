<template>
    <div id="updatepassword-container">
      <div id="updatepassword-form">
        <!-- Logo -->
        <img src="/src/assets/imgs/auth_imgs/logo.png" alt="Logo" class="logo" />
  
        <!-- Tiêu đề -->
        <h2>ĐẶT LẠI MẬT KHẨU</h2>
  
        <!-- Form -->
        <form @submit.prevent="handleUpdatePassword">
          <div class="input-group">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              placeholder="Mật khẩu mới"
              v-model="newPassword"
              required
            />
            <!-- Icon cho việc hiển thị và ẩn mật khẩu -->
            <span class="password-toggle" @click="togglePasswordVisibility">
              {{ passwordVisible ? "🙈" : "👁️" }}
            </span>
          </div>
          <div class="input-group">
            <input
              :type="confirmPasswordVisible ? 'text' : 'password'"
              placeholder="Nhập lại mật khẩu"
              v-model="confirmPassword"
              required
            />
            <!-- Icon cho việc hiển thị và ẩn mật khẩu -->
            <span class="password-toggle" @click="toggleConfirmPasswordVisibility">
              {{ confirmPasswordVisible ? "🙈" : "👁️" }}
            </span>
          </div>
          <button type="submit">XÁC NHẬN</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const newPassword = ref("");
  const confirmPassword = ref("");
  const passwordVisible = ref(false);
  const confirmPasswordVisible = ref(false);
  
  // Hàm để chuyển đổi trạng thái hiển thị mật khẩu mới
  function togglePasswordVisibility() {
    passwordVisible.value = !passwordVisible.value;
  }
  
  // Hàm để chuyển đổi trạng thái hiển thị mật khẩu xác nhận
  function toggleConfirmPasswordVisibility() {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  }
  
  // Hàm xử lý form submit
  function handleUpdatePassword() {
    if (newPassword.value === confirmPassword.value) {
      console.log("Mật khẩu đã được thay đổi:", newPassword.value);
    } else {
      console.log("Mật khẩu không khớp!");
    }
  }
  </script>
  
  <style scoped>
  #updatepassword-container {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    background-image: url("/src/assets/imgs/auth_imgs/background-login-humg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  #updatepassword-form {
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
    width: 290px;
    margin-top: 50px;
  }
  
  .input-group {
    margin-bottom: 15px;
    width: 100%;
    position: relative;
  }
  
  .input-group input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    outline: none;
    font-size: 16px;
    background-color: #f8f8f8;
    box-sizing: border-box;
  }
  
  .input-group input:focus {
    border-color: #2d8d2f;
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
  </style>
  