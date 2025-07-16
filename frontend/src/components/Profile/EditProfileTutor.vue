<script setup>
import { ref} from 'vue'
import navbarEditProfile from './navbarEditProfile.vue'
import Footer from '../footer.vue'
import butSimpan from '../dirButton/butSimpan.vue'

const nama = ref('')
const status = ref(null)
const sekolah = ref('')
const noWa = ref('')
const noWali = ref('')
const alamat = ref('')
const jenjang = ref('')
const pelajaran = ref('')


// Opsi untuk dropdown `n-select`
const options = [
  { label: "Semester 1-2", value: "TH1" },
  { label: "Semester 3-4", value: "TH2" },
  { label: "Semester 5-6", value: "TH3" },
  { label: "Semester 7-8", value: "TH4" },
  { label: "Semester 8<", value: "TH5" },
  { label: "S1", value: "S1" },
  { label: "S2", value: "S2" },
  { label: "S3", value: "S3" },
]

import { defineEmits, defineProps, watch } from 'vue'

// Props (optional: receive default selected days from parent)
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

// Emit untuk v-model
const emit = defineEmits(['update:modelValue'])

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
const selectedDays = ref([...props.modelValue])

watch(selectedDays, (val) => {
  emit('update:modelValue', val)
})

const toggleDay = (day) => {
  if (selectedDays.value.includes(day)) {
    selectedDays.value = selectedDays.value.filter(d => d !== day)
  } else {
    selectedDays.value.push(day)
  }
}

const submitForm = async () => {
  const token = localStorage.getItem('token')
  const rawPayload = {
    name: nama.value,
    status: status.value,
    school: sekolah.value,
    phone: noWa.value,
    address: alamat.value,
    teachLevel: jenjang.value,
    subjects: pelajaran.value
  }

  if (selectedDays.value.length > 0) {
    rawPayload.daysName = selectedDays.value
  }

  const payload = Object.fromEntries(
    Object.entries(rawPayload).filter(
      ([_, v]) =>
        v !== null &&
        v !== undefined &&
        !(typeof v === 'string' && v.trim() === '')
    )
  )
  try {
    const res = await fetch('http://localhost:3000/users/me', {
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
  <div>
    <navbarEditProfile />
    <div class="profile-container padding-components">
      <h1 class="headersb3">Informasi Akun</h1>
      <n-space vertical class="input bodym2">
        <div class="input-line">
          <div class="input-nama">
            <p class="input-judul">Nama</p>
            <n-input v-model="nama" type="text" placeholder="Ganti nama kamu" />
          </div>
          <div class="input-status">
            <p class="input-judul">Status</p>
            <n-select 
              v-model="status" 
              :options="options" 
              placeholder="Pilih status" 
            />
          </div>
        </div>

        <div class="input-line">
          <div class="input-wa">
            <p class="input-judul">No. Whatsapp</p>
            <n-input v-model="noWa" type="text" placeholder="Ganti nomor Whatsapp" />
          </div>
        </div>

        <div class="input-line">
          <div class="input-password">
            <p class="input-judul">Password</p>
            <n-input v-model="password" type="text" placeholder="Ganti password kamu" />
          </div>
        </div>

        <div class="input-line">
          <div class="input-alamat">
            <p class="input-judul">Alamat</p>
            <n-input v-model="alamat" type="text" placeholder="Ganti alamat kamu" />
          </div>
        </div>

        <div class="input-line">
          <div class="input-jenjang">
            <p class="input-judul">Jenjang </p>
            <n-input v-model="jenjang" type="text" placeholder="masukkan jenjang yang bisa anda ajar" />
          </div>
        </div>
        
        <div class="input-line">
          <div class="input-pelajaran">
            <p class="input-judul">Mata Pelajaran</p>
            <n-input v-model="pelajaran" type="text" placeholder="masukkan jenjang yang bisa anda ajar" />
          </div>
        </div>

        <div class="hari-mengajar">
          <p class="input-judul">Hari aktif</p>
          <div class="days">
            <button
              v-for="(day, index) in days"
              :key="index"
              :class="['day-button', { active: selectedDays.includes(day) }]"
              @click="toggleDay(day)"
            >
              {{ day }}
            </button>
          </div>
        </div>

      </n-space>
      <butSimpan @click="submitForm"/>
    </div>
    <Footer/> 
  </div>
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
.input-line .input-status {
  grid-column: span 3;
}
.input-line .input-sekolah,
.input-alamat, .input-wa, 
.input-jenjang, .input-pelajaran, .input-password{
  grid-column: span 12;
}

.hari-mengajar {
  font-family: 'Poppins', sans-serif;
}

.days {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 0.5rem 0;
}

.day-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #154484;
  border-radius: 20px;
  background-color: white;
  color: #154484;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-button.active,
.day-button:hover {
  background-color: #154484;
  color: white;
}

@media (max-width: 768px) {
  .input-line {
    grid-template-columns: 1fr !important;
  }
  .input-line .input-nama,
  .input-line .input-status {
    grid-column: span 1 !important;
  }
}
</style>