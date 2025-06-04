<script setup>
import butPrimerNormal from '../dirButton/butPrimerNormal.vue';
import butSecondNormal from '../dirButton/butSecondNormal.vue';
import Footer from '@/components/footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function waAdmin() {
  const phoneNumber = '6285855852485'; // Ganti dengan nomor WhatsApp admin
  const message = 'Halo, saya ingin mengonfirmasi pendaftaran Bimbingan Belajar Mandala.';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function goHome() {
  router.push('/');
}
</script>

<template>
    <div class="info-text actInfor-container">
        <div class="info-container">
            <img src="@/assets/success/PemesananProgram.png" alt="Menjadi Tutor Success" />
            <div class="info-text">
                <p class="bodyb3">
                    Pendaftaran Program
                </p>
                <h1 class="headlineb1">
                    Terimakasih Telah Mendaftar
                </h1>
                <div class="program-info">
                    <p class="bodyr1">
                        Program: 
                    </p>
                    <p class="bodyb1">
                        <span>(Program Terdaftar){{ $route.query.program }}</span>
                    </p>
                </div>
                <p class="bodyr3">
                    Silahkan konfirmasi ke admin dan lakukan cek berkala pada jadwal
                </p>
            </div>
        </div>
        <div class="program-info">
            <butPrimerNormal label="Hubungi Admin" @click="waAdmin"/>
            <butSecondNormal label="Kembali ke beranda" @click="goHome"/>
        </div>
    </div>
    <Footer />
</template>

<style scoped>
 
.actInfor-container {
    display: flex;
    flex-direction: column;
    padding: 4rem 0;
    margin: 0 auto;
    align-items: flex-start;
    justify-content: center;
    width: fit-content;

}

.program-info {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}

.info-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: center;
}

.info-text {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.bodyb3, .bodyr3 {
    color: #061222; 
}
.headlineb1 {
    color: #154484;
}
span {
    color: #FB8312;
}

@media (max-width: 768px) {
    .actInfor-container {
        gap: 1.5rem;
    }
    .actInfor-container {
        padding: 2rem 0.5rem;
        width: 100%;
        align-items: center;
    }

    .info-container {
        flex-direction: column;
        gap: 1.2rem;
        text-align: center;
    }

    .info-container img {
        width: 80vw;
        max-width: 220px;
        height: auto;
    }

    .headlineb1 {
        font-size: 2rem;
    }

    .bodyb3, .bodyr3 {
        font-size: 1rem;
    }
}
</style>
