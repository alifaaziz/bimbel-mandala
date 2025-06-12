<script setup>
import topSearchBar from './topSearchBar.vue';
import Rekomendasi from './Rekomendasi.vue';
import mostPopular from './mostPopular.vue';
import seluruhProgram from './SeluruhProgram.vue';
import PalingPopuler from './PalingPopuler.vue';
import Footer from '../footer.vue';
</script>

<template>
    <div class="padding-components">
        <topSearchBar />
        <Rekomendasi />
        <PalingPopuler />
        <!-- <mostPopular /> -->
        <seluruhProgram />
    </div>
    <Footer />
</template>

<style scoped>
.padding-components {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    padding-bottom: 4rem;
}
</style>