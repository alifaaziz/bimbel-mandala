<script setup>
import DashboardBiaya from './DashboardBiaya.vue';
import DetailProgramSelesai from './DetailProgramSelesai.vue';
</script>

<template>
    <div class="main-content">
        <DashboardBiaya />
        <div>
            <detail-program-selesai />
        </div>
    </div>
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  justify-content: space-between;
  padding: 20px;
  overflow-y: auto;
  background-color: #0B2343;
}
</style>