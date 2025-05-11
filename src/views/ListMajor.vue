<template>
  <Header />
  <NavHeader />
  <div class="container">
    <header>
      <div v-if="store.error" class="auth-error-box">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ store.error }}</p>
      </div>
      <!-- <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên ngành học..."
          v-model="searchQuery"
          @input="searchMajors"
        />
      </div> -->
      <h1>XEM DANH SÁCH ĐOÀN VIÊN THEO CHUYÊN NGÀNH</h1>
    </header>

    <div class="table-container">
      <div v-if="!store.majors.length && !store.error" class="loading">
        <div class="spinner"></div>
        <p>Đang tải danh sách ngành học...</p>
      </div>

      <div v-else-if="filteredMajors.length === 0" class="no-data">
        <i class="fas fa-graduation-cap no-data-icon"></i>
        <p>Không tìm thấy ngành học nào</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên ngành</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(major, index) in filteredMajors" :key="major.value" :class="{ 'even-row': index % 2 === 1 }">
            <td>{{ index + 1 }}</td>
            <td class="major-name">
              <i class="fas fa-book-open major-icon"></i>
              <span>{{ formatMajorName(major.name) }}</span>
            </td>
            <td>
              <button class="view-btn" @click="viewMembers(major.name)">
                <i class="fas fa-users"></i>
                <span>Xem đoàn viên</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dialog hiển thị danh sách thành viên -->
    <MemberListByMajor
      v-if="showMembersDialog"
      :major-name="formatMajorName(selectedMajor)"
      :members="store.membersByMajor"
      @close="closeMembersDialog"
    />
  </div>
  <Footer />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useMajorStore } from '../store/StoreMajor';
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";
import MemberListByMajor from "../components/MemberListByMajor.vue";

const store = useMajorStore();
const searchQuery = ref('');
const showMembersDialog = ref(false);
const selectedMajor = ref('');

// Hàm chuyển đổi tên ngành từ code sang dạng hiển thị
const formatMajorName = (code) => {
  const nameMap = {
    'CongNghePhanMem': 'Công Nghệ Phần Mềm',
    'HeThongThongTin': 'Hệ Thống Thông Tin',
    'KhoaHocMayTinh': 'Khoa Học Máy Tính',
    'KyThuatMayTinh': 'Kỹ Thuật Máy Tính',
    'MangVaTruyenThongDuLieu': 'Mạng và Truyền Thông Dữ Liệu',
    'CongNgheThongTin': 'Công Nghệ Thông Tin',
    'KyThuatPhanMem': 'Kỹ Thuật Phần Mềm',
    'AnToanThongTin': 'An Toàn Thông Tin',
    'TruyenThongVaMangMayTinh': 'Truyền Thông và Mạng Máy Tính',
    'CongNgheWeb': 'Công Nghệ Web',
    'TriTueNhanTao': 'Trí Tuệ Nhân Tạo',
    'KhoaHocDuLieu': 'Khoa Học Dữ Liệu',
    'CongNgheDiDong': 'Công Nghệ Di Động',
    'LapTrinhGame': 'Lập Trình Game',
    'CongNgheThucTeAo': 'Công Nghệ Thực Tế Ảo',
    'InternetVaVatLieu': 'Internet và Vạn Vật',
    'Blockchain': 'Blockchain',
    'MayHoc': 'Máy Học',
    'XuLyNgonNguTuNhien': 'Xử Lý Ngôn Ngữ Tự Nhiên',
    'ThiKeWeb': 'Thiết Kế Web',
    'LapTrinhUngDung': 'Lập Trình Ứng Dụng',
    'QuanTriHeThong': 'Quản Trị Hệ Thống',
    'BaoMatHeThong': 'Bảo Mật Hệ Thống',
    'KhoaHocMayTinhVaTruyenThong': 'Khoa Học Máy Tính và Truyền Thông',
    'CongNgheThongTinVaTruyenThong': 'Công Nghệ Thông Tin và Truyền Thông',
    'KyThuatPhanMemVaHeThongThongTin': 'Kỹ Thuật Phần Mềm và Hệ Thống Thông Tin',
    'CongNgheThongTinVaTruyenThongDuLieu': 'Công Nghệ Thông Tin và Truyền Thông Dữ Liệu',
    'CongNgheThongTinVaTruyenThongDuLieuVaMang': 'Công Nghệ Thông Tin và Truyền Thông Dữ Liệu và Mạng',
    'CongNgheThongTinVaTruyenThongDuLieuVaMangVaBaoMat': 'Công Nghệ Thông Tin và Truyền Thông Dữ Liệu và Mạng và Bảo Mật',
    'CongNgheThongTinVaTruyenThongDuLieuVaMangVaBaoMatVaAnToan': 'Công Nghệ Thông Tin và Truyền Thông Dữ Liệu và Mạng và Bảo Mật và An Toàn',
    'CongNgheThongTinVaTruyenThongDuLieuVaMangVaBaoMatVaAnToanVaHeThong': 'Công Nghệ Thông Tin và Truyền Thông Dữ Liệu và Mạng và Bảo Mật và An Toàn và Hệ Thống'
  };
  return nameMap[code] || code;
};

const filteredMajors = computed(() => {
  if (!searchQuery.value) return store.majors;
  const query = searchQuery.value.toLowerCase();
  return store.majors.filter(major => 
    formatMajorName(major.name).toLowerCase().includes(query) ||
    major.value.toString().includes(query)
  );
});

// const searchMajors = () => {
//   // The filtering is handled by the computed property
// };

const viewMembers = async (majorName) => {
  selectedMajor.value = majorName;
  showMembersDialog.value = true;
  await store.getMembersByMajor(majorName);
};

const closeMembersDialog = () => {
  showMembersDialog.value = false;
  selectedMajor.value = '';
};

onMounted(async () => {
  await store.getMajor();
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top: 0;
}

header {
  text-align: center;
  padding: 20px 0;
  background: #f8f9fa;
  border-radius: 0;
  margin-bottom: 0;
  box-shadow: none;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
}

.search-box input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  font-size: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  padding: 0 20px;
  line-height: 1.4;
}

.table-container {
  background: white;
  border-radius: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  padding: 16px 20px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
}

tr {
  transition: background-color 0.3s;
}

tr:hover {
  background-color: #f8f9fa;
}

.even-row {
  background-color: #f8f9fa;
}

.major-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #2c3e50;
}

.major-icon {
  color: #007bff;
  font-size: 1.2rem;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.view-btn:hover {
  background-color: #218838;
  transform: translateY(-1px);
}

.view-btn i {
  font-size: 1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.no-data-icon {
  font-size: 48px;
  color: #dee2e6;
  margin-bottom: 16px;
}

.auth-error-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background-color: #fff3cd;
  border-radius: 8px;
  color: #856404;
  font-weight: 500;
  margin-bottom: 20px;
}

.auth-error-box i {
  font-size: 1.2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  header {
    padding: 20px 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .search-box {
    max-width: 100%;
  }

  .search-box input {
    padding: 12px 12px 12px 40px;
    font-size: 0.95rem;
  }

  th, td {
    padding: 12px 15px;
  }

  .major-name {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .view-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>