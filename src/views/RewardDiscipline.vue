<script setup>
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";
import { onMounted, ref, computed } from "vue";
import { useRewardDisciplineStore } from "../store/RewardDisciplineStore";
import { useUserStore } from "../store/userStore";

const rewardDisciplineStore = useRewardDisciplineStore();
const userStore = useUserStore();
const activeTab = ref('reward'); // 'reward' or 'discipline'
const showProposalForm = ref(false);
const formType = ref('reward'); // 'reward' or 'discipline'
const roleNamelogin = ref("");

// Form fields
const description = ref('');
const recipientMaSV = ref('');
const classValue = ref('');
const excelFile = ref(null); // Changed from url to file upload

// Document preview
const showDocumentPreview = ref(false);
const previewUrl = ref('');
const originalUrl = ref('');
const isDocLoading = ref(true);
const isViewerFailed = ref(false);
const fallbackContent = ref('');
const isEdgeBrowser = ref(false);

// Check if user is Bí thư đoàn viên
const isBiThu = computed(() => {
  return roleNamelogin.value === "Bí thư đoàn viên";
});

// Load data on mount
onMounted(async () => {
  await rewardDisciplineStore.GetListReward();
  await rewardDisciplineStore.GetListDiscipline();
  
  // Lấy thông tin user từ userStore giống như NavHeader.vue
  await userStore.getMemberInfo();
  roleNamelogin.value = userStore.memberInfo.roleName;
  console.log("Current roleName:", roleNamelogin.value);
  console.log("Is Bí thư đoàn viên:", isBiThu.value);

  // Check browser type on mount
  isEdgeBrowser.value = navigator.userAgent.indexOf("Edge") > -1 || 
                        navigator.userAgent.indexOf("Edg") > -1 || 
                        navigator.userAgent.indexOf("Trident") > -1;
});

// Get status label
const getStatusLabel = (status) => {
  switch(status) {
    case 0: return 'Đang chờ';
    case 1: return 'Đã phê duyệt';
    case 2: return 'Đã từ chối';
    default: return 'Không xác định';
  }
};

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

// Handle file change
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check if file is Excel
    if (file.type === 'application/vnd.ms-excel' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.name.endsWith('.xlsx') || 
        file.name.endsWith('.xls')) {
      excelFile.value = file;
    } else {
      alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      event.target.value = null;
      excelFile.value = null;
    }
  }
};

// Submit proposal
const submitProposal = async () => {
  if (!description.value || !classValue.value || !excelFile.value) {
    alert('Vui lòng điền đầy đủ thông tin và chọn file Excel!');
    return;
  }
  
  try {
    let result;
    
    if (formType.value === 'reward') {
      result = await rewardDisciplineStore.PostListReward(
        description.value,
        "", // Để trống mã sinh viên
        classValue.value,
        excelFile.value
      );
      await rewardDisciplineStore.GetListReward();
    } else {
      result = await rewardDisciplineStore.PostListDiscipline(
        description.value,
        "", // Để trống mã sinh viên
        classValue.value,
        excelFile.value
      );
      await rewardDisciplineStore.GetListDiscipline();
    }
    
    // Reset form
    description.value = '';
    classValue.value = '';
    excelFile.value = null;
    
    // Reset file input field
    const fileInput = document.getElementById('excelFile');
    if (fileInput) fileInput.value = '';
    
    showProposalForm.value = false;
    
    alert('Đề xuất đã được gửi thành công!');
  } catch (error) {
    console.error('Lỗi khi gửi đề xuất:', error);
    alert(rewardDisciplineStore.error || 'Có lỗi xảy ra khi gửi đề xuất!');
  }
};

// Show the proposal form
const openProposalForm = (type) => {
  formType.value = type;
  showProposalForm.value = true;
};

// Open document preview modal
const openDocumentPreview = (viewUrl, downloadUrl) => {
  console.log('Opening document preview:', { viewUrl, downloadUrl });
  
  // Kiểm tra nếu không có URL
  if (!viewUrl && !downloadUrl) {
    alert('Không tìm thấy tài liệu để xem!');
    return;
  }
  
  // Kiểm tra và đảm bảo viewUrl là URL hợp lệ
  try {
    new URL(viewUrl);
  } catch (e) {
    console.error('URL không hợp lệ:', viewUrl);
    alert('URL tài liệu không hợp lệ!');
    return;
  }
  
  // Sử dụng urlDecodeFile trực tiếp cho iframe - đã là URL Microsoft viewer
  previewUrl.value = viewUrl || '';
  
  // Sử dụng urlFile cho tải xuống và xem bên ngoài
  originalUrl.value = downloadUrl || viewUrl || '';
  
  isDocLoading.value = true;
  isViewerFailed.value = false;
  fallbackContent.value = '';
  showDocumentPreview.value = true;
};

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

<template>
  <Header />
  <NavHeader />
  
  <div class="main-content">
    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'reward' }"
        @click="activeTab = 'reward'"
      >
        Khen thưởng
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'discipline' }"
        @click="activeTab = 'discipline'"
      >
        Kỷ luật
      </div>
    </div>
    
    <!-- Error Display -->
    <div v-if="rewardDisciplineStore.error" class="auth-error-box">
      {{ rewardDisciplineStore.error }}
    </div>
    
    <!-- Rewards Section -->
    <div v-if="activeTab === 'reward'" class="section">
      <div class="section-header">
        <h2 class="section-title">Danh sách khen thưởng</h2>
        <button v-if="isBiThu" class="action-button" @click="openProposalForm('reward')">
          <i class="fas fa-plus"></i> Đề xuất khen thưởng
        </button>
      </div>
      
      <div v-if="rewardDisciplineStore.listReward.length === 0" class="empty-state">
        Không có khen thưởng nào.
      </div>
      
      <!-- Rewards List -->
      <div v-else class="card-grid">
        <div 
          v-for="reward in rewardDisciplineStore.listReward" 
          :key="reward.id" 
          class="card"
        >
          <h3>{{ reward.proposerName }}</h3>
          <p><strong>Mô tả:</strong> {{ reward.description }}</p>
          <p><strong>Ngày tạo:</strong> {{ formatDate(reward.createDate) }}</p>
          <p><strong>Trạng thái:</strong> {{ getStatusLabel(reward.status) }}</p>
          <p v-if="reward.rejectReason"><strong>Lý do từ chối:</strong> {{ reward.rejectReason }}</p>
          <p><strong>Lớp:</strong> {{ reward.class || 'Không có' }}</p>
          
          <!-- Document preview button if file exists -->
          <a 
            v-if="reward.urlDecodeFile" 
            href="#"
            @click.prevent="openDocumentPreview(reward.urlDecodeFile, reward.urlFile)"
            class="view-document"
          >
            <i class="fas fa-file-excel"></i> Xem tài liệu
          </a>
        </div>
      </div>
      
      <!-- Pagination for Rewards -->
      <div class="pagination" v-if="rewardDisciplineStore.rewardPagination.totalPages.value > 1">
        <button 
          :disabled="rewardDisciplineStore.rewardPagination.currentPage.value === 1"
          @click="rewardDisciplineStore.goToPageReward(rewardDisciplineStore.rewardPagination.currentPage.value - 1)"
        >
          &laquo; Trước
        </button>
        
        <span 
          v-for="pageNum in rewardDisciplineStore.rewardPagination.totalPages.value" 
          :key="pageNum"
          :class="{ active: pageNum === rewardDisciplineStore.rewardPagination.currentPage.value }"
          @click="rewardDisciplineStore.goToPageReward(pageNum)"
        >
          {{ pageNum }}
        </span>
        
        <button 
          :disabled="rewardDisciplineStore.rewardPagination.currentPage.value === rewardDisciplineStore.rewardPagination.totalPages.value"
          @click="rewardDisciplineStore.goToPageReward(rewardDisciplineStore.rewardPagination.currentPage.value + 1)"
        >
          Sau &raquo;
        </button>
      </div>
    </div>
    
    <!-- Disciplines Section -->
    <div v-if="activeTab === 'discipline'" class="section">
      <div class="section-header">
        <h2 class="section-title">Danh sách kỷ luật</h2>
        <button v-if="isBiThu" class="action-button" @click="openProposalForm('discipline')">
          <i class="fas fa-plus"></i> Đề xuất kỷ luật
        </button>
      </div>
      
      <div v-if="rewardDisciplineStore.listDiscipline.length === 0" class="empty-state">
        Không có kỷ luật nào.
      </div>
      
      <!-- Disciplines List -->
      <div v-else class="card-grid">
        <div 
          v-for="discipline in rewardDisciplineStore.listDiscipline" 
          :key="discipline.id" 
          class="card warning"
        >
          <h3>{{ discipline.proposerName }}</h3>
          <p><strong>Mô tả:</strong> {{ discipline.description }}</p>
          <p><strong>Ngày tạo:</strong> {{ formatDate(discipline.createDate) }}</p>
          <p><strong>Trạng thái:</strong> {{ getStatusLabel(discipline.status) }}</p>
          <p v-if="discipline.rejectReason"><strong>Lý do từ chối:</strong> {{ discipline.rejectReason }}</p>
          <p><strong>Lớp:</strong> {{ discipline.class || 'Không có' }}</p>
          
          <!-- Document preview button if file exists -->
          <a 
            v-if="discipline.urlDecodeFile" 
            href="#"
            @click.prevent="openDocumentPreview(discipline.urlDecodeFile, discipline.urlFile)"
            class="view-document"
          >
            <i class="fas fa-file-excel"></i> Xem tài liệu
          </a>
        </div>
      </div>
      
      <!-- Pagination for Disciplines -->
      <div class="pagination" v-if="rewardDisciplineStore.disciplinePagination.totalPages.value > 1">
        <button 
          :disabled="rewardDisciplineStore.disciplinePagination.currentPage.value === 1"
          @click="rewardDisciplineStore.goToPageDiscipline(rewardDisciplineStore.disciplinePagination.currentPage.value - 1)"
        >
          &laquo; Trước
        </button>
        
        <span 
          v-for="pageNum in rewardDisciplineStore.disciplinePagination.totalPages.value" 
          :key="pageNum"
          :class="{ active: pageNum === rewardDisciplineStore.disciplinePagination.currentPage.value }"
          @click="rewardDisciplineStore.goToPageDiscipline(pageNum)"
        >
          {{ pageNum }}
        </span>
        
        <button 
          :disabled="rewardDisciplineStore.disciplinePagination.currentPage.value === rewardDisciplineStore.disciplinePagination.totalPages.value"
          @click="rewardDisciplineStore.goToPageDiscipline(rewardDisciplineStore.disciplinePagination.currentPage.value + 1)"
        >
          Sau &raquo;
        </button>
      </div>
    </div>
    
    <!-- Proposal Form Modal -->
    <div v-if="showProposalForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ formType === 'reward' ? 'Đề xuất khen thưởng' : 'Đề xuất kỷ luật' }}</h2>
          <button class="close-button" @click="showProposalForm = false">&times;</button>
        </div>
        
        <div class="form-group">
          <label for="description">Mô tả <span class="required">*</span></label>
          <textarea 
            id="description" 
            v-model="description" 
            rows="4" 
            placeholder="Nhập mô tả chi tiết..."
            required
          ></textarea>
        </div>
        
        <!-- <div class="form-group">
          <label for="recipientMaSV">Mã sinh viên <span class="required">*</span></label>
          <input 
            type="text" 
            id="recipientMaSV" 
            v-model="recipientMaSV" 
            placeholder="Nhập mã sinh viên..."
            required
          />
        </div> -->
        
        <div class="form-group">
          <label for="classValue">Lớp <span class="required">*</span></label>
          <input 
            type="text" 
            id="classValue" 
            v-model="classValue" 
            placeholder="Nhập tên lớp..."
            required
          />
        </div>
        
        <div class="form-group">
          <label for="excelFile">File Excel <span class="required">*</span></label>
          <div class="file-upload">
            <input 
              type="file"
              id="excelFile"
              @change="handleFileChange"
              accept=".xlsx,.xls"
              required
            />
            <label for="excelFile" class="file-label">
              <span v-if="!excelFile">Chọn file Excel...</span>
              <span v-else>{{ excelFile.name }}</span>
            </label>
          </div>
          <p class="file-format-note">Chỉ chấp nhận file Excel (.xlsx, .xls)</p>
        </div>
        
        <div class="form-actions">
          <button class="cancel-button" @click="showProposalForm = false">Hủy</button>
          <button class="submit-button" @click="submitProposal">Gửi đề xuất</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Document Preview Modal -->
  <div v-if="showDocumentPreview" class="modal-overlay">
    <div class="modal-content document-modal">
      <div class="modal-header">
        <h2>Xem tài liệu</h2>
        <button class="close-button" @click="() => { showDocumentPreview = false; isDocLoading = true; }">&times;</button>
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
          <p v-if="isEdgeBrowser" class="browser-tip">
            <i class="fas fa-lightbulb"></i> Gợi ý: Hãy sử dụng nút "Mở trong Office Online" bên dưới để xem tài liệu trực tiếp từ Microsoft Office Online.
          </p>
          <p v-else class="browser-tip">
            <i class="fas fa-lightbulb"></i> Gợi ý: Bạn có thể tải xuống file hoặc sử dụng nút "Mở trong Office Online" bên dưới để xem trực tiếp.
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
  
  <Footer />
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 70vh;
  max-width: 1400px;
  margin: 0 auto;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 12px;
  background: linear-gradient(90deg, #007bff, #28a745, #ffc107, #dc3545);
}

.section {
  width: 100%;
  margin-bottom: 2.5rem;
  animation: fadeIn 0.5s ease-in-out;
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin: 0;
  position: relative;
  padding-left: 2rem;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  width: 10px;
  height: 10px;
  background-color: #007bff;
  border-radius: 50%;
  box-shadow: 0 0 0 5px rgba(0, 123, 255, 0.2);
}

.tab-navigation {
  display: flex;
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 0.5rem;
}

.tab {
  flex: 1;
  padding: 1rem 0;
  text-align: center;
  font-weight: 600;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-radius: 40px;
  margin: 0 0.25rem;
  color: #495057;
}

.tab:hover {
  background-color: rgba(0, 123, 255, 0.08);
  color: #007bff;
}

.tab.active {
  background-color: #007bff;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.25);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  perspective: 1000px;
}

.card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  border: none;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #28a745, #20c997);
}

.card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle at top right, rgba(40, 167, 69, 0.1) 0%, transparent 70%);
  z-index: 0;
}

.card.warning::before {
  background: linear-gradient(to bottom, #dc3545, #fd7e14);
}

.card.warning::after {
  background: radial-gradient(circle at top right, rgba(220, 53, 69, 0.1) 0%, transparent 70%);
}

.card h3 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  color: #212529;
  font-weight: 700;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.card h3::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #28a745;
  border-radius: 50%;
  margin-right: 10px;
}

.card.warning h3::before {
  background-color: #dc3545;
}

.card p {
  margin: 0.5rem 0;
  color: #495057;
  line-height: 1.5;
  position: relative;
  z-index: 1;
}

.card p strong {
  color: #212529;
  font-weight: 600;
}

.card:hover {
  transform: translateY(-10px) rotateX(3deg);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.view-document {
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.2rem;
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
  font-weight: 500;
  gap: 8px;
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

.auth-error-box {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 243, 205, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%);
  border-radius: 12px;
  color: #856404;
  font-weight: 600;
  margin-bottom: 1.5rem;
  width: 100%;
  border-left: 4px solid #ffc107;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.auth-error-box::before {
  content: '⚠️';
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 2rem;
  opacity: 0.2;
}

.pagination {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pagination button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(90deg, #007bff, #0062cc);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
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
  box-shadow: 0 8px 15px rgba(0, 123, 255, 0.4);
}

.pagination span {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  font-weight: 500;
  background: #f8f9fa;
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

.action-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #007bff, #0062cc);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.action-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #0062cc, #007bff);
  z-index: -1;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 123, 255, 0.4);
}

.action-button:hover::after {
  opacity: 1;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: #fff;
  border-radius: 16px;
  color: #6c757d;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.empty-state::before {
  content: '📋';
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1));
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-state::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #007bff, #28a745, #ffc107, #dc3545);
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
  border-radius: 20px;
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
  border-radius: 10px;
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

/* Form Elements */
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
  background-color: #007bff;
  border-radius: 50%;
}

.required {
  color: #dc3545;
  margin-left: 3px;
}

input, textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #f9fafb;
}

input:focus, textarea:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  outline: none;
  background-color: #fff;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button {
  padding: 0.7rem 1.2rem;
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
  padding: 0.7rem 1.5rem;
  background: linear-gradient(90deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.25);
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #20c997, #28a745);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(40, 167, 69, 0.3);
}

.submit-button:hover::before {
  opacity: 1;
}

/* File upload styles */
.file-upload {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.file-upload input[type="file"] {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 2;
}

.file-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 1rem;
  background-color: #f8f9fa;
  border: 2px dashed #adb5bd;
  border-radius: 12px;
  color: #495057;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-label::before {
  content: '📄';
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.file-label:hover {
  background-color: #e9ecef;
  border-color: #007bff;
  transform: translateY(-2px);
}

.file-label:hover::before {
  animation: bounce 0.5s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}

.file-format-note {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #6c757d;
  text-align: center;
  background-color: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
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

/* Responsive styles */
@media (max-width: 768px) {
  .main-content {
    padding: 2rem 1rem;
  }
  
  .tab-navigation {
    border-radius: 12px;
  }
  
  .tab {
    padding: 0.8rem 0;
    border-radius: 10px;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .preview-actions {
    flex-direction: column;
    padding: 0.75rem;
  }
  
  .document-modal {
    max-width: 95%;
    height: 80vh;
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .submit-button, .cancel-button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}

/* Tablet responsive styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .document-modal {
    max-width: 90%;
  }
}
</style>
