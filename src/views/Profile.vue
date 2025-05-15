<script setup>
import { onMounted, ref } from "vue";
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
    politicalTheory: userInfo.value.politicalTheory || null,
    nation: userInfo.value.nation || null,
    birthdate: userInfo.value.birthdate || null,
    religion: userInfo.value.religion || null,
    dateOfJoining: userInfo.value.dateOfJoining || null,
    phoneNumber: userInfo.value.phoneNumber || null,
    classValue: userInfo.value.class || null,
    fullName: userInfo.value.fullName || null,
    placeOfJoining: userInfo.value.placeOfJoining || null,
    gender: userInfo.value.gender || null,
    major: userInfo.value.major || null,
    courseIntake: userInfo.value.courseIntake || null,
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
    router.push("/Login");
  }, 1500);
};
</script>

<template>
  <Header></Header>
  <NavHeader></NavHeader>

  <div class="profile-layout">
    <div class="profile-cer">
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
          <div class="profile-actions">  
            <div class="secondary-actions">
              <button @click="togglePasswordForm" class="btn-change-password">
                <i class="fas fa-key"></i> Đổi mật khẩu
              </button>
            </div>
            <div class="secondary-actions">
              <button @click="logout" class="btn-logout">
                <i class="fas fa-sign-out-alt"></i> Đăng xuất
              </button>
            </div>
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
                    disabled
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
                  <input :value="userInfo?.maSV || ''" class="profile-input" disabled />
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
                  <select v-model="userInfo.major" class="profile-input">
                    <option value="CongNghePhanMem">Công Nghệ Phần Mềm</option>
                    <option value="TinHocKinhTe">Tin Học Kinh Tế</option>
                    <option value="TinHocTracDia">Tin Học Trắc Địa</option>
                    <option value="MangMayTinh">Mạng Máy Tính</option>
                    <option value="HeThongThongTinVaTriThuc">Hệ Thống Thông Tin Và Tri Thức</option>
                  </select>
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
                    disabled
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
            <div class="profile-item">
              <div class="profile-row">
                <div class="profile-field">
                  <label class="profile-label">Khóa:</label>
                  <select
                    v-model="userInfo.courseIntake"
                    class="profile-input"
                  >
                    <option value="66">66</option>
                    <option value="67">67</option>
                    <option value="68">68</option>
                    <option value="69">69</option>
                    <option value="70">70</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div class="profile-actions">
            <button @click="updateProfile" class="btn-update">
              <i class="fas fa-save"></i> Cập nhật thông tin
            </button>
          </div>

          <div v-if="showPasswordForm" class="dialog-overlay" @click="togglePasswordForm">
            <div class="dialog-content" @click.stop>
              <div class="dialog-header">
                <h3 class="dialog-title">
                  <i class="fas fa-lock"></i>
                  Đổi mật khẩu
                </h3>
                <button class="btn-close" @click="togglePasswordForm">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="dialog-body">
                <div class="input-group">
                  <div class="input-container">
                    <label class="input-label">Mật khẩu cũ</label>
                    <input
                      v-model="oldPassword"
                      :type="isOldPasswordVisible ? 'text' : 'password'"
                      placeholder="Nhập mật khẩu cũ"
                      class="input-field"
                    />
                    <button
                      @click="toggleOldPasswordVisibility"
                      class="btn-toggle-password"
                      :title="isOldPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                    >
                      <i :class="isOldPasswordVisible ? 'far fa-eye-slash' : 'far fa-eye'"></i>
                    </button>
                  </div>
                  <div class="input-container">
                    <label class="input-label">Mật khẩu mới</label>
                    <input
                      v-model="newPassword"
                      :type="isNewPasswordVisible ? 'text' : 'password'"
                      placeholder="Nhập mật khẩu mới"
                      class="input-field"
                    />
                    <button
                      @click="toggleNewPasswordVisibility"
                      class="btn-toggle-password"
                      :title="isNewPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                    >
                      <i :class="isNewPasswordVisible ? 'far fa-eye-slash' : 'far fa-eye'"></i>
                    </button>
                  </div>
                  <div class="input-container">
                    <label class="input-label">Xác nhận mật khẩu mới</label>
                    <input
                      v-model="confirmPassword"
                      :type="isConfirmPasswordVisible ? 'text' : 'password'"
                      placeholder="Nhập lại mật khẩu mới"
                      class="input-field"
                    />
                    <button
                      @click="toggleConfirmPasswordVisibility"
                      class="btn-toggle-password"
                      :title="isConfirmPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                    >
                      <i :class="isConfirmPasswordVisible ? 'far fa-eye-slash' : 'far fa-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="dialog-footer">
                <button class="btn-cancel" @click="togglePasswordForm">Hủy</button>
                <button class="btn-submit" @click="submitPasswordChange">
                  <i class="fas fa-check-circle"></i> Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer></Footer>
</template>

<style scoped>
.profile-layout {
  display: flex;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 30px 20px;
  min-height: calc(100vh - 120px);
}

.profile-container {
  width: 100%;
  max-width: 1200px;
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

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

.dialog-header {
  padding: 20px 25px;
  border-bottom: 1px solid #e3e6f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-title {
  color: #2e384d;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.dialog-title i {
  color: #4e73df;
}

.btn-close {
  background: none;
  border: none;
  color: #6e707e;
  font-size: 18px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background-color: #f8f9fc;
  color: #4e73df;
  transform: rotate(90deg);
}

.dialog-body {
  padding: 25px;
}

.dialog-footer {
  padding: 20px 25px;
  border-top: 1px solid #e3e6f0;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 20px;
  background: #f8f9fc;
  color: #6e707e;
  border: 1px solid #e3e6f0;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #eaecf4;
  color: #4e73df;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  color: #5a5c69;
  font-weight: 600;
  font-size: 14px;
}

.input-group {
  display: grid;
  gap: 20px;
  margin-bottom: 25px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.input-field {
  width: 100%;
  padding: 14px 45px 14px 16px;
  border: 2px solid #e3e6f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #f8f9fc;
  height: 48px;
}

.input-field:focus {
  border-color: #4e73df;
  outline: none;
  box-shadow: 0 0 0 4px rgba(78, 115, 223, 0.1);
  background-color: white;
}

.btn-toggle-password {
  position: absolute;
  right: 12px;
  top: 70%;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
  color: #6e707e;
  font-size: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  padding: 0;
}

.btn-toggle-password:hover {
  background-color: #f8f9fc;
  color: #4e73df;
}

.btn-toggle-password:active {
  transform: translateY(-50%) scale(0.95);
}

.btn-toggle-password i {
  transition: all 0.3s ease;
}

.btn-toggle-password:hover i {
  transform: scale(1.1);
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(78, 115, 223, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-submit:hover {
  background: linear-gradient(135deg, #3b5ab8 0%, #1a3a8f 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 115, 223, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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