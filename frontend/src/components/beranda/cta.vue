<script setup>
    import butCta from '../dirButton/butCta.vue'
</script>

<template>
    <div class="cta-section">
        <div class="contents">
            <div class="hero">
                Gapai Impianmu
            </div>
            <p class="copy">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sapien, est felis, sagittis viverra nulla mattis scelerisque.
                Eget cras integer.
            </p>
            <butCta />
        </div>
    </div>
</template>

<style setup>
    .hero {
        font-size: 56px;
        font-weight: bold;
        color: #ffffff;
        text-align: left;
        line-height: 1.2;
        font-family: 'Poppins', sans-serif;
        margin-bottom: 2rem;
        width: 40%;
    }
    .copy {
        color: #ffffff;
        font-size: 12px;
        text-align: left;
        line-height: 2;
        font-family: 'Poppins', sans-serif;
        margin-bottom: 2rem;
        width: 60%;
    }
    p {
        padding: 0 !important;
    }

    .contents {
        padding: 0 8rem;
    }

    .cta-section {
        height: 620px;
        display: flex;
        justify-content: left; /* Mengatur konten ke tengah secara horizontal */
        align-items: center; /* Mengatur konten ke tengah secara vertikal */
        text-align: center; /* Opsional: untuk memastikan teks rata tengah */
    }
    
</style>
