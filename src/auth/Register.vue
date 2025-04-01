<template>
  <div id="container_login">
    <div id="form_login">
      <img src="/src/assets/imgs/auth_imgs/logo.png" alt="Logo" class="logo" />

      <h2>HỆ THỐNG QUẢN LÝ ĐOÀN VIÊN HUMG</h2>

      <form @submit.prevent="handleSubmit">
        <div class="input-group-inline">
          <div class="input-group">
            <input type="text" placeholder="Họ và Tên" v-model="fullName" />
          </div>
        </div>
        <div class="input-group-inline">
          <div class="input-group">
            <input type="text" placeholder="Tên đăng nhập" v-model="username" />
          </div>
          <div class="input-group">
            <input type="email" placeholder="Email" v-model="email" />
          </div>
        </div>

        <div class="input-group-inline">
          <div class="input-group">
            <input type="text" placeholder="Mã Sinh Viên" v-model="maSv" />
          </div>
          <div class="input-group password-group">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              placeholder="Mật khẩu"
              v-model="password"
              id="password-input"
            />
            <span class="password-toggle" @click="togglePasswordVisibility">
              {{ passwordVisible ? "🙈" : "👁️" }}
            </span>
          </div>
        </div>
        <button type="submit" :disabled="isSubmitting">ĐĂNG KÝ</button>
      </form>

      <div class="auth-links">
        <a href="/ForgotPassword" class="ForgotPassword"
          >Quên mật khẩu? &nbsp;</a
        >
        <a href="/Login" class="Register">Đăng nhập</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../store/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const username = ref("");
const email = ref("");
const fullName = ref("");
const maSv = ref("");
const password = ref("");
const passwordVisible = ref(false);
const isSubmitting = ref(false);

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

async function handleSubmit() {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  if (
    !username.value ||
    !email.value ||
    !maSv.value ||
    !password.value ||
    !fullName.value
  ) {
    window.$dialog.fail("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const result = await userStore.register(
    username.value,
    maSv.value,
    password.value,
    email.value,
    fullName.value
  );

  // console.log("Kết quả từ server:", result);

  if (!result || !result.success) {
    window.$dialog.fail(result?.message || "Lỗi không xác định!");
  } else {
    window.$dialog.success(result.message);
    localStorage.setItem("userEmail", email.value);
    setTimeout(() => {
      router.push("/VerifyEmail");
    }, 1000);
  }

  isSubmitting.value = false;
}
</script>

<style scoped>
/* Container chính */
#container_login {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url("/src/assets/imgs/auth_imgs/background-login-humg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Form login */
#form_login {
  width: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* Logo */
.logo {
  width: 100px;
  margin-bottom: 20px;
}

/* Tiêu đề */
h2 {
  color: #2d3b8d;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 20px;
}

/* Form */
form {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

/* Các nhóm input trên cùng một hàng */
.input-group-inline {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  width: 100%;
}

/* Định dạng input group để input rộng đều */
.input-group {
  flex: 1;
  position: relative;
}

/* Định dạng input */
.input-group input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: #2d3b8d;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(45, 59, 141, 0.5);
  outline: none;
}

/* Định dạng riêng cho nhóm mật khẩu */
.password-group {
  display: flex;
  align-items: center;
  position: relative;
}

.password-group input {
  padding-right: 40px;
}

/* Nút hiển thị mật khẩu */
.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
}

/* Nút đăng ký */
button {
  width: 100%;
  padding: 14px;
  background-color: #2d3b8d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s;
}

button:hover {
  background-color: #1e285a;
}

/* Các liên kết quên mật khẩu và đăng ký */
.auth-links {
  margin-top: 20px;
}

.auth-links a {
  color: #2d3b8d;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
