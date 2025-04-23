<script setup>
import banner from './components/beranda/banner.vue'
import keunggulanH from './components/beranda/keunggulanHighlight.vue'
import cta from './components/beranda/cta.vue'
import programHighlight from './components/beranda/programHighlight.vue'
import tutorHighlight from './components/beranda/tutorHighlight.vue'
</script>

<template>
  <div class="content-container">
    <navbar />
    <div class="part banner">
      <banner />
    </div>
    <div class="part">
      <keunggulanH />
    </div>
    <div class="pad_cta">
      <div class="part cta-section">
        <cta />
      </div>
    </div>
    <div class="part">
      <programHighlight />
    </div>
    <div class="part">
      <tutorHighlight />
    </div>
  </div>
</template>

<style scoped>
.content-container {
  padding: 2rem 0;
}
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
  padding: 2rem 0 ;
}


.cta-section {
  position: relative; /* Dibutuhkan untuk pseudo-element */
  background-image: url('./assets/bgCta.png'); /* Ganti dengan path gambar Anda */
  background-size: cover;
  background-position: center;
  width: 100%;
}

.pad_cta {
  padding: 2rem 0;
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

@media (max-width: 982px) {
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
  .content-container {
    padding: 0rem 0;
  }
}
</style>
