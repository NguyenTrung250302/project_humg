<template>
  <Header />
  <NavHeader />

  <div class="main-content">
    <!-- Khen thưởng -->
    <section class="section">
      <h2 class="section-title">🎖️ Khen thưởng</h2>
      <div class="card-list">
        <div class="card" v-for="(reward, index) in rewards" :key="index">
          <h3>{{ reward.name }}</h3>
          <p>Lý do: {{ reward.reason }}</p>
          <p>Ngày: {{ reward.date }}</p>
        </div>
      </div>
    </section>

    <!-- Kỷ luật -->
    <section class="section">
      <h2 class="section-title">⚠️ Kỷ luật</h2>
      <div class="card-list">
        <div
          class="card warning"
          v-for="(penalty, index) in penalties"
          :key="index"
        >
          <h3>{{ penalty.name }}</h3>
          <p>Lý do: {{ penalty.reason }}</p>
          <p>Ngày: {{ penalty.date }}</p>
        </div>
      </div>
    </section>
  </div>

  <Footer />
</template>

<script setup>
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";

// Dữ liệu mẫu
const rewards = [
  {
    name: "Nguyễn Văn A",
    reason: "Đạt thành tích xuất sắc",
    date: "2024-10-01",
  },
  {
    name: "Trần Thị B",
    reason: "Tích cực tham gia hoạt động",
    date: "2024-09-15",
  },
];

const penalties = [
  { name: "Lê Văn C", reason: "Vi phạm nội quy", date: "2024-10-05" },
  { name: "Phạm Thị D", reason: "Đi học muộn nhiều lần", date: "2024-09-30" },
];
</script>

<style scoped>
.main-content {
  padding: 20px;
  background-color: #f9f9f9;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  border-left: 5px solid #007bff;
  padding-left: 10px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex: 1 1 calc(33.333% - 16px);
  min-width: 250px;
}

.card.warning {
  border-left: 4px solid #ff4d4f;
}

.card h3 {
  margin: 0 0 8px;
}

.card p {
  margin: 4px 0;
}
</style>
