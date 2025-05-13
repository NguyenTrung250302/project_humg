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
      <h1>THÔNG TIN QUẢN TRỊ VIÊN</h1>
      <div class="profile-layout">
        <div class="profile-container">
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
                <div class="avatar-overlay">
                  <i class="fas fa-camera"></i>
                </div>
              </label>
              <label
                for="avatar-upload"
                class="change-avatar-text"
                >Thay đổi ảnh đại diện</label
              >
              <div v-if="isAvatarChanged" class="confirm-avatar-change">
                <button @click="updateAvatar" class="btn-confirm-avatar-change">
                  <i class="fas fa-check"></i> Xác nhận
                </button>
              </div>
            </div>
            <div class="profile-details">
              <h2 class="profile-title">{{userInfo.roleName}}: {{ userInfo.fullName }}</h2>
              <div class="profile-fields">
                <div class="profile-item">
                  <div class="profile-row">
                    <div class="profile-field">
                      <label class="profile-label">Họ Tên:</label>
                      <input v-model="userInfo.fullName" class="profile-input" />
                    </div>
                    <div class="profile-field">
                      <label class="profile-label">Email:</label>
                      <input
                        type="email"
                        :value="userInfo?.email || ''"
                        class="profile-input"
                                        />
                    </div>
                  </div>
                </div>
                <div class="profile-item">
                  <div class="profile-row">
                    <div class="profile-field">
                      <label class="profile-label">Số điện thoại:</label>
                      <input
                        v-model="userInfo.phoneNumber"
                        type="email"
                        class="profile-input"
                      />
                    </div>
                    <div class="profile-field">
                      <label class="profile-label">Mã sinh viên:</label>
                      <input :value="userInfo?.maSV || ''" class="profile-input"/>
                    </div>
                  </div>
                </div>
                <div class="profile-item">
                  <div class="profile-row">
                    <div class="profile-field">
                      <label class="profile-label">Ngày sinh:</label>
                      <input
                        v-model="userInfo.birthdate"
                        type="text"
                        class="profile-input"
                      />
                    </div>
                    <div class="profile-field">
                      <label class="profile-label">Lớp:</label>
                      <input v-model="userInfo.class" type="text" class="profile-input" />
                    </div>
                  </div>
                </div>
                <div class="profile-item">
                  <div class="profile-row">
                    <div class="profile-field">
                      <label class="profile-label">Giới tính</label>
                      <input
                        v-model="userInfo.gender"
                        type="text"
                        class="profile-input"
                      />
                    </div>
                    <div class="profile-field">
                      <label class="profile-label">Chuyên ngành</label>
                      <input v-model="userInfo.major" type="text" class="profile-input" />
                    </div>
                  </div>
                </div>
                <div class="profile-item">
                  <div class="profile-row">
                    <div class="profile-field">
                      <label class="profile-label">Quốc tịch:</label>
                      <input v-model="userInfo.nation" type="text" class="profile-input" />
                    </div>
                    <div class="profile-field">
                      <label class="profile-label">Dân tộc:</label>
                      <input
                        v-model="userInfo.religion"
                        type="text"
                        class="profile-input"
                      />
                    </div>
                  </div>
                </div>
                <div class="profile-item">
                  <div class="profile-row">
                    <div class="profile-field">
                      <label class="profile-label">Chức vụ:</label>
                      <input
                        v-model="userInfo.roleName"
                        type="text"
                        class="profile-input"
                                        />
                    </div>
                    <div class="profile-field">
                      <label class="profile-label">Ngày gia nhập đoàn:</label>
                      <input
                        v-model="userInfo.dateOfJoining"
                        type="text"
                        class="profile-input"
                      />
                    </div>
                  </div>
                </div>
                <div class="profile-item">
                  <div class="profile-row">
                    <div class="profile-field">
                      <label class="profile-label">Nơi gia nhập đoàn:</label>
                      <input
                        v-model="userInfo.placeOfJoining"
                        type="text"
                        class="profile-input"
                      />
                    </div>
                    <div class="profile-field">
                      <label class="profile-label">Chính trị:</label>
                      <input
                        v-model="userInfo.politicalTheory"
                        type="text"
                        class="profile-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="profile-actions">
                <button @click="updateProfile" class="btn-update">
                  <i class="fas fa-save"></i> Cập nhật thông tin
                </button>
                
                <div class="secondary-actions">
                  <button @click="togglePasswordForm" class="btn-change-password">
                    <i class="fas fa-key"></i> Đổi mật khẩu
                  </button>
                  <button @click="logout" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Đăng xuất
                  </button>
                </div>
              </div>

              <div v-if="showPasswordForm" class="password-form">
                <h3 class="password-title">Đổi mật khẩu</h3>
                <div class="input-group">
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
                      <i :class="isOldPasswordVisible ? 'far fa-eye-slash' : 'far fa-eye'"></i>
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
                      <i :class="isNewPasswordVisible ? 'far fa-eye-slash' : 'far fa-eye'"></i>
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
                      <i :class="isConfirmPasswordVisible ? 'far fa-eye-slash' : 'far fa-eye'"></i>
                    </button>
                  </div>
                </div>
                <button @click="submitPasswordChange" class="btn-submit">
                  <i class="fas fa-check-circle"></i> Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<style scoped>
.profile-layout {
  display: flex;
  justify-content: center;
  background-color: #FFFFFF;
  padding: 30px 20px;
  min-height: calc(100vh - 120px);
}

.profile-container {
  width: 100%;
  max-width: 100%;
}

.profile-info {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  margin-bottom: 30px;
}

.profile-avatar {
  flex: 0 0 220px;
  text-align: center;
  position: relative;
}

.avatar-upload {
  display: none;
}

.avatar-label {
  cursor: pointer;
  display: inline-block;
  position: relative;
  margin-bottom: 15px;
}

.avatar-img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #4e73df;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-label:hover .avatar-overlay {
  opacity: 1;
}

.avatar-label:hover .avatar-img {
  transform: scale(1.02);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.avatar-overlay i {
  color: white;
  font-size: 24px;
}

.change-avatar-text {
  display: block;
  margin-top: 10px;
  color: #4e73df;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.change-avatar-text:hover {
  color: #2e59d9;
  text-decoration: underline;
}

.confirm-avatar-change {
  margin-top: 15px;
}

.btn-confirm-avatar-change {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-confirm-avatar-change:hover {
  background: linear-gradient(135deg, #3b5ab8 0%, #1a3a8f 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-confirm-avatar-change i {
  margin-right: 8px;
}

.profile-details {
  flex: 1;
  min-width: 300px;
}

.profile-title {
  color: #2e384d;
  font-size: 24px;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
}

.profile-fields {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.profile-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.profile-field {
  margin-bottom: 15px;
}

.profile-label {
  display: block;
  margin-bottom: 8px;
  color: #5a5c69;
  font-weight: 600;
  font-size: 14px;
}

.profile-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #d1d3e2;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: #f8f9fc;
}

.profile-input:focus {
  border-color: #bac8f3;
  outline: none;
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.15);
  background-color: white;
}

.profile-input:disabled {
  background-color: #eaecf4;
  color: #6e707e;
}

.profile-actions {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-update {
  padding: 12px 20px;
  background: linear-gradient(135deg, #1cc88a 0%, #17a673 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-update:hover {
  background: linear-gradient(135deg, #17a673 0%, #13855c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-update i {
  margin-right: 8px;
}

.secondary-actions {
  display: flex;
  gap: 15px;
}

.btn-change-password,
.btn-logout {
  flex: 1;
}

.btn-change-password {
  padding: 12px 20px;
  background: linear-gradient(135deg, #f6c23e 0%, #dda20a 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-change-password:hover {
  background: linear-gradient(135deg, #dda20a 0%, #b38609 100%);
  transform: translateY(-1px);
}

.btn-logout {
  padding: 12px 20px;
  background: linear-gradient(135deg, #e74a3b 0%, #be2617 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: linear-gradient(135deg, #be2617 0%, #9c1f12 100%);
  transform: translateY(-1px);
}

.btn-change-password i,
.btn-logout i {
  margin-right: 8px;
}

.password-form {
  margin-top: 30px;
  padding: 25px;
  background-color: #f8f9fc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.password-title {
  color: #2e384d;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  display: grid;
  gap: 15px;
  margin-bottom: 20px;
}

.input-container {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid #d1d3e2;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.input-field:focus {
  border-color: #bac8f3;
  outline: none;
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.15);
}

.btn-toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  color: #6e707e;
  font-size: 16px;
  padding: 5px;
}

.btn-toggle-password:hover {
  color: #4e73df;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover {
  background: linear-gradient(135deg, #3b5ab8 0%, #1a3a8f 100%);
  transform: translateY(-1px);
}

.btn-submit i {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: center;
    padding: 25px;
  }
  
  .profile-row {
    grid-template-columns: 1fr;
  }
  
  .secondary-actions {
    flex-direction: column;
  }
}
</style>
