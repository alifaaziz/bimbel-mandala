<script setup>
import headerTutor from './components/pendaftaranTutor/headerTutor.vue';
import infoPribadi from './components/pendaftaranTutor/infoPribadi.vue';
import riwayatPendidikan from './components/pendaftaranTutor/riwayatPendidikan.vue';
import mapelMengajar from './components/pendaftaranTutor/mapelMengajar.vue';
import hariMengajar from './components/pendaftaranTutor/hariMengajar.vue';
import navbar from './components/beranda/navbar.vue';
import footerWeb from './components/beranda/footer.vue';
</script>

<template>
    <div class="pendaftaran-tutor">
        <div class="content">
            <header-tutor />
            <info-pribadi />
            <hr class="divider" />
            <riwayat-pendidikan />
            <hr class="divider" />
            <mapel-mengajar />
            <hari-mengajar />
        </div>
        <navbar />
    </div>
    <footerWeb />
</template>

<style scoped>
.pendaftaran-tutor {
    font-family: 'Poppins', sans-serif;
    background-color: #f8f9fa;
    padding: 2rem 8rem;
    min-height: 100vh; /* Pastikan elemen ini setidaknya setinggi viewport */
    display: flex;
    flex-direction: column; /* Atur elemen anak secara vertikal */
    flex-grow: 1; /* Pastikan elemen ini tumbuh untuk memenuhi ruang kosong */
    justify-content: space-between; /* Dorong footer ke bawah */
}

.content {
    flex-grow: 1; /* Pastikan konten utama tumbuh untuk memenuhi ruang kosong */
}

.divider {
    border: none; /* Hilangkan border default */
    border-top: 1px solid #f27f28; /* Garis tipis dengan warna abu-abu muda */
    margin: 2rem 0; /* Jarak atas dan bawah */
}
</style>