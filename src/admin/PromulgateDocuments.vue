<template>
  <div class="container-dashboard">
    <Dashboard />
    <div class="main">
      <h1>BAN HÀNH THÔNG BÁO CHUNG</h1>

      <!-- Nút để mở form modal thêm tài liệu -->
      <button @click="openAddModal" class="open-modal-button">Thêm thông báo chung</button>

      <!-- Hiển thị thông báo -->
      <transition name="fade">
        <div v-if="notification.show" 
             :class="['message', { error: notification.type === 'error' }]">
          {{ notification.message }}
        </div>
      </transition>

      <!-- Form Modal thêm tài liệu -->
      <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
        <div class="modal-container">
          <h2>Ban hành thông báo chung</h2>
          
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

            <button type="submit" class="submit-button">Thêm thông báo</button>
            <button type="button" @click="closeAddModal" class="cancel-button">Hủy</button>
          </form>
        </div>
      </div>

      <!-- Form Modal sửa tài liệu -->
      <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-container">
          <h2>Chỉnh sửa thông báo</h2>
          
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

            <button type="submit" class="submit-button">Cập nhật thông báo</button>
            <button type="button" @click="closeEditModal" class="cancel-button">Hủy</button>
          </form>
        </div>
      </div>

      <!-- 📢 Thông báo tài liệu -->
      <div v-if="promulgateDocumentsStore.documentList && promulgateDocumentsStore.documentList.length > 0" class="document-banner-list">
        <div v-for="(document, index) in promulgateDocumentsStore.documentList" :key="index" class="document-banner">
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
        <div class="document-pagination">
          <button 
            class="pagination-btn prev"
            @click="goToPageDocument(documentStore.documentPagination.currentPage - 1)"
            :disabled="documentStore.documentPagination.currentPage === 1"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="page-info">
            Trang {{ documentStore.documentPagination.currentPage }} / {{ documentStore.documentPagination.totalPages }}
          </span>
          <button 
            class="pagination-btn next"
            @click="goToPageDocument(documentStore.documentPagination.currentPage + 1)"
            :disabled="documentStore.documentPagination.currentPage === documentStore.documentPagination.totalPages"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
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
import Dashboard from "./Dashboard.vue";
import "../assets/css/Dashboard.css";

// Gọi store
const promulgateDocumentsStore = usePromulgateDocuments(); 
const { addDocument, updateDocument, deleteDocument: deleteDoc } = promulgateDocumentsStore;

// Lấy store chứa danh sách tài liệu
const documentStore = usePromulgateDocuments();
const { getDocumentList, documentList } = documentStore;

// Notification state
const notification = ref({
  message: '',
  type: '', // 'success' or 'error'
  show: false
});

// Show notification function
const showNotification = (message, type = 'success') => {
  notification.value = {
    message,
    type,
    show: true
  };
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const goToPageDocument = async (page) => {
  if (page >= 1 && page <= documentStore.documentPagination.totalPages) {
    await documentStore.goToDocumentPage(page);
  }
};

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
  try {
    const documentData = {
      documentTitle: documentTitle.value,
      documentContent: documentContent.value,
    };

    const result = await addDocument(documentData, file.value);
    
    if (result) {
      showNotification('Thêm văn bản thành công!', 'success');
      resetAddForm();
      closeAddModal();
      getDocumentList();
    }
  } catch (err) {
    console.error('Lỗi khi thêm tài liệu:', err);
    showNotification('Có lỗi xảy ra khi thêm văn bản!', 'error');
  }
};

// Hàm chỉnh sửa tài liệu
const editDocument = (document) => {
  selectedDocument.value = document;
  editDocumentTitle.value = document.documentTitle;
  editDocumentContent.value = document.documentContent;
  editFile.value = null; // Reset file khi mở modal sửa
  isEditModalOpen.value = true;
};

// Submit form - Sửa tài liệu
const submitEditDocument = async () => {
  try {
    const documentData = {
      id: selectedDocument.value.id,
      documentTitle: editDocumentTitle.value,
      documentContent: editDocumentContent.value,
    };

    const result = await updateDocument(documentData, editFile.value);
    
    if (result) {
      showNotification('Cập nhật văn bản thành công!', 'success');
      resetEditForm();
      closeEditModal();
      getDocumentList();
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật tài liệu:', err);
    showNotification('Có lỗi xảy ra khi cập nhật văn bản!', 'error');
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


// Hàm xóa tài liệu
const deleteDocument = async (documentId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
    return;
  }

  try {
    const result = await deleteDoc(documentId);
    if (result) {
      showNotification('Xóa văn bản thành công!', 'success');
      getDocumentList();
    }
  } catch (err) {
    console.error('Lỗi khi xóa tài liệu:', err);
    showNotification('Có lỗi xảy ra khi xóa văn bản!', 'error');
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
  margin: 25px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease;
}

.message:not(.error) {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  color: #1b5e20;
}

.message.error {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #b71c1c;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.document-banner:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.document-banner-inner {
  display: flex;
  justify-content: center;
  align-items: center;
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
  min-width: 0;
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

/* Notification Styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: 600;
  z-index: 9999;
  animation: slideIn 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification.success {
  background: #4caf50;
  color: white;
}

.notification.error {
  background: #f44336;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
