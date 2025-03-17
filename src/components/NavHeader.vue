<template>
    <div class="nav-header">
        <ul class="nav-header-ul">
            <RouterLink to="/">
                <li class="nav-header-item" tabindex="0">
                    Trang chủ
                </li>
            </RouterLink>
        </ul>
        <ul class="nav-header-ul">
            <RouterLink to="/MemberList">
                <li class="nav-header-item" tabindex="0">
                    Danh sách đoàn viên
                </li>
            </RouterLink>
        </ul>
        <ul class="nav-header-ul">
            <RouterLink to="/">
                <li class="nav-header-item" tabindex="0">
                    Khen thưởng / Kỉ luật
                </li>
             </RouterLink>
        </ul>
        <ul class="nav-header-ul">
            <RouterLink to="/">
                <li class="nav-header-item" tabindex="0">
                    Lịch sử hoạt động
                </li>
            </RouterLink>
        </ul>
        <ul class="nav-header-ul notify-container">
            <svg class="notify-icon" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.99993 0C7.14341 0 5.36294 0.737498 4.05018 2.05025C2.73743 3.36301 1.99993 5.14348 1.99993 7V10.528C2.00008 10.6831 1.96413 10.8362 1.89493 10.975L0.17793 14.408C0.0940568 14.5757 0.0544524 14.7621 0.0628789 14.9494C0.0713053 15.1368 0.127483 15.3188 0.226075 15.4783C0.324668 15.6379 0.462403 15.7695 0.626197 15.8608C0.789992 15.9521 0.974408 16 1.16193 16H16.8379C17.0255 16 17.2099 15.9521 17.3737 15.8608C17.5375 15.7695 17.6752 15.6379 17.7738 15.4783C17.8724 15.3188 17.9286 15.1368 17.937 14.9494C17.9454 14.7621 17.9058 14.5757 17.8219 14.408L16.1059 10.975C16.0364 10.8362 16.0001 10.6832 15.9999 10.528V7C15.9999 5.14348 15.2624 3.36301 13.9497 2.05025C12.6369 0.737498 10.8564 0 8.99993 0ZM8.99993 19C8.37928 19.0003 7.7738 18.8081 7.26695 18.4499C6.76009 18.0917 6.37681 17.5852 6.16993 17H11.8299C11.623 17.5852 11.2398 18.0917 10.7329 18.4499C10.2261 18.8081 9.62058 19.0003 8.99993 19Z" fill="white"/>
            </svg>
        </ul>
        <div class="nav-header-login">
            <div v-if="userInfo">
                <RouterLink to="/Profile">
                <div class="user-info">
                        <img :src="userInfo.urlAvatar" alt="User Avatar" class="user-avatar" />
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
import { ref, onMounted } from 'vue';
import { useUserStore } from '../store/userStore'; 
import { RouterLink } from 'vue-router';

const userStore = useUserStore();

const userInfo = ref(null);
onMounted(async () => {
  await userStore.getMemberInfo(); 
  userInfo.value = userStore.memberInfo; 
});

</script>

<style scoped>
*{
    text-decoration: none;
    color: white;
}
.nav-header{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2D3B8D;
    font-weight: 550;
    padding: 10px 0;
}

ul{
    margin: 0;
    padding: 15px; 
    list-style: none;
    cursor: pointer;
}

li{
    font-size: 18px;
    padding: 10px 15px;
}

li:hover{
    background-color: rgba(255, 255, 255, 0.367);
    border-radius: 5px;
}

.btn-login{
    background-color:#2D3B8D;
    outline: none;
    border: 1px solid white;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 550;
    margin-left: 20px;
}

.btn-login:hover{
    background-color: rgba(255, 255, 255, 0.2);
}

li:focus {
    color: white;
}

.notify-container {
    margin-right: 8px;
}

.user-info {
    display: flex;
    align-items: center;
    padding: 2px 8px;
}

.user-info:hover{
    background-color: rgba(255, 255, 255, 0.367);
    border-radius: 5px;
}

.user-avatar {
    width:50px;
    object-fit: cover;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-name {
    font-size: 16px;
    font-weight: 600;
}
</style>
