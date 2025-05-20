<script setup>
import { computed } from 'vue'
import { auth } from '@/components/Absen/auth.js'
import programTerbukaTutor from './programTerbukaTutor.vue';

// Ambil user tutor yang aktif
const userTutor = computed(() => 
  auth.users.find(user => user.role === 'tutor' && user.isActive)
)

const userName = computed(() => userTutor.value ? userTutor.value.nama : 'User')
</script>

<template>
    <div class="noprogram-container">
        <img src="@/assets/noprogram.svg" alt="" class="noprogram-img" />
        <div class="noprogram-text">
            <h1 class="hero2">Selamat Datang, {{ userName }}</h1>
            <p class="bodyr1">
                Sepertinya Anda belum memiliki kelas aktif.  
                Silahkan tunggu sampai ada panggilan mengajar
            </p>
        </div>
    </div>
    <programTerbukaTutor />
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

/* Responsive untuk mobile */
@media (max-width: 600px) {
  .noprogram-container {
    flex-direction: column;
    padding: 2rem 1rem;
    gap: 2rem;
    align-items: center;
  }
  .noprogram-img {
    max-width: 220px;
  }
  .noprogram-text {
    width: 100%;
    text-align: center;
  }
}
</style>