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
      <p>{{ RewardDisciplineStore.error }}</p>
    </div>
    <h1>📜 Lịch sử phê duyệt</h1>
    <div class="history-list">
      <div
        class="history-item"
        :class="{
          reward: history.historyType === 'reward',
          discipline: history.historyType === 'discipline',
        }"
        v-for="(history, index) in approvalHistory"
        :key="index"
      >
        <h3>ID: {{ history.id }}</h3>
        <p>
          Loại:
          {{
            history.historyType === "reward" ? "🎖️ Khen thưởng" : "⚠️ Kỷ luật"
          }}
        </p>
        <p>Phê duyệt bởi ID: {{ history.approvedById }}</p>
        <p>
          Trạng thái:
          <span :class="history.isAccept ? 'status accept' : 'status reject'">
            {{ history.isAccept ? "Đã chấp nhận" : "Bị từ chối" }}
          </span>
        </p>
        <p>Reward/Discipline ID: {{ history.rewardDisciplineId }}</p>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";
import { onMounted, ref } from "vue";
import { useRewardDisciplineStore } from "../store/RewardDisciplineStore";

const RewardDisciplineStore = useRewardDisciplineStore();
const approvalHistory = ref([]);

onMounted(async () => {
  await RewardDisciplineStore.GetApprovalHistory();
  approvalHistory.value = RewardDisciplineStore.listApprovalHistory;
});
</script>

<style scoped>
.main-content {
  padding: 24px;
  background-color: #f0f2f5;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  font-size: 28px;
  margin-bottom: 24px;
  color: #333;
  border-left: 6px solid #1890ff;
  padding-left: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.history-item {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border-left: 5px solid #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.4s ease-in-out;
}

.history-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.history-item.reward {
  border-left-color: #52c41a; /* xanh lá cho khen thưởng */
}

.history-item.discipline {
  border-left-color: #f5222d; /* đỏ cho kỷ luật */
}

.history-item h3 {
  margin-bottom: 8px;
  font-size: 20px;
  color: #0050b3;
}

.history-item p {
  margin: 6px 0;
  font-size: 15px;
  color: #555;
}

.status {
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: 8px;
}

.status.accept {
  background-color: #dfffdc;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

.status.reject {
  background-color: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffa39e;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .history-item {
    padding: 16px;
  }

  .history-item h3 {
    font-size: 18px;
  }

  .history-item p {
    font-size: 14px;
  }
}

.auth-error-box {
  text-align: center;
  padding: 20px;
  background-color: #fff3cd;
  border-radius: 10px;
  color: #856404;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
