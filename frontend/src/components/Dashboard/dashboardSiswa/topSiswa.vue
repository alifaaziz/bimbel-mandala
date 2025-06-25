<template>
  <n-card class="top-siswa-widget" :bordered="false">
    <n-space vertical :size="16">
      <h3 class="headerb2 widget-title">Top Siswa</h3>
      <div class="siswa-list">
        <div class="list-row headersb3 header-row">
          <span class="header-text">Nama</span>
          <span class="header-text">Program</span>
        </div>

        <div
          v-for="student in topStudents"
          :key="student.id"
          class="list-row student-row"
        >
          <span class="bodym2 student-name">{{ student.name }}</span>
          <span class="bodym2 student-program">{{ student.program }}</span>
        </div>
      </div>
    </n-space>
  </n-card>
</template>

<script setup>
import { ref } from 'vue';
import { NCard, NSpace, NH3 } from 'naive-ui';

// Data tiruan (mock data) untuk top siswa
const topStudents = ref([
  { id: 1, name: 'Arell Saverro Biyantoro', program: 2 },
  { id: 2, name: 'Zyan Shainori', program: 2 },
  { id: 3, name: 'Alif Abdul Aziz', program: 1 },
  { id: 4, name: 'Raihan Muhammad R. R.', program: 1 },
  { id: 5, name: 'Yulius Calvin', program: 1 },
]);
</script>

<style scoped>
.top-siswa-widget { /* Atur lebar maksimum widget */
  border-radius: 16px; /* Sudut yang lebih bulat sesuai gambar */
  background-color: #f8faff; /* Latar belakang soft-white/blue */
  padding: 24px; /* Padding internal untuk widget */
}

:deep(.n-card__content) {
  padding: 0;
  padding-top: 0 !important;
}

.widget-title, .header-text {
  color: #154484; /* Warna biru tua untuk judul */
}

.list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px; /* Padding vertikal dan sedikit horizontal */
}

.header-row {
  padding-bottom: 12px;
}

.student-row {
  border-top: 1px solid #e8eef8; /* Garis pemisah tipis antar siswa */
}

.student-name {
  color: #334155; /* Warna abu-abu tua untuk nama */
}

.student-program {
  color: #154484; /* Warna biru untuk nomor program */
}
</style>