<template>
  <n-card class="top-siswa-widget" :bordered="false">
    <n-space vertical :size="20">
      <n-h3 class="widget-title">Top Siswa</n-h3>

      <div class="siswa-list">
        <div class="list-row header-row">
          <span class="header-text">Nama</span>
          <span class="header-text">Program</span>
        </div>

        <div
          v-for="student in topStudents"
          :key="student.id"
          class="list-row student-row"
        >
          <span class="student-name">{{ student.name }}</span>
          <span class="student-program">{{ student.program }}</span>
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
.top-siswa-widget {
  max-width: 350px; /* Atur lebar maksimum widget */
  border-radius: 16px; /* Sudut yang lebih bulat sesuai gambar */
  background-color: #f8faff; /* Latar belakang soft-white/blue */
  padding: 16px; /* Padding internal untuk widget */
  font-family: 'Inter', sans-serif; /* Menggunakan font yang lebih modern */
}

.widget-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.5rem;
  color: #0F2C5A; /* Warna biru tua untuk judul */
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

.header-text {
  font-weight: 600;
  font-size: 1.1rem;
  color: #0F2C5A; /* Warna biru tua yang sama dengan judul */
}

.student-row {
  border-top: 1px solid #e8eef8; /* Garis pemisah tipis antar siswa */
}

.student-name {
  font-size: 1rem;
  color: #334155; /* Warna abu-abu tua untuk nama */
}

.student-program {
  font-size: 1rem;
  font-weight: 500;
  color: #3b82f6; /* Warna biru untuk nomor program */
}
</style>