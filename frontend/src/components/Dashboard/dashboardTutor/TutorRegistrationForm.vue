<template>
  <n-card title="Buat Akun Tutor" :bordered="false" style="max-width: 800px; margin: auto;">
    <n-form ref="formRef" :model="formValue">
      <n-h2>Informasi Pribadi</n-h2>
      <n-grid :x-gap="24" :y-gap="20" :cols="1" responsive="screen" s-responsive="2">
        <n-gi :span="2">
          <n-form-item label="Nama Lengkap" path="fullName">
            <n-input v-model="formValue.fullName" placeholder="Tuliskan nama tutor" />
          </n-form-item>
        </n-gi>
        
        <n-gi>
          <n-form-item label="Tanggal Lahir" path="dateOfBirth">
            <n-date-picker v-model="formValue.dateOfBirth" type="date" style="width: 100%;" placeholder="Pilih tanggal lahir" />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item label="Jenis Kelamin" path="gender">
            <n-select v-model="formValue.gender" :options="genderOptions" placeholder="Pilih jenis kelamin" />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item label="E-mail" path="email">
            <n-input v-model="formValue.email" placeholder="Tuliskan email tutor" />
          </n-form-item>
        </n-gi>
        
        <n-gi>
          <n-form-item label="No. WhatsApp" path="whatsapp">
            <n-input v-model="formValue.whatsapp" placeholder="08xxxxxxxxxx" />
          </n-form-item>
        </n-gi>
        
        <n-gi :span="2">
          <n-form-item label="Foto Diri" path="profilePicture">
            <n-upload
              action="https://www.mocky.io/v2/5e4bafc63100007100d59bbe"
              :max="1"
              list-type="image-card"
            >
              Masukkan foto tutor
            </n-upload>
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-divider />

      <n-h2>Pendidikan</n-h2>
      <n-grid :x-gap="24" :y-gap="20" :cols="1" responsive="screen" s-responsive="2">
        <n-gi :span="2">
          <n-form-item label="Asal Universitas" path="university">
            <n-input v-model="formValue.university" placeholder="Tuliskan universitas asal tutor" />
          </n-form-item>
        </n-gi>
        
        <n-gi>
          <n-form-item label="Prodi" path="major">
            <n-input v-model="formValue.major" placeholder="Tuliskan prodi tutor" />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item label="Status" path="educationStatus">
            <n-select v-model="formValue.educationStatus" :options="statusOptions" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-divider />

      <n-h2>Mengajar</n-h2>
      <n-grid :x-gap="24" :y-gap="20" :cols="1" responsive="screen" s-responsive="2">
        <n-gi>
          <n-form-item label="Jenjang" path="teachingLevels">
             <n-select
              v-model="formValue.teachingLevels"
              multiple
              placeholder="Contoh: SMP, SMA"
              :options="levelOptions"
            />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item label="Mata Pelajaran" path="subjects">
            <n-select
              v-model="formValue.subjects"
              multiple
              tag
              placeholder="Contoh: Matematika, Fisika"
              :options="subjectOptions"
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      
      <n-form-item label="Hari Aktif" path="activeDays" :label-style="{ 'margin-top': '10px' }">
        <n-checkbox-group v-model="formValue.activeDays">
          <n-space>
            <n-checkbox v-for="day in days" :key="day.value" :value="day.value" :label="day.label" />
          </n-space>
        </n-checkbox-group>
      </n-form-item>

      <n-space justify="end" style="margin-top: 30px;">
        <n-button @click="handleCancel">Batal</n-button>
        <n-button type="primary" @click="handleCreateAccount">Buat Akun Tutor</n-button>
      </n-space>

    </n-form>
  </n-card>
</template>

<script setup>
import { ref } from 'vue';
import { 
  NCard, NForm, NFormItem, NInput, NDatePicker, NSelect, NUpload, 
  NDivider, NH2, NGrid, NGi, NButton, NSpace, NCheckboxGroup, NCheckbox,
  useMessage 
} from 'naive-ui';

// Inisialisasi message untuk notifikasi
const message = useMessage();

// Referensi untuk form (berguna untuk validasi)
const formRef = ref(null);

// State untuk semua data di dalam form
const formValue = ref({
  fullName: null,
  dateOfBirth: null, // Naive UI akan mengisinya dengan timestamp
  gender: null,
  email: null,
  whatsapp: null,
  profilePicture: null,
  university: null,
  major: null,
  educationStatus: 'Sarjana S1', // Nilai default sesuai gambar
  teachingLevels: [],
  subjects: [],
  activeDays: [],
});

// Opsi untuk dropdown
const genderOptions = [
  { label: 'Laki-Laki', value: 'laki-laki' },
  { label: 'Perempuan', value: 'perempuan' },
];

const statusOptions = [
  { label: 'Semester 1-2', value: 'Semester 1-2' },
  { label: 'Semester 3-4', value: 'Semester 3-4' },
  { label: 'Semester 5-6', value: 'Semester 5-6' },
  { label: 'Semester 7-8', value: 'Semester 7-8' },
  { label: 'Semester 8>', value: 'Semester 8>' },  
  { label: 'Sarjana S1', value: 'Sarjana S1' },
  { label: 'Sarjana S2', value: 'Sarjana S2' },
  { label: 'Sarjana S3', value: 'Sarjana S3' }, 
];

const levelOptions = [
  { label: 'SD', value: 'sd' },
  { label: 'SMP', value: 'smp' },
  { label: 'SMA', value: 'sma' },
  { label: 'SMK', value: 'smk' },
];

const subjectOptions = [
    { label: 'Matematika', value: 'matematika' },
    { label: 'Fisika', value: 'fisika' },
    { label: 'Kimia', value: 'kimia' },
    { label: 'Biologi', value: 'biologi' },
    { label: 'Bahasa Indonesia', value: 'bahasa_indonesia' },
    { label: 'Bahasa Inggris', value: 'bahasa_inggris' },
];


// Opsi untuk hari aktif
const days = [
  { label: 'Senin', value: 'senin' },
  { label: 'Selasa', value: 'selasa' },
  { label: 'Rabu', value: 'rabu' },
  { label: 'Kamis', value: 'kamis' },
  { label: 'Jum\'at', value: 'jumat' },
  { label: 'Sabtu', value: 'sabtu' },
  { label: 'Minggu', value: 'minggu' },
];

// Fungsi untuk menangani submit
const handleCreateAccount = (e) => {
  e.preventDefault();
  // Contoh validasi (opsional)
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('Data Formulir:', formValue.value);
      message.success('Akun tutor berhasil dibuat! (cek console)');
    } else {
      console.log(errors);
      message.error('Harap isi semua data yang diperlukan.');
    }
  });
};

// Fungsi untuk menangani pembatalan
const handleCancel = () => {
  // Anda bisa mengosongkan form atau melakukan navigasi
  console.log('Aksi dibatalkan');
  message.info('Pembuatan akun dibatalkan.');
};
</script>

<style scoped>
/* Menambahkan beberapa styling tambahan jika diperlukan */
.n-h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #efefef;
}
</style>