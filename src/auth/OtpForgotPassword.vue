<template>
  <div id="forgotpassword-container">
    <div id="forgotpassword-form">
      <img src="/src/assets/imgs/auth_imgs/logo.png" alt="Logo" class="logo" />
      <h2>XÁC THỰC OTP</h2>
      <p class="email-info">Mã xác thực OTP đã được gửi đến <b>{{ email }}</b></p>

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

      <button class="confirm-btn" @click="checkOtp" :disabled="!isOtpComplete">
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
const otp = ref(["", "", "", "", "", ""]); 
const otpRefs = ref([]); 

onMounted(() => {
  email.value = localStorage.getItem("userEmail") || "";
});

// Xử lý nhập số OTP
const handleInput = (index) => {
  if (!/^\d$/.test(otp.value[index])) {
    otp.value[index] = ""; 
    return;
  }

  if (index < 5) {
    nextTick(() => otpRefs.value[index + 1]?.focus()); 
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

// Xác thực OTP và nhận mật khẩu
const checkOtp = async () => {
  const otpCode = otp.value.join(""); 

  const result = await userStore.activatePassword(email.value, otpCode);

  if (result.success) {
    window.$dialog.success(result.message);
    router.push("/Login"); 
    localStorage.removeItem("userEmail");
  } else {
    window.$dialog.fail(result.message);
  }
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
