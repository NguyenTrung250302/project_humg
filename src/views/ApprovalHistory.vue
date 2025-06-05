<template>
  <Header></Header>
  <NavHeader></NavHeader>
  <div class="main-content">
    <div
      v-if="
        RewardDisciplineStore.error &&
        RewardDisciplineStore.error.includes('🔒')
      "
      class="auth-error-box"
    >
      <div class="error-icon">🔒</div>
      <p>{{ RewardDisciplineStore.error }}</p>
    </div>
    <div class="page-header">
      <div class="header-content">
        <h1>📜 Lịch sử phê duyệt</h1>
        <p class="header-subtitle">Danh sách các đề xuất đã được xử lý</p>
      </div>
      <div class="header-decoration"></div>
    </div>

    <!-- Filter Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Loại đề xuất:</label>
        <select v-model="filters.historyType">
          <option value="">Tất cả</option>
          <option value="reward">Khen thưởng</option>
          <option value="discipline">Kỷ luật</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Trạng thái:</label>
        <select v-model="filters.status">
          <option value="">Tất cả</option>
          <option value="accept">Đã chấp nhận</option>
          <option value="reject">Đã từ chối</option>
        </select>
      </div>
      <button class="reset-filters" @click="resetFilters">
        🔄 Đặt lại bộ lọc
      </button>
    </div>

    <div class="history-list">
      <div
        class="history-item"
        :class="{
          reward: history.historyType === 'reward',
          discipline: history.historyType === 'discipline',
        }"
        v-for="(history, index) in filteredHistory"
        :key="index"
      >
        <div class="history-header">
          <div class="header-left">
            <h3>
              <span class="id-label">Mã phê duyệt</span>
              <span class="id-value">#{{ history.id }}</span>
            </h3>
            <span class="proposal-id">Mã đề xuất: #{{ history.rewardDisciplineId }}</span>
          </div>
          <div class="type-badge" :class="history.historyType">
            <span class="badge-icon">{{ history.historyType === "reward" ? "🎖️" : "⚠️" }}</span>
            <span class="badge-text">{{ history.historyType === "reward" ? "Khen thưởng" : "Kỷ luật" }}</span>
          </div>
        </div>
        <div class="history-content">
          <div class="description">
            <p class="description-text">{{ history.description }}</p>
          </div>
          <div class="approval-info">
            <div class="approval-details">
              <div class="approver">
                <span class="icon">👤</span>
                <span class="label">Phê duyệt bởi:</span>
                <span class="value">{{ history.approvedByName }}</span>
              </div>
              <div class="approval-date">
                <span class="icon">📅</span>
                <span class="label">Thời gian:</span>
                <span class="value">{{ history.approvedDate }}</span>
              </div>
            </div>
            <div class="status-container">
              <span :class="['status-badge', history.isAccept ? 'accept' : 'reject']">
                <span class="status-icon">{{ history.isAccept ? '✓' : '×' }}</span>
                <span class="status-text">{{ history.isAccept ? "Đã chấp nhận" : "Bị từ chối" }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";
import { onMounted, ref, watch } from "vue";
import { useRewardDisciplineStore } from "../store/RewardDisciplineStore";

const RewardDisciplineStore = useRewardDisciplineStore();
const approvalHistory = ref([]);
const filteredHistory = ref([]);
const filters = ref({
  historyType: '',
  status: '',
});

onMounted(async () => {
  await RewardDisciplineStore.GetApprovalHistory();
  approvalHistory.value = RewardDisciplineStore.listApprovalHistory
    .map((item) => ({
      ...item,
      approvedDate: item.approvedDate.split("T")[0],
      timestamp: new Date(item.approvedDate).getTime(),
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
  filteredHistory.value = approvalHistory.value;
});

const resetFilters = () => {
  filters.value.historyType = '';
  filters.value.status = '';
};

const applyFilters = () => {
  filteredHistory.value = approvalHistory.value.filter((history) => {
    const typeMatch = filters.value.historyType === '' || history.historyType === filters.value.historyType;
    const statusMatch = filters.value.status === '' || 
      (filters.value.status === 'accept' ? history.isAccept : !history.isAccept);
    return typeMatch && statusMatch;
  });
};

// Watch for changes in filters
watch(filters, () => {
  applyFilters();
}, { deep: true });
</script>

<style scoped>
.main-content {
  padding: 40px;
  background-color: #f8fafc;
  min-height: calc(100vh - 64px);
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.page-header {
  margin-bottom: 48px;
  position: relative;
  padding-bottom: 16px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-subtitle {
  font-size: 16px;
  color: #666;
  margin: 8px 0 0;
}

.header-decoration {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  border-radius: 2px;
}

.history-list {
  display: grid;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.history-item {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.history-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.history-item.reward {
  border-top: 5px solid #52c41a;
}

.history-item.discipline {
  border-top: 5px solid #ff4d4f;
}

.history-header {
  padding: 24px 32px;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-header h3 {
  margin: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.id-label {
  color: #8c8c8c;
  font-weight: 500;
  font-size: 14px;
}

.id-value {
  color: #1a1a1a;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.proposal-id {
  font-size: 14px;
  color: #666;
}

.type-badge {
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.type-badge .badge-icon {
  font-size: 18px;
}

.type-badge.reward {
  background-color: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

.type-badge.reward:hover {
  background-color: #d9f7be;
}

.type-badge.discipline {
  background-color: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffa39e;
}

.type-badge.discipline:hover {
  background-color: #ffccc7;
}

.history-content {
  padding: 32px;
}

.description {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.description-text {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #262626;
}

.approval-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.approval-details {
  display: flex;
  gap: 24px;
}

.approver, .approval-date {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 16px;
}

.label {
  font-size: 14px;
  color: #8c8c8c;
}

.value {
  font-size: 15px;
  color: #262626;
  font-weight: 600;
}

.status-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.status-badge.accept {
  background-color: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

.status-badge.accept:hover {
  background-color: #d9f7be;
}

.status-badge.reject {
  background-color: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffa39e;
}

.status-badge.reject:hover {
  background-color: #ffccc7;
}

.status-icon {
  font-size: 16px;
}

.auth-error-box {
  background: linear-gradient(135deg, #fff6e9, #ffe7e7);
  border-radius: 16px;
  padding: 20px 32px;
  margin-bottom: 40px;
  border: 1px solid #ffd591;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.error-icon {
  font-size: 24px;
}

.auth-error-box p {
  color: #d46b08;
  font-weight: 600;
  margin: 0;
  font-size: 15px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .history-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .approval-info {
    flex-direction: column;
    gap: 20px;
  }

  .approval-details {
    flex-direction: column;
    gap: 12px;
  }

  .history-content {
    padding: 20px;
  }

  .type-badge, .status-badge {
    width: 100%;
    justify-content: center;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.history-item {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.filters-section {
  max-width: 1200px;
  margin: 0 auto 32px;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.filter-group select {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background: #fff;
  font-size: 14px;
  color: #262626;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.filter-group select:hover {
  border-color: #1890ff;
}

.filter-group select:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.reset-filters {
  padding: 8px 16px;
  border-radius: 8px;
  background: #f0f2f5;
  border: 1px solid #d9d9d9;
  color: #595959;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reset-filters:hover {
  background: #e6e8eb;
  border-color: #8c8c8c;
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group select {
    width: 100%;
  }

  .reset-filters {
    width: 100%;
    justify-content: center;
  }
}
</style>
