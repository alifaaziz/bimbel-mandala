<script setup>
import navbarDetail from './components/detailProgram/navbarDetail.vue'
import programBelajar from './components/detailProgram/program.vue'
import banner from './components/beranda/banner.vue'
import programHighlight from './components/beranda/programHighlight.vue'
import Footer from './components/footer.vue'
</script>

<template>
  <div class="content-container">
    <navbarDetail />
  </div>
  <programBelajar />
  <Footer />
</template>

<style scoped>
.content-container {
  padding: 2rem 0;
}
.part {
  padding: 2rem 0 ;
}

@media (max-width: 960px) {
  .content-container {
    padding: 0rem 0;
  }
}
</style>
