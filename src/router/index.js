import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../auth/Login.vue";
import Header from "../components/Header.vue";
import NavHeader from "../components/NavHeader.vue";

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
  // path views
  {
    path: "/Home",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/header",
    name: "header",
    component: Header,
  },
  {
    path: "/navheader",
    name: "navheader",
    component: NavHeader,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
