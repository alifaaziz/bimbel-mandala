<template>
  <div class="confirmation-container">
    <div class="confirmation-content">
      <div class="gambar-sukses">
        <img class="img" src="@/assets/success/success.png" alt="">
      </div>
      <div class="text">
        <p class="bodyb2">Pendaftaran Tutor</p>
        <h1 class="headersb1">
          Anda telah mengkonfirmasi <strong>{{ tutor.name }}</strong> sebagai tutor
        </h1>
        <p class="bodyr3">Silahkan beri informasi username dan password akun kepada John Doe S.Pd melalui pesan WhatsApp.</p>
      </div>
      <n-space justify="left" size="large">
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
    </div>
  </div>
</template>

<script setup>
import { NButton, NIcon, NSpace } from 'naive-ui';
import { LogoWhatsapp } from '@vicons/ionicons5';
import { useRouter } from 'vue-router';

const router = useRouter();

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
  router.push('/dashboardadmin');
};

</script>

<style scoped>
.confirmation-container {
  background-color: #fff;
  display: flex;
  justify-content: center;
  text-align: center;
  min-height: 80vh;
  width: 100%;
  padding: 20px;
  margin: 20px;
}
.confirmation-content{
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.gambar-sukses{
  width: 380px;
}
.img{
  width: 200px;
  height: auto;
}
.text{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.bodyb2, .bodyr3{
  color: #061222;
  text-align: left;
}
.headersb1 {
  color: #154484;
  text-align: left;
}

.strong {
  font-weight: 700;
}

</style>