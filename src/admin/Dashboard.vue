<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import "../assets/css/Dashboard.css";

const isSidebarOpen = ref(true);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div :class="['sidebar', { 'sidebar-collapsed': !isSidebarOpen }]">
    <h2 v-if="isSidebarOpen">HUMG</h2>
    <RouterLink to="/" v-if="isSidebarOpen" class="sidebar-link">
      <i class="bx bx-home"></i> Trang chủ
    </RouterLink>
    <RouterLink to="/EventManager" v-if="isSidebarOpen" class="sidebar-link">
      <i class="bx bx-user"></i> Quản lý sự kiện
    </RouterLink>
    <RouterLink to="/Approve" v-if="isSidebarOpen" class="sidebar-link">
      <i class="bx bx-book"></i>
      Phê Duyệt
    </RouterLink>
    <RouterLink to="/AdminProfile" v-if="isSidebarOpen" class="sidebar-link">
      <i class="bx bx-cog"></i> Tài khoản Admin
    </RouterLink>
    <!-- Mũi tên và nút đăng xuất -->
    <div class="toggle-logout-container">
      <button class="toggle-btn" @click="toggleSidebar">
        <i
          :class="[
            'bx',
            isSidebarOpen ? 'bx-chevron-left' : 'bx-chevron-right',
          ]"
        ></i>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
