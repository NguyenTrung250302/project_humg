<script setup>
import { ref, onMounted } from "vue";
import { useApproveStore } from "../StoreAdmin/StoreApprove";
import Dashboard from "./Dashboard.vue";
import "../assets/css/Dashboard.css";

const approveStore = useApproveStore();

onMounted(() => {
  approveStore.getApproveList();
});

// dialog logic
const actionDialog = ref(null);
const actionId = ref(null);
const isRejectMode = ref(false);
const rejectReason = ref("");

const openRejectDialog = (id) => {
  isRejectMode.value = true;
  actionId.value = id;
  rejectReason.value = "";
  actionDialog.value.showModal();
};

const openApproveDialog = (id) => {
  isRejectMode.value = false;
  actionId.value = id;
  actionDialog.value.showModal();
};

const closeActionDialog = () => {
  actionDialog.value.close();
};

const handleConfirm = async () => {
  if (isRejectMode.value) {
    if (!rejectReason.value.trim()) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }
    await approveStore.rejectProposal(actionId.value, rejectReason.value);
  } else {
    await approveStore.acceptProposal(actionId.value);
  }
  closeActionDialog();
};
</script>

<template>
  <div class="container-dashboard">
    <Dashboard></Dashboard>
    <div class="main">
      <h1>DANH SÁCH YÊU CẦU PHÊ DUYỆT</h1>

      <!-- list -->
      <div class="approve-list">
        <div
          class="approve-item"
          :class="item.rewardOrDiscipline ? 'reward' : 'discipline'"
          v-for="item in approveStore.approveList"
          :key="item.id"
        >
          <p><strong>ID đề xuất:</strong> {{ item.id }}</p>
          <p>
            <strong>👤 Người được đề xuất:</strong> {{ item.recipientName }} ({{
              item.recipientMaSV
            }})
          </p>
          <p>
            <strong>✍️ Người đề xuất:</strong> {{ item.proposerName }} ({{
              item.proposerMaSV
            }})
          </p>
          <p><strong>📝 Lý do:</strong> {{ item.description }}</p>
          <p>
            <strong>📅 Ngày tạo:</strong>
            {{ new Date(item.createDate).toLocaleString("vi-VN") }}
          </p>
          <p>
            <strong>📌 Hình thức:</strong>
            <span class="tag">
              {{ item.rewardOrDiscipline ? "🎖️ Khen thưởng" : "⚠️ Kỷ luật" }}
            </span>
          </p>

          <!-- Nút thao tác -->
          <div class="action-buttons">
            <button class="btn-approve" @click="openApproveDialog(item.id)">
              Phê duyệt
            </button>
            <button class="btn-reject" @click="openRejectDialog(item.id)">
              Từ chối
            </button>
          </div>
        </div>
        <p v-if="approveStore.error" class="error">{{ approveStore.error }}</p>
      </div>
    </div>

    <!-- Dialog xác nhận phê duyệt và từ chối -->
    <dialog ref="actionDialog">
      <h3>{{ isRejectMode ? "Lý do từ chối" : "Xác nhận phê duyệt" }}</h3>

      <!-- Chỉ hiển thị khi từ chối -->
      <textarea
        v-if="isRejectMode"
        v-model="rejectReason"
        rows="4"
        placeholder="Nhập lý do..."
      ></textarea>

      <div class="dialog-actions">
        <button @click="handleConfirm">
          {{ isRejectMode ? "Xác nhận" : "Phê duyệt" }}
        </button>
        <button @click="closeActionDialog">Hủy</button>
      </div>
    </dialog>
  </div>
</template>


<style scoped>
/* Căn chỉnh và giãn đều các phần tử */
.approve-list {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px; /* Tăng khoảng cách giữa các phần tử */
  align-items: flex-start; /* Đặt các phần tử sát trái để không bị thu hẹp */

}

.approve-item {
  width: 100%; /* Sử dụng 100% chiều rộng */
  max-width: 1200px; /* Tăng chiều rộng tối đa */
  padding: 20px;
  line-height: 2.2rem;
  border-radius: 12px;
  border: 2px solid transparent;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: #fff;
  margin-bottom: 20px; /* Tăng khoảng cách dưới mỗi item */
}

.approve-item.reward {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.approve-item.discipline {
  background-color: #fff1f0;
  border-color: #ffa39e;
}

.tag {
  padding: 2px 12px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  display: inline-block;
}

.reward .tag {
  background-color: #188fffc9;
}

.discipline .tag {
  background-color: #f5222db9;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly; /* Giãn đều các nút */
  width: 100%;
}

.btn-approve, .btn-reject {
  padding: 10px 20px;
  background-color: #4caf50;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px; /* Đảm bảo các nút có cùng chiều rộng */
}

.btn-reject {
  background-color: #f44336e1;
}

.btn-approve:hover {
  background-color: #45a049d0;
}

.btn-reject:hover {
  background-color: #e53935;
}

.error {
  color: red;
  font-weight: bold;
}

/* Căn giữa dialog */
dialog {
  width: 600px;
  max-width: 100%;
  border: none;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

dialog h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px; /* Tăng khoảng cách dưới tiêu đề */
}

textarea {
  width: 100%;
  resize: none;
  margin-top: 15px;
  margin-bottom: 20px;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.dialog-actions {
  display: flex;
  justify-content: space-evenly; /* Giãn đều các nút */
  gap: 20px;
}

.dialog-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.dialog-actions button:first-child {
  background-color: #4caf50;
  color: white;
}

.dialog-actions button:last-child {
  background-color: #ccc;
  color: black;
}

.dialog-actions button:first-child:hover {
  background-color: #45a049;
}

.dialog-actions button:last-child:hover {
  background-color: #b0b0b0;
}


</style>
