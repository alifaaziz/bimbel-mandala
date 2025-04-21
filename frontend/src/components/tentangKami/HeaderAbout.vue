<script setup>
    import butCta from '../dirButton/butCta.vue'
</script>

<template>
    <div class="headAbout">
        <div class="contents">
            <div class="hero title">
                Bimbel<br>Mandala
            </div>
            <p class="copy">
                Bersama Bimbel Mandala, wujudkan cita-citamu masuk sekolah atau 
                perguruan tinggi favorit. Dapatkan bimbingan belajar terbaik dengan 
                tutor berpengalaman dan materi yang sesuai kurikulum.
            </p>
        </div>
    </div>
</template>

<style setup>
    .headAbout {
        height: 620px;
        display: flex;
        justify-content: center; /* Mengatur konten ke tengah secara horizontal */
        align-items: center; /* Mengatur konten ke tengah secara vertikal */
        text-align: center; /* Opsional: untuk memastikan teks rata tengah */
        position: relative; /* Dibutuhkan untuk pseudo-element */
        background-image: url('@/assets/headAbout.png'); /* Ganti dengan path gambar Anda */
        background-size: cover;
        background-position: center;
        width: 100%;
    }

    .title {
        color: #ffffff;
        text-align: center;
    }
    
    .headAbout::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Warna overlay gelap dengan transparansi */
        z-index: 1; /* Pastikan overlay berada di atas background */
    }

    .headAbout > * {
        position: relative;
        z-index: 2; /* Pastikan konten berada di atas overlay */
    }
    .contents {
        display: flex;
        flex-direction: column;
        justify-content: center; /* Mengatur konten ke tengah secara vertikal */
        align-items: center; /* Mengatur konten ke tengah secara horizontal */
        text-align: center; /* Opsional: untuk memastikan teks rata tengah */
    }
    .copy {
        color: #ffffff;
        font-size: 12px;
        text-align: center;
        line-height: 2;
        font-family: 'Poppins', sans-serif;
        margin: 0 0 2rem !important;
        width: 60%;
    }
    p {
        padding: 0 !important;
    }
    @media (max-width: 960px) {
        .title {
            width: 520px; /* Ukuran font untuk judul pada layar kecil */
        }
    }
    
</style>
