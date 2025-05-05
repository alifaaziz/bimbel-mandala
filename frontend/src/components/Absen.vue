<script setup>
import Footer from './footer.vue';
import Absensi from './Absen/Absensi.vue';
import jadwalHighlight from './Absen/jadwalHighlight.vue';
</script>

<template>
  <div class="container-absensi padding-components">
    <Absensi />
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
  margin: 4rem 0;
}

@media (max-width: 768px) {
  .container-absensi {
    margin: 2rem 0;
  }
}
</style>