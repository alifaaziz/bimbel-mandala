<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import butPrimerNormal from '../dirButton/butPrimerNormal.vue'

const otpLength = 6
const otp = ref(Array(otpLength).fill(''))
const otpDigits = Array.from({ length: otpLength })
const showModal = ref(false)
const verifiedCode = ref('')

const router = useRouter()

function focusNext(idx, event) {
  if (event.inputType === 'insertText' && otp.value[idx] && idx < otpLength - 1) {
    event.target.nextElementSibling?.focus()
  }
}

function focusPrev(idx, event) {
  if (!otp.value[idx] && idx > 0) {
    event.target.previousElementSibling?.focus()
  }
}

function verifyOtp() {
  const code = otp.value.join('')
  verifiedCode.value = code
  showModal.value = true
}

function goToLogin() {
  router.push('/auth')
}

function resendOtp() {
  // Lakukan request kirim ulang OTP di sini
  alert('Kode OTP telah dikirim ulang.')
}
</script>

<template>
  <div class="form-otp padding-components">
    <div class="form-wrapper">
      <h2 class="headerb1">Verifikasi OTP</h2>
      <p class="bodyr3">Masukkan kode OTP yang telah dikirim ke email/nomor Anda.</p>
      <form  @submit.prevent="verifyOtp">
        <div class="otp-input-group">
          <input
            v-for="(digit, idx) in otpDigits"
            :key="idx"
            type="text"
            maxlength="1"
            class="input-otp"
            v-model="otp[idx]"
            @input="focusNext(idx, $event)"
            @keydown.backspace="focusPrev(idx, $event)"
            @keyup.enter="verifyOtp"
          />
        </div>
        <div class="button">
            <butPrimerNormal label="Verifikasi" @click="verifyOtp" />
            <a class="resend-otp buttonr3" @click="resendOtp" >Kirim Ulang OTP</a>    
        </div>
      </form>
    </div>
  </div>

  <!-- Modal verifikasi -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <!-- Animated checkmark -->
      <div class="checkmark-wrapper">
        <svg class="checkmark" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
        </svg>
      </div>
      <h3 class="headersb3">Kode Terverifikasi</h3>
      <p class="bodyr3">Your verified code is: {{ verifiedCode }}</p>
      <butPrimerNormal label="Masuk" @click="goToLogin" />
    </div>
  </div>
</template>

<style scoped>
.form-otp {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff; /* opsional, bisa dihapus jika tidak perlu */
}
.form-wrapper {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.headerb1 {
  color: #154484;
  text-align: center;
}
.bodyr3 {
  color: #061222;
  text-align: center;
}
.otp-input-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}
.input-otp {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 2rem;
  font-weight: 400;
  border: 2px solid #cbd5e1; /* slate-300 */
  border-radius: 10px;
  background: #f8fafc; /* slate-50 */
  outline: none;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
}

.input-otp:focus {
  border-color: #2563eb; /* blue-600 */
  background: #e0e7ff;   /* indigo-100 */
  box-shadow: 0 0 0 2px #60a5fa;
}

.button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.resend-otp {
    color: #3b82f6; /* blue-600 */
    text-decoration: underline;
    cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.headersb3 {
  color: #154484;
  margin-bottom: 0.5rem;
}

.bodyr3 {
  color: #061222;
  margin-bottom: 0.5rem;
}

.checkmark-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.checkmark {
  width: 56px;
  height: 56px;
  display: block;
}

.checkmark-circle {
  stroke: #22c55e; /* green-500 */
  stroke-width: 3;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  stroke: #22c55e;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.4s 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}

@media (max-width: 500px) {
  .input-otp {
    width: 36px;
    height: 44px;
    font-size: 1.2rem;
  }
  .otp-input-group {
    gap: 6px;
  }
}
</style>
