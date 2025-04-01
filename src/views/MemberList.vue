<script setup>
import { onMounted, ref } from "vue";
import { useManagerStore } from "../store/managerStore";
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";

const store = useManagerStore();
const memberList = ref([]); // Danh sách trung gian để lưu trữ thành viên
const searchQuery = ref(""); // Biến để lưu truy vấn tìm kiếm

// Hàm định dạng ngày
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Hàm tìm kiếm thành viên
const searchMembers = async () => {
  const params = {
    FullName: searchQuery.value, // Tìm kiếm theo tên
    // Bạn có thể thêm các tham số khác nếu cần
  };

  const result = await store.searchMembers(params);
  if (result.success) {
    // Lọc bỏ các member có roleName là "Liên chi đoàn khoa" và "Bí thư đoàn viên"
    memberList.value = result.data.items
      .filter(
        (member) =>
          member.roleName !== "Liên chi đoàn khoa" &&
          member.roleName !== "Bí thư đoàn viên"
      )
      .map((member) => ({
        ...member,
        // Bạn có thể thêm các chuyển đổi khác nếu cần
      }));
  } else {
    console.error(result.message);
  }
};

// Gọi hàm lấy danh sách thành viên khi component được mount
onMounted(async () => {
  await store.getMemberList(1);
  memberList.value = store.members; // Cập nhật danh sách trung gian ban đầu
});
</script>

<template>
  <Header></Header>
  <NavHeader></NavHeader>
  <div class="container">
    <header>
      <div class="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã sinh viên, tên, email, số điện thoại, trạng thái"
          v-model="searchQuery"
          @input="searchMembers"
        />
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
            v-for="(member, index) in memberList"
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
      <button
        @click="store.goToPage(store.currentPage - 1)"
        :disabled="store.currentPage === 1"
      >
        Trang trước
      </button>

      <span
        v-for="page in store.totalPages"
        :key="page"
        @click="store.goToPage(page)"
        :class="{ active: store.currentPage === page }"
      >
        {{ page }}
      </span>

      <button
        @click="store.goToPage(store.currentPage + 1)"
        :disabled="store.currentPage === store.totalPages"
      >
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
