<script setup>
import navbarDetail from './components/detailProgram/navbarDetail.vue'
import programBelajar from './components/detailProgram/program.vue'
import programHighlight from './components/beranda/programHighlight.vue'
import Footer from './components/footer.vue';
</script>

<template>
  <div>
    <navbarDetail />
    <div class="component-detail">
      <programBelajar />
    </div>
    <!-- <div class="other-program">
      <programHighlight />
    </div> -->
  </div>
  <Footer />
</template>

<style scoped>
.component-detail {
  padding: 2rem 0;
}

.other-program {
  padding-bottom: 2rem;
}
</style>
