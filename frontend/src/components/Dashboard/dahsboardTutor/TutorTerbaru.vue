<script setup>
import { ref } from 'vue';

// --- 1. State Management ---
// Data dummy untuk daftar tutor terbaru
// Perhatikan bahwa tanggalnya sesuai dengan gambar: 12 Maret 2025
const latestTutors = ref([
  { id: 1, name: 'Pak Indra Jaya S.Pd', date: '12 Maret 2025', level: 'SMA' },
  { id: 2, name: 'Bu Susi Wati S.Pd', date: '12 Maret 2025', level: 'SMP' },
  { id: 3, name: 'Bu Luna S.Pd', date: '12 Maret 2025', level: 'SD' },
]);

// Fungsi untuk memberikan tipe warna pada n-tag berdasarkan jenjang
const getTagType = (level) => {
  switch (level) {
    case 'SMA':
      return 'success';
    case 'SMP':
      return 'info';
    case 'SD':
      return 'warning';
    default:
      return 'default';
  }
};
</script>

<template>
  <div class="latest-tutors-widget">
    <n-space vertical :size="20">
      <n-h2 class="widget-title">Tutor Terbaru</n-h2>

      <n-space vertical size="medium">
        <div
          v-for="tutor in latestTutors"
          :key="tutor.id"
          class="tutor-item-card"
        >
          <div class="tutor-info">
            <div class="tutor-name">{{ tutor.name }}</div>
            <div class="tutor-date">{{ tutor.date }}</div>
          </div>

          <div class="tutor-level">
            <n-tag size="small" :bordered="false" :type="getTagType(tutor.level)">
              {{ tutor.level }}
            </n-tag>
          </div>
        </div>
      </n-space>
    </n-space>
  </div>
</template>

<style scoped>
.latest-tutors-widget {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 20px;
  max-width: 400px; /* Lebar optimal untuk widget seperti ini */
  margin: 20px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.widget-title {
  margin: 0;
  font-weight: 700;
  color: #1e3a8a; /* Warna biru tua sesuai gambar */
}

.tutor-item-card {
  /* Mengatur tata letak flexbox untuk item */
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Rata atas agar tag sejajar dengan nama */
  background-color: #eef2f7; /* Latar belakang abu-abu muda */
  padding: 16px;
  border-radius: 12px;
}

.tutor-info {
  /* Container untuk nama dan tanggal */
  display: flex;
  flex-direction: column;
  gap: 4px; /* Jarak antara nama dan tanggal */
}

.tutor-name {
  font-size: 1rem; /* Ukuran font 16px */
  font-weight: 600;
  color: #1f2937;
}

.tutor-date {
  font-size: 0.875rem; /* Ukuran font 14px */
  color: #6b7280; /* Warna abu-abu untuk tanggal */
}

.tutor-level .n-tag {
  /* Styling tambahan untuk tag jika diperlukan */
  font-weight: 500;
}
</style>