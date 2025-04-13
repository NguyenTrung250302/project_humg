<script setup>
import '../assets/css/Dashboard.css';
import Dashboard from "../admin/Dashboard.vue";
</script>

<template>
  <div class="container-dashboard">
    <Dashboard></Dashboard>
    <div class="main">
      <div class="welcome-box">
        <img
          src="../assets//imgs/auth_imgs/schoollogo.png"
          alt="Admin Image"
          class="admin-image" 
        />
        <h1 class="greeting-text">Xin chào Quản Trị Viên</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  background-color: #f1f2f6;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.welcome-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 30px;
  width: 350px; 
  height: 450px; 
}

.admin-image {
  width: 200px; 
  height: auto;
  border-radius: 50%; 
  margin-bottom: 20px;
}

.greeting-text {
  font-size: 24px;
  font-weight: bold;
  color: #515151;
}
</style>
