<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';

// Gunakan 'useMessage' untuk menampilkan notifikasi saat tombol "Aksi" diklik
const message = useMessage();

// --- 1. State Management ---
// Data dummy untuk daftar pendaftar
const registrantList = ref([
  { id: 1, name: 'John Doe S.Pd' },
  { id: 2, name: 'Jane Smith S.Kom' },
  { id: 3, name: 'Peter Jones M.Pd' },
]);

// --- 2. Methods ---
// Fungsi yang akan dipanggil saat tombol "Aksi" diklik
const handleActionClick = (registrant) => {
  message.info(`Tombol Aksi untuk "${registrant.name}" diklik.`);
  // Di sini Anda bisa menambahkan logika lain, misalnya:
  // - Menampilkan modal dengan detail pendaftar
  // - Menavigasi ke halaman profil pendaftar
  // - Menandai pendaftar sebagai 'telah diproses'
};
</script>

<template>
  <div class="registrant-container">
    <n-space vertical :size="24">
      <n-h1 style="margin: 0; color: #1e3a8a;">Pendaftar</n-h1>

      <n-space vertical size="medium">
        <div
          v-for="registrant in registrantList"
          :key="registrant.id"
          class="registrant-item"
        >
          <span class="registrant-name">{{ registrant.name }}</span>

          <n-button secondary strong @click="handleActionClick(registrant)">
            Aksi
          </n-button>
        </div>
      </n-space>
    </n-space>
  </div>
</template>

<style scoped>
.registrant-container {
  /* Memberi padding dan membatasi lebar container */
  background-color: #ffffff;
  padding: 24px;
  border-radius: 20px; /* Sudut membulat seperti pada container di gambar */
  max-width: 450px;
  margin: 20px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Memberi sedikit bayangan */
}

.registrant-item {
  /* Styling untuk setiap item dalam daftar */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eef2f7; /* Warna latar belakang abu-abu muda */
  padding: 12px 20px;
  border-radius: 12px; /* Sudut membulat untuk setiap item */
  width: 100%;
}

.registrant-name {
  /* Styling untuk teks nama */
  font-size: 1.1rem; /* Ukuran font 16px-18px */
  font-weight: 500;
  color: #333;
}

/* Mengubah style tombol Aksi agar lebih mirip dengan gambar */
.n-button {
  border-radius: 20px !important; /* Membuat tombol lebih membulat */
  font-weight: 600;
}
</style>