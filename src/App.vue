<template>
  <RouterView />
  <router-link to="/hello">home</router-link>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>
