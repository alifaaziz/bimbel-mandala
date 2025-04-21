<script setup>
import navbar from './components/navbar.vue'
import HeaderAbout from './components/tentangKami/HeaderAbout.vue'
import visiMisi from './components/tentangKami/visiMisi.vue'
import Kapabilitas from './components/tentangKami/Kapabilitas.vue'
import keunggulan from './components/beranda/keunggulan.vue'
import tutor from './components/tentangKami/tutor.vue'
import Footer from './components/footer.vue'
</script>

<template>
  <div class="content-container">
    <navbar />
    <HeaderAbout />
    <div class="part-about">
      <visiMisi />
    </div>
    <div class="part-about">
      <Kapabilitas />
    </div>
    <div class="part-about">
      <keunggulan />
    </div>
    <div class="part-about">
      <tutor class="tutor-pad"/>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.content-container {
  padding: rem 0;
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

.part-about {
  padding: 2rem 0 ;
}

.tutor-pad {
  padding-bottom: 2rem ;
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
