<script setup>
import { onMounted } from "vue";
import { useManagerStore } from "../store/managerStore";
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";

const store = useManagerStore();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

onMounted(async () => {
  await store.getMemberList(1);
});
</script>

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
            <th>Ngày sinh</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(member, index) in store.members"
            :key="index"
            :class="{ 'even-row': index % 2 === 1 }"
          >
            <td>
              <img class="avatar" :src="member.urlAvatar" alt="avatar" />
              {{ member.fullName }}
            </td>
            <td>{{ member.roleName }}</td>
            <td>{{ member.class }}</td>
            <td>{{ member.email }}</td>
            <td>{{ formatDate(member.birthdate) }}</td>
            <td>
              <button class="action-btn"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="store.goToPage(store.currentPage - 1)" :disabled="store.currentPage === 1">
        Trang trước
      </button>

      <span v-for="page in store.totalPages" :key="page" @click="store.goToPage(page)" :class="{ active: store.currentPage === page }">
        {{ page }}
      </span>

      <button @click="store.goToPage(store.currentPage + 1)" :disabled="store.currentPage === store.totalPages">
        Trang sau
      </button>
    </div>
  </div>
  <Footer></Footer>
</template>

<style scoped>
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

th,
td {
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

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 5px;
  cursor: pointer;
}

.pagination .active {
  font-weight: bold;
  color: red;
}
</style>
