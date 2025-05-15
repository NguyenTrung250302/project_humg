<template>
  <div class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-box members-dialog">
      <div class="dialog-header">
        <h3>Danh sách đoàn viên ngành {{ majorName }}</h3>
        <button class="close-icon" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Course Intake Selection -->
      <div v-if="!showMemberList" class="course-selection">
        <h4>Chọn khóa để xem danh sách đoàn viên</h4>
        <div class="course-grid">
          <div 
            v-for="intake in store.courseIntakes" 
            :key="intake"
            class="course-card"
            @click="selectCourseIntake(intake)"
          >
            <div class="course-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="course-info">
              <h3>Khóa {{ intake }}</h3>
              <p>Niên khóa 20{{ intake - 50 }} - 20{{ intake - 46 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Member List -->
      <div v-else>
        <div class="selected-course">
          <span>
            <i class="fas fa-graduation-cap"></i>
            Khóa {{ selectedCourseIntake }} 
            (20{{ selectedCourseIntake - 50 }} - 20{{ selectedCourseIntake - 46 }})
          </span>
          <button class="change-course-btn" @click="showMemberList = false">
            <i class="fas fa-exchange-alt"></i>
            Đổi khóa
          </button>
        </div>

        <div class="search-section">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã sinh viên, email..."
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>
        </div>

        <div v-if="filteredMembers.length === 0" class="no-members">
          <i class="fas fa-users no-data-icon"></i>
          <p>Không tìm thấy đoàn viên nào</p>
        </div>
        <div v-else class="members-list">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Mã SV</th>
                <th>Email</th>
                <th>Lớp</th>
                <th>Giới tính</th>
                <!-- <th>Trạng thái</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in paginatedMembers" :key="member.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="member-name">
                  <img :src="member.urlAvatar" :alt="member.fullName" class="member-avatar" />
                  <span>{{ member.fullName }}</span>
                </td>
                <td>{{ member.maSV }}</td>
                <td>{{ member.email }}</td>
                <td>{{ member.class || 'Chưa cập nhật' }}</td>
                <td>{{ member.gender || 'Chưa cập nhật' }}</td>
                <!-- <td>
                  <span :class="['status-badge', member.isOutstandingMember ? 'outstanding' : 'normal']">
                    {{ member.isOutstandingMember ? 'Ưu tú' : 'Thường' }}
                  </span>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="changePage(page)"
            :class="['page-number', { active: currentPage === page }]"
          >
            {{ page }}
          </button>

          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="dialog-footer">
        <span v-if="showMemberList" class="total-count">
          Tổng số: {{ filteredMembers.length }} đoàn viên
        </span>
        <button class="close-btn" @click="closeDialog">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useMajorStore } from '../store/StoreMajor';

const store = useMajorStore();

const props = defineProps({
  majorName: {
    type: String,
    required: true
  },
  members: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close']);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedCourseIntake = ref(null);
const showMemberList = ref(false);

onMounted(async () => {
  await store.getCourseIntakes();
});

// Computed properties
const filteredMembers = computed(() => {
  if (!selectedCourseIntake.value) {
    console.log("Chưa chọn khóa");
    return [];
  }

  console.log("Khóa đã chọn:", selectedCourseIntake.value);
  console.log("Tất cả đoàn viên:", store.membersByMajor);
  
  const filtered = store.membersByMajor.filter(member => {
    console.log("Kiểm tra member:", {
      name: member.fullName,
      major: member.major,
      courseIntake: member.courseIntake,
      selectedCourse: selectedCourseIntake.value.toString(),
      isMatch: member.courseIntake === selectedCourseIntake.value.toString()
    });
    return member.courseIntake === selectedCourseIntake.value.toString();
  });
  
  console.log("Đoàn viên sau khi lọc theo khóa:", filtered);
  return filtered;
});

const totalPages = computed(() => 
  Math.ceil(filteredMembers.value.length / itemsPerPage)
);

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredMembers.value.slice(start, end);
});

const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

// Methods
const handleSearch = async () => {
  console.log("Đang tìm kiếm với query:", searchQuery.value);
  currentPage.value = 1;
  if (searchQuery.value.trim()) {
    await store.searchMembersByMajor(props.majorName, searchQuery.value.trim());
  } else {
    await store.getMembersByMajor(props.majorName);
  }
};

const selectCourseIntake = async (courseIntake) => {
  console.log("Đã chọn khóa:", courseIntake);
  selectedCourseIntake.value = courseIntake;
  showMemberList.value = true;
  await store.getMembersByMajor(props.majorName);
  console.log("Danh sách sau khi lấy từ API:", store.membersByMajor);
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const closeDialog = () => {
  emit('close');
};

// Reset pagination when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog-box {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 1400px;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.dialog-header {
  padding: 24px 28px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 16px 16px 0 0;
}

.dialog-header h3 {
  margin: 0;
  color: #1a237e;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.close-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon:hover {
  background: #f0f0f0;
  color: #1a237e;
  transform: rotate(90deg);
}

.search-section {
  padding: 24px 28px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #9fa8da;
  font-size: 1.1rem;
}

.search-box input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e8eaf6;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  color: #1a237e;
  background: #f8f9fa;
}

.search-box input:focus {
  border-color: #3949ab;
  outline: none;
  box-shadow: 0 0 0 4px rgba(57, 73, 171, 0.1);
  background: #fff;
}

.search-box input::placeholder {
  color: #9fa8da;
}

.members-list {
  padding: 0 28px;
  overflow-y: auto;
  flex: 1;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 8px 0;
}

th, td {
  padding: 18px 16px;
  text-align: left;
  border-bottom: 1px solid #e8eaf6;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #1a237e;
  position: sticky;
  top: 0;
  z-index: 1;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

tr {
  transition: all 0.3s ease;
}

tr:hover {
  background-color: #f5f7ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.member-name {
  display: flex;
  align-items: center;
  gap: 14px;
}

.member-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

tr:hover .member-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  display: inline-block;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.status-badge.outstanding {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

.status-badge.normal {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.2);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  gap: 10px;
}

.page-btn, .page-number {
  padding: 10px 16px;
  border: 2px solid #e8eaf6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #1a237e;
}

.page-btn:hover:not(:disabled) {
  background: #f5f7ff;
  border-color: #3949ab;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(57, 73, 171, 0.1);
}

.page-btn:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
  color: #adb5bd;
  border-color: #e8eaf6;
}

.page-number.active {
  background: linear-gradient(135deg, #1a237e, #3949ab);
  color: white;
  border-color: #1a237e;
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.page-number:hover:not(.active) {
  background: #f5f7ff;
  border-color: #3949ab;
  transform: translateY(-2px);
}

.dialog-footer {
  padding: 24px 28px;
  border-top: 1px solid #e8eaf6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 0 0 16px 16px;
}

.total-count {
  color: #1a237e;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.close-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #1a237e, #3949ab);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(26, 35, 126, 0.3);
}

.no-members {
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

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.course-selection {
  padding: 24px;
  text-align: center;
}

.course-selection h4 {
  color: #1a237e;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
}

.course-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #e8eaf6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.course-card:hover {
  background: #e8eaf6;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.1);
  border-color: #3949ab;
}

.course-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1a237e, #3949ab);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
}

.course-info {
  text-align: center;
}

.course-info h3 {
  color: #1a237e;
  margin: 0 0 4px;
  font-size: 1.1rem;
}

.course-info p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.selected-course {
  padding: 16px 28px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8eaf6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-course span {
  color: #1a237e;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-course i {
  color: #3949ab;
}

.change-course-btn {
  padding: 8px 16px;
  background: white;
  border: 2px solid #e8eaf6;
  border-radius: 8px;
  color: #1a237e;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.change-course-btn:hover {
  background: #f5f7ff;
  border-color: #3949ab;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dialog-box {
    width: 95%;
    margin: 10px;
    max-height: 90vh;
  }

  .dialog-header {
    padding: 20px;
  }

  .dialog-header h3 {
    font-size: 1.3rem;
  }

  .search-section {
    padding: 20px;
  }

  .search-box input {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
  }

  .members-list {
    padding: 0 20px;
  }

  .member-name {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .member-avatar {
    width: 36px;
    height: 36px;
  }

  th, td {
    padding: 12px 8px;
    font-size: 0.9rem;
  }

  .status-badge {
    padding: 6px 12px;
    font-size: 0.8em;
  }

  .pagination {
    padding: 16px;
    gap: 6px;
  }

  .page-btn, .page-number {
    padding: 8px 12px;
    min-width: 32px;
    font-size: 0.9rem;
  }

  .dialog-footer {
    padding: 16px 20px;
  }

  .total-count {
    font-size: 0.9rem;
  }

  .close-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .course-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 10px;
  }

  .course-card {
    padding: 16px;
  }

  .course-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .course-info h3 {
    font-size: 1rem;
  }

  .course-info p {
    font-size: 0.8rem;
  }

  .selected-course {
    padding: 12px 20px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .change-course-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 