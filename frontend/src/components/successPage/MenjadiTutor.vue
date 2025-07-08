<script setup>
import butPrimerHuge from '@/components/dirButton/butPrimerHuge.vue';
import Footer from '@/components/footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
function goHome() {
  router.push('/');
}
</script>

<template>
    <div class="actInfor-container">
        <div class="info-container">
            <img src="@/assets/success/MenjadiTutorSuccess.png" alt="Menjadi Tutor Success" />
            <div>
                <p class="bodyb3">
                    Pendaftaran Tutor
                </p>
                <h1 class="headlineb1">
                    Terimakasih Telah Mendaftar <br/>
                    Sebagai <span>Tutor</span> di Mandala
                </h1>
                <p class="bodyr3">
                    Silahkan menunggu informasi melalu WhatsApp  Admin 
                    <br />
                    Karir Bimbel Mandala untuk melanjutkan proses lamaran.
                </p>
            </div>
        </div>
        <butPrimerHuge label="Kembali ke beranda" @click="goHome"/>
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

.info-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: center;
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
