<script setup>
    import butCta from '../dirButton/butCta.vue'
</script>

<template>
    <div class="cta-section">
        <div class="padding-components cta-content">
            <div class="hero hero-title">
                Gapai Impianmu
            </div>
            <p class="bodyr2 copy-cta">
                Bersama Bimbel Mandala, wujudkan cita-citamu masuk sekolah atau 
                perguruan tinggi favorit. Dapatkan bimbingan belajar terbaik dengan 
                tutor berpengalaman dan materi yang sesuai kurikulum.
            </p>
            <butCta />
        </div>
    </div>
</template>

<style setup>
    .copy-cta {
        color: #ffffff;
        font-size: 12px;
        width: 60%;
        text-align: left;
        margin: 2rem 0;
        width: 40%;
        letter-spacing: 0.08em; /* Menambahkan jarak per huruf */
    }

    .cta-content {
        max-width: 1440px;
    }

    .cta-section {
        height: 620px;
        display: flex;
        justify-content: center; /* Mengatur konten ke tengah secara horizontal */
        align-items: center; /* Mengatur konten ke tengah secara vertikal */
        text-align: center; /* Opsional: untuk memastikan teks rata tengah */
    }
    .hero-title {
        color: #ffffff;
        text-align: left;
    }

    @media (max-width: 768px) {
        .copy-cta {
            width: 80%; 
        }
        
    }
    
</style>
