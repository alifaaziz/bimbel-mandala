<script setup>
import { ref} from 'vue'
import navbarEditProfile from './navbarEditProfile.vue'
import Footer from '../footer.vue'
import butSimpan from '../dirButton/butSimpan.vue'

const nama = ref('')
const jenjang = ref(null)
const sekolah = ref('')
const noWa = ref('')
const noWali = ref('')
const alamat = ref('')


// Opsi untuk dropdown `n-select`
const options = [
  { label: "SMA", value: "SMA" },
  { label: "SMP", value: "SMP" },
  { label: "SD", value: "SD" },
]

const submitForm = async () => {
  const token = localStorage.getItem('token')
  const rawPayload = {
    name: nama.value,
    level: jenjang.value,
    schoolName: sekolah.value,
    phone: noWa.value,
    parentPhone: noWali.value,
    address: alamat.value
  }
  // Filter field yang null, undefined, atau string kosong/whitespace
  const payload = Object.fromEntries(
    Object.entries(rawPayload).filter(
      ([_, v]) =>
        v !== null &&
        v !== undefined &&
        !(typeof v === 'string' && v.trim() === '')
    )
  )
  try {
    const res = await fetch('/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    window.location.href = '/profileuser'
  } catch (err) {
    console.error('Update gagal:', err)
  }
}
</script>

<template>
  <navbarEditProfile />
  <div class="profile-container padding-components">
    <h1 class="headersb3">Informasi Akun</h1>
    <n-space vertical class="input bodym2">
      <div class="input-line">
        <div class="input-nama">
          <p class="input-judul">Nama</p>
          <n-input v-model:value="nama" type="text" placeholder="Ganti nama kamu" />
        </div>
        <div class="input-jenjang">
          <p class="input-judul">Jenjang</p>
          <n-select 
            v-model:value="jenjang" 
            :options="options" 
            placeholder="Pilih jenjang" 
          />
        </div>
      </div>

      <div class="input-line">
        <div class="input-sekolah">
          <p class="input-judul">Sekolah</p>
          <n-input v-model:value="sekolah" type="text" placeholder="Ganti nama sekolah baru kamu" />
        </div>
      </div>

      <div class="input-line">
        <div class="input-wa">
          <p class="input-judul">No. Whatsapp</p>
          <n-input v-model:value="noWa" type="text" placeholder="Ganti nomor Whatsapp" />
        </div>
        <div class="input-nowali">
          <p class="input-judul">No Telp Wali</p>
          <n-input v-model:value="noWali" type="text" placeholder="Ganti nomor telp wali" />
        </div>
      </div>

      <div class="input-line">
        <div class="input-wa">
          <p class="input-judul">Alamat</p>
          <n-input v-model:value="alamat" type="text" placeholder="Ganti alamat kamu" />
        </div>
        <div class="input-nowali">
          <p class="input-judul">Password</p>
          <n-input v-model:value="password" type="text" placeholder="Ganti password kamu" />
        </div>
      </div>
      
    </n-space>
    <butSimpan @click="submitForm"/>
  </div>
  <Footer/> 
</template>

<style scoped>
.profile-container {
  margin: 104px 0 0;
}
.profile-container .headersb3, .profile-container .bodym2{
  color: #061222;
}
.input-line {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  padding: 0.5rem 0;
}
.n-input {
  border-radius: 8px;
}
.input-judul{
  color: #154484;
}
.input-line .input-judul {
  margin-bottom: 8px;
}
.input-line .input-nama {
  grid-column: span 9;
}
.input-line .input-jenjang {
  grid-column: span 3;
}
.input-line .input-sekolah,
.input-alamat {
  grid-column: span 12;
}
.input-line .input-wa,
.input-nowali {
  grid-column: span 6;
}

@media (max-width: 768px) {
  .input-line {
    grid-template-columns: 1fr !important;
  }
  .input-line .input-nama,
  .input-line .input-jenjang {
    grid-column: span 1 !important;
  }
}

</style>