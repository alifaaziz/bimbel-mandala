<script setup>
import sideBar from './sideBar.vue';
</script>

<template>
  <div class="dashboard-container">
    <sideBar />
    <router-view/>
  </div>
</template>

<style scoped>
.dashboard-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
  z-index: 1000;
  background-color: #f8f9fa;
}
</style>