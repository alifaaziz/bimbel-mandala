<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NForm, NFormItem, NInput, NSelect, useMessage
} from 'naive-ui'
import butPrimerHuge from '../dirButton/butPrimerHuge.vue'
import butSecondHuge from '../dirButton/butSecondHuge.vue'

const router = useRouter()
const message = useMessage()
const formRef = ref(null)

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
const selectedDays = ref([])

const isSubmitting = ref(false)

const formData = ref({
  nama: "",
  tanggalLahir: "",
  jenisKelamin: "",
  foto: null,
  email: "",
  whatsapp: "",
  alamat: "",
  universitas: "",
  prodi: "",
  status: "",
  jenjang: "",
  mapel: "",
  deskripsi: ""
})

const rules = {
  nama: { required: true, message: 'Nama wajib diisi', trigger: 'blur' },
  tanggalLahir: { required: true, message: 'Tanggal lahir wajib diisi', trigger: 'blur' },
  jenisKelamin: { required: true, message: 'Jenis kelamin wajib dipilih', trigger: 'change' },
  email: { required: true, message: 'Email wajib diisi', trigger: 'blur' },
  whatsapp: { required: true, message: 'Nomor WhatsApp wajib diisi', trigger: 'blur' },
  alamat: { required: true, message: 'Alamat wajib diisi', trigger: 'blur' },
  universitas: { required: true, message: 'Universitas wajib diisi', trigger: 'blur' },
  prodi: { required: true, message: 'Program studi wajib diisi', trigger: 'blur' },
  status: { required: true, message: 'Status wajib dipilih', trigger: 'change' },
  jenjang: { required: true, message: 'Jenjang wajib diisi', trigger: 'blur' },
  mapel: { required: true, message: 'Mata pelajaran wajib diisi', trigger: 'blur' },
}

const toggleDay = (day) => {
  if (selectedDays.value.includes(day)) {
    selectedDays.value = selectedDays.value.filter(d => d !== day)
  } else {
    selectedDays.value.push(day)
  }
}

const mapStatusToEnum = (status) => {
  switch (status) {
    case "Mahasiswa Semester 1-2": return "TH1"
    case "Mahasiswa Semester 3-4": return "TH2"
    case "Mahasiswa Semester 5-6": return "TH3"
    case "Mahasiswa Semester 7-8": return "TH4"
    case "Mahasiswa Semester >8": return "TH5"
    case "Sarjana S1": return "S1"
    case "Magister S2": return "S2"
    case "Doktor S3": return "S3"
    default: return ""
  }
}

const submitForm = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    await formRef.value?.validate()

    if (!formData.value.foto) {
      message.error("Foto wajib diunggah.")
      isSubmitting.value = false
      return
    }

    const payload = new FormData()
    payload.append("name", formData.value.nama)
    payload.append("email", formData.value.email)
    payload.append("birthDate", new Date(formData.value.tanggalLahir).toISOString())
    payload.append("gender", formData.value.jenisKelamin === "Laki-Laki" ? "Male" : "Female")
    payload.append("phone", formData.value.whatsapp)
    payload.append("address", formData.value.alamat)
    payload.append("subjects", formData.value.mapel)
    payload.append("status", mapStatusToEnum(formData.value.status))
    payload.append("major", formData.value.prodi)
    payload.append("school", formData.value.universitas)
    payload.append("teachLevel", formData.value.jenjang)
    payload.append("description", formData.value.deskripsi);
    payload.append("days", JSON.stringify(selectedDays.value));
    payload.append("photo", formData.value.foto)

    const res = await fetch("http://localhost:3000/apply", { method: "POST", body: payload })
    if (!res.ok) throw new Error((await res.json()).message || "Gagal mendaftar sebagai tutor.")

    message.success("Pendaftaran berhasil! Kami akan menghubungi Anda segera.")
    router.push("/registersuccess")
  } catch (err) {
    console.error("Error:", err)
    message.error("Terjadi kesalahan saat mendaftar. Silakan coba lagi.")
  } finally {
    isSubmitting.value = false
  }
}

const cancelForm = () => {
  router.push("/")
}

const upload = ref(null);

function handleChange({ fileList }) {
  formData.value.foto = fileList.length > 0 ? fileList[0].file : null;
}
</script>

<template>
  <div class="container-form">
    <div class="header-tutor">
      <h1 class="title title-header">Selamat Datang <br /> Calon Tutor Mandala</h1>
      <p class="subtitle">Silahkan mendaftar dan menjadi bagian dari Bimbel Mandala.</p>
    </div>

    <n-form ref="formRef" :model="formData" :rules="rules" label-placement="top">
      <div class="form">
        <div class="form-group full-width">
          <n-form-item label="Nama Lengkap" path="nama">
            <n-input type="text" v-model:value="formData.nama" placeholder="Tuliskan nama Anda" />
          </n-form-item>
        </div>

        <div class="form-group third-width">
          <n-form-item label="Tanggal Lahir" path="tanggalLahir">
            <n-input type="date" v-model:value="formData.tanggalLahir" placeholder="" />
          </n-form-item>
        </div>

        <div class="form-group third-width">
          <n-form-item label="Jenis Kelamin" path="jenisKelamin">
            <n-select :options="[
              { label: 'Laki-Laki', value: 'Laki-Laki' },
              { label: 'Perempuan', value: 'Perempuan' }
            ]" placeholder="Pilih Jenis Kelamin" v-model:value="formData.jenisKelamin" />
          </n-form-item>
        </div>

        <div class="form-group third-width">
          <label class="bodyr3">Upload Foto</label>
          <n-upload
            ref="upload"
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :default-upload="false"
            :max="1"
            @change="handleChange"
          >
            <n-button>Upload File</n-button>
          </n-upload>
        </div>

        <div class="form-group half-width">
          <n-form-item label="E-mail" path="email">
            <n-input type="email" v-model:value="formData.email" placeholder="Tuliskan email Anda" />
          </n-form-item>
        </div>

        <div class="form-group half-width">
          <n-form-item label="No. WhatsApp" path="whatsapp">
            <n-input-group-label>+62</n-input-group-label>
            <n-input type="tel" v-model:value="formData.whatsapp" placeholder="8xx xxxx xxxx" prefix="+62" />
          </n-form-item>
        </div>

        <div class="form-group full-width">
          <n-form-item label="Alamat" path="alamat">
            <n-input type="text" v-model:value="formData.alamat" placeholder="Tuliskan alamat Anda" />
          </n-form-item>
        </div>

        <div class="form-group full-width">
          <n-form-item label="Asal Universitas" path="universitas">
            <n-input type="text" v-model:value="formData.universitas" placeholder="Tuliskan asal universitas" />
          </n-form-item>
        </div>

        <div class="form-group half-width">
          <n-form-item label="Program Studi" path="prodi">
            <n-input type="text" v-model:value="formData.prodi" placeholder="Tuliskan Program Studi Anda" />
          </n-form-item>
        </div>

        <div class="form-group half-width">
          <n-form-item label="Status" path="status">
            <n-select v-model:value="formData.status" placeholder="Pilih Status" :options="[
              { label: 'Mahasiswa Semester 1-2', value: 'Mahasiswa Semester 1-2' },
              { label: 'Mahasiswa Semester 3-4', value: 'Mahasiswa Semester 3-4' },
              { label: 'Mahasiswa Semester 5-6', value: 'Mahasiswa Semester 5-6' },
              { label: 'Mahasiswa Semester 7-8', value: 'Mahasiswa Semester 7-8' },
              { label: 'Mahasiswa Semester >8', value: 'Mahasiswa Semester >8' },
              { label: 'Sarjana S1', value: 'Sarjana S1' },
              { label: 'Magister S2', value: 'Magister S2' },
              { label: 'Doktor S3', value: 'Doktor S3' }
            ]" />
          </n-form-item>
        </div>

        <div class="form-group half-width">
          <n-form-item label="Jenjang" path="jenjang">
            <n-input type="text" v-model:value="formData.jenjang" placeholder="SMP, SMA" />
          </n-form-item>
        </div>

        <div class="form-group half-width">
          <n-form-item label="Mata Pelajaran" path="mapel">
            <n-input type="text" v-model:value="formData.mapel" placeholder="Matematika, Fisika, Kimia" />
          </n-form-item>
        </div>

        <div class="form-group full-width">
          <n-form-item label="Deskripsi">
            <n-input type="textarea" v-model:value="formData.deskripsi" placeholder="Tuliskan pengalaman mengajar Anda" />
          </n-form-item>
        </div>

        <div class="form-group full-width">
          <h2 class="headersb2">Hari Aktif</h2>
          <div class="days">
            <button
              v-for="(day, index) in days"
              :key="index"
              type="button"
              :class="['day-button', { active: selectedDays.includes(day) }]"
              @click="toggleDay(day)"
            >
              {{ day }}
            </button>
          </div>
        </div>

        <div class="button-action">
          <butPrimerHuge label="Daftar Sebagai Tutor" @click="submitForm" />
          <butSecondHuge label="Batal" @click="cancelForm" />
        </div>
      </div>
    </n-form>
  </div>
</template>


<style scoped>
/* Global */
* {
  box-sizing: border-box;
}

.container-form {
  padding: 0 8rem;
}

form {
  margin-bottom: 3rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #154484;
  text-align: left;
}

.title-header {
  font-size: 4rem;
  line-height: 1.2;
  text-align: center;
}

.gender-select {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 100%;
}

.button-action {
  display: flex;
  justify-content: left;
  gap: 0.5rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .title-header {
    font-size: 2.5rem;
  }
}

.subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: #f27f28;
  text-align: center;
}

.headersb2{
  color: #154484;
  margin-bottom: 0.5rem;
}

/* Layout untuk header */
.header-tutor {
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'Poppins', sans-serif;
}

/* Info Pribadi, Pendidikan, Mengajar, Hari Mengajar */
.info-pribadi,
.pendidikan,
.mengajar,
.hari-mengajar {
  font-family: 'Poppins', sans-serif;
}

/* Form */
.form {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 6;
}

.form-group.third-width {
  grid-column: span 2;
}

.form-group.half-width {
  grid-column: span 3;
}

label {
  color: black;
  margin-bottom: 0.5rem;
}

input,
select {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 100%;
  height: 100%;
}

input::placeholder {
  color: #9ca3af;
}

.input-with-icon {
  position: relative;
}

.calendar-button,
.upload-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #154484;
}

/* Hari Aktif */
.days {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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

/* Hilangkan spinner di input type number (Chrome, Safari, Edge) */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hilangkan spinner di input type number (Firefox) */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: none;
}

/* Responsive */
@media (max-width: 960px) {
  .container-form {
      padding: 0 2rem;
  }
  .form {
    grid-template-columns: 1fr;
  }

  .form-group.full-width,
  .form-group.third-width,
  .form-group.half-width {
    grid-column: span 1;
  }

  input,
  select {
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .calendar-button,
  .upload-button {
    font-size: 1rem;
  }
}
</style>