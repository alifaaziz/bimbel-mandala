<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import Footer from './footer.vue'
import { useRouter } from 'vue-router'
import ButPrimerNormalLoading from './dirButton/butPrimerNormalLoading.vue'

const router = useRouter()
function goBack() {
  router.go(-1)
}

const programCode = ref('')
const loading = ref(false)
const feedback = ref('')
const status = ref('')
const successFeedback = ref('')

const message = useMessage()

function submitprogram() {
  feedback.value = ''
  status.value = ''
  successFeedback.value = ''
  if (!programCode.value) {
    feedback.value = 'Kode program wajib diisi'
    status.value = 'error'
    return
  }
  loading.value = true

  setTimeout(() => {
    loading.value = false
    if (programCode.value === 'MANDALA123') {
      message.success('Berhasil bergabung dengan program!')
      successFeedback.value = 'Berhasil bergabung dengan program!'
      programCode.value = ''
      // Tambahkan timeout untuk redirect setelah 2 detik
      setTimeout(() => {
        router.push('/absen') // Ganti 'Home' dengan nama route halaman utama jika berbeda
      }, 2000)
    } else {
      feedback.value = 'Kode program tidak valid'
      status.value = 'error'
    }
  }, 1200)
}
</script>

<template>
  <n-layout>
    <n-layout-header class="navbar-detail">
      <div
        class="arrow"
        @click="goBack"
        tabindex="0"
        aria-label="Kembali"
        @keyup.enter="goBack"
      >
        <img src="@/assets/arrow-left-circle.svg" alt="Kembali" />
      </div>
      <div class="headlineb1 detail-title">Gabung Program</div>
    </n-layout-header>
    <n-layout-content>
      <n-card>
        <h2 class="headersb2">Gabung Program</h2>
        <n-form @submit.prevent="submitprogram">
          <n-form-item label="Kode Program" :feedback="feedback" :validation-status="status">
            <n-input
              v-model:value="programCode"
              placeholder="Masukkan kode program"
              maxlength="10"
              clearable
              round
            />
          </n-form-item>
          <div v-if="successFeedback" class="success-feedback">{{ successFeedback }}</div>
          <n-space justify="center">
            <ButPrimerNormalLoading :loading="loading" label="Gabung" @click="submitprogram" />
          </n-space>
        </n-form>
      </n-card>
      <Footer />
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
.n-card {
  max-width: 400px;
  margin: 104px auto 40px;
}
h2 {
  text-align: center;
  color: #154484;
  margin-bottom: 1rem;
}
.navbar-detail {
  width: 100%;
  height: 104px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 2rem 8rem;
  gap: 1rem;
  background-color: white;
}
.arrow {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.arrow img {
  height: 40px;
  object-fit: contain;
}
.detail-title {
  color: #154484;
}
.success-feedback {
  color: #18a058;
  text-align: center;
  margin-bottom: 8px;
}
@media (max-width: 768px) {
  .navbar-detail {
    padding: 2rem 40px;
  }
}
</style>
