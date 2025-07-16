<script setup>
import { ref } from 'vue'
import { NInput, NButton } from 'naive-ui'
import googleIcon from '../../assets/google.svg'
import router from '@/router'

const name = ref('')
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const isLoading = ref(false)

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
  const value = password.value

  if (!value) {
    passwordError.value = 'Password wajib diisi.'
  } else if (value.length < 8) {
    passwordError.value = 'Password minimal 8 karakter.'
  } else if (!/[A-Z]/.test(value)) {
    passwordError.value = 'Password harus mengandung huruf kapital.'
  } else if (!/[0-9]/.test(value)) {
    passwordError.value = 'Password harus mengandung angka.'
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    passwordError.value = 'Password harus mengandung karakter khusus.'
  } else {
    passwordSuccess.value = 'Password cukup kuat.'

  }
}

async function handleSignup() {
  validateEmail()
  validatePassword()

  if (!emailError.value && !passwordError.value) {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
          role: 'siswa',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Registrasi gagal. Periksa kembali data Anda.';
        throw new Error(errorMessage);
      }

      localStorage.setItem('email', email.value);
      router.replace('/otp')
    } catch (error) {
      alert(`${error.message}`)
    } finally {
      isLoading.value = false
    }
  }
}

// Tambahkan fungsi untuk login dengan Google
async function handleGoogleLogin() {
  window.location.href = '/auth/google'
}

const emit = defineEmits(['toggle-form'])

function goToLogin() {
  emit('toggle-form')
}

function goToMenjadiTutor() {
  router.push('/pendaftarantutor')
}

</script>

<template>
  <div class="form-wrapper" @keyup.enter="handleSignup">
    <div class="container">
      <h1 class="headersb1">Daftar Sebagai Siswa</h1>
      <p class="bodyr3">Ayo mulai belajar dan raih impianmu</p>
    </div>

    <div class="compo">
      <div class="form-input">
        <p class="bodym2">Nama Lengkap</p>
        <n-input
          type="text"
          round
          v-model:value="name"
          placeholder="Nama Lengkap"
          class="input-custom mb-2 bodyr2"
        />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>
      <div class="form-input">
        <p class="bodym2">E-mail</p>
        <n-input
          round
          v-model:value="email"
          placeholder="E-mail"
          type="email"
          class="input-custom mb-2 bodyr2"
          @blur="validateEmail"
        />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>

      <div class="form-input">
        <p class="bodym2">Password</p>
        <div style="position: relative;">
          <n-input
            round
            v-model:value="password"
            show-password-on="mousedown"
            placeholder="Password"
            :type="showPassword ? 'text' : 'password'"
            class="input-custom mb-2 bodyr2"
            @blur="validatePassword"
          />
        </div>
        <p class="bodyr4">Password harus lebih dari 8 karakter</p>
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        <p v-else-if="passwordSuccess" class="success-message">{{ passwordSuccess }}</p>
      </div>

      <n-button
        type="primary"
        block
        @click="handleSignup"
        :loading="isLoading"
        class="butSign buttonb2"
      >
        Daftar
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
        Lanjutkan dengan Google
      </n-button>

      <p class="bodym3">
        Sudah punya akun?
        <button @click="goToLogin" class="toggle-link">
          Masuk disini
        </button>
      </p>
      <p class="bodym3" style="margin-top: 1rem;">
      Ingin menjadi tutor?
      <button @click="goToMenjadiTutor" class="toggle-link">
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

.menjadi-tutor{
  margin: 1rem 0;
  text-align: left;
}

.form-wrapper > div {
  width: 100%;
}

.container .headersb1 {
  color: #154484;
}

.container .bodyr2, .form-input {
  color: #061222;
}

.input-custom {
  text-align: left;
}

.form-input {
  margin: 1.5rem 0;
}

.bodyr4 {
  color: darkgrey;
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

.success-message { 
  color: green !important;
  font-size: 0.75rem;
  margin-top: 0.25rem;
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

.divider {
  width: 100%;
  text-align: center;
  border: none;
  position: relative;
  margin: 16px 0;
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #777E90;
  margin: 0 8px;
}

.divider-text {
  color: #6b7280;
  font-size: 12px;
  background: #fff;
  padding: 0 12px;
  z-index: 1;
}

.bodym3 {
  color: #777E90;
  text-align: center;
}

@media (max-width: 982px) {
  .form-wrapper {
    width: 280px;
  }
}
</style>
