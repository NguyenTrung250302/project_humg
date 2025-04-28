<template>
  <div class="home-body">
    <!-- 📢 Thông báo tài liệu -->
    <div
      v-if="eventStore.documentList && eventStore.documentList.length > 0"
      class="document-banner-list"
    >
      <div
        class="document-banner"
        v-for="(document, index) in eventStore.documentList"
        :key="index"
      >
        <div class="document-banner-inner">
          <img
            :src="document.urlAvatar"
            alt="Ảnh tài liệu"
            class="banner-image"
          />
          <div class="banner-text">
            <h2 class="banner-title">
              📢 {{ document.documentTitle }}
            </h2>
            <p class="banner-content">
              {{ document.documentContent }}
            </p>
            <p class="banner-meta">
              🧑 {{ document.userName }} - {{ formatDate(document.createAt) }}
            </p>
          </div>
        </div>
        <div class="pagination">
          <!-- Phân trang cho tài liệu -->
          <button
            @click="goToPageDocument(eventStore.documentPagination.currentPage - 1)"
            :disabled="eventStore.documentPagination.currentPage === 1"
          >
            Trang trước
          </button>
    
          <span
            v-for="page in eventStore.documentPagination.totalPages"
            :key="page"
            @click="goToPageDocument(page)"
            :class="{ active: eventStore.documentPagination.currentPage === page }"
          >
            {{ page }}
          </span>
    
          <button
            @click="goToPageDocument(eventStore.documentPagination.currentPage + 1)"
            :disabled="eventStore.documentPagination.currentPage === eventStore.documentPagination.totalPages"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
    

    <h1 class="page-title">🎉 NHỮNG SỰ KIỆN NỔI BẬT GẦN ĐÂY</h1>

    <div class="content-frame">
      <div
        v-if="eventStore.error && eventStore.error.includes('🔒')"
        class="auth-error-box"
      >
        <p>{{ eventStore.error }}</p>
      </div>

      <div v-else-if="isLoading" class="loading-box">
        <p>⏳ Đang tải dữ liệu sự kiện...</p>
      </div>

      <div
        v-else-if="eventStore.eventList && eventStore.eventList.length > 0"
        class="event-grid">
        <div
          class="event-card"
          v-for="event in eventStore.eventList"
          :key="event.id"
          @click="goToEventDetail(event.id)"
          style="cursor: pointer">
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
      

      <div v-else class="no-event">
        <p>😕 Hiện tại không có sự kiện nào để hiển thị.</p>
      </div>
    </div>
    
    <div class="pagination">
      <!-- Phân trang cho sự kiện -->
      <button
        @click="goToPageEvent(eventStore.eventPagination.currentPage - 1)"
        :disabled="eventStore.eventPagination.currentPage === 1"
      >
        Trang trước
      </button>

      <span
        v-for="page in eventStore.eventPagination.totalPages"
        :key="page"
        @click="goToPageEvent(page)"
        :class="{ active: eventStore.eventPagination.currentPage === page }"
      >
        {{ page }}
      </span>

      <button
        @click="goToPageEvent(eventStore.eventPagination.currentPage + 1)"
        :disabled="eventStore.eventPagination.currentPage === eventStore.eventPagination.totalPages"
      >
        Trang sau
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useEventStore } from "../store/EventStore";

const eventStore = useEventStore();
const isLoading = ref(true);
const router = useRouter();

onMounted(async () => {
  isLoading.value = true;
  await eventStore.getEventList();
  await eventStore.getDocumentList();
  isLoading.value = false;
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const goToEventDetail = (id) => {
  router.push(`/EventsDetail/${id}`);
};

// Chuyển trang
const goToPageEvent = async (page) => {
  if (page >= 1 && page <= eventStore.eventPagination.totalPages) {
    await eventStore.goToEventPage(page);
  }
};
const goToPageDocument = async (page) => {
  if (page >= 1 && page <= eventStore.documentPagination.totalPages) {
    await eventStore.goToDocumentPage(page);
  }
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
.document-banner-list {
  margin-bottom: 30px;
}

.document-banner {
  background-color: #fffbe6;
  border: 2px solid #ffe58f;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
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
  line-height: 2rem;
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
  height: 300px;
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
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-detail {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

/*  */
.auth-error-box {
  text-align: center;
  padding: 20px;
  background-color: #fff3cd;
  border-radius: 10px;
  color: #856404;
  font-weight: bold;
  margin-top: 20px;
}

.pagination {
  margin-top: 100px;
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
