<script setup>
import siswaView from './siswaView.vue';
import siswaTerbaru from './siswaTerbaru.vue';
import topSiswa from './topSiswa.vue';
</script>

<template>
    <div class="main-content">
        <siswaView />
        <div class="right-side">
            <topSiswa />
            <siswa-terbaru />
        </div>
    </div>
</template>

<style setup>
.main-content {
  gap: 8px;
  justify-content: space-between;
  padding: 20px;
  overflow-y: auto;
  background-color: #0B2343;
}
.right-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 288px;
}
</style>