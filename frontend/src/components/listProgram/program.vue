<script setup>
import topSearchBar from './topSearchBar.vue'
import PalingPopuler from './PalingPopuler.vue'
import seluruhProgram from './SeluruhProgram.vue'
import Footer from '../footer.vue'
</script>

<template>
  <div class="padding-components">
    <topSearchBar />
    <PalingPopuler />
    <seluruhProgram />
  </div>
  <Footer />
</template>

<style scoped>
.padding-components {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-bottom: 3rem;
  padding-top: 3rem;
}
</style>
