<script setup>
import StatisticProgram from '@/components/rekap/StatisticProgram.vue'
import RekapDetail from '@/components/rekap/RekapDetail.vue'
import Footer from '@/components/footer.vue'
</script>

<template>
    <div class="padding-components">
        <StatisticProgram />
    </div>
    <div class="rekap-container padding-components">
        <RekapDetail />
    </div>
    <Footer />
</template>

<style scoped>
.rekap-container{
    padding-bottom: 2rem;
    padding-top: 2rem;
}
.template{
    background-color: white;
}
</style>