<template>
  <div class="siswa-terbaru-widget">
    <n-space vertical :size="16">
      <h2 class="headerb2 widget-title">Siswa Terbaru</h2>

      <n-card
        v-for="student in newStudents"
        :key="student.id"
        class="student-card"
        :bordered="false"
        hoverable
      >
        <div class="card-content">
          <div class="student-info">
            <div class="bodysb1 student-name">{{ student.name }}</div>
            <n-text :depth="3" class="bodym2">{{ student.date }}</n-text>
          </div>

          <div class="student-level">
            <n-tag :bordered="false" size="large" round>
              {{ student.level }}
            </n-tag>
          </div>
        </div>
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NCard, NSpace, NH2, NText, NTag } from 'naive-ui';
import { formatTanggal } from '@/utils/formatTanggal';

const newStudents = ref([]);

async function fetchNewStudents() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/users/new-students?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const json = await res.json();
    // Pastikan struktur respons sesuai backend kamu
    newStudents.value = (json.data?.data || []).map(student => ({
      id: student.id,
      name: student.name,
      level: student.level,
      date: formatTanggal(student.createdAt),
    }));
  } catch (err) {
    newStudents.value = [];
  }
}

onMounted(fetchNewStudents);
</script>

<style scoped>
.siswa-terbaru-widget {
  border-radius: 12px; /* Sudut yang lebih bulat sesuai gambar */
  background-color: #f8faff; /* Latar belakang soft-white/blue */
  padding: 24px; /* Padding internal untuk widget */
}

.widget-title {
  color: #154484; /* Warna biru tua sesuai gambar */
}

/* Kustomisasi n-card agar sesuai dengan desain */
:deep(.student-card.n-card) {
  background-color: #EFF4FB; /* Warna latar belakang kartu */
  border-radius: 12px; /* Membuat sudut lebih bulat */
}
:deep(.student-card.n-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
:deep(.student-card > .n-card__content) {
    padding: 16px !important;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  color: #1e1e1e;
}

.student-level {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Kustomisasi n-tag agar mirip teks biasa tapi tetap komponen Naive */
:deep(.n-tag) {
  color: #6B7280; /* Warna abu-abu untuk jenjang */
  background-color: transparent;
  font-weight: 500;
  font-size: 1rem;
  padding-right: 0; /* Menghapus padding agar rata kanan */
}
</style>