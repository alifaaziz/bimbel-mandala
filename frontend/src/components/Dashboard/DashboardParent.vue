<script setup>
    import sidebar from '@/components/Dashboard/sideBar.vue';
</script>

<template>
    <div class="dashboard-container">
      <div>
        <sidebar />
      </div>
    <router-view />
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #f8f9fa;
}
</style>