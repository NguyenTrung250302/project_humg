<script setup>
import { ref } from "vue";
import { useUserStore } from "../store/userStore";
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";
import Footer from "../components/Footer.vue";
import { useRouter } from "vue-router"; 

const userStore = useUserStore();
const router = useRouter(); 

const showPasswordForm = ref(false);
const isAvatarChanged = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const selectedFile = ref(null); 
const isPasswordVisible = ref(false); 

const togglePasswordForm = () => {
  showPasswordForm.value = !showPasswordForm.value;
};

// Hàm đổi mật khẩu
const submitPasswordChange = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    window.$dialog.fail("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    window.$dialog.fail("Xác nhận mật khẩu mới không khớp!");
    return;
  }

  const result = await userStore.changePassword(oldPassword.value, newPassword.value);

  if (result.success) {
    window.$dialog.success(result.message);
    showPasswordForm.value = false;
    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } else {
    window.$dialog.fail(result.message);
  }
};

// Hàm thay đổi avatar
const changeAvatar = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onloadend = () => {
      userStore.user.urlavartar = reader.result;
      isAvatarChanged.value = true; 
    };
    reader.readAsDataURL(file);
  }
};

// Hàm xác nhận thay đổi avatar
const submitAvatarChange = async () => {
  if (!selectedFile.value) {
    window.$dialog.fail("Vui lòng chọn ảnh để thay đổi!");
    return;
  }

  window.$dialog.success("Loading...");
  
  const formData = new FormData();
  formData.append("Urlavartar", selectedFile.value);
  formData.append("Id", userStore.user.id); 

  const result = await userStore.updateAvatar(formData);

  if (result.success) {
    window.$dialog.success(result.message);
    isAvatarChanged.value = false; 
    selectedFile.value = null; 
  } else {
    window.$dialog.fail(result.message);
  }
};

// Hàm đăng xuất
const logout = () => {
  userStore.logout();
  window.$dialog.success("Đăng xuất thành công!");
  setTimeout(() => {
    router.push("/");
  }, 1500);
};

// Hàm thay đổi trạng thái hiển thị mật khẩu
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
  <Header></Header>
  <NavHeader></NavHeader>

  <div class="profile-layout">
    <div class="profile-info">
      <div class="avatar-section">
        <input type="file" id="avatar-upload" class="avatar-upload" @change="changeAvatar" />
        <label for="avatar-upload" class="avatar-label">
          <img src="../assets/imgs/auth_imgs/schoollogo.png" alt="Avatar" class="avatar" />
        </label>
        <label for="avatar-upload" class="change-avatar-text" style="text-decoration: none;">Thay đổi ảnh đại diện</label>
      </div>

      <div v-if="isAvatarChanged" class="confirm-avatar-change">
        <button @click="submitAvatarChange" class="btn-confirm-avatar-change">
          Xác nhận thay đổi ảnh
        </button>
      </div>

      <div class="email-section">
        <div class="email-item">
          <div class="email-title">Email:</div>
          <div class="email-value">{{  }}</div>
        </div>
      </div>

      <div class="action-buttons">
        <div class="change-password">
          <button @click="togglePasswordForm" class="btn-change-password">
            Đổi mật khẩu
          </button>
        </div>

        <div class="logout">
          <button @click="logout" class="btn-logout">
            Đăng xuất
          </button>
        </div>
      </div>

      <div v-if="showPasswordForm" class="password-form">
        <div class="input-container">
          <input v-model="oldPassword" :type="isPasswordVisible ? 'text' : 'password'" placeholder="Mật khẩu cũ" class="input-field" />
          <button @click="togglePasswordVisibility" class="btn-toggle-password">{{ isPasswordVisible ? "🙈" : "👁️" }}</button>
        </div>
        <div class="input-container">
          <input v-model="newPassword" :type="isPasswordVisible ? 'text' : 'password'" placeholder="Mật khẩu mới" class="input-field" />
          <button @click="togglePasswordVisibility" class="btn-toggle-password">{{ isPasswordVisible ? "🙈" : "👁️" }}</button>
        </div>
        <div class="input-container">
          <input v-model="confirmPassword" :type="isPasswordVisible ? 'text' : 'password'" placeholder="Nhập lại mật khẩu mới" class="input-field" />
          <button @click="togglePasswordVisibility" class="btn-toggle-password">{{ isPasswordVisible ? "🙈" : "👁️" }}</button>
        </div>
        <button @click="submitPasswordChange" class="btn-submit">Xác nhận</button>
      </div>
    </div>
  </div>

  <Footer></Footer>
</template>

<style scoped>
.profile-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
  min-height: 50vh;
}

.profile-info {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.avatar-upload {
  display: none;
}

.avatar-label {
  cursor: pointer;
  display: inline-block;
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #007bff;
  transition: border 0.3s ease;
}

.avatar-label:hover .avatar {
  border-color: #0056b3;
}

.change-avatar-text {
  margin-top: 10px;
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.confirm-avatar-change {
  text-align: center;
  margin-top: 10px;
}

.btn-confirm-avatar-change {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-confirm-avatar-change:hover {
  background-color: #218838;
}

.email-section {
  font-size: 18px;
  margin-bottom: 20px;
}

.email-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.email-title {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.email-value {
  font-size: 16px;
  color: #555;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.change-password,
.logout {
  flex: 1;
  margin: 0 10px;
}

.btn-change-password,
.btn-logout {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-change-password {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-logout {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-change-password:hover {
  background-color: #0056b3;
}

.btn-logout:hover {
  background-color: #c82333;
}

.password-form {
  margin-top: 20px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.btn-submit {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn-submit:hover {
  background-color: #218838;
}

.input-container {
  position: relative;
  width: 100%;
}

.btn-toggle-password {
  position: absolute;
  right: 10px;
  top: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  font-size: 20px;
}
</style>
