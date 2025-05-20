<script setup>
import navbar from './components/navbar.vue';
</script>

<template>
  <div class="Main">
    <navbar />
    <router-view />
  </div>
</template>

<script>
export default {
  watch: {
    $route(to, from) {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style>
.Main {
  max-width: 100%;
  margin-top: 32px;
  background-color: white; 
}
</style>

