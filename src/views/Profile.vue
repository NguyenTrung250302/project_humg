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
const isPasswordVisible = ref(false); 



const userInfo = ref(null);
onMounted(async () => {
  await userStore.getMemberInfo(); 
  userInfo.value = userStore.memberInfo;
  
  if (userInfo.value?.birthdate) {
    userInfo.value.birthdate = formatDate(userInfo.value.birthdate);
  }
  if (userInfo.value?.dateOfJoining) {
    userInfo.value.dateOfJoining = formatDate(userInfo.value.dateOfJoining);
  }
  console.log(userInfo.value);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

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

  const result = await userStore.changePassword(oldPassword.value, newPassword.value, confirmPassword.value);

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
      userInfo.value.urlAvatar = reader.result;
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
      <div class="profile-avatar">
        <input type="file" id="avatar-upload" class="avatar-upload" @change="changeAvatar" />
        <label for="avatar-upload" class="avatar-label">
          <img :src="userInfo?.urlAvatar || ''" alt="Avatar" class="avatar-img" />
        </label>
        <label for="avatar-upload" class="change-avatar-text" style="text-decoration: none;">Thay đổi ảnh đại diện</label>
      </div>

      <div v-if="isAvatarChanged" class="confirm-avatar-change">
        <button @click="submitAvatarChange" class="btn-confirm-avatar-change">
          Xác nhận thay đổi ảnh
        </button>
      </div>

      <div class="profile-details">
        <div class="profile-item">
          <div class="profile-label">Họ Tên:</div>
          <input type="text" :value="userInfo?.fullName || ''" class="profile-input" />
        </div>
        <div class="profile-item">
          <div class="profile-label">Email:</div>
          <input type="email" :value="userInfo?.email || ''" class="profile-input" disabled/>
        </div>
        <div class="profile-item">
          <div class="profile-label">Số điện thoại:</div>
          <input type="email" :value="userInfo?.phoneNumber || ''" class="profile-input"/>
        </div>
        <div class="profile-item">
          <div class="profile-label">Mã sinh viên:</div>
          <input type="email" :value="userInfo?.maSV || ''" class="profile-input" disabled/>
        </div>
        <div class="profile-item">
          <div class="profile-label">Ngày sinh:</div>
          <input type="text" :value="userInfo?.birthdate || ''" class="profile-input"/>
        </div>
        <div class="profile-item">
          <div class="profile-label">Lớp:</div>
          <input type="text" :value="userInfo?.class || ''" class="profile-input" />
        </div>
        <div class="profile-item">
          <div class="profile-label">Quốc tịch:</div>
          <input type="text" :value="userInfo?.nation || ''" class="profile-input" />
        </div>
        <div class="profile-item">
          <div class="profile-label">Dân tộc:</div>
          <input type="text" :value="userInfo?.religion || ''" class="profile-input"/>
        </div>
        <div class="profile-item">
          <div class="profile-label">Chức vụ:</div>
          <input type="text" :value="userInfo?.roleName || ''" class="profile-input" disabled/>
        </div>
        <div class="profile-item">
          <div class="profile-label">Ngày gia nhập đoàn:</div>
          <input type="text" :value="userInfo?.dateOfJoining || ''" class="profile-input"/>
        </div>
        <div class="profile-item">
          <div class="profile-label">Nơi gia nhập đoàn:</div>
          <input type="text" :value="userInfo?.placeOfJoining || ''" class="profile-input"/>
        </div>
        <div class="profile-item">
          <div class="profile-label">Chính trị:</div>
          <input type="text" :value="userInfo?.politicalTheory || ''" class="profile-input"/>
        </div>
      </div>

      <div class="btn-logout">
        <button @click="submitProfileChanges" class="btn-action">
          Xác nhận sửa thông tin
        </button>
      </div>
          
      <div class="action-buttons">
        <div class="btn-change-password">
          <button @click="togglePasswordForm" class="btn-action">
            Đổi mật khẩu
          </button>
        </div>

        <div class="btn-logout">
          <button @click="logout" class="btn-action">
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
  max-width: 650px; 
  background-color: #fff;
  padding: 30px; 
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  text-align: center;
  margin-bottom: 30px;
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
  font-size: 18px;
  margin-bottom: 30px; 
}

.profile-item {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 15px;
}

.profile-label {
  font-weight: 600;
  color: #333;
  width: 30%; 
  margin-right: 10px;
}

.profile-input {
  font-size: 15px;
  width: 65%;
  padding: 12px;
  margin-top: 10px;
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

.input-field {
  width: 100%;
  padding: 12px;
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