<script setup>
import Footer from './components/footer.vue';
import navbar from './components/navbar.vue';
import Home from './Home.vue';
</script>

<template>
  <navbar />
  <router-view />
  <Footer />
</template>

<script>
export default {
  watch: {
    $route(to, from) {
      // Scroll ke atas setiap kali rute berubah
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style>
#app {
  max-width: 100%;
  margin-top: 68px;
}
</style>

