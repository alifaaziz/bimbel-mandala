<!-- src/components/HalamanAbsensi.vue -->
<script setup>
import { auth, USER_ROLES } from './Absen/auth.js';
import Footer from './footer.vue';
import Absensi from './Absen/Absensi.vue';
import AbsensiTutor from './Absen/AbsensiTutor.vue';
import jadwalHighlight from './Absen/jadwalHighlight.vue';
import JadwalHighlightTutor from './Absen/JadwalHighlightTutor.vue';
import NoProgram from './Absen/NoProgram.vue';
import NoProgramTutor from './Absen/NoProgramTutor.vue';

import { ref, computed } from 'vue';

const hasProgram = ref(true);

// Ambil user yang aktif
const activeUser = computed(() => auth.users.find(u => u.isActive));
</script>

<template>
  <div class="container-absensi padding-components">
    <template v-if="!hasProgram">
      <NoProgramTutor v-if="activeUser && activeUser.role === USER_ROLES.TUTOR" />
      <NoProgram v-else />
    </template>
    <template v-else>
      <template v-if="activeUser && activeUser.role === USER_ROLES.TUTOR">
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
