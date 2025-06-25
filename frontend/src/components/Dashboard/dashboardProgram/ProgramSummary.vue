<template>
  <n-card class="widget-card" title="Ringkasan Program">
    <div class="progress-chart-container">
      <n-progress
        type="circle"
        :percentage="activePercentage"
        :color="colors.active"
        :rail-style="{ stroke: colors.open }"
        :stroke-width="12"
      >
        </n-progress>
    </div>

    <n-divider />

    <n-space justify="space-around" align="start" class="legend-container">
      <div class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: colors.active }"></span>
        <n-statistic>
          <template #label>
            <span class="legend-label">Aktif</span>
          </template>
          {{ activePrograms }}
          <template #suffix>
            <span class="legend-unit">Program</span>
          </template>
        </n-statistic>
      </div>

      <div class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: colors.open }"></span>
        <n-statistic>
          <template #label>
            <span class="legend-label">Dibuka</span>
          </template>
          {{ openPrograms }}
          <template #suffix>
            <span class="legend-unit">Program</span>
          </template>
        </n-statistic>
      </div>
    </n-space>
  </n-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { NCard, NProgress, NSpace, NStatistic, NDivider } from 'naive-ui';

// Definisikan warna agar mudah diubah
const colors = {
  active: '#1d4ed8', // Biru tua
  open: '#f97316'    // Oranye
};

// Data reaktif untuk jumlah program
const activePrograms = ref(15);
const openPrograms = ref(85);

// Hitung total program untuk kalkulasi persentase
const totalPrograms = computed(() => activePrograms.value + openPrograms.value);

// Hitung persentase program aktif secara dinamis
const activePercentage = computed(() => {
  if (totalPrograms.value === 0) {
    return 0;
  }
  return (activePrograms.value / totalPrograms.value) * 100;
});
</script>

<style scoped>
.widget-card {
  max-width: 350px;
  border-radius: 16px; /* Sesuai dengan gambar */
  text-align: center;
}

:deep(.n-card-header) {
  text-align: left;
  font-weight: 600;
}

.progress-chart-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

:deep(.n-progress.n-progress--circle .n-progress-graph) {
  transform: rotate(-90deg); /* Opsi: memutar agar start dari atas */
}

.legend-container {
  padding-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}

.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0; /* Mencegah dot mengecil */
}

:deep(.n-statistic-value) {
  font-size: 1.1rem;
  font-weight: 600;
}

.legend-unit {
  font-weight: 600;
  font-size: 1.1rem;
  margin-left: 0.4em;
}

.legend-label {
  color: #64748b; /* Warna abu-abu untuk sub-teks */
  font-size: 0.9rem;
  font-weight: 500;
}
</style>