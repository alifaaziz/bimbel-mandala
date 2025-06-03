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

<style scoped>
    .copy-cta {
        color: #ffffff;
        font-size: 12px;
        text-align: left;
        margin: 2rem 0;
        letter-spacing: 0.08em;
        width: 100%;
    }

    .cta-content {
        max-width: 50%;
    }

    .cta-section {
        height: 620px;
        display: flex;

        align-items: center; /* Mengatur konten ke tengah secara vertikal */
    }
    .hero-title {
        color: #ffffff;
        text-align: left;
    }

    @media (max-width: 576px) {
        .hero-title {
            font-size: 3rem;
        }
    }
    
</style>
