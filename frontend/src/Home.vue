<script setup>
import banner from './components/beranda/banner.vue'
import keunggulanH from './components/beranda/keunggulanHighlight.vue'
import cta from './components/beranda/cta.vue'
import programHighlight from './components/beranda/programHighlight.vue'
import tutorHighlight from './components/beranda/tutorHighlight.vue'
import Footer from './components/footer.vue';

</script>

<template>
  <div class="content-container">
    <div class="part banner">
      <banner />
    </div>
    <div class="part">
      <keunggulanH />
    </div>
    <div class="pad_cta">
      <div class="cta-section">
        <cta />
      </div>
    </div>
    <div class="part padding-components">
      <programHighlight />
    </div>
    <div class="part">
      <tutorHighlight />
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.content-container {
  padding: 2rem 0;
}
.banner {

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
  padding-top: 2rem ;
  padding-bottom: 2rem ;
}

.pad_cta {
  padding: 2rem 0;
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
