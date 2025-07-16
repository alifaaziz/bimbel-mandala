<script setup>
import { ref, onMounted } from 'vue';
import Footer from '../footer.vue';
import navbarDetailJadwal from './navbarDetailJadwal.vue';
import KontenDetailJadwal from './KontenDetailJadwal.vue';
import KontenDetailJadwalTutor from './KontenDetailJadwal_Tutor.vue';

const isTutor = ref(false);

onMounted(async () => {
  window.scrollTo(0, 0);
  const token = localStorage.getItem('token');
  if (!token) return;
  const res = await fetch('localhost:3000/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (res.ok) {
    const data = await res.json();
    isTutor.value = data.data?.role === 'tutor';
  }
});
</script>

<template>
  <navbarDetailJadwal/>
  <div class="detail-container padding-components">
    <KontenDetailJadwalTutor v-if="isTutor" />
    <KontenDetailJadwal v-else />
  </div>
  <Footer />
</template>

<style setup>
.detail-container {
  margin-top: 104px;
}
</style>