<script setup>
import { computed } from 'vue'
import programHighlight from '../beranda/programHighlight.vue';
import { auth } from '@/components/Absen/auth.js'

const userTutor = computed(() => 
  auth.users.find(user => user.role === 'siswa' && user.isActive)
)

const userName = computed(() => userTutor.value ? userTutor.value.nama : 'User')
</script>

<template>
    <div class="noprogram-container">
        <img src="@/assets/noprogram.svg" alt="" class="noprogram-img" />
        <div class="noprogram-text">
            <h1 class="hero2">Selamat Datang, {{ userName }}</h1>
            <p class="bodyr1">
                Sepertinya kamu belum terdaftar program manapun di Bimbel Mandala.
                Silahkan jelajahi dan daftar salah satu program.
            </p>
        </div>
    </div>
    <programHighlight />
</template>


<style>
.noprogram-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
}

.noprogram-img {
    width: 100%;
    max-width: 360px;
    height: auto;
}

.noprogram-text {
    width: 50%;
    color: #154484;
}
.noprogram-text .hero2 {
    line-height: 1;
    padding-bottom: 1rem;
}
</style>