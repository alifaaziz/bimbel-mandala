<script setup>
import Footer from './components/footer.vue';
import navbar from './components/navbar.vue';
import Home from './Home.vue';
</script>

<template>
  <navbar />
  <RouterView />
  <Footer />
</template>

<style>
#app {
  max-width: 1440px;
  margin-top: 68px;
}
</style>

