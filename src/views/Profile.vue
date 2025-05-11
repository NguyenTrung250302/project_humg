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
  <Header></Header>
  <NavHeader></NavHeader>

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
        <div v-if="isAvatarChanged" class="confirm-avatar-change">
          <button @click="updateAvatar" class="btn-confirm-avatar-change">
            Xác nhận
          </button>
        </div>
      </div>
      <div class="profile-details">
        <div class="profile-fields">
          <div class="profile-item">
            <div class="profile-row">
              <div class="profile-label">Họ Tên:</div>
              <input v-model="userInfo.fullName" class="profile-input" />
              <div class="profile-label">Email:</div>
              <input
                type="email"
                :value="userInfo?.email || ''"
                class="profile-input"
                disabled
              />
            </div>
          </div>
          <div class="profile-item">
            <div class="profile-row">
              <div class="profile-label">Số điện thoại:</div>
              <input
                v-model="userInfo.phoneNumber"
                type="email"
                class="profile-input"
              />
              <div class="profile-label">Mã sinh viên:</div>
              <input :value="userInfo?.maSV || ''" class="profile-input" disabled />
            </div>
          </div>
          <div class="profile-item">
            <div class="profile-row">
              <div class="profile-label">Ngày sinh:</div>
              <input
                v-model="userInfo.birthdate"
                type="text"
                class="profile-input"
              />
              <div class="profile-label">Lớp:</div>
              <input v-model="userInfo.class" type="text" class="profile-input" />
            </div>
          </div>
          <div class="profile-item">
            <div class="profile-row">
              <div class="profile-label">Giới tính</div>
              <input
                v-model="userInfo.gender"
                type="text"
                class="profile-input"
              />
              <div class="profile-label">Chuyên ngành</div>
              <input v-model="userInfo.major" type="text" class="profile-input" />
            </div>
          </div>
          <div class="profile-item">
            <div class="profile-row">
              <div class="profile-label">Quốc tịch:</div>
              <input v-model="userInfo.nation" type="text" class="profile-input" />
              <div class="profile-label">Dân tộc:</div>
              <input
                v-model="userInfo.religion"
                type="text"
                class="profile-input"
              />
            </div>
          </div>
          <div class="profile-item">
            <div class="profile-row">
              <div class="profile-label">Chức vụ:</div>
              <input
                v-model="userInfo.roleName"
                type="text"
                class="profile-input"
                disabled
              />
              <div class="profile-label">Ngày gia nhập đoàn:</div>
              <input
                v-model="userInfo.dateOfJoining"
                type="text"
                class="profile-input"
              />
            </div>
          </div>
          <div class="profile-item">
            <div class="profile-row">
              <div class="profile-label">Nơi gia nhập đoàn:</div>
              <input
                v-model="userInfo.placeOfJoining"
                type="text"
                class="profile-input"
              />
              <div class="profile-label">Chính trị:</div>
              <input
                v-model="userInfo.politicalTheory"
                type="text"
                class="profile-input"
              />
            </div>
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
  max-width: 1300px;
  background: linear-gradient(90deg, #ffffff, rgba(236, 236, 236, 0.034));
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.profile-avatar {
  flex: 0 0 170px;
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
  background-color: #2fb74f;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
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
  flex-direction: column;
  flex: 1;
}

.profile-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.profile-item {
  display: flex;
  flex-direction: column;
}

.profile-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  align-items: center;
}

.profile-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  flex: 0 0 150px;
}

.profile-input {
  font-size: 14px;
  width: 100%;
  max-width: 500px;
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
