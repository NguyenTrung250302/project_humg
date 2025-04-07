<template>
  <div class="home-body">
    <h1 class="page-title">🎉 Sự kiện nổi bật</h1>

    <div class="content-frame">
      <!-- Hiển thị lỗi nếu có -->
      <div v-if="eventStore.error" class="error-box">
        <p>🚫 {{ eventStore.error }}</p>
      </div>

      <!-- Loading -->
      <div v-else-if="isLoading" class="loading-box">
        <p>⏳ Đang tải dữ liệu sự kiện...</p>
      </div>

      <!-- Danh sách sự kiện -->
      <div
        v-else-if="eventStore.eventList && eventStore.eventList.length > 0"
        class="event-grid"
      >
        <div
          class="event-card"
          v-for="event in eventStore.eventList"
          :key="event.id"
        >
          <img :src="event.urlAvatar" alt="Ảnh sự kiện" class="event-image" />
          <div class="event-info">
            <h2 class="event-name">{{ event.eventName }}</h2>
            <p class="event-description">{{ event.description }}</p>
            <p class="event-detail">
              📍 <strong>Địa điểm:</strong> {{ event.eventLocation }}
            </p>
            <p class="event-detail">
              📅 <strong>Thời gian:</strong>
              {{ formatDate(event.eventStartDate) }} -
              {{ formatDate(event.eventEndDate) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Không có dữ liệu -->
      <div v-else class="no-event">
        <p>😕 Hiện tại không có sự kiện nào để hiển thị.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useEventStore } from "../store/EventStore";

const eventStore = useEventStore();
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  await eventStore.getEventList();
  isLoading.value = false;
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
</script>

<style scoped>
.home-body {
  padding: 30px;
  background-color: #f4f6f8;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}

.page-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
}

.content-frame {
  max-width: 1200px;
  margin: 0 auto;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.event-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
}

.event-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.event-info {
  padding: 16px;
  text-align: left;
}

.event-name {
  font-size: 20px;
  color: #007bff;
  margin-bottom: 8px;
}

.event-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.event-detail {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

.error-box,
.loading-box,
.no-event {
  text-align: center;
  padding: 20px;
  background-color: #ffe5e5;
  border-radius: 10px;
  color: #d10000;
  font-weight: bold;
  margin-top: 20px;
}
</style>
