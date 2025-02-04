import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../auth/Login.vue";
import Register from "../auth/Register.vue";
import ForgotPassword from "../auth/ForgotPassword.vue";
import OtpForgotPassword from "../auth/OtpForgotPassword.vue";
import UpdatePassword from "../auth/UpdatePassword.vue";
import UpdatePassSuccess from "../auth/UpdatePassSuccess.vue";

const routes = [
  // Redirect '/' to '/Login'
  {
    path: "/",
    redirect: "/Login",
  },
  //--------------------------------------------------------------------------------------------------
  // path auth
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
  // path views
  {
    path: "/Home",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/forgotpassword",
    name: "forgotpassword",
    component: ForgotPassword,
  },
  {
    path: "/otpforgotpassword",
    name: "otpforgotpassword",
    component: OtpForgotPassword,
  },
  {
    path: "/updatepassword",
    name: "updatepassword",
    component: UpdatePassword,
  },
  {
    path: "/updatepasssuccess",
    name: "updatepasssuccess",
    component: UpdatePassSuccess,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;