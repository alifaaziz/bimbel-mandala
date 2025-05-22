<script setup>
import { auth, USER_ROLES } from '@/components/Absen/auth.js';

const currentUser = auth.users.find(user => user.isActive);
const isTutor = currentUser && currentUser.role === USER_ROLES.TUTOR;

// Contoh data stat, silakan ganti dengan data dinamis jika ada
const stat = {
  terbuka: 2,
  berjalan: 1,
  selesai: 3
};
</script>

<template>
  <div class="stats-container">
    <template v-if="isTutor">
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
        <p class="value hero">01</p>
      </div>
      <div class="stat-box">
        <p class="label headersb1">Program Selesai</p>
        <p class="value hero">03</p>
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
