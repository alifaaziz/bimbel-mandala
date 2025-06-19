<template>
  <div class="form-container">
    <n-card title="Tambah Akun Siswa">
      <n-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="top"
        label-width="auto"
      >
        <n-grid :x-gap="24" :cols="24">
          <n-gi :span="12">
            <n-form-item label="Nama Lengkap" path="namaLengkap">
              <n-input
                v-model="formModel.namaLengkap"
                placeholder="Tuliskan nama siswa disini"
              />
            </n-form-item>
          </n-gi>
          <n-gi :span="12">
            <n-form-item label="Jenjang" path="jenjang">
              <n-select
                v-model="formModel.jenjang"
                :options="jenjangOptions"
              />
            </n-form-item>
          </n-gi>

          <n-gi :span="24">
            <n-form-item label="E-mail" path="email">
              <n-input
                v-model="formModel.email"
                placeholder="Tuliskan e-mail siswa disini"
              />
            </n-form-item>
          </n-gi>

          <n-gi :span="24">
            <n-form-item label="Password Siswa" path="password">
              <n-input
                v-model="formModel.password"
                type="password"
                show-password-on="mousedown"
                placeholder="Berikan password untuk akun siswa"
              />
            </n-form-item>
          </n-gi>

          <n-gi :span="12">
            <n-form-item label="No. WhatsApp" path="noWhatsApp">
              <n-input
                v-model="formModel.noWhatsApp"
                placeholder="08xx xxxx xxxx"
              />
            </n-form-item>
          </n-gi>
          <n-gi :span="12">
            <n-form-item label="No. Telp Wali" path="noTelpWali">
              <n-input
                v-model="formModel.noTelpWali"
                placeholder="08xx xxxx xxxx"
              />
            </n-form-item>
          </n-gi>

          <n-gi :span="24">
            <n-form-item label="Alamat" path="alamat">
              <n-input
                v-model="formModel.alamat"
                type="textarea"
                placeholder="Alamat tempat tinggal siswa"
                :autosize="{
                  minRows: 3,
                  maxRows: 5,
                }"
              />
            </n-form-item>
          </n-gi>
        </n-grid>

        <n-text :depth="3">
          Kolom dengan tanda bintang (*) wajib diisi
        </n-text>

        <n-space style="margin-top: 20px;">
          <n-button type="primary" @click="handleApplyClick">
            Terapkan
          </n-button>
          <n-button @click="handleCancelClick">
            Batal
          </n-button>
        </n-space>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NCard,
  NGrid,
  NGi,
  NSpace,
  NText,
  useMessage,
} from 'naive-ui';

// Hook untuk menampilkan notifikasi
const message = useMessage();

// Referensi ke komponen form untuk memicu validasi
const formRef = ref(null);

// Model data reaktif untuk semua input form
const formModel = ref({
  namaLengkap: '',
  jenjang: 'SMA', // Nilai default sesuai gambar
  email: '',
  password: '',
  noWhatsApp: '',
  noTelpWali: '',
  alamat: '',
});

// Opsi untuk dropdown "Jenjang"
const jenjangOptions = ref([
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SMA', value: 'SMA' },
  { label: 'SMK', value: 'SMK' },
]);

// Aturan validasi untuk form
const rules = {
  namaLengkap: {
    required: true,
    message: 'Nama lengkap wajib diisi',
    trigger: ['input', 'blur'],
  },
  email: {
    required: true,
    message: 'E-mail wajib diisi',
    trigger: ['input', 'blur'],
  },
  password: {
    required: true,
    message: 'Password wajib diisi',
    trigger: ['input', 'blur'],
  },
};

// Fungsi saat tombol "Terapkan" diklik
const handleApplyClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('Data form valid:', formModel.value);
      message.success('Akun siswa berhasil ditambahkan!');
      // Di sini Anda dapat menambahkan logika untuk mengirim data ke server
    } else {
      console.log('Validasi gagal:', errors);
      message.error('Harap isi semua kolom yang wajib diisi.');
    }
  });
};

// Fungsi saat tombol "Batal" diklik
const handleCancelClick = () => {
  // Reset form ke nilai awal
  formModel.value = {
    namaLengkap: '',
    jenjang: 'SMA',
    email: '',
    password: '',
    noWhatsApp: '',
    noTelpWali: '',
    alamat: '',
  };
  message.info('Penambahan akun dibatalkan dan form telah direset.');
};

</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
</style>