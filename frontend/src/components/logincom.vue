<script setup>
import { ref } from 'vue'
import { NInput, NButton } from 'naive-ui'

const username = ref('')
const password = ref('')

function login() {
  alert(`Login sebagai ${username.value}`)
}
</script>

<template>
  <div class="form-wrapper">

    <div class="container">
      <h1 class="headersb1">Selamat datang kembali!</h1>
      <p class="bodyr2">Lorem ipsum dolor sit amet</p>
    </div>

    <div class="container">
        
        <n-form-item label="Username">Username</n-form-item>
        <n-input 
        v-model:value="username" 
        placeholder="Username" 
        class="input-custom mb-2"
        />
        <n-form-item label="Password">Password</n-form-item>
        <n-form-item label="Password"></n-form-item>
        <n-input 
          v-model:value="password" 
          placeholder="Password" 
          type="password" 
          class="input-custom mb-2"
        />
    
        <n-button 
          type="primary" 
          block 
          @click="login" 
          class="butSign">
          Login
        </n-button>
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
  border: #154484;
}

.form-wrapper > div {
  width: 100%;
}

.input-custom :hover {
  border: #154484;
}

.mb-2 {
  margin-bottom: 12px;
}

.butSign {
  width: 100%;
  background-color: #154484;
  border: solid white 1px;
  color: white;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  border-radius: 1.5rem;
  font-size: 12px;
  font-weight: bold;
  margin: 1.5rem 0;
}

.butSign:hover {
  background-color: #000000;
}

.input-custom {
  text-align: left;
  padding-left: 0px;
  font-family: 'Poppins', sans-serif;
  border: solid #154484 1px;
  border-radius: 1rem;
}

.input-custom:hover {
  border-color: #154484;
}

:deep(.input-custom::placeholder) {
  font-family: 'Poppins', sans-serif;
}

@media (max-width: 982px) {
  .form-wrapper {
    width: 280px;
  }
}

.container {
  padding: 0rem 0;
}

:deep(.n-input) {
  border: 1px solid #154484 !important; /* Pastikan warna border default */
  border-radius: 1rem !important; /* Border radius */
}

:deep(.n-input:hover) {
  border-color: #154484 !important; /* Warna border saat hover */
  box-shadow: none !important; /* Hilangkan efek bawaan */
}

:deep(.n-input:focus-within) {
  border-color: #154484 !important; /* Warna border saat focus */
  box-shadow: 0 0 4px #154484 !important; /* Tambahkan efek glow */
}
</style>
