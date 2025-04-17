<template>
  <div class="container-dashboard">
    <Dashboard />
    <div class="main">
      <h1>Quản lý sự kiện</h1>

      <!-- Nút Thêm sự kiện -->
      <button class="btn add-btn" @click="showForm = !showForm">
        {{ showForm ? "Đóng form" : "+ Thêm sự kiện" }}
      </button>

      <!-- Form tạo mới -->
      <div v-if="showForm" class="event-form">
        <h3>Thêm sự kiện mới</h3>
        <form @submit.prevent="addEvent">
          <input
            v-model="newEvent.eventName"
            placeholder="Tên sự kiện"
            required
          />
          <input
            v-model="newEvent.eventStartDate"
            type="date"
            placeholder="Ngày bắt đầu"
            required
          />
          <input
            v-model="newEvent.eventEndDate"
            type="date"
            placeholder="Ngày kết thúc"
            required
          />
          <input
            v-model="newEvent.eventLocation"
            placeholder="Địa điểm"
            required
          />
          <textarea
            v-model="newEvent.description"
            placeholder="Mô tả sự kiện"
            rows="3"
          ></textarea>

          <!-- Chọn ảnh từ file hoặc nhập URL -->
          <label for="image-upload" class="image-upload-label">
            Chọn ảnh sự kiện
          </label>
          <input
            type="file"
            id="image-upload"
            @change="handleImageUpload"
            accept="image/*"
            class="image-upload-input"
          />

          <!-- Hoặc nhập URL ảnh -->
          <input
            v-model="newEvent.urlAvatar"
            type="text"
            placeholder="Hoặc nhập URL ảnh"
            class="url-input"
          />

          <!-- Xem ảnh preview -->
          <div v-if="imagePreview || newEvent.urlAvatar" class="image-preview">
            <img
              :src="imagePreview || newEvent.urlAvatar"
              alt="Ảnh sự kiện"
              class="preview-img"
            />
          </div>

          <button type="submit" class="btn save-btn">Lưu</button>
        </form>
      </div>

      <!-- Form chỉnh sửa -->
      <div v-if="editFormVisible" class="event-form">
        <h3>Chỉnh sửa sự kiện</h3>
        <form @submit.prevent="updateEvent">
          <input
            v-model="editEventData.eventName"
            placeholder="Tên sự kiện"
            required
          />
          <input
            v-model="editEventData.eventStartDate"
            type="date"
            placeholder="Ngày bắt đầu"
            required
          />
          <input
            v-model="editEventData.eventEndDate"
            type="date"
            placeholder="Ngày kết thúc"
            required
          />
          <input
            v-model="editEventData.eventLocation"
            placeholder="Địa điểm"
            required
          />
          <textarea
            v-model="editEventData.description"
            placeholder="Mô tả sự kiện"
            rows="3"
          ></textarea>

          <!-- Chọn ảnh từ file hoặc nhập URL -->
          <label for="edit-image-upload" class="image-upload-label">
            Chọn ảnh sự kiện
          </label>
          <input
            type="file"
            id="edit-image-upload"
            @change="handleEditImageUpload"
            accept="image/*"
            class="image-upload-input"
          />

          <!-- Hoặc nhập URL ảnh -->
          <input
            v-model="editEventData.urlAvatar"
            type="text"
            placeholder="Hoặc nhập URL ảnh"
            class="url-input"
          />

          <!-- Xem ảnh preview -->
          <div
            v-if="editImagePreview || editEventData.urlAvatar"
            class="image-preview"
          >
            <img
              :src="editImagePreview || editEventData.urlAvatar"
              alt="Ảnh sự kiện"
              class="preview-img"
            />
          </div>

          <button type="submit" class="btn save-btn">Lưu</button>
        </form>
      </div>

      <!-- Danh sách sự kiện -->
      <div v-if="eventAdminStore.error" class="error-message">
        {{ eventAdminStore.error }}
      </div>

      <div v-else>
        <ul class="event-list">
          <li
            v-for="event in eventStore.eventList"
            :key="event.id"
            class="event-item"
          >
            <img :src="event.urlAvatar" alt="Ảnh sự kiện" class="event-image" />
            <div class="event-content">
              <h3>{{ event.eventName }}</h3>
              <p>
                <strong>Thời gian:</strong> {{ event.eventStartDate }} -
                {{ event.eventEndDate }}
              </p>
              <p><strong>Địa điểm:</strong> {{ event.eventLocation }}</p>
              <p>{{ event.description }}</p>
            </div>
            <div class="event-actions">
              <button class="btn edit-btn" @click="editEvent(event)">
                Sửa
              </button>
              <button class="btn delete-btn" @click="deleteEvent(event.id)">
                Xóa
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import the necessary components and stores
import { ref, onMounted } from "vue";
import { useEventStore } from "../store/EventStore";
import { useEventAdminStore } from "../StoreAdmin/StoreEvent";
import Dashboard from "./Dashboard.vue";

const eventStore = useEventStore();
const eventAdminStore = useEventAdminStore();
const showForm = ref(false);

// Dữ liệu form tạo mới
const newEvent = ref({
  eventName: "",
  eventStartDate: "",
  eventEndDate: "",
  eventLocation: "",
  description: "",
  urlAvatar: "",
});

const imagePreview = ref(null);

onMounted(() => {
  eventStore.getEventList();
});

// Thêm sự kiện mới
const addEvent = async () => {
  console.log("Thêm sự kiện:", newEvent.value);
  const imageFile = document.getElementById("image-upload").files[0]; // Lấy file ảnh từ input
  await eventAdminStore.AddNewEvent(newEvent.value, imageFile); // Truyền file ảnh vào hàm
  eventStore.getEventList(); // Cập nhật lại danh sách sự kiện
  showForm.value = false;

  // Reset form
  newEvent.value = {
    eventName: "",
    eventStartDate: "",
    eventEndDate: "",
    eventLocation: "",
    description: "",
    urlAvatar: "",
  };
  imagePreview.value = null; // Reset ảnh preview
};

// Xử lý ảnh tải lên
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result; // Hiển thị ảnh preview
      newEvent.value.urlAvatar = e.target.result; // Lưu URL ảnh vào form
    };
    reader.readAsDataURL(file); // Đọc ảnh dưới dạng URL
  }
};

// Xóa sự kiện
const deleteEvent = async (eventId) => {
  try {
    await eventAdminStore.DeleteEvent(eventId);
    eventStore.getEventList(); // Refresh the event list after deletion
  } catch (err) {
    console.error("Error deleting event:", err);
  }
};

const editFormVisible = ref(false);
const editEventData = ref({
  eventName: "",
  eventStartDate: "",
  eventEndDate: "",
  eventLocation: "",
  description: "",
  urlAvatar: "",
});
const editImagePreview = ref(null);

const editEvent = (event) => {
  editEventData.value = { ...event };
  editFormVisible.value = true;
};

const updateEvent = async () => {
  try {
    const imageFile = document.getElementById("edit-image-upload").files[0];
    if (imageFile) {
      // If a new image is uploaded, use it
      editEventData.value.urlAvatar = imageFile;
    }
    await eventAdminStore.UpdateEvent(editEventData.value);
    eventStore.getEventList(); // Refresh the event list after update
    editFormVisible.value = false;
  } catch (err) {
    console.error("Error updating event:", err);
  }
};

const handleEditImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editImagePreview.value = e.target.result;
      editEventData.value.urlAvatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped>
.event-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.event-item {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.event-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}

.event-content {
  flex: 1;
  min-width: 250px;
}

.event-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-btn {
  background-color: #2196f3;
  color: white;
  margin-bottom: 16px;
}

.add-btn:hover {
  background-color: #1976d2;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
}

.edit-btn:hover {
  background-color: #45a049;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.save-btn {
  background-color: #2196f3;
  color: white;
  margin-top: 10px;
}

.save-btn:hover {
  background-color: #1e88e5;
}

.event-form {
  background: #f0f0f0;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  max-width: 600px;
}

.event-form input,
.event-form textarea {
  display: block;
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.image-upload-label {
  display: inline-block;
  background-color: #2196f3;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

.image-upload-input {
  display: none;
}

.image-preview {
  margin-top: 10px;
}

.preview-img {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.url-input {
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
