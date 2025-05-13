<template>
  <div class="container-dashboard">
    <Dashboard />
    <div class="main">
      <h1>QUẢN LÍ SỰ KIỆN</h1>

      <!-- Nút Thêm sự kiện -->
      <button class="btn add-btn" @click="showForm = !showForm">
        {{ showForm ? "Đóng form" : "+ Thêm sự kiện" }}
      </button>

      <!-- Form tạo mới -->
      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal-container">
          <h3>Thêm sự kiện mới</h3>
          <form @submit.prevent="addEvent">
            <div class="form-group">
              <label for="eventName">Tên sự kiện</label>
              <input
                id="eventName"
                v-model="newEvent.eventName"
                placeholder="Nhập tên sự kiện"
                required
              />
            </div>

            <div class="form-group">
              <label for="eventStartDate">Ngày bắt đầu</label>
              <input
                id="eventStartDate"
                v-model="newEvent.eventStartDate"
                type="date"
                required
              />
            </div>

            <div class="form-group">
              <label for="eventEndDate">Ngày kết thúc</label>
              <input
                id="eventEndDate"
                v-model="newEvent.eventEndDate"
                type="date"
                required
              />
            </div>

            <div class="form-group">
              <label for="eventLocation">Địa điểm</label>
              <input
                id="eventLocation"
                v-model="newEvent.eventLocation"
                placeholder="Nhập địa điểm"
                required
              />
            </div>

            <div class="form-group">
              <label for="description">Mô tả sự kiện</label>
              <textarea
                id="description"
                v-model="newEvent.description"
                placeholder="Nhập mô tả sự kiện"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
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
            </div>

            <div class="form-group">
              <label for="urlAvatar">Hoặc nhập URL ảnh</label>
              <input
                id="urlAvatar"
                v-model="newEvent.urlAvatar"
                type="text"
                placeholder="Nhập URL ảnh"
                class="url-input"
              />
            </div>

            <div v-if="imagePreview || newEvent.urlAvatar" class="image-preview">
              <img
                :src="imagePreview || newEvent.urlAvatar"
                alt="Ảnh sự kiện"
                class="preview-img"
              />
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn save-btn">Lưu</button>
              <button type="button" class="btn cancel-btn" @click="showForm = false">Hủy</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Form chỉnh sửa -->
      <div v-if="editFormVisible" class="modal-overlay" @click.self="editFormVisible = false">
        <div class="modal-container">
          <h3>Chỉnh sửa sự kiện</h3>
          <form @submit.prevent="updateEvent">
            <div class="form-group">
              <label for="editEventName">Tên sự kiện</label>
              <input
                id="editEventName"
                v-model="editEventData.eventName"
                placeholder="Nhập tên sự kiện"
                required
              />
            </div>

            <div class="form-group">
              <label for="editEventStartDate">Ngày bắt đầu</label>
              <input
                id="editEventStartDate"
                v-model="editEventData.eventStartDate"
                type="date"
                required
              />
            </div>

            <div class="form-group">
              <label for="editEventEndDate">Ngày kết thúc</label>
              <input
                id="editEventEndDate"
                v-model="editEventData.eventEndDate"
                type="date"
                required
              />
            </div>

            <div class="form-group">
              <label for="editEventLocation">Địa điểm</label>
              <input
                id="editEventLocation"
                v-model="editEventData.eventLocation"
                placeholder="Nhập địa điểm"
                required
              />
            </div>

            <div class="form-group">
              <label for="editDescription">Mô tả sự kiện</label>
              <textarea
                id="editDescription"
                v-model="editEventData.description"
                placeholder="Nhập mô tả sự kiện"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
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
            </div>

            <div class="form-group">
              <label for="editUrlAvatar">Hoặc nhập URL ảnh</label>
              <input
                id="editUrlAvatar"
                v-model="editEventData.urlAvatar"
                type="text"
                placeholder="Nhập URL ảnh"
                class="url-input"
              />
            </div>

            <div v-if="editImagePreview || editEventData.urlAvatar" class="image-preview">
              <img
                :src="editImagePreview || editEventData.urlAvatar"
                alt="Ảnh sự kiện"
                class="preview-img"
              />
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn save-btn">Cập nhật</button>
              <button type="button" class="btn cancel-btn" @click="editFormVisible = false">Hủy</button>
            </div>
          </form>
        </div>
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
.add-btn {
  background: linear-gradient(135deg, #1a237e, #3949ab);
  color: #fff;
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(26, 35, 126, 0.2);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 35, 126, 0.3);
}

.event-form {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  margin: 25px 0;
  border: 1px solid #e8eaf6;
}

.event-form h3 {
  color: #1a237e;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  letter-spacing: 0.3px;
}

.event-form input,
.event-form textarea,
.event-form .url-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e8eaf6;
  border-radius: 12px;
  font-size: 15px;
  background: #fff;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.event-form input:focus,
.event-form textarea:focus {
  border-color: #3949ab;
  box-shadow: 0 0 0 4px rgba(57, 73, 171, 0.1);
  outline: none;
}

.event-form textarea {
  min-height: 120px;
  resize: vertical;
}

.image-upload-label {
  display: inline-block;
  padding: 12px 24px;
  background: #e8eaf6;
  color: #1a237e;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.image-upload-label:hover {
  background: #c5cae9;
  transform: translateY(-2px);
}

.image-upload-input {
  display: none;
}

.url-input {
  margin-top: 16px;
}

.image-preview {
  margin: 20px 0;
  max-width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.preview-img {
  width: 100%;
  height: auto;
  display: block;
}

.event-list {
  list-style: none;
  padding: 0;
  margin-top: 30px;
  display: grid;
  gap: 25px;
}

.event-item {
  background: #fff;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 25px;
  transition: all 0.3s ease;
  border: 1px solid #e8eaf6;
}

.event-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.event-image {
  width: 180px;
  height: 180px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-content h3 {
  color: #1a237e;
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.3px;
}

.event-content p {
  color: #455a64;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.event-content strong {
  color: #1a237e;
  font-weight: 600;
}

.event-actions {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.edit-btn,
.delete-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1565c0;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #bbdefb, #90caf9);
  transform: translateY(-2px);
}

.delete-btn {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #c62828;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #ffcdd2, #ef9a9a);
  transform: translateY(-2px);
}

.error-message {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #b71c1c;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .main {
    padding: 25px;
  }

  .event-item {
    flex-direction: column;
    padding: 20px;
  }

  .event-image {
    width: 100%;
    height: 220px;
  }

  .event-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-container h3 {
  color: #1a237e;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
  letter-spacing: 0.3px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1a237e;
  font-weight: 500;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
}

.save-btn {
  background: linear-gradient(135deg, #1a237e, #3949ab);
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(26, 35, 126, 0.2);
}

.cancel-btn {
  background: #f5f7fa;
  color: #1a237e;
  padding: 12px 24px;
  border: 2px solid #e8eaf6;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e8eaf6;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}

/* Form Styles Enhancement */
.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #1a237e;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e8eaf6;
  border-radius: 12px;
  font-size: 15px;
  background: #fff;
  transition: all 0.3s ease;
  color: #1a237e;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #3949ab;
  box-shadow: 0 0 0 4px rgba(57, 73, 171, 0.1);
  outline: none;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9fa8da;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.6;
}

/* Date Input Styling */
.form-group input[type="date"] {
  color: #1a237e;
  font-family: inherit;
  cursor: pointer;
}

.form-group input[type="date"]::-webkit-calendar-picker-indicator {
  background-color: #3949ab;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
  filter: invert(1);
}

/* Image Upload Enhancement */
.image-upload-label {
  display: inline-block;
  padding: 14px 28px;
  background: linear-gradient(135deg, #e8eaf6, #c5cae9);
  color: #1a237e;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  border: 2px dashed #9fa8da;
}

.image-upload-label:hover {
  background: linear-gradient(135deg, #c5cae9, #9fa8da);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(26, 35, 126, 0.1);
}

.image-preview {
  margin: 20px 0;
  max-width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid #e8eaf6;
  transition: all 0.3s ease;
}

.image-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.preview-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* Modal Actions Enhancement */
.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 35px;
  padding-top: 20px;
  border-top: 2px solid #e8eaf6;
}

.save-btn {
  background: linear-gradient(135deg, #1a237e, #3949ab);
  color: #fff;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 35, 126, 0.2);
}

.cancel-btn {
  background: #f5f7fa;
  color: #1a237e;
  padding: 14px 28px;
  border: 2px solid #e8eaf6;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cancel-btn:hover {
  background: #e8eaf6;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* Modal Container Enhancement */
.modal-container {
  background: #fff;
  padding: 35px;
  border-radius: 20px;
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  border: 1px solid #e8eaf6;
}

.modal-container h3 {
  color: #1a237e;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 15px;
}

.modal-container h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #1a237e, #3949ab);
  border-radius: 4px;
}

/* Scrollbar Styling */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #c5cae9;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #9fa8da;
}

/* Responsive Enhancements */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    padding: 25px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group input,
  .form-group textarea {
    padding: 12px 16px;
  }

  .modal-actions {
    flex-direction: column;
    gap: 12px;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
    padding: 12px 24px;
  }

  .image-preview {
    max-width: 100%;
  }
}
</style>
