<template>
  <div class="success-container">
    <n-space vertical align="center" justify="center" size="large">
      
      <div class="success-icon-wrapper">
        <n-icon :component="Checkmark" size="60" color="#ff69b4" />
      </div>

      <n-space vertical align="center" :size="[0, 0]">
        <n-text strong>
          Pembuatan Akun Siswa
        </n-text>
        <n-h2 style="text-align: center; margin-top: 12px; margin-bottom: 8px;">
          Anda telah membuat akun
          <br />
          <n-text type="primary" strong>{{ studentName }}</n-text>
          sebagai siswa
        </n-h2>
        <n-p :depth="3" style="text-align: center; max-width: 400px;">
          Silahkan beri informasi username dan password akun kepada {{ studentName }} melalui pesan WhatsApp.
        </n-p>
      </n-space>

      <n-space size="large" style="margin-top: 20px;">
        <n-button type="primary" size="large" round @click="handleContact">
          <template #icon>
            <n-icon :component="LogoWhatsapp" />
          </template>
          Hubungi
        </n-button>
        <n-button size="large" round strong @click="handleGoToHome">
          Halaman Utama
        </n-button>
      </n-space>

    </n-space>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { NSpace, NText, NH2, NP, NButton, NIcon } from 'naive-ui';
import { Checkmark, LogoWhatsapp } from '@vicons/ionicons5';

// Mendefinisikan props yang diterima oleh komponen
const props = defineProps({
  studentName: {
    type: String,
    required: true,
    default: 'Siswa Baru' // Nilai default jika prop tidak diberikan
  }
});

// Fungsi untuk tombol "Hubungi"
const handleContact = () => {
  // Anda bisa membuka link WhatsApp di sini
  // Contoh: window.open('https://wa.me/NOMOR_TELEPON_SISWA', '_blank');
  console.log(`Menghubungi ${props.studentName}...`);
  alert(`Implementasi untuk menghubungi ${props.studentName} via WhatsApp.`);
};

// Fungsi untuk tombol "Halaman Utama"
const handleGoToHome = () => {
  // Anda bisa mengarahkan pengguna ke halaman utama menggunakan Vue Router
  // Contoh: router.push('/');
  console.log('Kembali ke Halaman Utama...');
  alert('Implementasi untuk kembali ke Halaman Utama.');
};
</script>

<style scoped>
.success-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh; /* Mengisi sebagian besar tinggi layar */
  padding: 2rem;
  font-family: sans-serif;
}

.success-icon-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%; /* Membuat lingkaran luar */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f5ff; /* Warna biru muda untuk latar belakang ikon */
  border: 4px solid #d6e4ff; /* Border biru lebih gelap */
  margin-bottom: 24px;
}

/* Mengganti warna default ikon dari vicons */
.success-icon-wrapper .n-icon {
  color: #ff69b4 !important; /* Warna oranye untuk checkmark */
}

/* Mengatur agar nama siswa yang panjang tidak merusak layout */
.n-h2 .n-text {
  word-break: break-word;
}
</style>