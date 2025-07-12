<template>
  <div class="ordered-program-container">
    <n-h2 class="main-title">Program Terpesan</n-h2>
    <n-card class="program-card">
      <div class="card-content">
        <n-thing>
          <template #header>
            <span class="course-title">Fisika SMA</span>
          </template>
          <template #description>
            <span class="instructor-name">Pak Dendy Wan S.Pd</span>
          </template>
        </n-thing>
        <n-button ghost type="primary" @click="goToVerifProgram">
          Aksi
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// Impor komponen yang diperlukan dari Naive UI
import { NCard, NButton, NH2, NThing } from 'naive-ui';

const router = useRouter()

function goToVerifProgram() {
  router.push({ name: 'VerifProgram' })
}
</script>

<style scoped>
/* Memberi batasan lebar dan margin untuk container utama */
.ordered-program-container {
  background-color: #ffffff; /* Latar belakang kartu putih */
  border-radius: 12px; /* Lengkungan sudut kartu keseluruhan */
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08); /* Bayangan halus untuk efek kartu */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 400px; /* Batas lebar maksimum kartu */
}

/* Styling untuk judul utama "Program Terpesan" */
.main-title {
  font-weight: 700;
  color: #1e3a8a; /* Warna biru tua sesuai gambar */
  margin-bottom: 16px;
}

/* Styling untuk kartu program */
.program-card {
  border-radius: 12px !important; /* Membuat sudut lebih tumpul */
  background-color: #eef2f7 !important; /* Warna latar belakang abu-abu muda */
}

/* Menggunakan flexbox untuk mengatur layout konten di dalam kartu */
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Styling untuk judul mata pelajaran */
.course-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e1e1e; /* Warna hitam pekat */
}

/* Styling untuk nama instruktur */
.instructor-name {
  font-size: 0.95rem;
  color: #6b7280; /* Warna abu-abu untuk teks sekunder */
}
</style>