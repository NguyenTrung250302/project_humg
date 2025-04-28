<script setup>
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";
import { onMounted, ref } from "vue";
import { useRewardDisciplineStore } from "../store/RewardDisciplineStore";

const RewardDisciplineStore = useRewardDisciplineStore();

onMounted(async () => {
  await RewardDisciplineStore.GetListReward();
  await RewardDisciplineStore.GetListDiscipline();
});

const goToPageReward = async (page) => {
  if (page >= 1 && page <= RewardDisciplineStore.rewardPagination.totalPages) {
    await RewardDisciplineStore.goToPageReward(page); 
  }
};

const goToPageDiscipline = async (page) => {
  if (page >= 1 && page <= RewardDisciplineStore.disciplinePagination.totalPages) {
    await RewardDisciplineStore.goToPageDiscipline(page); 
  }
};
</script>

<template>
  <Header />
  <NavHeader />
  <div></div>

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

    <!-- Khen thưởng -->
    <section class="section">
      <h2 class="section-title">🎖️ KHEN THƯỞNG</h2>
      <div class="card-grid">
        <div class="card" v-for="(reward, index) in RewardDisciplineStore.listReward" :key="index">
          <h3>{{ reward.recipientName }}</h3>
          <p><strong>Mã SV:</strong> {{ reward.recipientMaSV }}</p>
          <p><strong>Lý do:</strong> {{ reward.description }}</p>
          <p><strong>Ngày duyệt:</strong> {{ reward.createDate.split("T")[0] }}</p>
          <p><strong>Đề xuất bởi:</strong> {{ reward.proposerName }}</p>
          <p v-if="reward.rejectReason">
            <strong>Lý do từ chối:</strong> {{ reward.rejectReason }}
          </p>
        </div>
      </div>
      <div class="pagination">
        <button
          @click="goToPageReward(RewardDisciplineStore.rewardPagination.currentPage - 1)"
          :disabled="RewardDisciplineStore.rewardPagination.currentPage === 1"
        >
          Trang trước
        </button>
  
        <span
          v-for="page in RewardDisciplineStore.rewardPagination.totalPages"
          :key="page"
          @click="goToPageReward(page)"
          :class="{ active: RewardDisciplineStore.rewardPagination.currentPage === page }"
        >
          {{ page }}
        </span>
  
        <button
          @click="goToPageReward(RewardDisciplineStore.rewardPagination.currentPage + 1)"
          :disabled="RewardDisciplineStore.rewardPagination.currentPage === RewardDisciplineStore.rewardPagination.totalPages"
        >
          Trang sau
        </button>
      </div>
    </section>

    <!-- Kỷ luật -->
    <section class="section">
      <h2 class="section-title">⚠️ KỶ LUẬT</h2>
      <div class="card-grid">
        <div
          class="card warning"
          v-for="(penalty, index) in RewardDisciplineStore.listDiscipline"
          :key="index"
        >
          <h3>{{ penalty.recipientName }}</h3>
          <p><strong>Mã SV:</strong> {{ penalty.recipientMaSV }}</p>
          <p><strong>Lý do:</strong> {{ penalty.description }}</p>
          <p><strong>Ngày duyệt:</strong> {{ penalty.createDate.split("T")[0] }}</p>
          <p><strong>Đề xuất bởi:</strong> {{ penalty.proposerName }}</p>
          <p v-if="penalty.rejectReason">
            <strong>Lý do từ chối:</strong> {{ penalty.rejectReason }}
          </p>
        </div>
      </div>
      <div class="pagination">
        <button
          @click="goToPageDiscipline(RewardDisciplineStore.disciplinePagination.currentPage - 1)"
          :disabled="RewardDisciplineStore.disciplinePagination.currentPage === 1"
        >
          Trang trước
        </button>
  
        <span
          v-for="page in RewardDisciplineStore.disciplinePagination.totalPages"
          :key="page"
          @click="goToPageDiscipline(page)"
          :class="{ active: RewardDisciplineStore.disciplinePagination.currentPage === page }"
        >
          {{ page }}
        </span>
  
        <button
          @click="goToPageDiscipline(RewardDisciplineStore.disciplinePagination.currentPage + 1)"
          :disabled="RewardDisciplineStore.disciplinePagination.currentPage === RewardDisciplineStore.disciplinePagination.totalPages"
        >
          Trang sau
        </button>
      </div>
    </section>
  </div>

  <Footer />
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: #f9f9f9;
}

.section {
  width: 100%;
  margin-bottom: 40px;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #222;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background-color: #e8f5e9;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #28a745;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card.warning {
  background-color: #fff1f0;
  border-left: 4px solid #ff4d4f;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #007bff;
  font-weight: bold;
}

.card p {
  margin: 4px 0;
  color: #555;
}

.card p strong {
  color: #222;
}

.card:hover {
  transform: translateY(-5px);
}

.card:not(.warning):hover {
  box-shadow: 0 8px 16px rgba(40, 167, 69, 0.3);
}

.card.warning:hover {
  box-shadow: 0 8px 16px rgba(255, 77, 79, 0.3);
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
</style>

