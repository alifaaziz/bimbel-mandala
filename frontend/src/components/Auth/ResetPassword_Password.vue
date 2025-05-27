<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import butSecondNormal from '../dirButton/butSecondNormal.vue'

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const router = useRouter()

const submitPassword = async () => {
  error.value = ''
  success.value = ''
  if (password.value.length < 6) {
    error.value = "Password minimal 6 karakter."
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = "Konfirmasi password tidak cocok."
    return
  }
  loading.value = true
  try {
    // Ganti dengan API reset password Anda
    // await axios.post('/api/auth/reset-password', { password: password.value });
    await new Promise((resolve) => setTimeout(resolve, 1000))
    success.value = "Password berhasil direset. Silakan login dengan password baru."
    password.value = ""
    confirmPassword.value = ""
  } catch (e) {
    error.value = "Gagal mereset password. Silakan coba lagi."
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/auth')
}
</script>

<template>
  <div class="reset-password-page-center">
    <div class="reset-password-password">
      <h2 class="headersb1">Reset Password Baru</h2>
      <form @submit.prevent="submitPassword">
        <label class="bodyr2" for="password">Password Baru:</label>
        <input
          class="bodyr2"
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="Masukkan password baru"
        />
        <label class="bodyr2" for="confirmPassword">Konfirmasi Password:</label>
        <input
          class="bodyr2"
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          placeholder="Ulangi password baru"
        />
        <span v-if="error" class="error">{{ error }}</span>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Menyimpan...' : 'Simpan Password Baru' }}
        </button>
        <span v-if="success" class="success">{{ success }}</span>
        <butSecondNormal
          label="Kembali ke Login"
          v-if="success"
          @click="goToLogin"
          style="margin-top: 12px;"
        >
          Kembali ke Login
        </butSecondNormal>
      </form>
    </div>
  </div>
</template>


<style scoped>
.reset-password-page-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f7f9fb;
}
.reset-password-password {
  max-width: 400px;
  margin-top: 60px;
  margin-bottom: auto;
  background: #fff;
  padding: 32px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(21, 68, 132, 0.07);
}
.headersb1 {
  text-align: left;
  color: #154484;
  margin-bottom: 2rem;
}
.bodyr2 {
  color: #061222;
}
label {
  display: block;
  margin-bottom: 8px;
}
input[type="password"] {
  width: 100%;
  border: 1px solid #dfe2e5;
  border-radius: 2rem;
  padding: 8px;
  margin-bottom: 12px;
  box-sizing: border-box;
}
button {
  padding: 8px 16px;
  background-color: #154484;
  color: #fff;
  border: none;
  border-radius: 2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
button:disabled {
  background-color: #b0b8c1;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background-color: #0d2c5a;
  box-shadow: 0 2px 8px rgba(21, 68, 132, 0.15);
}
.error {
  color: red;
  display: block;
  margin-bottom: 8px;
}
.success {
  color: green;
  display: block;
  margin-top: 8px;
}
</style>