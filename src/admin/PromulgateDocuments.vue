<template>
  <div class="container-dashboard">
    <Dashboard />
    <div class="main">
      <h1>BAN HÀNH VĂN BẢN</h1>

      <!-- Nút để mở form modal thêm tài liệu -->
      <button @click="openAddModal" class="open-modal-button">Ban hành văn bản</button>

      <!-- Form Modal thêm tài liệu -->
      <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
        <div class="modal-container">
          <h2>Ban hành văn bản</h2>
          
          <form @submit.prevent="submitAddDocument" class="form-container">
            <div class="form-group">
              <label for="title">Tiêu đề văn bản:</label>
              <input type="text" id="title" v-model="documentTitle" required />
            </div>

            <div class="form-group">
              <label for="content">Nội dung văn bản:</label>
              <textarea id="content" v-model="documentContent" required></textarea>
            </div>

            <div class="form-group">
              <label for="file">Ảnh đại diện:</label>
              <input type="file" id="file" @change="handleFileUpload" accept="image/*" />
            </div>

            <button type="submit" class="submit-button">Ban hành văn bản</button>
            <button type="button" @click="closeAddModal" class="cancel-button">Hủy</button>
          </form>
        </div>
      </div>

      <!-- Form Modal sửa tài liệu -->
      <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-container">
          <h2>Chỉnh sửa văn bản</h2>
          
          <form @submit.prevent="submitEditDocument" class="form-container">
            <div class="form-group">
              <label for="editTitle">Tiêu đề văn bản:</label>
              <input type="text" id="editTitle" v-model="editDocumentTitle" required />
            </div>

            <div class="form-group">
              <label for="editContent">Nội dung văn bản:</label>
              <textarea id="editContent" v-model="editDocumentContent" required></textarea>
            </div>

            <div class="form-group">
              <label for="editFile">Ảnh đại diện:</label>
              <input type="file" id="editFile" @change="handleEditFileUpload" accept="image/*" />
            </div>

            <button type="submit" class="submit-button">Cập nhật văn bản</button>
            <button type="button" @click="closeEditModal" class="cancel-button">Hủy</button>
          </form>
        </div>
      </div>

      <!-- Hiển thị thông báo thành công -->
      <div class="message" v-if="success">{{ success }}</div>

      <!-- Hiển thị thông báo lỗi -->
      <div class="message error" v-if="error">{{ error }}</div>

      <!-- 📢 Thông báo tài liệu -->
      <div v-if="eventStore.documentList && eventStore.documentList.length > 0" class="document-banner-list">
        <div v-for="(document, index) in eventStore.documentList" :key="index" class="document-banner">
          <div class="document-banner-inner">
            <img :src="document.urlAvatar" alt="Ảnh tài liệu" class="banner-image" />
            <div class="banner-text">
              <h2 class="banner-title">📢 {{ document.documentTitle }}</h2>
              <p class="banner-content">{{ document.documentContent }}</p>
              <p class="banner-meta">🧑 {{ document.userName }} - {{ formatDate(document.createAt) }}</p>
            </div>
            <!-- Nút Sửa và Xóa -->
            <div class="banner-actions">
              <button @click="editDocument(document)" class="edit-button">Sửa</button>
              <button @click="deleteDocument(document.id)" class="delete-button">Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nếu không có tài liệu -->
      <div v-else>
        <p>Chưa có tài liệu nào được ban hành.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePromulgateDocuments } from "../StoreAdmin/PromulgateDocuments";
import { useEventStore } from "../store/EventStore"; 
import Dashboard from "./Dashboard.vue";
import "../assets/css/Dashboard.css";

// Gọi store
const promulgateDocumentsStore = usePromulgateDocuments(); 
const { addDocument, updateDocument, deleteDocument: deleteDoc, error, success } = promulgateDocumentsStore;

// Lấy store chứa danh sách tài liệu
const eventStore = useEventStore();
const { getDocumentList, documentList } = eventStore;

// Form state
const documentTitle = ref("");
const documentContent = ref("");
const file = ref(null);

// State for Modal
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

// Edit form state
const editDocumentTitle = ref("");
const editDocumentContent = ref("");
const editFile = ref(null);

// State for selected document to edit
let selectedDocument = ref(null);

// Chọn file
const handleFileUpload = (e) => {
  file.value = e.target.files[0];
};

const handleEditFileUpload = (e) => {
  editFile.value = e.target.files[0];
};

// Submit form - Thêm tài liệu
const submitAddDocument = async () => {
  const documentData = {
    documentTitle: documentTitle.value,
    documentContent: documentContent.value,
  };

  await addDocument(documentData, file.value); 

  if (!promulgateDocumentsStore.error) {
    resetAddForm();
    closeAddModal();
    getDocumentList();
  }
};

// Submit form - Sửa tài liệu
const submitEditDocument = async () => {
  try {
    const documentData = {
      id: selectedDocument.value.id,
      documentTitle: editDocumentTitle.value,
      documentContent: editDocumentContent.value,
    };

    await updateDocument(documentData, editFile.value);

    if (!promulgateDocumentsStore.error) {
      resetEditForm();
      closeEditModal();
      // Sử dụng setTimeout để tránh block UI
      setTimeout(() => {
        getDocumentList();
      }, 0);
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật tài liệu:', err);
  }
};

// Gọi getDocumentList khi component được mount
onMounted(() => {
  getDocumentList(); 
});

// Format ngày
const formatDate = (date) => {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString(); 
};

// Hàm chỉnh sửa tài liệu
const editDocument = (document) => {
  selectedDocument.value = document;
  editDocumentTitle.value = document.documentTitle;
  editDocumentContent.value = document.documentContent;
  editFile.value = null; // Reset file khi mở modal sửa
  isEditModalOpen.value = true;
};

// Hàm xóa tài liệu
const deleteDocument = async (documentId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
    return;
  }

  try {
    await deleteDoc(documentId);
    if (!promulgateDocumentsStore.error) {
      // Sử dụng setTimeout để tránh block UI
      setTimeout(() => {
        getDocumentList();
      }, 0);
    }
  } catch (err) {
    console.error('Lỗi khi xóa tài liệu:', err);
  }
};

// Hàm mở modal thêm tài liệu
const openAddModal = () => {
  isAddModalOpen.value = true;
};

// Hàm đóng modal thêm tài liệu
const closeAddModal = () => {
  isAddModalOpen.value = false;
};

// Hàm mở modal sửa tài liệu
const openEditModal = () => {
  isEditModalOpen.value = true;
};

// Hàm đóng modal sửa tài liệu
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// Reset form thêm tài liệu
const resetAddForm = () => {
  documentTitle.value = "";
  documentContent.value = "";
  file.value = null;
};

// Reset form sửa tài liệu
const resetEditForm = () => {
  editDocumentTitle.value = "";
  editDocumentContent.value = "";
  editFile.value = null;
};
</script>

<style scoped>
/* Style cho form container */
.form-container {
  margin-top: 20px;
  max-width: 600px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

textarea {
  resize: vertical;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
}

.cancel-button:hover {
  background-color: #e53935;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.message {
  margin-top: 20px;
  font-weight: bold;
  color: green;
}

.error {
  color: red;
}

/* Styles for document list */
.document-banner-list {
  margin-top: 40px;
}

.document-banner {
  display: flex;
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.document-banner-inner {
  display: flex;
  width: 100%;
}

.banner-image {
  max-width: 200px;
  height: auto;
  margin-right: 16px;
}

.banner-text {
  flex-grow: 1;
}

.banner-title {
  font-size: 20px;
  font-weight: bold;
}

.banner-content {
  margin-top: 8px;
}

.banner-meta {
  margin-top: 16px;
  font-size: 14px;
  color: gray;
}

/* Căn chỉnh các nút Sửa và Xóa sát nhau */
.banner-actions {
  display: flex;
  flex-direction: row; /* Đặt các nút ngang */
  align-items: center; /* Căn giữa các nút theo chiều dọc */
  justify-content: flex-start; /* Căn trái các nút */
  gap: 10px; /* Khoảng cách giữa các nút */
}

.edit-button,
.delete-button {
  background-color: #4caf50;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
}

.delete-button:hover {
  background-color: #e53935;
}

.open-modal-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
}

.open-modal-button:hover {
  background-color: #45a049;
}
</style>
