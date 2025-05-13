<template>
  <div class="nav-header">
    <ul class="nav-header-ul">
      <RouterLink to="/">
        <li class="nav-header-item" tabindex="0">Trang chủ</li>
      </RouterLink>
    </ul>
    <ul class="nav-header-ul">
      <RouterLink to="/ListMajor">
        <li class="nav-header-item" tabindex="0">Danh sách đoàn viên</li>
      </RouterLink>
    </ul>
    <ul class="nav-header-ul">
      <RouterLink to="/RewardDiscripline">
        <li class="nav-header-item" tabindex="0">Khen thưởng / Kỉ luật</li>
      </RouterLink>
    </ul>
    <ul class="nav-header-ul">
      <RouterLink to="/ApprovalHistory">
        <li class="nav-header-item" tabindex="0">Lịch sử phê duyệt</li>
      </RouterLink>
    </ul>

    <ul class="nav-header-ul notify-container">
      <svg
        class="notify-icon"
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.99993 0C7.14341 0 5.36294 0.737498 4.05018 2.05025C2.73743 3.36301 1.99993 5.14348 1.99993 7V10.528C2.00008 10.6831 1.96413 10.8362 1.89493 10.975L0.17793 14.408C0.0940568 14.5757 0.0544524 14.7621 0.0628789 14.9494C0.0713053 15.1368 0.127483 15.3188 0.226075 15.4783C0.324668 15.6379 0.462403 15.7695 0.626197 15.8608C0.789992 15.9521 0.974408 16 1.16193 16H16.8379C17.0255 16 17.2099 15.9521 17.3737 15.8608C17.5375 15.7695 17.6752 15.6379 17.7738 15.4783C17.8724 15.3188 17.9286 15.1368 17.937 14.9494C17.9454 14.7621 17.9058 14.5757 17.8219 14.408L16.1059 10.975C16.0364 10.8362 16.0001 10.6832 15.9999 10.528V7C15.9999 5.14348 15.2624 3.36301 13.9497 2.05025C12.6369 0.737498 10.8564 0 8.99993 0ZM8.99993 19C8.37928 19.0003 7.7738 18.8081 7.26695 18.4499C6.76009 18.0917 6.37681 17.5852 6.16993 17H11.8299C11.623 17.5852 11.2398 18.0917 10.7329 18.4499C10.2261 18.8081 9.62058 19.0003 8.99993 19Z"
          fill="white"
        />
      </svg>
    </ul>
    <div class="nav-header-login">
      <div v-if="userInfo">
      <RouterLink
        :to="
          userInfo.roleName === 'Liên chi đoàn khoa'
            ? '/HelloAdmin'
            : userInfo.roleName === 'Bí thư đoàn viên'
              ? '/SecretaryProfile'
              : '/Profile'
        "
      >
        <div class="user-info">
          <img
            :src="userInfo.urlAvatar"
            alt="User Avatar"
            class="user-avatar"
          />
          <p class="user-name">{{ userInfo.fullName }}</p>
        </div>
      </RouterLink>
      </div>
      <div v-else>
        <RouterLink to="/Login">
          <button class="btn-login">Đăng nhập</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../store/userStore";
import { RouterLink } from "vue-router";

const userStore = useUserStore();

const userInfo = ref(null);
onMounted(async () => {
  await userStore.getMemberInfo();
  userInfo.value = userStore.memberInfo;
  // console.log("userInfo", userInfo.value.roleName);
});
</script>

<style scoped>
* {
  text-decoration: none;
  color: white;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.nav-header {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a237e, #3949ab);
  font-weight: 600;
  padding: 12px 0;
  box-shadow: 0 4px 20px rgba(26, 35, 126, 0.2);
  position: relative;
  z-index: 100;
}

.nav-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  z-index: -1;
}

.nav-header-ul {
  margin: 0;
  padding: 8px 15px;
  list-style: none;
  cursor: pointer;
  position: relative;
}

.nav-header-item {
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.nav-header-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-header-item:hover::before {
  opacity: 1;
}

.nav-header-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-login {
  background: linear-gradient(135deg, #1a237e, #3949ab);
  outline: none;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-left: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-login::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-login:hover::before {
  opacity: 1;
}

.notify-container {
  margin-right: 8px;
  position: relative;
}

.notify-icon {
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.notify-icon:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.nav-header-login {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  object-fit: cover;
}

.user-info:hover .user-avatar {
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.user-info:hover .user-name {
  color: #ffffff;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nav-header {
    padding: 10px 0;
  }

  .nav-header-item {
    font-size: 14px;
    padding: 8px 15px;
  }

  .btn-login {
    padding: 8px 15px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .nav-header {
    flex-wrap: wrap;
    padding: 8px 0;
  }

  .nav-header-ul {
    padding: 5px 10px;
  }

  .nav-header-item {
    font-size: 13px;
    padding: 6px 12px;
  }

  .btn-login {
    padding: 6px 12px;
    font-size: 13px;
    margin-left: 10px;
  }

  .user-info {
    padding: 4px 10px;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }

  .user-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .nav-header {
    padding: 5px 0;
  }

  .nav-header-ul {
    padding: 3px 8px;
  }

  .nav-header-item {
    font-size: 12px;
    padding: 5px 10px;
  }

  .btn-login {
    padding: 5px 10px;
    font-size: 12px;
    margin-left: 8px;
  }

  .user-info {
    padding: 3px 8px;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
    margin-right: 6px;
  }

  .user-name {
    font-size: 12px;
  }
}
</style>
