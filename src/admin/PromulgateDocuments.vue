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

.open-modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 35, 126, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background: #fff;
  padding: 35px;
  border-radius: 20px;
  width: 90%;
  max-width: 650px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-container h2 {
  color: #1a237e;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: 0.5px;
}

.form-container {
  display: grid;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 15px;
  font-weight: 600;
  color: #1a237e;
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
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #3949ab;
  box-shadow: 0 0 0 4px rgba(57, 73, 171, 0.1);
  outline: none;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

/* Buttons */
.submit-button,
.cancel-button {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button {
  background: linear-gradient(135deg, #1a237e, #3949ab);
  color: #fff;
  box-shadow: 0 4px 15px rgba(26, 35, 126, 0.2);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 35, 126, 0.3);
}

.cancel-button {
  background: #f5f7fa;
  color: #1a237e;
  border: 2px solid #e8eaf6;
}

.cancel-button:hover {
  background: #e8eaf6;
  transform: translateY(-2px);
}

/* Messages */
.message {
  padding: 18px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.message:not(.error) {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  color: #1b5e20;
}

.message.error {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #b71c1c;
}

/* Document List */
.document-banner-list {
  margin-top: 35px;
  display: grid;
  gap: 25px;
}

.document-banner {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e8eaf6;
}

.document-banner:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.document-banner-inner {
  display: flex;
  padding: 30px;
  gap: 30px;
  position: relative;
}

.banner-image {
  width: 160px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.banner-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.banner-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
  letter-spacing: 0.3px;
}

.banner-content {
  font-size: 15px;
  line-height: 1.7;
  color: #455a64;
  margin: 0;
}

.banner-meta {
  font-size: 14px;
  color: #78909c;
  display: flex;
  align-items: center;
  gap: 10px;
}

.banner-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.edit-button,
.delete-button {
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

.edit-button {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1565c0;
}

.edit-button:hover {
  background: linear-gradient(135deg, #bbdefb, #90caf9);
  transform: translateY(-2px);
}

.delete-button {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #c62828;
}

.delete-button:hover {
  background: linear-gradient(135deg, #ffcdd2, #ef9a9a);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .main {
    padding: 25px;
    margin-left: 0;
  }

  .document-banner-inner {
    flex-direction: column;
    padding: 20px;
  }

  .banner-image {
    width: 100%;
    height: 220px;
  }

  .banner-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
