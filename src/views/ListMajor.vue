<template>
  <Header />
  <NavHeader />
  <div class="container">
    <div class="page-header">
      <div v-if="store.error" class="auth-error-box">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ store.error }}</p>
      </div>
      <h1>DANH SÁCH ĐOÀN VIÊN THEO CHUYÊN NGÀNH</h1>
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm ngành học..."
          v-model="searchQuery"
        />
      </div>
    </div>

    <div class="table-container">
      <div v-if="!store.majors.length && !store.error" class="loading">
        <div class="spinner"></div>
        <p>Đang tải danh sách ngành học...</p>
      </div>

      <div v-else-if="filteredMajors.length === 0" class="no-data">
        <i class="fas fa-graduation-cap no-data-icon"></i>
        <p>Không tìm thấy ngành học nào</p>
      </div>

      <div v-else class="majors-grid">
        <div 
          v-for="(major, index) in filteredMajors" 
          :key="major.value" 
          class="major-card"
          :class="{ 'even-row': index % 2 === 1 }"
        >
          <div class="major-info">
            <div class="major-icon">
              <i class="fas fa-book-open"></i>
            </div>
            <div class="major-details">
              <h3>{{ formatMajorName(major.name) }}</h3>
              <span class="major-code">Mã ngành: {{ major.value }}</span>
            </div>
          </div>
          <button class="view-btn" @click="viewMembers(major.name)">
            <i class="fas fa-users"></i>
            <span>Xem đoàn viên</span>
          </button>
        </div>
      </div>
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
    'MangMayTinh' : "Mạng Máy Tính",
    'TinHocTracDia' : "Tin Học Trắc Địa",
    'TinHocKinhTe':"Tin Học Kinh Tế",
    'KhoaHocMayTinh': "Khoa Học Máy Tính",
    'HeThongThongTinVaTriThuc' : "Hệ Thống Thông Tin Và Tri Thức"
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
  padding: 40px 20px;
  min-height: calc(100vh - 200px);
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #1a237e, #3949ab);
  padding: 40px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(26, 35, 126, 0.15);
}

h1 {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 30px;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #9fa8da;
  font-size: 1.2rem;
}

.search-box input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-box input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  outline: none;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: 20px;
}

.majors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 10px;
}

.major-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e8eaf6;
  position: relative;
  overflow: hidden;
}

.major-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #1a237e, #3949ab);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.major-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(26, 35, 126, 0.12);
}

.major-card:hover::before {
  opacity: 1;
}

.major-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.major-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e8eaf6, #c5cae9);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a237e;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.major-details {
  flex: 1;
}

.major-details h3 {
  color: #1a237e;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.4;
}

.major-code {
  color: #6c757d;
  font-size: 0.9rem;
  display: block;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #1a237e, #3949ab);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  width: 100%;
}

.view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.view-btn i {
  font-size: 1.1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #1a237e;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e8eaf6;
  border-top: 4px solid #1a237e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.no-data {
  text-align: center;
  padding: 80px 20px;
  color: #1a237e;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 20px 0;
}

.no-data-icon {
  font-size: 56px;
  color: #e8eaf6;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.auth-error-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 30px;
  backdrop-filter: blur(8px);
}

.auth-error-box i {
  font-size: 1.4rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@media (max-width: 768px) {
  .container {
    padding: 20px 15px;
  }

  .page-header {
    padding: 30px 15px;
    margin-bottom: 30px;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .search-box input {
    padding: 14px 14px 14px 45px;
    font-size: 1rem;
  }

  .majors-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .major-card {
    padding: 20px;
  }

  .major-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .major-details h3 {
    font-size: 1.1rem;
  }

  .view-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
</style>