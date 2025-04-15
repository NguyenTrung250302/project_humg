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

    <!-- Nút đăng ký sự kiện -->
    <div class="register-button-box">
      <button class="register-button" @click="handleRegister">🎉 Đăng ký tham gia sự kiện</button>
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

const handleRegister = async () => {
  const eventId = event.value?.id;

  const result = await eventStore.signUpForEvent(eventId);

  if (result.success) {
    window.$dialog.success(result.message);
  } else {
    window.$dialog.fail(result.message);
  }
};

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
  max-height: 500px;
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

/* Nút đăng ký sự kiện */
.register-button-box {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.register-button {
  background-color: #3aafe1; 
  color: white;
  padding: 14px 28px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.register-button:hover {
  background-color: #0078b0; 
  transform: translateY(-2px);
}
</style>
  