<script setup>
import navbarDetail from './components/detailProgram/navbarDetail.vue'
import Footer from './components/footer.vue';
</script>

<template>
  <div>
    <navbarDetail />
    <div class="component-detail">
      <router-view />
    </div>
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
