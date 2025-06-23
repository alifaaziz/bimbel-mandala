<script setup>
import siswaView from './siswaView.vue';
import siswaTerbaru from './siswaTerbaru.vue';
import topSiswa from './topSiswa.vue';
</script>

<template>
    <div class=" main-content">
        <siswaView />
        <div>
            <topSiswa />
            <siswa-terbaru />
        </div>
    </div>
</template>

<style setup>
.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  justify-content: space-between;
  padding: 20px 30px; /* Padding untuk konten utama */
  overflow-y: auto;
  background-color: #091c36;
}
</style>