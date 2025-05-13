import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../auth/Login.vue";
import Register from "../auth/Register.vue";
import ForgotPassword from "../auth/ForgotPassword.vue";
import OtpForgotPassword from "../auth/OtpForgotPassword.vue";
import UpdatePassword from "../auth/UpdatePassword.vue";
import VerifyEmail from "../auth/VerifyEmail.vue";
import Profile from "../views/Profile.vue";
import MemberList from "../views/MemberList.vue";
import Dashboard from "../admin/Dashboard.vue";
import EventManager from "../admin/EventManager.vue";
import HelloAdmin from "../admin/HelloAdmin.vue";
import AdminProfile from "../admin/AdminProfile.vue";
import RewardDiscipline from "../views/RewardDiscipline.vue";
import ApprovalHistory from "../views/ApprovalHistory.vue";
import Approve from "../admin/Approve.vue";
import EliteMember from "../admin/EliteMember.vue";
import PromulgateDocuments from "../admin/PromulgateDocuments.vue";
import ListMajor from "../views/ListMajor.vue";

const routes = [
  // HomeView
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  //--------------------------------------------------------------------------------------------------
  // Auth
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Register",
    name: "Register",
    component: Register,
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/ForgotPassword",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/OtpForgotPassword",
    name: "OtpForgotPassword",
    component: OtpForgotPassword,
  },
  {
    path: "/UpdatePassword",
    name: "UpdatePassword",
    component: UpdatePassword,
  },
  {
    path: "/VerifyEmail",
    name: "VerifyEmail",
    component: VerifyEmail,
  },
  {
    path: "/MemberList",
    name: "MemberList",
    component: MemberList,
  },
  {
    path: "/RewardDiscripline",
    name: "RewardDiscripline",
    component: RewardDiscipline,
  },
  {
    path: "/EventsDetail/:id",
    name: "EventsDetail",
    component: EventsDetail,
  },
  {
    path: "/ListMajor",
    name: "ListMajor",
    component: ListMajor,
  },

  // Admin
  {
    path: "/Dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/HelloAdmin",
    name: "HelloAdmin",
    component: HelloAdmin,
  },
  {
    path: "/EventManager",
    name: "EventManager",
    component: EventManager,
  },
  {
    path: "/AdminProfile",
    name: "AdminProfile",
    component: AdminProfile,
  },
  {
    path: "/ApprovalHistory",
    name: "ApprovalHistory",
    component: ApprovalHistory,
  },
  {
    path: "/Approve",
    name: "Approve",
    component: Approve,
  },
  {
    path: "/EliteMember",
    name: "EliteMember",
    component: EliteMember,
  },
  {
    path: "/Documents",
    name: "Documents",
    component: PromulgateDocuments,
  },

  // Secretary
   {
    path: "/SecretaryProfile",
    name: "SecretaryProfile",
    component: SecretaryProfile,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

import { useUserStore } from "../store/userStore";
import EventsDetail from "../views/EventsDetail.vue";
import SecretaryProfile from "../views/SecretaryProfile.vue";

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  const adminRoutes = [
    "/Dashboard",
    "/HelloAdmin",
    "/EventManager",
    "/AdminProfile",
    "/Approve",
    "/EliteMember",
    "/Documents"
  ];
  const isAdminRoute = adminRoutes.includes(to.path);

  // console.log("Chuyển đến:", to.path);
  // console.log("Thông tin người dùng trước khi kiểm tra:", userStore.memberInfo);

  // Nếu là trang admin
  if (isAdminRoute) {
    // Nếu chưa có memberInfo thì gọi API lấy
    if (!userStore.memberInfo) {
      const result = await userStore.getMemberInfo();
      console.log("Lấy lại memberInfo sau reload:", result);
    }

    // Sau khi gọi API vẫn không có hoặc là Đoàn viên -> chặn
    if (
      !userStore.memberInfo ||
      userStore.memberInfo.roleName === "Đoàn viên" ||
      userStore.memberInfo.roleName === "Bí thư đoàn viên"
    ) {
      console.log("Chặn truy cập admin do không đủ quyền");
      return next("/");
    }
  }

  next();
});

export default router;
