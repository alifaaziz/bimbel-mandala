<template>
  <div class="confirmation-container">
    <n-result
      status="success"
      :title="`Anda telah mengkonfirmasi ${tutor.name} sebagai tutor`"
      :description="`Silahkan beri informasi username dan password akun kepada ${tutor.fullName} melalui pesan WhatsApp.`"
    >
      <template #icon>
        <div class="custom-icon-wrapper">
          <n-icon :component="CheckmarkOutline" color="#ff6912" size="60" />
        </div>
      </template>

      <template #header>
        <p class="subtitle">Pendaftaran Tutor</p>
        <h1 class="title">
          Anda telah mengkonfirmasi<br /><strong>{{ tutor.name }}</strong> sebagai tutor
        </h1>
      </template>
      
      <template #footer>
        <n-space justify="center" size="large">
          <n-button type="primary" strong round @click="handleContact">
            <template #icon>
              <n-icon :component="LogoWhatsapp" />
            </template>
            Hubungi
          </n-button>
          <n-button strong round @click="handleGoHome">
            Halaman Utama
          </n-button>
        </n-space>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { NResult, NButton, NIcon, NSpace } from 'naive-ui';
import { CheckmarkOutline, LogoWhatsapp } from '@vicons/ionicons5';

// Mendefinisikan props yang diterima komponen ini
const props = defineProps({
  tutor: {
    type: Object,
    required: true,
    default: () => ({
      name: 'John Doe',
      fullName: 'John Doe S.Pd',
      // Gunakan format internasional (62 untuk Indonesia) tanpa 0 di depan
      whatsappNumber: '6283647382734' 
    })
  }
});

// Mendefinisikan event yang akan di-emit
const emit = defineEmits(['go-home']);

// Fungsi untuk membuka link WhatsApp
const handleContact = () => {
  if (props.tutor.whatsappNumber) {
    // Membuat pesan default (opsional)
    const message = encodeURIComponent(`Halo ${props.tutor.fullName}, akun tutor Anda telah berhasil diverifikasi. Berikut adalah detail login Anda:\nUsername: [username]\nPassword: [password]`);
    window.open(`https://wa.me/${props.tutor.whatsappNumber}?text=${message}`, '_blank');
  } else {
    alert('Nomor WhatsApp tidak tersedia.');
  }
};

// Fungsi untuk kembali ke halaman utama
const handleGoHome = () => {
  emit('go-home');
};

</script>

<style scoped>
.confirmation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 80vh;
  padding: 20px;
}

.custom-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background-color: #f0f5ff; /* Latar belakang biru muda */
  border: 4px solid #183153; /* Border biru tua */
  border-radius: 28%; /* Membuat sudut sedikit membulat tapi tidak lingkaran penuh */
  
  /* Efek 'wavy' sangat kustom, ini adalah pendekatan CSS sederhana menggunakan clip-path */
  /* Untuk hasil persis seperti gambar, disarankan menggunakan file SVG */
  clip-path: path('M48,5 C74,5 74,25 90,25 C106,25 106,5 132,5 C158,5 158,25 158,50 C158,75 158,95 132,95 C106,95 106,75 90,75 C74,75 74,95 48,95 C22,95 22,75 22,50 C22,25 22,5 48,5 Z');
  transform: scale(0.9);
  margin-bottom: 24px;
}

.subtitle {
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.title {
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.3;
  color: #183153;
  margin-top: 0;
  margin-bottom: 16px;
}

.title strong {
  font-weight: 700;
}

/* Mengganti deskripsi default dari n-result */
.n-result :deep(.n-result-header .n-result-header__description) {
  max-width: 400px;
  margin: 0 auto 32px auto;
  color: #666;
}
</style>