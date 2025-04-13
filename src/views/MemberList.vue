<script setup>
import { onMounted, ref, watch } from "vue";
import { useManagerStore } from "../store/managerStore";
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";

const store = useManagerStore();
const memberList = ref([]);
const searchQuery = ref("");

const showDialog = ref(false);
const dialogType = ref(""); // 'khen-thuong' hoặc 'ky-luat'
const selectedMemberId = ref(null);

const openDialog = (type, id) => {
  dialogType.value = type;
  selectedMemberId.value = id;

  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  dialogType.value = "";
};

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
  const searchValue = searchQuery.value.trim();
  const params = {};

  if (/^\d+$/.test(searchValue)) {
    params.MaSV = searchValue;
    params.PhoneNumber = searchValue;
  } else if (searchValue.includes("@")) {
    params.Email = searchValue;
  } else {
    params.FullName = searchValue;
  }

  const result = await store.searchMembers(params);
  if (result.success) {
    memberList.value = result.data.items.filter(
      (member) =>
        member.roleName !== "Liên chi đoàn khoa" &&
        member.roleName !== "Bí thư đoàn viên"
    );
  } else {
    console.error(result.message);
  }
};

// Theo dõi khi store.members thay đổi thì cập nhật lại memberList
watch(
  () => store.members,
  (newMembers) => {
    memberList.value = newMembers.filter(
      (member) =>
        member.roleName !== "Liên chi đoàn khoa" &&
        member.roleName !== "Bí thư đoàn viên"
    );
  }
);

// Chuyển trang
const goToPage = async (page) => {
  if (page >= 1 && page <= store.totalPages) {
    await store.goToPage(page);
  }
};

// Khi component mount
onMounted(async () => {
  await store.getMemberList(1);
});
</script>

<template>
  <Header />
  <NavHeader />
  <div class="container">
    <header>
      <div class="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã sinh viên, tên, email, số điện thoại, trạng thái"
          v-model="searchQuery"
        />
        <button @click="searchMembers">Tìm kiếm</button>
      </div>
      <h1>DANH SÁCH ĐOÀN VIÊN</h1>
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
            <th>Đề Xuất</th>
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
              <button
                class="action-btn reward-btn"
                @click="openDialog('khen-thuong', member.maSV)"
                title="Khen thưởng"
              >
                <i class="fas fa-gift"></i>
              </button>
              \
              <button
                class="action-btn discipline-btn"
                @click="openDialog('ky-luat', member.maSV)"
                title="Kỷ luật"
              >
                <i class="fas fa-exclamation-triangle"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Dialog hiển thị khi bấm khen thưởng hoặc kỷ luật -->
    <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog-box">
        <h3>{{ dialogType === "khen-thuong" ? "Khen thưởng" : "Kỷ luật" }}</h3>
        <textarea rows="4" placeholder="Nhập mô tả..."></textarea>
        <div class="dialog-buttons">
          <button class="submit-btn">Submit</button>
          <button class="cancel-btn" @click="closeDialog">Cancel</button>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button
        @click="goToPage(store.currentPage - 1)"
        :disabled="store.currentPage === 1"
      >
        Trang trước
      </button>

      <span
        v-for="page in store.totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: store.currentPage === page }"
      >
        {{ page }}
      </span>

      <button
        @click="goToPage(store.currentPage + 1)"
        :disabled="store.currentPage === store.totalPages"
      >
        Trang sau
      </button>
    </div>
  </div>
  <Footer />
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
  width: 70%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

.search-box button {
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-box button:hover {
  background-color: #0056b3;
}

.table-container {
  margin: 40px;
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
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  margin: 0 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 5px;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.pagination span:hover {
  background-color: #f0f0f0;
}

.pagination .active {
  font-weight: bold;
  color: #007bff;
  background-color: #e7f1ff;
}

.action-btn i {
  font-size: 16px;
}
.reward-btn {
  color: #28a745; /* xanh lá: khen thưởng */
  transition: color 0.3s;
}

.reward-btn:hover {
  color: #218838;
}

.discipline-btn {
  color: #dc3545; /* đỏ: kỷ luật */
  transition: color 0.3s;
}

.discipline-btn:hover {
  color: #c82333;
}

/* dialog  */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.dialog-box h3 {
  margin-top: 0;
  color: #333;
}

.dialog-box textarea {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.dialog-buttons {
  text-align: right;
}

.dialog-buttons button {
  padding: 8px 14px;
  margin-left: 8px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.cancel-btn {
  background-color: #ccc;
  color: #333;
}
</style>
