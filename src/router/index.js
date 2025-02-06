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
    name: "HomeView",
    component: HomeView,
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
    path: "/UpdatePassSuccess",
    name: "UpdatePassSuccess",
    component: UpdatePassSuccess,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;