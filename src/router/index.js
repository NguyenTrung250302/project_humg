// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import HelloWorld from "../components/HelloWorld.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/Hello",
    name: "Hello",
    component: HelloWorld,
  },

  // ... thêm các routes khác
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Vẫn dùng import.meta.env.BASE_URL
  routes,
});

export default router;
