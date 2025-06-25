<template>
  <div class="active-programs-widget">
    <n-space vertical :size="16">
      <n-h3 class="widget-title">Program Aktif</n-h3>

      <n-card
        v-for="program in activePrograms"
        :key="program.id"
        class="program-item-card"
        :bordered="false"
        content-style="padding: 16px;"
      >
        <n-thing>
          <template #header>
            <span class="program-subject">{{ program.subject }}</span>
          </template>

          <template #header-extra>
            <span class="program-code">{{ program.code }}</span>
          </template>
          
          <template #description>
            <span class="program-teacher">{{ program.teacher }}</span>
          </template>
        </n-thing>
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { NCard, NSpace, NH3, NThing } from 'naive-ui';

// Data reaktif untuk daftar program aktif.
// Diambil langsung dari contoh pada gambar.
const activePrograms = ref([
  {
    id: 1,
    subject: 'Matematika SMA',
    teacher: 'Pak Dendy Wan S.Pd',
    code: '#11234'
  },
  {
    id: 2,
    subject: 'Matematika SD',
    teacher: 'Bu Luna S.Pd',
    code: '#11355'
  },
  {
    id: 3,
    subject: 'Fisika SMA',
    teacher: 'Bu Wendy S.Pd',
    code: '#11237'
  },
  {
    id: 4,
    subject: 'Seni SMA',
    teacher: 'Pak Wahyu Hendi S.Pd',
    code: '#11244'
  }
]);
</script>

<style scoped>
.active-programs-widget {
  max-width: 400px;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
}

.widget-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.5rem;
  color: #1e3a8a; /* Biru Tua */
}

.program-item-card {
  background-color: #eef2ff; /* Warna latar biru keabuan yang sangat muda */
  border-radius: 12px;
}

.program-subject {
  font-weight: 600;
  color: #1e293b; /* Hitam keabuan */
}

.program-teacher {
  color: #475569; /* Abu-abu */
  font-size: 0.9rem;
}

.program-code {
  color: #64748b; /* Abu-abu lebih terang */
  font-size: 0.9rem;
  font-weight: 500;
}
</style>