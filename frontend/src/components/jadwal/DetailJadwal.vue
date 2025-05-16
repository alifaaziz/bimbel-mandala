<script setup>
import { onMounted } from 'vue';
import Footer from '../footer.vue';
import navbarDetailJadwal from './navbarDetailJadwal.vue';
import KontenDetailJadwal from './KontenDetailJadwal.vue';

onMounted(() => {
  window.scrollTo(0, 0);
});

</script>

<template>
  <navbarDetailJadwal/>
  <div class="detail-container padding-components">
    <KontenDetailJadwal/>
  </div>
  <Footer />
</template>

<style setup>
.detail-container {
  margin-top: 104px;
}
</style>