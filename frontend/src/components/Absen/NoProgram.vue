<script setup>
import { ref, onMounted } from 'vue';
import programHighlight from '../beranda/programHighlight.vue';

const userName = ref('User');
const error = ref(null);

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'Token tidak ditemukan. Silakan login ulang.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengambil data pengguna.');
    }

    const data = await response.json();
    userName.value = data.data?.name || 'User';
  } catch (err) {
    error.value = err.message;
  }
});
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