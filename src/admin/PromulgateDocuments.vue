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
.open-modal-button {
  background-color: #00695c;
  color: #fff;
  padding: 14px 24px;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.open-modal-button:hover {
  background-color: #004d40;
  transform: scale(1.05);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  pointer-events: none; /* Ngăn không cho click ra ngoài */
}

.modal-container {
  background: #fefefe;
  padding: 40px 35px;
  border-radius: 24px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease;
  pointer-events: all; /* Cho phép click vào modal */
}

@keyframes slideUp {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

h2 {
  margin-bottom: 24px;
  font-size: 28px;
  text-align: center;
  color: #004d40;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.form-group label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 15px;
  background: #f9f9f9;
  transition: border 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border: 1px solid #00695c;
  box-shadow: 0 0 8px rgba(0, 105, 92, 0.4);
  outline: none;
}

textarea {
  resize: both;
  min-height: 120px;
  max-width: 530px;
}

/* Submit and Cancel Buttons */
.submit-button, .cancel-button {
  padding: 12px 18px;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button {
  background-color: #00796b;
  color: #fff;
}

.submit-button:hover {
  background-color: #004d40;
  transform: translateY(-2px);
}

.cancel-button {
  background-color: #d32f2f;
  color: #fff;
}

.cancel-button:hover {
  background-color: #b71c1c;
  transform: translateY(-2px);
}

/* Messages */
.message {
  margin-top: 20px;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  background: #e0f2f1;
  color: #00695c;
}

.message.error {
  background: #ffebee;
  color: #c62828;
}

/* Document List */
.document-banner-list {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.document-banner {
  background: #fafafa;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.document-banner:hover {
  transform: translateY(-5px);
}

.document-banner-inner {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  gap: 16px;
}

.banner-image {
  width: 120px;  /* Tăng kích thước hình ảnh */
  height: 120px; /* Tăng kích thước hình ảnh */
  border-radius: 16px;
  object-fit: cover;
  background: #eee;
  flex-shrink: 0;
  margin: auto;    /* Căn giữa */
  display: block;  /* Căn giữa */
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 22px;
  font-weight: bold;
  color: #00695c;
  margin-bottom: 6px;
}

.banner-content {
  font-size: 16px;
  text-align: justify;
  line-height: 2rem;
  color: #666;
  margin-bottom: 8px;
}

.banner-meta {
  font-size: 13px;
  color: #aaa;
}

/* Edit and Delete Buttons */
.banner-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-button, .delete-button {
  padding: 8px 14px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button {
  background-color: #0288d1;
  color: #fff;
}

.edit-button:hover {
  background-color: #0277bd;
  transform: scale(1.05);
}

.delete-button {
  background-color: #e53935;
  color: #fff;
}

.delete-button:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}

</style>
