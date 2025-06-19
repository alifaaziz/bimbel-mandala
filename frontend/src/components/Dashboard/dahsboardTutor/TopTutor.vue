<script setup>
import { ref } from 'vue';

// --- 1. State Management ---
// Data dummy untuk daftar top tutor sesuai gambar
const topTutors = ref([
  { id: 1, name: 'Pak Dendy Wan S.Pd', completed: 12 },
  { id: 2, name: 'Bu Susi Wati S.Pd', completed: 7 },
  { id: 3, name: 'Pak Wahyu Hendi S.Pd', completed: 6 },
  { id: 4, name: 'Bu Luna S.Pd', completed: 5 },
  { id: 5, name: 'Pak Indra Jaya S.Pd', completed: 2 },
]);
</script>

<template>
  <div class="top-tutor-widget">
    <n-space vertical :size="24">
      <n-h2 class="widget-title">Top Tutor</n-h2>

      <div class="tutor-list-container">
        <div class="list-row header">
          <span class="column-name">Nama</span>
          <span class="column-completed">P. Selesai</span>
        </div>

        <div
          v-for="tutor in topTutors"
          :key="tutor.id"
          class="list-row"
        >
          <span class="column-name">{{ tutor.name }}</span>
          <span class="column-completed data">{{ tutor.completed }}</span>
        </div>
      </div>
    </n-space>
  </div>
</template>

<style scoped>
.top-tutor-widget {
  background-color: #ffffff;
  padding: 24px 28px;
  border-radius: 20px;
  max-width: 400px;
  margin: 20px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.widget-title {
  margin: 0;
  font-weight: 700;
  color: #1e3a8a; /* Warna biru tua */
}

.tutor-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Jarak vertikal antar baris */
}

.list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-row.header {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e3a8a; /* Warna biru tua */
  padding-bottom: 8px; /* Sedikit padding di bawah header */
}

.column-name {
  flex: 1; /* Memastikan kolom nama mengambil sisa ruang */
  padding-right: 16px; /* Jarak antara kolom nama dan kolom selesai */
  color: #333;
}

.column-completed {
  min-width: 60px; /* Lebar minimum untuk kolom P. Selesai */
  text-align: right;
}

.column-completed.data {
  color: #6b7d9e; /* Warna biru keabuan untuk angka */
  font-weight: 500;
  font-size: 1.1rem;
}

.list-row.header .column-name,
.list-row.header .column-completed {
    color: #1e3a8a;
}
</style>