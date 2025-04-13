<template>
  <div class="home-body">
    <!-- 📢 Thông báo tài liệu (hiển thị lớn ở đầu) -->
    <div
      v-if="eventStore.documentList && eventStore.documentList.length > 0"
      class="document-banner"
    >
      <div class="document-banner-inner">
        <img
          :src="eventStore.documentList[0].urlAvatar"
          alt="Ảnh tài liệu"
          class="banner-image"
        />
        <div class="banner-text">
          <h2 class="banner-title">
            📢 {{ eventStore.documentList[0].documentTitle }}
          </h2>
          <p class="banner-content">
            {{ eventStore.documentList[0].documentContent }}
          </p>
          <p class="banner-meta">
            🧑 {{ eventStore.documentList[0].userName }} -
            {{ formatDate(eventStore.documentList[0].createAt) }}
          </p>
        </div>
      </div>
    </div>

    <h1 class="page-title">🎉 NHỮNG SỰ KIỆN NỔI BẬT GẦN ĐÂY</h1>

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

      <!-- Không có sự kiện -->
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
  await eventStore.getEventList(), eventStore.getDocumentList();
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

/* Thông báo tài liệu lớn */
.document-banner {
  background-color: #fffbe6;
  border: 2px solid #ffe58f;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.document-banner-inner {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.banner-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 22px;
  color: #d48806;
  margin-bottom: 10px;
}

.banner-content {
  font-size: 15px;
  color: #444;
  margin-bottom: 8px;
}

.banner-meta {
  font-size: 13px;
  color: #888;
}

/* Tiêu đề trang */
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

/* --- Event styles --- */
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
