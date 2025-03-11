<template>
  <div id="forgotpassword-container">
    <div id="forgotpassword-form">
      <!-- Logo -->
      <img src="/src/assets/imgs/auth_imgs/logo.png" alt="Logo" class="logo" />

      <!-- Tiêu đề -->
      <h2>XÁC THỰC EMAIL</h2>

      <!-- Email thông báo -->
      <p class="email-info">Mã OTP đã được gửi đến <b>{{ email }}</b></p>

      <!-- Nhập mã OTP -->
      <div class="otp-container">
        <input 
          v-for="(digit, index) in otp" 
          :key="index" 
          ref="otpRefs"
          type="text" 
          maxlength="1" 
          class="otp-box" 
          v-model="otp[index]"
          @input="handleInput(index)"
          @keydown.delete="handleDelete(index)"
        />
      </div>

      <!-- Nút Xác nhận -->
      <button class="confirm-btn" @click="handleVerifyOtp" :disabled="!isOtpComplete">
        <span>XÁC NHẬN</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/userStore";

const userStore = useUserStore();
const router = useRouter();

const email = ref("");
const otp = ref(["", "", "", "", "", ""]); // Mảng rỗng ban đầu
const otpRefs = ref([]); // Danh sách ref để điều khiển input

onMounted(() => {
  email.value = localStorage.getItem("userEmail") || "";
});

// Xử lý nhập số OTP
const handleInput = (index) => {
  if (!/^\d$/.test(otp.value[index])) {
    otp.value[index] = ""; // Chỉ cho phép số 0-9
    return;
  }

  if (index < 5) {
    nextTick(() => otpRefs.value[index + 1]?.focus()); // Chuyển sang ô tiếp theo
  }
};

// Xử lý xóa số (quay lại ô trước)
const handleDelete = (index) => {
  if (otp.value[index] === "" && index > 0) {
    nextTick(() => otpRefs.value[index - 1]?.focus());
  }
};

// Kiểm tra đủ 6 số để kích hoạt nút XÁC NHẬN
const isOtpComplete = computed(() => otp.value.every((digit) => digit !== ""));

// Xác thực OTP
const handleVerifyOtp = async () => {
  const otpCode = otp.value.join(""); 
  console.log("🔍 OTP hiện tại:", otp.value);// Chuyển thành chuỗi số OTP
  if (otp.value.some((digit) => digit === "")) {
    console.log("⚠️ OTP chưa đủ 6 số!");
    window.$dialog.fail("Vui lòng nhập đủ 6 chữ số OTP!");
    return;
  }
  
  

  const result = await userStore.activateAccount(otpCode); 

  
  if (!result.success) {
    window.$dialog.fail(result.message);
    return;
  }
  window.$dialog.success(result.message);
  setTimeout(() => router.push("/Login"), 1000);
  localStorage.removeItem("userEmail");
};
</script>





<style scoped>
#forgotpassword-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url("/src/assets/imgs/auth_imgs/background-login-humg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#forgotpassword-form {
  width: 50%;
  height: 100%;
  background-color: #ffffffc5;
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.logo {
  width: 94px;
  margin-bottom: 20px;
}

h2 {
  color: #2d3b8d;
  margin-bottom: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.email-info {
  font-size: 14px;
  color: #333;
  margin-bottom: 15px;
}

.otp-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.otp-box {
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 20px;
  border: 2px solid #2d3b8d;
  border-radius: 5px;
  outline: none;
}

.otp-box:focus {
  border-color: #ff9800;
  box-shadow: 0 0 5px rgba(255, 152, 0, 0.7);
}

button {
  width: 35%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
}

.confirm-btn {
  background-color: #2d3b8d;
  color: white;
}

.confirm-btn:hover {
  background-color: #1e285a;
}

.resend-btn {
  background-color: #ddd;
  color: #333;
}

.resend-btn:hover {
  background-color: #bbb;
}
</style>
