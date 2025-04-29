<script setup>
import { ref } from 'vue'
import { NInput, NButton } from 'naive-ui'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const isLoading = ref(false)

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
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login gagal. Periksa kembali data Anda.')
      }

      const data = await response.json()
      alert(`Login berhasil: ${data.message}`)
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
</script>

<template>
  <n-global-style />
  <div class="form-wrapper">
    <div class="container">
      <h1 class="headersb1">Selamat datang kembali!</h1>
      <p class="bodyr2">Lorem ipsum dolor sit amet</p>
    </div>

    <div class="compo">
      <div class="form-input">
        <p class="bodym2">E-mail</p>
        <n-input
          round
          v-model:value="email"
          placeholder="E-mail"
          type="email"
          class="input-custom mb-2 bodym2"
          @blur="validateEmail"
        />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>

      <div class="form-input">
        <p class="bodym2">Password</p>
        <n-input
          round
          v-model:value="password"
          placeholder="Password"
          type="password"
          class="input-custom mb-2 bodym2"
          @blur="validatePassword"
        />
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      </div>

      <n-button
        type="primary"
        block
        @click="handleLogin"
        :loading="isLoading"
        class="butSign buttonb2"
      >
        Login
      </n-button>

      <p>
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
  color: red;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

@media (max-width: 982px) {
  .form-wrapper {
    width: 280px;
  }
}
</style>
