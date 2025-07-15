<script setup>
import { ref, onMounted } from 'vue'

const stat = ref({
  terbuka: 0,
  berjalan: 0,
  selesai: 0
})
const isTutor = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return
  const res = await fetch('/packages/statistics/my', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if ('activePackages' in data) {
    isTutor.value = true
    stat.value.terbuka = data.activePackages || 0
    stat.value.berjalan = data.runningClasses || 0
    stat.value.selesai = data.completedClasses || 0
  } else {
    isTutor.value = false
    stat.value.berjalan = data.runningClasses || 0
    stat.value.selesai = data.completedClasses || 0
  }
})
</script>

<template>
  <div class="stats-container">
    <template v-if="isTutor">
      <!-- Tampilkan statistik tutor -->
      <div class="stat-box">
        <p class="label headersb1">Program Terbuka</p>
        <p class="value hero">{{ stat.terbuka.toString().padStart(2, '0') }}</p>
      </div>
      <div class="stat-box">
        <p class="label headersb1">Program Berjalan</p>
        <p class="value hero">{{ stat.berjalan.toString().padStart(2, '0') }}</p>
      </div>
      <div class="stat-box">
        <p class="label headersb1">Program Selesai</p>
        <p class="value hero">{{ stat.selesai.toString().padStart(2, '0') }}</p>
      </div>
    </template>
    <template v-else>
      <div class="stat-box">
        <p class="label headersb1">Program Berjalan</p>
        <p class="value hero">{{ stat.berjalan.toString().padStart(2, '0') }}</p>
      </div>
      <div class="stat-box">
        <p class="label headersb1">Program Selesai</p>
        <p class="value hero">{{ stat.selesai.toString().padStart(2, '0') }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  width: 100%;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-box {
  flex: 1;
  min-width: 120px;
  text-align: center;
  border-radius: 16px;
  padding: 1.2rem 0.5rem;
  margin-bottom: 1rem;
}

.label {
  color: #f58220;
}

.value {
  color: #0f3b71;
  font-size: 2.2rem;
  font-weight: bold;
}

/* Responsive untuk mobile */
@media (max-width: 700px) {
  .stats-container {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  .stat-box {
    width: 100%;
    min-width: unset;
    margin-bottom: 0;
    padding: 1rem 0.5rem;
    font-size: 1rem;
  }
  .value {
    font-size: 1.6rem;
  }
}
</style>
