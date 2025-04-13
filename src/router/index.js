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












];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
