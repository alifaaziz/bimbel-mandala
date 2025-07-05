<script setup>
import { ref, onMounted } from 'vue';

// Format tanggal ke "DD MMMM YYYY" (contoh: 12 Maret 2025)
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

const latestTutors = ref([]);

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

const fetchLatestTutors = async () => {
  try {
    const res = await fetch('http://localhost:3000/users/tutors?page=1&limit=3');
    const json = await res.json();
    latestTutors.value = json.data.map(tutor => ({
      id: tutor.id,
      name: tutor.name,
      date: formatDate(tutor.joinDate || tutor.createdAt),
      level: tutor.teachLevel
    }));
  } catch (e) {
    latestTutors.value = [];
  }
};

onMounted(fetchLatestTutors);
</script>

<template>
  <div class="latest-tutors-widget">
    <n-space vertical :size="20">
      <h2 class="headerb2 widget-title">Tutor Terbaru</h2>

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
  border-radius: 12px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.widget-title {
  color: #154484; /* Warna biru tua sesuai gambar */
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