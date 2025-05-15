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

<template>
  <div class="home-body">
    <!-- 📢 Thông báo tài liệu -->
    <h1 class="page-title">🔔 THÔNG BÁO CHUNG</h1>
    <div
      v-if="eventStore.documentList && eventStore.documentList.length > 0"
      class="document-banner-list"
    >
      <div
        class="document-banner"
        v-for="(document, index) in [eventStore.documentList[0]]"
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
        <div class="document-pagination">
          <button 
            class="pagination-btn prev"
            @click="goToPageDocument(eventStore.documentPagination.currentPage - 1)"
            :disabled="eventStore.documentPagination.currentPage === 1"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="page-info">
            Trang {{ eventStore.documentPagination.currentPage }} / {{ eventStore.documentPagination.totalPages }}
          </span>
          <button 
            class="pagination-btn next"
            @click="goToPageDocument(eventStore.documentPagination.currentPage + 1)"
            :disabled="eventStore.documentPagination.currentPage === eventStore.documentPagination.totalPages"
          >
            <i class="fas fa-chevron-right"></i>
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


<style scoped>
.home-body {
  padding: 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}

/* Thông báo tài liệu lớn */
.document-banner-list {
  margin-bottom: 40px;
}

.document-banner {
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.document-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.document-banner-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.banner-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.banner-text {
  flex: 1;
  padding: 8px 0;
  min-width: 0;
}

.banner-title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 12px;
  font-weight: 600;
}

.banner-content {
  font-size: 15px;
  color: #495057;
  margin-bottom: 12px;
  line-height: 2.5;
}

.banner-meta {
  font-size: 14px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Tiêu đề trang */
.page-title {
  text-align: center;
  font-size: 28px;
  margin: 40px 0;
  color: #2c3e50;
  font-weight: 600;
  position: relative;
  padding-bottom: 15px;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #007bff;
  border-radius: 2px;
}

.content-frame {
  max-width: 1200px;
  margin: 0 auto;
}

/* --- Event styles --- */
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.event-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.event-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .event-image {
  transform: scale(1.05);
}

.event-info {
  padding: 20px;
}

.event-name {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.event-description {
  font-size: 14px;
  color: #495057;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
}

.event-detail {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-detail strong {
  color: #495057;
  font-weight: 500;
}

/* Loading và Error states */
.auth-error-box {
  text-align: center;
  padding: 24px;
  background-color: #fff3cd;
  border-radius: 12px;
  color: #856404;
  font-weight: 500;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-box {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 16px;
}

.no-event {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  font-size: 16px;
  background: #fff;
  border-radius: 12px;
  margin: 20px 0;
}

/* Pagination */
.pagination {
  margin-top: 60px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.pagination button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  min-width: 100px;
}

.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.pagination button:disabled {
  background-color: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}

.pagination span {
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #495057;
  min-width: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pagination span:hover:not(.active) {
  background-color: #e9ecef;
}

.pagination .active {
  background-color: #007bff;
  color: white;
}

/* Document Pagination */
.document-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.document-pagination .pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e9ecef;
  background: white;
  color: #495057;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.document-pagination .pagination-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
}

.document-pagination .pagination-btn:disabled {
  background: #f8f9fa;
  color: #adb5bd;
  cursor: not-allowed;
}

.document-pagination .page-info {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

@media (max-width: 768px) {
  .home-body {
    padding: 20px;
  }

  .document-banner-inner {
    flex-direction: column;
  }

  .banner-image {
    width: 100%;
    height: 200px;
  }

  .event-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .page-title {
    font-size: 24px;
    margin: 30px 0;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .pagination button,
  .pagination span {
    padding: 8px 16px;
  }

  .document-pagination {
    gap: 15px;
  }
  
  .document-pagination .pagination-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
