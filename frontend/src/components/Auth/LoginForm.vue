<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton } from 'naive-ui'
import googleIcon from '../../assets/google.svg'

const router = useRouter()
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const isLoading = ref(false)
const isLoggedIn = ref(!!localStorage.getItem('token'))

// Tambahkan state untuk toggle password visibility
const showPassword = ref(false)

function validateEmail() {
  if (!email.value) {
    emailError.value = 'E-mail wajib diisi.'
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Format e-mail tidak valid.'
  } else {
    emailError.value = ''
  }
}

function validatePassword() {
  if (!password.value) {
    passwordError.value = 'Password wajib diisi.'
  } else if (password.value.length < 8) {
    passwordError.value = 'Password minimal 8 karakter.'
  } else {
    passwordError.value = ''
  }
}

async function handleLogin() {
  validateEmail()
  validatePassword()

  if (!emailError.value && !passwordError.value) {
    isLoading.value = true
    try {
      const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
      })

      const data = await response.json()

      if (!response.ok) {
      throw new Error(
        (data.error && data.error.message) ||
        data.error ||
        'Login gagal. Periksa kembali data Anda.'
      )
      }

      localStorage.setItem('token', data.data.token)
      isLoggedIn.value = true

      const userRes = await fetch('/users/me', {
      headers: {
        'Authorization': `Bearer ${data.data.token}`,
        'Content-Type': 'application/json'
      }
      })
      const userData = await userRes.json()
      if (userRes.ok && userData.data && userData.data.role === 'admin') {
      router.push('/dashboardadmin')
      } else {
      router.push('/absen')
      }
    } catch (error) {
      alert(error.message)
    } finally {
      isLoading.value = false
    }
  }
}

const emit = defineEmits(['toggle-form'])

function goToSignup() {
  emit('toggle-form')
}

function handleForgotPassword() {
  router.push('/resetpassword')
}

function handleGoogleLogin() {
  window.location.href = '/auth/google'
}

</script>

<template>
  <n-global-style />
  <div class="form-wrapper">
    <div class="container">
      <h1 class="headersb1">Selamat datang kembali!</h1>
      <p class="bodyr3">Masuk dan melanjutkan perjalanan belajarmu</p>
    </div>

    <div class="compo" @keyup.enter="handleLogin">
      <div class="form-input">
        <p class="bodym2">E-mail</p>
        <n-input
          round
          v-model:value="email"
          placeholder="Ketik email terdaftar kamu disini"
          type="email"
          class="input-custom mb-2 bodyr2"
          @blur="validateEmail"
        />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>

      <div class="form-input">
        <div class="label-row">
          <p class="bodym2">Password</p>
          <button @click="handleForgotPassword" class="forgot-link">
            Lupa password?
          </button>
        </div>
        <div style="position: relative;">
          <n-input
            round
            v-model:value="password"
            show-password-on="mousedown"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="input-custom mb-2 bodyr2"
            @blur="validatePassword"
          />
        </div>
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      </div>

      <n-button
        type="primary"
        block
        @click="handleLogin"
        :loading="isLoading"
        class="butSign buttonb2"
      >
        Masuk
      </n-button>

      <!-- Divider -->
      <div class="divider">
        <span class="divider-text">atau</span>
      </div>

      <!-- Tombol Login dengan Google -->
      <n-button
        block
        class="google-btn"
        @click="handleGoogleLogin"
      >
        <img :src="googleIcon" alt="Google" class="google-icon-img" />
        Masuk dengan Google
      </n-button>
      
      <p class="bodym3">
        Belum punya akun?
        <button @click="goToSignup" class="toggle-link">
          Daftar disini
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.form-wrapper {
  width: 320px;
  margin: 12px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-wrapper > div {
  width: 100%;
}

.container .headersb1 {
  color: #154484;
}

.container .bodyr2, .form-input .bodyr2 {
  color: #061222;
}

.bodym3 {
  color: #777E90;
  text-align: center;
}


.input-custom {
  text-align: left;
}

.form-input {
  margin: 1.5rem 0;
}

.butSign {
  width: 100%;
  background-color: #154484;
  color: white;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  border-radius: 1.5rem;
  margin: 1.5rem 0;
}

.compo {
  padding: 1rem 0;
}

.toggle-link {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.toggle-link:hover {
  color: #2563eb;
}

.error-message {
  color: red !important;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.forgot-link {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.forgot-link:hover {
  color: #2563eb;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.google-btn {
  border: 1px solid #154484;
  color: #154484;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  border-radius: 1.5rem;
  margin: 1.5rem auto;
  width: fit-content;
  height: fit-content;
  padding: 0 0.5rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-icon-img {
  width: 40px;
  height: auto;
}

.toggle-password-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  color: #154484;
}

.divider {
  width: 100%;
  border-bottom: 1px solid #777E90;
  margin: 16px 0;
  position: relative;
}

.divider-text {
  position: absolute;
  top: -0.6em;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 12px;
}

@media (max-width: 982px) {
  .form-wrapper {
    width: 280px;
  }
}
</style>
