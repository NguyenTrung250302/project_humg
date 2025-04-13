<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "../store/userStore";
import { useRouter } from "vue-router";
import Dashboard from "../admin/Dashboard.vue";

const userStore = useUserStore();
const router = useRouter();

const showPasswordForm = ref(false);
const isAvatarChanged = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const selectedFile = ref(null);
const isOldPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

// Format ngày tháng
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Ẩn hiện Form đổi mật khẩu
const togglePasswordForm = () => {
  showPasswordForm.value = !showPasswordForm.value;
};

// Hàm thay đổi trạng thái hiển thị mật khẩu cũ
const toggleOldPasswordVisibility = () => {
  isOldPasswordVisible.value = !isOldPasswordVisible.value;
};

// Hàm thay đổi trạng thái hiển thị mật khẩu mới
const toggleNewPasswordVisibility = () => {
  isNewPasswordVisible.value = !isNewPasswordVisible.value;
};

// Hàm thay đổi trạng thái hiển thị mật khẩu xác nhận
const toggleConfirmPasswordVisibility = () => {
  isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
};

// Hàm thay đổi avatar để nhận hình từ máy
const changeAvatar = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onloadend = () => {
      userInfo.value.urlAvatar = reader.result;
      isAvatarChanged.value = true;
    };
    reader.readAsDataURL(file);
  }
};

// get memberInfo
const userInfo = ref({});
onMounted(async () => {
  await userStore.getMemberInfo();
  userInfo.value = userStore.memberInfo;

  if (userInfo.value?.birthdate) {
    userInfo.value.birthdate = formatDate(userInfo.value.birthdate);
  }
  if (userInfo.value?.dateOfJoining) {
    userInfo.value.dateOfJoining = formatDate(userInfo.value.dateOfJoining);
  }
});

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

  const result = await userStore.changePassword(
    oldPassword.value,
    newPassword.value,
    confirmPassword.value
  );

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

// Hàm cập nhật thông tin member
const updateProfile = async () => {
  const result = await userStore.updateProfile({
    politicalTheory: userInfo.value.politicalTheory || undefined,
    nation: userInfo.value.nation || undefined,
    birthdate: userInfo.value.birthdate || undefined,
    religion: userInfo.value.religion || undefined,
    dateOfJoining: userInfo.value.dateOfJoining || undefined,
    phoneNumber: userInfo.value.phoneNumber || undefined,
    class: userInfo.value.class || undefined,
    fullName: userInfo.value.fullName || undefined,
    placeOfJoining: userInfo.value.placeOfJoining || undefined,
  });

  if (result.success) {
    window.$dialog.success(result.message);
  } else {
    window.$dialog.fail(result.message);
  }
};

const updateAvatar = async () => {
  window.$dialog.success("Vui lòng chờ...");
  const result = await userStore.updateUserImage(selectedFile.value);

  if (result.success) {
    window.$dialog.success(result.message);
    setTimeout(() => {
      location.reload();
    }, 1000);
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
</script>

<template>
  <div class="container-dashboard">
    <Dashboard></Dashboard>
    <div class="main">
      <h1>Trang cá nhân</h1>
      <div class="profile-layout">
        <div class="profile-info">
          <div class="profile-avatar">
            <input
              type="file"
              id="avatar-upload"
              class="avatar-upload"
              @change="changeAvatar"
            />
            <label for="avatar-upload" class="avatar-label">
              <img
                :src="userInfo?.urlAvatar || ''"
                alt="Avatar"
                class="avatar-img"
              />
            </label>
            <label
              for="avatar-upload"
              class="change-avatar-text"
              style="text-decoration: none"
              >Thay đổi ảnh đại diện</label
            >
          </div>

          <div v-if="isAvatarChanged" class="confirm-avatar-change">
            <button @click="updateAvatar" class="btn-confirm-avatar-change">
              Xác nhận thay đổi ảnh
            </button>
          </div>

          <div class="profile-details">
            <div class="profile-item">
              <div class="profile-label">Họ Tên:</div>
              <input v-model="userInfo.fullName" class="profile-input" />
            </div>
            <div class="profile-item">
              <div class="profile-label">Email:</div>
              <input
                type="email"
                :value="userInfo?.email || ''"
                class="profile-input"
                disabled
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Số điện thoại:</div>
              <input
                v-model="userInfo.phoneNumber"
                type="email"
                class="profile-input"
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Mã sinh viên:</div>
              <input
                :value="userInfo?.maSV || ''"
                class="profile-input"
                disabled
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Ngày sinh:</div>
              <input
                v-model="userInfo.birthdate"
                type="text"
                class="profile-input"
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Lớp:</div>
              <input
                v-model="userInfo.class"
                type="text"
                class="profile-input"
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Quốc tịch:</div>
              <input
                v-model="userInfo.nation"
                type="text"
                class="profile-input"
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Dân tộc:</div>
              <input
                v-model="userInfo.religion"
                type="text"
                class="profile-input"
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Chức vụ:</div>
              <input
                v-model="userInfo.roleName"
                type="text"
                class="profile-input"
                disabled
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Ngày gia nhập đoàn:</div>
              <input
                v-model="userInfo.dateOfJoining"
                type="text"
                class="profile-input"
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Nơi gia nhập đoàn:</div>
              <input
                v-model="userInfo.placeOfJoining"
                type="text"
                class="profile-input"
              />
            </div>
            <div class="profile-item">
              <div class="profile-label">Chính trị:</div>
              <input
                v-model="userInfo.politicalTheory"
                type="text"
                class="profile-input"
              />
            </div>
          </div>

          <div class="btn-logout">
            <button @click="updateProfile" class="btn-action">
              Xác nhận cập nhật thông tin
            </button>
          </div>

          <div class="action-buttons">
            <div class="btn-change-password">
              <button @click="togglePasswordForm" class="btn-action">
                Đổi mật khẩu
              </button>
            </div>

            <div class="btn-logout">
              <button @click="logout" class="btn-action">Đăng xuất</button>
            </div>
          </div>

          <div v-if="showPasswordForm" class="password-form">
            <div class="input-container">
              <input
                v-model="oldPassword"
                :type="isOldPasswordVisible ? 'text' : 'password'"
                placeholder="Mật khẩu cũ"
                class="input-field"
              />
              <button
                @click="toggleOldPasswordVisibility"
                class="btn-toggle-password"
              >
                {{ isOldPasswordVisible ? "🙈" : "👁️" }}
              </button>
            </div>
            <div class="input-container">
              <input
                v-model="newPassword"
                :type="isNewPasswordVisible ? 'text' : 'password'"
                placeholder="Mật khẩu mới"
                class="input-field"
              />
              <button
                @click="toggleNewPasswordVisibility"
                class="btn-toggle-password"
              >
                {{ isNewPasswordVisible ? "🙈" : "👁️" }}
              </button>
            </div>
            <div class="input-container">
              <input
                v-model="confirmPassword"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                placeholder="Nhập lại mật khẩu mới"
                class="input-field"
              />
              <button
                @click="toggleConfirmPasswordVisibility"
                class="btn-toggle-password"
              >
                {{ isConfirmPasswordVisible ? "🙈" : "👁️" }}
              </button>
            </div>
            <button @click="submitPasswordChange" class="btn-submit">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 50vh;
}

.profile-info {
  width: 100%;
  max-width: 750px;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
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

.avatar-img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #007bff;
  transition: border 0.3s ease;
}

.avatar-label:hover .avatar-img {
  border-color: #0056b3;
}

.change-avatar-text {
  margin-top: 10px;
  font-size: 16px;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.confirm-avatar-change {
  text-align: center;
  margin-top: 15px;
}

.btn-confirm-avatar-change {
  padding: 12px 25px;
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

.profile-details {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: space-between;
}

.profile-item {
  display: flex;
  flex-direction: column;
  width: calc(50% - 10px);
}

.profile-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.profile-input {
  font-size: 14px;
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.btn-change-password,
.btn-logout {
  flex: 1;
  margin: 0 12px;
}

.btn-action {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-action {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-action:hover {
  background-color: #0056b3;
}

.password-form {
  margin-top: 30px;
}

.input-container {
  position: relative;
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.btn-submit {
  width: 100%;
  padding: 12px;
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
