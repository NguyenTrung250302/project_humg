<template>
    <Header></Header>
    <NavHeader></NavHeader>
    <div class="container">
      <header>
        <div class="search-box">
          <input type="text" placeholder="Tìm kiếm sinh viên theo tên hoặc mã sinh viên" />
        </div>
        <h1>ĐOÀN VIÊN</h1>
      </header>
  
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Chức vụ</th>
              <th>Lớp</th>
              <th>Email</th>
              <th>Giới tính</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in students" :key="index" :class="{ 'even-row': index % 2 === 1 }">
              <td>
                <img class="avatar" src="../assets/imgs/logo.ico" alt="avatar" />
                {{ student.name }}
              </td>
              <td>{{ student.role }}</td>
              <td>{{ student.class }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.gender }}</td>
              <td>
                <button class="action-btn">⋮</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Footer></Footer>
  </template>

  
  <script setup>
  import { ref, computed } from "vue";
  import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";
  
      const students = ref([
        { name: "Nguyễn Văn A", role: "Bí thư", class: "DCCTCT66-02B", email: "michelle@example.com", gender: "Nam" },
        { name: "Nguyễn Văn B", role: "Đoàn viên", class: "DCCTCT66-02B", email: "kenzi@example.com", gender: "Nữ" },
        { name: "Nguyễn Văn C", role: "Đoàn viên", class: "DCCTCT66-02B", email: "nathan@example.com", gender: "Nữ" },
        { name: "Nguyễn Văn D", role: "Đoàn viên", class: "DCCTCT66-02B", email: "felicia@example.com", gender: "Nữ" },
        { name: "Nguyễn Văn E", role: "Đoàn viên", class: "DCCTCT66-02B", email: "tim@example.com", gender: "Nữ" },
        { name: "Nguyễn Văn F", role: "Đoàn viên", class: "DCCTCT66-02B", email: "alma@example.com", gender: "Nữ" },
        { name: "Nguyễn Văn G", role: "Đoàn viên", class: "DCCTCT66-02B", email: "debra@example.com", gender: "Nam" },
        { name: "Nguyễn Văn H", role: "Đoàn viên", class: "DCCTCT66-02B", email: "deanna@example.com", gender: "Nam" },
        { name: "Nguyễn Văn I", role: "Đoàn viên", class: "DCCTCT66-02B", email: "georgia@example.com", gender: "Nam" },
        { name: "Nguyễn Văn J", role: "Đoàn viên", class: "DCCTCT66-02B", email: "jackson@example.com", gender: "Nữ" },
      ]);
  
  </script>

  
  <style>

  
  .container {
    width: 100%;
    margin: auto;
  }
  
  header {
    text-align: center;
    padding: 20px 0;
  }
  
  .search-box {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .search-box input {
    width: 50%;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 5px;
  }
  
  .table-container {
    margin: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  .even-row {
    background-color: #f9f9f9;
  }
  
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
  }
  
  .action-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  
  .pagination {
    margin-top: 10px;
    text-align: center;
  }
  
  .pagination span {
    margin: 0 5px;
    cursor: pointer;
  }
  
  .pagination .active {
    font-weight: bold;
  }
  </style>
  