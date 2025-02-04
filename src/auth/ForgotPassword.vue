<template>
    <div id="updatepasssuccess-container">
      <div id="updatepasssuccess-form">
        <!-- Logo -->
        <img src="/src/assets/imgs/auth_imgs/logo.png" alt="Logo" class="logo" />
  
        <!-- Tiêu đề -->
        <h2 class="success-title">CẬP NHẬT MẬT KHẨU MỚI</h2>
  
        <!-- Form -->
        <form @submit.prevent="handleLogin">
          <button type="submit">ĐĂNG NHẬP</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  const handleLogin = () => {
    console.log("Chuyển hướng đến trang đăng nhập...");
    // Chỗ này có thể chuyển hướng đến trang login nếu cần
  };
  </script>
  
  <style scoped>
  #updatepasssuccess-container {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    background-image: url("/src/assets/imgs/auth_imgs/background-login-humg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  #updatepasssuccess-form {
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
  
  .success-title {
    color: #007bff; /* Màu xanh */
    margin-bottom: 20px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
  