<template>
    <Teleport to="body">
      <div v-if="isOpen" class="dialog-overlay" @click="close">
        <div class="dialog-content" :class="dialogClass" @click.stop>
          <h2>{{ title }}</h2>
          <p>{{ message }}</p>
          <button @click="close" class="dialog-close">Đóng</button>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  
  const isOpen = ref(false);
  const type = ref(""); 
  const title = ref("");
  const message = ref("");
  
  const open = (dialogType, msg) => {
    type.value = dialogType;
    title.value = dialogType === "success" ? "🎉 Thành công!" : "❌ Thất bại!";
    message.value = msg;
    isOpen.value = true;
  };
  
  const close = () => {
    isOpen.value = false;
  };
  
  // Hàm mở dialog thành công
  const success = (msg) => {
    open("success", msg);
  };
  
  // Hàm mở dialog thất bại
  const fail = (msg) => {
    open("fail", msg);
  };
  
  // Gán vào window để gọi từ bất kỳ đâu
  window.$dialog = { success, fail, close };
  
  const dialogClass = computed(() => ({
    "dialog-success": type.value === "success",
    "dialog-fail": type.value === "fail",
  }));
  </script>
  
  <style scoped>
  /* Overlay nền mờ */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-in-out;
    z-index: 2000;
  }
  
  /* Hộp dialog chính */
  .dialog-content {
    background: white;
    padding: 25px;
    border-radius: 12px;
    min-width: 350px;
    max-width: 90%;
    text-align: center;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-in-out;
  }
  
  /* Hiệu ứng vào */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  /* Tiêu đề */
  .dialog-content h2 {
    margin-bottom: 12px;
    font-size: 20px;
    font-weight: bold;
  }
  
  /* Nội dung */
  .dialog-content p {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
  }
  
  /* Nút đóng */
  .dialog-close {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
  }
  
  /* Thành công */
  .dialog-success {
    border-top: 5px solid #176ffd;
    color: #176ffd;
  }
  
  .dialog-success .dialog-close {
    background: #176ffd;
    color: white;
  }
  
  .dialog-success .dialog-close:hover {
    background: #176ffddf;
  }
  
  /* Thất bại */
  .dialog-fail {
    border-top: 5px solid #e74c3c;
    color: #e74c3c;
  }
  
  .dialog-fail .dialog-close {
    background: #e74c3c;
    color: white;
  }
  
  .dialog-fail .dialog-close:hover {
    background: #c0392b;
  }
  </style>
  