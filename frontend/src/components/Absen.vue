<!-- src/components/HalamanAbsensi.vue -->
<script setup>
import Footer from './footer.vue';
import Absensi from './Absen/Absensi.vue';
import AbsensiTutor from './Absen/AbsensiTutor.vue';
import jadwalHighlight from './Absen/jadwalHighlight.vue';
import JadwalHighlightTutor from './Absen/JadwalHighlightTutor.vue';
import NoProgram from './Absen/NoProgram.vue';
import NoProgramTutor from './Absen/NoProgramTutor.vue';

import { ref, onMounted } from 'vue';

const hasProgram = ref(true);
const userRole = ref(null);

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const resUser = await fetch('/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (resUser.ok) {
    const data = await resUser.json();
    userRole.value = data.data?.role || null;
  }

  const resStat = await fetch('/packages/statistics/my', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (resStat.ok) {
    const stat = await resStat.json();
    hasProgram.value = (stat.runningClasses || 0) !== 0;
  } else {
    hasProgram.value = false;
  }
});
</script>

<template>
  <div class="container-absensi padding-components">
    <template v-if="!hasProgram">
      <div v-if="userRole === 'tutor'">
        <NoProgramTutor />
      </div>
      <NoProgram v-else />
    </template>
    <template v-else>
      <template v-if="userRole === 'tutor'">
        <AbsensiTutor />
        <JadwalHighlightTutor />
      </template>
      <template v-else>
        <Absensi />
        <jadwalHighlight />
      </template>
    </template>
  </div>
  <Footer />
</template>

<style scoped>
.container-absensi {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 4rem 0;
}

@media (max-width: 768px) {
  .container-absensi {
    margin: 2rem 0;
  }
}
</style>
