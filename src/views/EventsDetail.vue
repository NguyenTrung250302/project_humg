<template>
    <Header></Header>
    <NavHeader></NavHeader>
    <div class="event-detail-page" v-if="event">
      <h1 class="event-title">📌 {{ event.eventName }}</h1>
      <img :src="event.urlAvatar" alt="Ảnh sự kiện" class="event-banner" />
  
      <div class="event-meta">
        <p><strong>📍 Địa điểm:</strong> {{ event.eventLocation }}</p>
        <p>
          <strong>📅 Thời gian:</strong>
          {{ formatDate(event.eventStartDate) }} - {{ formatDate(event.eventEndDate) }}
        </p>
      </div>
  
      <div class="event-description-full">
        <h2>📝 Mô tả chi tiết:</h2>
        <p>{{ event.description }}</p>
      </div>
    </div>
  
    <div v-else class="loading-box">
      <p>⏳ Đang tải thông tin sự kiện...</p>
    </div>
    <Footer></Footer>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useEventStore } from "../store/EventStore";
  import NavHeader from "../components/NavHeader.vue";
  import Header from "../components/Header.vue";
  import Footer from "../components/Footer.vue";
  
  const route = useRoute();
  const eventStore = useEventStore();
  const event = ref(null);
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  
  onMounted(async () => {
    const id = route.params.id;
    if (!eventStore.eventList.length) {
      await eventStore.getEventList();
    }
    event.value = eventStore.eventList.find((e) => e.id.toString() === id);
  });
  </script>
  
  <style scoped>
  .event-detail-page {
    padding: 20px;
    max-width: 800px;
    margin: auto;
  }
  
  .event-title {
    font-size: 28px;
    margin-bottom: 16px;
    text-align: center;
  }
  
  .event-banner {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
  }
  
  .event-meta {
    margin-bottom: 20px;
    font-size: 16px;
  }
  
  .event-description-full {
    font-size: 16px;
    line-height: 2rem;
    max-height: 1000px;
    overflow-y: auto;
    padding-right: 10px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    text-align: justify; 
}

  </style>
  