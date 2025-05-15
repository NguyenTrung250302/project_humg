<template>
  <div class="container-dashboard">
    <Dashboard></Dashboard>
    <div class="main">
      <h1>PHÊ DUYỆT ĐỀ XUẤT KHEN THƯỞNG KỶ LUẬT</h1>
      
      <div class="proposal-list-container">
        <!-- Tab navigation -->
        <div class="tab-navigation">
          <button 
            :class="['tab-button', { active: activeTab === 'reward' }]"
            @click="activeTab = 'reward'"
          >
            <i class="fas fa-award"></i>
            Khen thưởng
          </button>
          <button 
            :class="['tab-button', { active: activeTab === 'discipline' }]"
            @click="activeTab = 'discipline'"
          >
            <i class="fas fa-gavel"></i>
            Kỷ luật
          </button>
        </div>

        <!-- Thông báo lỗi nếu có -->
        <div v-if="rewardDisciplineStore.error" class="error-message">
          {{ rewardDisciplineStore.error }}
        </div>
        
        <!-- Thông báo trống -->
        <div v-else-if="filteredProposals.length === 0" class="empty-message">
          Không có đề xuất {{ activeTab === 'reward' ? 'khen thưởng' : 'kỷ luật' }} nào đang chờ phê duyệt.
        </div>
        
        <!-- Danh sách đề xuất -->
        <div v-else class="proposal-list">
          <div v-for="item in filteredProposals" :key="item.id" class="proposal-card" :class="{ 'reward': item.rewardOrDiscipline, 'discipline': !item.rewardOrDiscipline }">
            <div class="proposal-header">
              <h3>{{ item.rewardOrDiscipline ? 'Khen thưởng' : 'Kỷ luật' }}</h3>
              <span class="proposal-date">{{ formatDate(item.createDate) }}</span>
            </div>
            
            <div class="proposal-body">
              <div class="proposal-info">
                <p><strong>Người đề xuất:</strong> {{ item.proposerName }}</p>
                <p><strong>Lớp:</strong> {{ item.class }}</p>
                <p><strong>Mô tả:</strong> {{ item.description }}</p>
              </div>
              
              <div class="proposal-file">
                <a href="#" class="view-document" @click.prevent="showDocumentModal(item.urlDecodeFile)">
                  <i class="fas fa-file-excel"></i> Xem tài liệu Excel
                </a>
              </div>
            </div>
            
            <div class="proposal-actions">
              <button class="btn-approve" @click="confirmProposal(item.id, true)">
                <i class="fas fa-check"></i> Phê duyệt
              </button>
              <button class="btn-reject" @click="showRejectModal(item.id)">
                <i class="fas fa-times"></i> Từ chối & Xóa
              </button>
            </div>
          </div>
        </div>
        
        <!-- Phân trang -->
        <div class="pagination" v-if="rewardDisciplineStore.waitingPagination.totalPages.value > 1">
          <button 
            :disabled="rewardDisciplineStore.waitingPagination.currentPage.value === 1"
            @click="rewardDisciplineStore.goToPageWaiting(rewardDisciplineStore.waitingPagination.currentPage.value - 1)"
          >
            &laquo; Trước
          </button>
          
          <span 
            v-for="pageNum in rewardDisciplineStore.waitingPagination.totalPages.value" 
            :key="pageNum"
            :class="{ active: pageNum === rewardDisciplineStore.waitingPagination.currentPage.value }"
            @click="rewardDisciplineStore.goToPageWaiting(pageNum)"
          >
            {{ pageNum }}
          </span>
          
          <button 
            :disabled="rewardDisciplineStore.waitingPagination.currentPage.value === rewardDisciplineStore.waitingPagination.totalPages.value"
            @click="rewardDisciplineStore.goToPageWaiting(rewardDisciplineStore.waitingPagination.currentPage.value + 1)"
          >
            Sau &raquo;
          </button>
        </div>
      </div>
      
      <!-- Modal từ chối -->
      <div v-if="showRejectForm" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Từ chối và xóa đề xuất</h2>
            <button class="close-button" @click="showRejectForm = false">&times;</button>
          </div>
          
          <div class="form-group">
            <label for="rejectReason">Lý do từ chối <span class="required">*</span></label>
            <textarea 
              id="rejectReason" 
              v-model="rejectReason" 
              rows="4" 
              placeholder="Nhập lý do từ chối..."
              required
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button class="cancel-button" @click="showRejectForm = false">Hủy</button>
            <button class="submit-button" @click="showConfirmDialog">Xác nhận từ chối và xóa</button>
          </div>
        </div>
      </div>
      
      <!-- Modal xác nhận xóa -->
      <div v-if="showConfirmDelete" class="modal-overlay">
        <div class="modal-content confirm-delete-modal">
          <div class="modal-header">
            <h2>Xác nhận xóa</h2>
            <button class="close-button" @click="showConfirmDelete = false">&times;</button>
          </div>
          
          <div class="confirm-delete-content">
            <div class="warning-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <p>Bạn có chắc chắn muốn từ chối và xóa đề xuất này?</p>
            <p class="warning-text">Hành động này không thể hoàn tác!</p>
          </div>
          
          <div class="form-actions">
            <button class="cancel-button" @click="showConfirmDelete = false">
              <i class="fas fa-times"></i> Hủy bỏ
            </button>
            <button class="delete-button" @click="handleConfirmDelete">
              <i class="fas fa-trash-alt"></i> Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal xem tài liệu -->
      <div v-if="showDocumentPreview" class="modal-overlay">
        <div class="modal-content document-modal">
          <div class="modal-header">
            <h2>Xem tài liệu</h2>
            <button class="close-button" @click="showDocumentPreview = false">&times;</button>
          </div>
          <div class="document-preview-container">
            <div v-if="isDocLoading" class="doc-loading">
              <div class="spinner"></div>
              <p>Đang tải tài liệu...</p>
            </div>
            <iframe 
              :src="previewUrl"
              frameborder="0"
              @load="handleIframeLoaded"
              @error="handleIframeError"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
              referrerpolicy="no-referrer"
              style="width:100%; height:calc(100% - 60px); margin-bottom: 60px; background-color: white;"
              allow="fullscreen clipboard-read clipboard-write"
              importance="high"
            ></iframe>
            
            <div v-if="isViewerFailed" class="fallback-content">
              {{ fallbackContent }}
              <p class="browser-tip">
                <i class="fas fa-lightbulb"></i> Gợi ý: Hãy sử dụng nút "Mở trong Office Online" bên dưới để xem tài liệu trực tiếp từ Microsoft Office Online.
              </p>
            </div>
            
            <div class="preview-actions">
              <button @click="retryLoading" class="preview-action-btn toggle-btn">
                <i class="fas fa-sync-alt"></i> Tải lại
              </button>
              
              <a v-if="previewUrl.includes('view.officeapps.live.com')" 
                 :href="'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(originalUrl)" 
                 target="_blank" 
                 class="preview-action-btn office-btn">
                <i class="fas fa-file-excel"></i> Mở trong Office Online
              </a>
              
              <a :href="originalUrl" download class="preview-action-btn download-btn">
                <i class="fas fa-download"></i> Tải xuống
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Dashboard from "./Dashboard.vue";
import "../assets/css/Dashboard.css";
import { useRewardDisciplineStore } from "../store/RewardDisciplineStore";
import { urlHost } from '../UrlApiHostStore/ApiHostStore';

const rewardDisciplineStore = useRewardDisciplineStore();

// Biến cho modal từ chối
const showRejectForm = ref(false);
const rejectReason = ref('');
const selectedProposalId = ref(null);
const showConfirmDelete = ref(false);

// Biến cho modal xem tài liệu
const showDocumentPreview = ref(false);
const previewUrl = ref('');
const isDocLoading = ref(true);
const isViewerFailed = ref(false);
const fallbackContent = ref('');
const originalUrl = ref('');

const activeTab = ref('reward');

// Filter proposals based on active tab
const filteredProposals = computed(() => {
  return rewardDisciplineStore.listWaiting.filter(item => {
    return activeTab.value === 'reward' ? item.rewardOrDiscipline : !item.rewardOrDiscipline;
  });
});

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Hiện modal từ chối
const showRejectModal = (proposalId) => {
  selectedProposalId.value = proposalId;
  rejectReason.value = '';
  showRejectForm.value = true;
};

// Hiện modal xem tài liệu
const showDocumentModal = (url) => {
  if (!url) {
    alert('Không tìm thấy tài liệu để xem!');
    return;
  }
  
  // Kiểm tra và đảm bảo url là URL hợp lệ
  try {
    new URL(url);
  } catch (e) {
    console.error('URL không hợp lệ:', url);
    alert('URL tài liệu không hợp lệ!');
    return;
  }
  
  previewUrl.value = url;
  
  // Nếu là URL Office Online Viewer, lấy URL gốc cho nút tải xuống
  if (url.includes('view.officeapps.live.com') && url.includes('src=')) {
    try {
      const srcParam = new URL(url).searchParams.get('src');
      if (srcParam) {
        originalUrl.value = decodeURIComponent(srcParam);
      } else {
        originalUrl.value = url;
      }
    } catch (e) {
      originalUrl.value = url;
    }
  } else {
    originalUrl.value = url;
  }
  
  isDocLoading.value = true;
  isViewerFailed.value = false;
  fallbackContent.value = '';
  showDocumentPreview.value = true;
};

// Hiện dialog xác nhận xóa
const showConfirmDialog = () => {
  if (!rejectReason.value.trim()) {
    window.$dialog.fail('Vui lòng nhập lý do từ chối.');
    return;
  }
  showConfirmDelete.value = true;
};

// Xử lý khi xác nhận xóa
const handleConfirmDelete = async () => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'accept': '*/*'
    };

    const formData = new FormData();
    formData.append('proposeId', selectedProposalId.value);

    const response = await fetch(`${urlHost}/api/Controller_RewardDiscipline/Delete_Reward_Discipline`, {
      method: 'DELETE',
      headers,
      body: formData
    });

    if (response.ok) {
      await rewardDisciplineStore.GetListWaiting();
      showRejectForm.value = false;
      showConfirmDelete.value = false;
      rejectReason.value = '';
      selectedProposalId.value = null;
      window.$dialog.success('Đã từ chối và xóa đề xuất thành công!');
    } else {
      const errorData = await response.json();
      window.$dialog.fail(`Có lỗi xảy ra: ${errorData.message || errorData.title || 'Vui lòng thử lại sau'}`);
    }
  } catch (error) {
    console.error('Lỗi khi xử lý đề xuất:', error);
    window.$dialog.fail('Có lỗi xảy ra. Vui lòng thử lại sau!');
  }
};

// Xác nhận hoặc từ chối đề xuất
const confirmProposal = async (proposalId, isApproved) => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'accept': '*/*'
    };

    let response;
    if (isApproved) {
      // Gọi API chấp nhận đề xuất
      const formData = new FormData();
      formData.append('proposeId', proposalId);

      response = await fetch(`${urlHost}/api/Controller_RewardDiscipline/Accept_Propose`, {
        method: 'PUT',
        headers,
        body: formData
      });
    } else {
      // Gọi API xóa đề xuất (từ chối)
      if (!rejectReason.value.trim()) {
        window.$dialog.fail('Vui lòng nhập lý do từ chối.');
        return;
      }
      
      // Xác nhận trước khi xóa
      if (!confirm('Bạn có chắc chắn muốn từ chối và xóa đề xuất này? Hành động này không thể hoàn tác.')) {
        return;
      }

      const formData = new FormData();
      formData.append('proposeId', proposalId);

      response = await fetch(`${urlHost}/api/Controller_RewardDiscipline/Delete_Reward_Discipline`, {
        method: 'DELETE',
        headers,
        body: formData
      });
    }

    if (response.ok) {
      // Reload danh sách sau khi xử lý thành công
      await rewardDisciplineStore.GetListWaiting();
      
      // Đóng modal nếu đang mở
      showRejectForm.value = false;
      
      // Reset form
      rejectReason.value = '';
      selectedProposalId.value = null;
      
      window.$dialog.success(isApproved ? 'Đã phê duyệt đề xuất thành công!' : 'Đã từ chối và xóa đề xuất thành công!');
    } else {
      const errorData = await response.json();
      window.$dialog.fail(`Có lỗi xảy ra: ${errorData.message || errorData.title || 'Vui lòng thử lại sau'}`);
    }
  } catch (error) {
    console.error('Lỗi khi xử lý đề xuất:', error);
    window.$dialog.fail('Có lỗi xảy ra. Vui lòng thử lại sau!');
  }
};

// Load dữ liệu khi component được tạo
onMounted(async () => {
  await rewardDisciplineStore.GetListWaiting();
});

// Handle iframe loaded event
const handleIframeLoaded = () => {
  isDocLoading.value = false;
};

// Handle iframe load error
const handleIframeError = () => {
  isDocLoading.value = false;
  isViewerFailed.value = true;
  console.error('Không thể tải tài liệu trong iframe:', previewUrl.value);
  
  if (previewUrl.value.includes('view.officeapps.live.com')) {
    fallbackContent.value = 'Microsoft Office Viewer không thể hiển thị tài liệu trong khung này. Vui lòng sử dụng các tùy chọn bên dưới.';
  } else {
    fallbackContent.value = 'Không thể hiển thị tài liệu. Vui lòng sử dụng các tùy chọn xem khác bên dưới.';
  }
};

// Retry loading if viewer fails
const retryLoading = () => {
  isDocLoading.value = true;
  isViewerFailed.value = false;
  
  // Force reload iframe
  const currentUrl = previewUrl.value;
  previewUrl.value = '';
  
  setTimeout(() => {
    previewUrl.value = currentUrl;
  }, 500);
};
</script>

<style scoped>
.proposal-list-container {
  width: 100%;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  overflow: hidden;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-message, .empty-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  border-radius: 12px;
  animation: fadeIn 0.5s ease-in-out;
}

.error-message {
  color: #721c24;
  background: linear-gradient(135deg, rgba(248, 215, 218, 0.9) 0%, rgba(255, 230, 230, 0.9) 100%);
  border-left: 4px solid #dc3545;
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.1);
}

.empty-message {
  color: #6c757d;
  background-color: #f8f9fa;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-message::before {
  content: '📋';
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.proposal-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 1.5rem;
  perspective: 1000px;
}

.proposal-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  transform-style: preserve-3d;
  border: none;
  animation: slideIn 0.5s ease-out;
}

.proposal-card:hover {
  transform: translateY(-10px) rotateX(3deg);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.proposal-card.reward {
  border-top: 4px solid #28a745;
  background: linear-gradient(to bottom right, #ffffff, #f8fff9);
}

.proposal-card.discipline {
  border-top: 4px solid #dc3545;
  background: linear-gradient(to bottom right, #ffffff, #fff8f8);
}

.proposal-header {
  padding: 1.25rem;
  background: linear-gradient(to right, #f8f9fa, #fff);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f3f5;
}

.proposal-header h3 {
  margin: 0;
  color: #212529;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.proposal-card.reward .proposal-header h3::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #28a745;
  border-radius: 50%;
  margin-right: 8px;
}

.proposal-card.discipline .proposal-header h3::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #dc3545;
  border-radius: 50%;
  margin-right: 8px;
}

.proposal-date {
  font-size: 0.9rem;
  color: #6c757d;
  background-color: #f8f9fa;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.proposal-body {
  padding: 1.5rem;
}

.proposal-info p {
  margin: 0.75rem 0;
  line-height: 1.6;
  color: #495057;
}

.proposal-info p strong {
  color: #212529;
  font-weight: 600;
}

.proposal-file {
  margin-top: 1.25rem;
}

.view-document {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.2rem;
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
  font-weight: 500;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.view-document::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #0056b3, #007bff);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.view-document:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4);
}

.view-document:hover::before {
  opacity: 1;
}

.view-document i {
  font-size: 1.1rem;
}

.proposal-actions {
  display: flex;
  padding: 1.25rem;
  gap: 1rem;
  border-top: 1px solid #f1f3f5;
}

.btn-approve, .btn-reject {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
}

.btn-approve {
  background: linear-gradient(90deg, #28a745, #20c997);
  color: white;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.25);
}

.btn-approve:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(40, 167, 69, 0.35);
}

.btn-reject {
  background: linear-gradient(90deg, #dc3545, #c82333);
  color: white;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.25);
}

.btn-reject:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.35);
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pagination button {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(90deg, #007bff, #0062cc);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.25);
  display: flex;
  align-items: center;
}

.pagination button:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination button:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.35);
}

.pagination span {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background: #f8f9fa;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.pagination span:hover {
  background: #e9ecef;
  transform: scale(1.1);
}

.pagination .active {
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #007bff, #0056b3);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
  transform: scale(1.1);
}

/* Document Preview Modal Styles */
.document-modal {
  max-width: 90%;
  height: 90vh;
  padding: 1.5rem;
  background: #fff;
}

.document-preview-container {
  width: 100%;
  height: calc(100% - 70px); /* Account for modal header */
  border: none;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
  position: relative;
  background-color: #f8f9fa;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.document-preview-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
  border-radius: 8px;
}

.doc-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 123, 255, 0.1);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 15px rgba(0, 123, 255, 0.1);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.doc-loading p {
  margin-top: 1rem;
  color: #212529;
  font-weight: 500;
  font-size: 1.1rem;
}

.preview-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(5px);
  border-radius: 0 0 12px 12px;
  z-index: 5;
}

.preview-action-btn {
  padding: 0.75rem 1.25rem;
  background: linear-gradient(90deg, #007bff, #0062cc);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.25);
  min-width: 140px;
  justify-content: center;
}

.preview-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.35);
}

.download-btn {
  background: linear-gradient(90deg, #28a745, #20c997);
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.25);
}

.download-btn:hover {
  box-shadow: 0 6px 15px rgba(40, 167, 69, 0.35);
}

.toggle-btn {
  background: linear-gradient(90deg, #6c757d, #5a6268);
  box-shadow: 0 4px 10px rgba(108, 117, 125, 0.25);
}

.toggle-btn:hover {
  box-shadow: 0 6px 15px rgba(108, 117, 125, 0.35);
}

.office-btn {
  background: linear-gradient(90deg, #0078d4, #106ebe);
  box-shadow: 0 4px 10px rgba(0, 120, 212, 0.25);
}

.office-btn:hover {
  box-shadow: 0 6px 15px rgba(0, 120, 212, 0.35);
}

.fallback-content {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 243, 205, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%);
  border-radius: 12px;
  color: #856404;
  font-weight: 600;
  margin: 2rem;
  border-left: 4px solid #ffc107;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.browser-tip {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #0c5460;
  background: linear-gradient(135deg, rgba(209, 236, 241, 0.9) 0%, rgba(226, 246, 249, 0.9) 100%);
  border-radius: 10px;
  padding: 1rem;
  display: inline-block;
  font-weight: 500;
  border-left: 4px solid #17a2b8;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  background-image: 
    radial-gradient(circle at top right, rgba(0, 123, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at bottom left, rgba(40, 167, 69, 0.05) 0%, transparent 50%);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-content.document-modal {
  max-width: 90%;
  height: 90vh;
  padding: 1.5rem;
  background: #fff;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f3f5;
  position: relative;
}

.modal-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, #007bff, #28a745);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
  font-weight: 700;
  position: relative;
  padding-left: 15px;
}

.modal-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 70%;
  width: 3px;
  background: linear-gradient(to bottom, #007bff, #28a745);
  border-radius: 3px;
}

.close-button {
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #495057;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background-color: #f8f9fa;
  color: #dc3545;
  transform: rotate(90deg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #495057;
  position: relative;
  padding-left: 15px;
}

.form-group label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background-color: #dc3545;
  border-radius: 50%;
}

.required {
  color: #dc3545;
  margin-left: 3px;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  min-height: 120px;
}

textarea:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
  outline: none;
  background-color: #fff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button {
  padding: 0.8rem 1.5rem;
  background-color: #f1f3f5;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  color: #495057;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.submit-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.25);
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.35);
}

/* Tab Navigation Styles */
.tab-navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}

.tab-button {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #6c757d;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.tab-button i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.tab-button:hover {
  color: #495057;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.tab-button:hover i {
  transform: scale(1.1) rotate(10deg);
}

.tab-button.active {
  color: white;
  transform: translateY(-2px);
}

.tab-button.active:first-child {
  background: linear-gradient(135deg, #28a745, #20c997);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.tab-button.active:last-child {
  background: linear-gradient(135deg, #dc3545, #c82333);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2));
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.tab-button:hover::before {
  transform: translateY(0);
}

/* Update proposal card styles */
.proposal-card {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive styles for tabs */
@media (max-width: 768px) {
  .tab-navigation {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .tab-button {
    width: 100%;
    padding: 0.8rem;
  }

  .main {
    padding: 1.5rem;
  }

  .proposal-list {
    grid-template-columns: 1fr;
  }

  .proposal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .proposal-date {
    align-self: flex-start;
  }

  .proposal-actions {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
    width: 95%;
  }

  .modal-content.document-modal {
    height: 85vh;
    max-width: 95%;
    padding: 1rem;
  }

  .pagination button {
    padding: 0.6rem 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .submit-button, .cancel-button {
    width: 100%;
  }

  .preview-actions {
    flex-direction: column;
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .preview-action-btn {
    width: 100%;
  }
}

/* Tablet responsive styles */
@media (min-width: 769px) and (max-width: 1200px) {
  .proposal-list {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}

/* Modal xác nhận xóa */
.confirm-delete-modal {
  max-width: 450px;
  text-align: center;
}

.confirm-delete-content {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.warning-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffecec, #fff5f5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

.warning-icon i {
  font-size: 2.5rem;
  color: #dc3545;
}

.confirm-delete-content p {
  font-size: 1.1rem;
  color: #495057;
  margin: 0;
  line-height: 1.5;
}

.warning-text {
  color: #dc3545 !important;
  font-weight: 600;
  font-size: 0.95rem !important;
}

.delete-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.25);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.35);
}

.delete-button i {
  font-size: 1rem;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(220, 53, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}

/* Responsive styles for confirm delete modal */
@media (max-width: 768px) {
  .confirm-delete-modal {
    width: 90%;
    margin: 0 auto;
  }

  .warning-icon {
    width: 60px;
    height: 60px;
  }

  .warning-icon i {
    font-size: 2rem;
  }

  .confirm-delete-content p {
    font-size: 1rem;
  }
}
</style>
