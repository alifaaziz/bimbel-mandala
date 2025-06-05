<script setup>
import navbarTerdaftar from './navbarTerdaftar.vue';
import DetailProgamTerdaftar from './DetailProgamTerdaftar.vue';
import JadwalKhusus from './JadwalKhusus.vue';
import Footer from '@/components/footer.vue';
</script>

<template>
    <navbarTerdaftar />
    <div class="container-detail">
        <DetailProgamTerdaftar />
        <div class="padding-components">
            <JadwalKhusus />
        </div>
    </div>
    <Footer />
</template>

<style scoped>
.container-detail {
    margin-top: 104px;
    margin-bottom: 2rem;
}
</style>