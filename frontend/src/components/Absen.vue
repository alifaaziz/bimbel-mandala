<!-- src/components/HalamanAbsensi.vue -->
<script setup>
import { auth, USER_ROLES } from './Absen/auth.js'; // sesuaikan path-nya
import Footer from './footer.vue';
import Absensi from './Absen/Absensi.vue';
import AbsensiTutor from './Absen/AbsensiTutor.vue';
import jadwalHighlight from './Absen/jadwalHighlight.vue';
import JadwalHighlightTutor from './Absen/JadwalHighlightTutor.vue';
import NoProgram from './Absen/NoProgram.vue';

import { ref } from 'vue';

const hasProgram = ref(true); // nanti ganti dengan data dari API kalau perlu
</script>

<template>
  <div class="container-absensi padding-components">
    <NoProgram v-if="!hasProgram" />
    <template v-else>
      <template v-if="auth.user.role === USER_ROLES.TUTOR">
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
