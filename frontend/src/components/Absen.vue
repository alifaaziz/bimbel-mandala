<script setup>
import Footer from './footer.vue';
import Absensi from './Absen/Absensi.vue';
import jadwalHighlight from './Absen/jadwalHighlight.vue';
</script>

<template>
  <div class="container-absensi">
    <Absensi />
  </div>
  <div class="container-absensi">
    <jadwalHighlight />
  </div>
    <Footer />
</template>

<style setup>
.container-absensi {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 2rem;
}
</style>