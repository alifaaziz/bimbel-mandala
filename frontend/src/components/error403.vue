<script setup>
import router from '@/router';
import butPrimerNormal from './dirButton/butPrimerNormal.vue';

function beranda() {
    router.push('/')
}
</script>

<template>
    <div class="error-container">
        <img src="@/assets/success/403.svg" alt="">
        <h4 class="hero">403</h4>
        <div class="error-text">
            <p class="bodyb2">Ups! Kamu tidak punya izin untuk mengakses halaman ini</p>
            <p class="bodyr2">Mungkin kamu belum login, atau tidak memiliki hak akses yang sesuai.</p>
        </div>
        <butPrimerNormal label="Kembali ke Beranda" @click="beranda" />
    </div>
</template>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center;
  height: 100vh;
}
.error-text{
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;
}
.hero, .bodyb2{
    color: #061222;
}
.bodyr2{
    color: darkgray;
} 
</style>