<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router'; // Tambahkan ini

const message = useMessage();
const router = useRouter(); // Tambahkan ini

const registrantList = ref([]);

const fetchRegistrants = async () => {
  try {
    const res = await fetch('http://localhost:3000/apply?page=1&limit=3', {
      headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    const json = await res.json();
    registrantList.value = json.data || [];
  } catch (e) {
    registrantList.value = [];
    message.error('Gagal mengambil data pendaftar');
  }
};

onMounted(fetchRegistrants);

// Fungsi yang akan dipanggil saat tombol "Aksi" diklik
const handleActionClick = (registrant) => {
  message.info(`Tombol Aksi untuk "${registrant.name}" diklik.`);
  router.push('/dashboardadmin/tutor/verifikasitutor'); // Navigasi ke rute
};
</script>

<template>
  <div class="registrant-container">
    <n-space vertical :size="20">
      <h1 class="headerb2" style="margin: 0; color: #154484;">Pendaftar</h1>

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
  border-radius: 12px; /* Sudut membulat seperti pada container di gambar */
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