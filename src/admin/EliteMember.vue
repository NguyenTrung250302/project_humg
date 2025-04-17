<template>
  <div class="container-dashboard">
    <Dashboard></Dashboard>
    <div class="main">
      <h1>Quản lý đoàn viên ưu tú</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Dashboard from "./Dashboard.vue";
import "../assets/css/Dashboard.css";
</script>

<style scoped></style>
