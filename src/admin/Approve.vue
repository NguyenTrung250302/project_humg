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

<style scoped>
.approve-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.approve-item {
  padding: 16px;
  border-radius: 10px;
  border: 2px solid transparent;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

/* Khen thưởng */
.approve-item.reward {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

/* Kỷ luật */
.approve-item.discipline {
  background-color: #fff1f0;
  border-color: #ffa39e;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  color: white;
}

.reward .tag {
  background-color: #1890ff;
}

.discipline .tag {
  background-color: #f5222d;
}

.action-buttons {
  margin-top: 12px;
  display: flex;
  gap: 10px;
}

.btn-approve {
  padding: 6px 12px;
  background-color: #4caf50;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn-reject {
  padding: 6px 12px;
  background-color: #f44336;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn-approve:hover {
  background-color: #45a049;
}

.btn-reject:hover {
  background-color: #e53935;
}

.error {
  color: red;
  font-weight: bold;
}

/* Dialog căn giữa */
dialog {
  width: 400px;
  border: none;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

dialog h3 {
  margin-top: 0;
}

textarea {
  width: 100%;
  resize: none;
  margin-top: 10px;
  margin-bottom: 16px;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-actions button:first-child {
  background-color: #4caf50;
  color: white;
}

.dialog-actions button:last-child {
  background-color: #ccc;
  color: black;
}
</style>
