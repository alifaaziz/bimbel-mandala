<script setup>
import navbar from './components/beranda/navbar.vue'
import banner from './components/beranda/banner.vue'
import keungggulan from './components/beranda/keunggulan.vue'
import cta from './components/beranda/cta.vue'
import programHighlight from './components/beranda/programHighlight.vue'
import Footer from './components/beranda/footer.vue'
</script>

<template>
  <!-- <p style="position: left;">test</p> -->
  <navbar />
  <div class="part banner">
    <banner />
  </div>
  <div class="part">
    <keungggulan />
  </div>
  <div class="part cta-section">
    <cta />
  </div>
  <div class="part">
    <programHighlight />
  </div>
  <Footer />

</template>

<style scoped>

.banner {
  display: flex; /* Menggunakan Flexbox */
  justify-content: center;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 1rem;
}

.part {
  padding: 4rem 0 0 ;
}

@media (min-width: 982px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    min-height: 0;
  }
}

.cta-section {
  position: relative; /* Dibutuhkan untuk pseudo-element */
  background-image: url('./assets/bgCta.png'); /* Ganti dengan path gambar Anda */
  background-size: cover;
  background-position: center;
  width: 100%;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Warna overlay gelap dengan transparansi */
  z-index: 1; /* Pastikan overlay berada di atas background */
}

.cta-section > * {
  position: relative;
  z-index: 2; /* Pastikan konten berada di atas overlay */
}
</style>
