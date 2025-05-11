<template>
  <div class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-box members-dialog">
      <div class="dialog-header">
        <h3>Danh sách đoàn viên ngành {{ majorName }}</h3>
        <button class="close-icon" @click="closeDialog">
          <i class="fas fa-times"></i>
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
              <th>Trạng thái</th>
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
              <td>
                <span :class="['status-badge', member.isOutstandingMember ? 'outstanding' : 'normal']">
                  {{ member.isOutstandingMember ? 'Ưu tú' : 'Thường' }}
                </span>
              </td>
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

      <div class="dialog-footer">
        <span class="total-count">Tổng số: {{ filteredMembers.length }} đoàn viên</span>
        <button class="close-btn" @click="closeDialog">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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

// Computed properties
const filteredMembers = computed(() => {
  return store.membersByMajor;
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
  currentPage.value = 1;
  if (searchQuery.value.trim()) {
    await store.searchMembersByMajor(props.majorName, searchQuery.value.trim());
  } else {
    await store.getMembersByMajor(props.majorName);
  }
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.dialog-box {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.dialog-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
}

.close-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-icon:hover {
  background: #eee;
  color: #333;
}

.search-section {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #666;
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.members-list {
  padding: 0 24px;
  overflow-y: auto;
  flex: 1;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  position: sticky;
  top: 0;
  z-index: 1;
}

tr:hover {
  background-color: #f8f9fa;
}

.member-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
  display: inline-block;
}

.status-badge.outstanding {
  background-color: #28a745;
  color: white;
}

.status-badge.normal {
  background-color: #6c757d;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 8px;
}

.page-btn, .page-number {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
  color: #adb5bd;
}

.page-number.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.page-number:hover:not(.active) {
  background-color: #f8f9fa;
}

.dialog-footer {
  padding: 20px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

.total-count {
  color: #495057;
  font-size: 0.95em;
  font-weight: 500;
}

.close-btn {
  padding: 8px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.close-btn:hover {
  background-color: #5a6268;
}

.no-members {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.no-data-icon {
  font-size: 48px;
  color: #dee2e6;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .dialog-box {
    width: 95%;
    margin: 10px;
    max-height: 90vh;
  }

  .member-name {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .search-box {
    flex-direction: column;
  }

  .pagination {
    flex-wrap: wrap;
  }

  th, td {
    padding: 12px 8px;
  }

  .dialog-header h3 {
    font-size: 1.2rem;
  }
}
</style> 