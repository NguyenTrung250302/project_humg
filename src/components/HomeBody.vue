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
    <!-- Hero Section -->
    <section class="hero-section" v-if="!eventStore.error">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-icon">📢</span>
          Thông tin mới nhất
        </h1>
        <p class="hero-subtitle">Cập nhật những thông báo và sự kiện quan trọng từ trường</p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Document Section -->
      <section class="document-section" v-if="eventStore.documentList && eventStore.documentList.length > 0">
        <div class="document-container" v-for="(document, index) in [eventStore.documentList[0]]" :key="index">
          <div class="document-header">
            <div class="header-content">
              <h2 class="document-title">
                <span class="icon">📢</span>
                {{ document.documentTitle }}
              </h2>
              <div class="document-meta">
                <div class="meta-item">
                  <span class="icon">👤</span>
                  {{ document.userName }}
                </div>
                <div class="meta-item">
                  <span class="icon">📅</span>
                  {{ formatDate(document.createAt) }}
                </div>
              </div>
            </div>
          </div>

          <div class="document-body">
            <div class="document-media">
              <img :src="document.urlAvatar" alt="Ảnh tài liệu" class="document-image" />
              <div class="media-overlay"></div>
            </div>
            <div class="document-content">
              <p class="content-text">{{ document.documentContent }}</p>
            </div>
          </div>

          <div class="document-footer">
            <div class="pagination-controls">
              <button class="control-btn" 
                @click="goToPageDocument(eventStore.documentPagination.currentPage - 1)"
                :disabled="eventStore.documentPagination.currentPage === 1">
                <i class="fas fa-chevron-left"></i>
                Trước
              </button>
              <span class="pagination-info">
                {{ eventStore.documentPagination.currentPage }} / {{ eventStore.documentPagination.totalPages }}
              </span>
              <button class="control-btn"
                @click="goToPageDocument(eventStore.documentPagination.currentPage + 1)"
                :disabled="eventStore.documentPagination.currentPage === eventStore.documentPagination.totalPages">
                Sau
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Events Section -->
      <section class="events-section">
        <!-- Error State -->
        <div v-if="eventStore.error" class="state-message error">
          <span class="icon">🔒</span>
          <p>{{ eventStore.error }}</p>
        </div>

        <template v-else>
          <div class="section-header">
            <h2 class="section-title">
              <span class="icon">🎉</span>
              Sự kiện nổi bật
            </h2>
          </div>

          <div class="events-container">
            <!-- Loading State -->
            <div v-if="isLoading" class="state-message loading">
              <div class="loading-spinner"></div>
              <p>Đang tải dữ liệu sự kiện...</p>
            </div>

            <!-- Events Grid -->
            <div v-else-if="eventStore.eventList && eventStore.eventList.length > 0" 
              class="events-grid">
              <div class="event-card" 
                v-for="event in eventStore.eventList" 
                :key="event.id" 
                @click="goToEventDetail(event.id)">
                <div class="card-media">
                  <img :src="event.urlAvatar" alt="Ảnh sự kiện" class="card-image" />
                  <div class="card-overlay"></div>
                </div>
                <div class="card-content">
                  <h3 class="card-title">{{ event.eventName }}</h3>
                  <p class="card-description">{{ event.description }}</p>
                  <div class="card-details">
                    <div class="detail-item">
                      <span class="icon">📍</span>
                      {{ event.eventLocation }}
                    </div>
                    <div class="detail-item">
                      <span class="icon">📅</span>
                      {{ formatDate(event.eventStartDate) }} - {{ formatDate(event.eventEndDate) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="state-message empty">
              <span class="icon">📭</span>
              <p>Hiện tại không có sự kiện nào</p>
            </div>

            <!-- Events Pagination -->
            <div class="events-pagination" v-if="eventStore.eventList && eventStore.eventList.length > 0">
              <div class="pagination-wrapper">
                <button class="page-btn" 
                  @click="goToPageEvent(eventStore.eventPagination.currentPage - 1)"
                  :disabled="eventStore.eventPagination.currentPage === 1">
                  <i class="fas fa-chevron-left"></i>
                </button>
                
                <div class="page-numbers">
                  <button v-for="page in eventStore.eventPagination.totalPages" 
                    :key="page"
                    @click="goToPageEvent(page)"
                    :class="['number-btn', { active: eventStore.eventPagination.currentPage === page }]">
                    {{ page }}
                  </button>
                </div>

                <button class="page-btn"
                  @click="goToPageEvent(eventStore.eventPagination.currentPage + 1)"
                  :disabled="eventStore.eventPagination.currentPage === eventStore.eventPagination.totalPages">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Base Styles */
.home-body {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff10" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.1;
}

.hero-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.hero-icon {
  font-size: 56px;
}

.hero-subtitle {
  font-size: 18px;
  font-weight: 400;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: -60px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

/* Document Section */
.document-section {
  margin-bottom: 60px;
  position: relative;
}

.document-section::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent,
    rgba(59, 130, 246, 0.1) 20%,
    rgba(59, 130, 246, 0.3) 40%,
    rgba(59, 130, 246, 0.5) 50%,
    rgba(59, 130, 246, 0.3) 60%,
    rgba(59, 130, 246, 0.1) 80%,
    transparent
  );
}

.document-section::before {
  content: '✦';
  position: absolute;
  bottom: -39px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #3b82f6;
  background: #f8fafc;
  padding: 0 20px;
  z-index: 1;
}

.document-container {
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.document-header {
  padding: 32px;
  background: linear-gradient(to right, #f8fafc, white);
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.document-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.3;
}

.document-meta {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.document-body {
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
  gap: 32px;
  padding: 32px;
  align-items: start;
}

.document-media {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #f8fafc;
}

.document-media::before {
  content: "";
  display: block;
  padding-top: 75%; /* Tỷ lệ 4:3 */
}

.document-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 16px;
  background: white;
  transition: transform 0.6s ease;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.document-media:hover .document-image {
  transform: scale(1.03);
}

.document-content {
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
  height: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: #334155;
  white-space: pre-line;
  margin: 0;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 16px;
}

.content-text::-webkit-scrollbar {
  width: 8px;
}

.content-text::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.content-text::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.content-text::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.document-footer {
  padding: 24px 32px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
}

.control-btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  padding: 8px 16px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Events Section */
.events-section {
  padding: 40px 0;
}

.section-header {
  margin-bottom: 40px;
  text-align: center;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.events-container {
  position: relative;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.event-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.card-media {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover .card-image {
  transform: scale(1.1);
}

.event-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  padding: 24px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.4;
}

.card-description {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

/* State Messages */
.state-message {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  margin-bottom: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-message.error {
  margin-top: 100px;
  background: #fee2e2;
  color: #991b1b;
}

.state-message.empty {
  color: #64748b;
}

.state-message .icon {
  font-size: 40px;
  margin-bottom: 16px;
  display: block;
}

/* Events Pagination */
.events-pagination {
  margin-top: 40px;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: white;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.page-btn:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.page-btn:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.number-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: white;
  color: #1e293b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.number-btn:hover:not(.active) {
  background: #f1f5f9;
}

.number-btn.active {
  background: #3b82f6;
  color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .document-body {
    grid-template-columns: 1fr;
  }

  .document-media {
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 250px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .document-header {
    padding: 24px;
  }

  .document-title {
    font-size: 28px;
  }

  .document-body {
    padding: 24px;
  }

  .document-media::before {
    padding-top: 66.67%; /* Tỷ lệ 3:2 cho màn hình nhỏ */
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .pagination-wrapper {
    flex-wrap: wrap;
  }

  .page-numbers {
    order: 2;
    width: 100%;
    justify-content: center;
    margin-top: 16px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }

  .document-meta {
    flex-direction: column;
    gap: 12px;
  }

  .control-btn {
    padding: 10px 16px;
  }

  .number-btn,
  .page-btn {
    width: 36px;
    height: 36px;
  }

  .document-body {
    padding: 16px;
  }

  .document-media::before {
    padding-top: 60%; /* Tỷ lệ 5:3 cho mobile */
  }

  .document-image {
    padding: 8px;
  }
}
</style>
