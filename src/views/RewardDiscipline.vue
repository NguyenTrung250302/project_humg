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
      <div class="card-list">
        <div class="card" v-for="(reward, index) in RewardDisciplineStore.listReward" :key="index">
          <h3>Đoàn viên: {{ reward.recipientName }}</h3>
          <p>Mã SV: {{ reward.recipientMaSV }}</p>
          <p>Lý do: {{ reward.description }}</p>
          <p>Ngày duyệt: {{ reward.createDate.split("T")[0] }}</p>
          <p>Đề xuất bởi: {{ reward.proposerName }}</p>
          <p v-if="reward.rejectReason">
            Lý do từ chối: {{ reward.rejectReason }}
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
      <div class="card-list">
        <div
          class="card warning"
          v-for="(penalty, index) in RewardDisciplineStore.listDiscipline"
          :key="index"
        >
          <h3>Đoàn viên: {{ penalty.recipientName }}</h3>
          <p>Mã SV: {{ penalty.recipientMaSV }}</p>
          <p>Lý do: {{ penalty.description }}</p>
          <p>Ngày duyệt: {{ penalty.createDate.split("T")[0] }}</p>
          <p>Đề xuất bởi: {{ penalty.proposerName }}</p>
          <p v-if="penalty.rejectReason">
            Lý do từ chối: {{ penalty.rejectReason }}
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

<style scoped>
.main-content {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
  border-left: 6px solid #1890ff;
  padding-left: 12px;
  color: #222;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  background-color: #e8f5e9; /* xanh nhạt cho khen thưởng */
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #28a745; /* viền xanh cho khen thưởng */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(33.333% - 16px);
  min-width: 250px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card.warning {
  background-color: #fff1f0; /* đỏ nhạt cho kỷ luật */
  border-left: 4px solid #ff4d4f;
}

.card:hover {
  transform: translateY(-5px);
}

.card:not(.warning):hover {
  box-shadow: 0 8px 16px rgba(40, 167, 69, 0.3); /* hiệu ứng hover khen thưởng */
}

.card.warning:hover {
  box-shadow: 0 8px 16px rgba(255, 77, 79, 0.3); /* hiệu ứng hover kỷ luật */
}

.card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #007bff;
}

.card p {
  margin: 4px 0;
  color: #555;
}

.card p:last-child {
  margin-bottom: 0;
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
