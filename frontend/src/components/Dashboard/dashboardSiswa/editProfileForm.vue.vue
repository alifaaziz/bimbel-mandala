<template>
  <div class="form-container">
    <n-card title="Edit Profil Siswa">
      <n-form
        ref="formRef"
        :model="formModel"
        label-placement="top"
        label-width="auto"
      >
        <n-grid :x-gap="24" :cols="24">
          <n-gi :span="12">
            <n-form-item label="Nama Lengkap" path="namaLengkap">
              <n-input
                v-model="formModel.namaLengkap"
                placeholder="Ubah Nama Siswa"
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
            <n-form-item label="Sekolah" path="sekolah">
              <n-input
                v-model="formModel.sekolah"
                placeholder="Ubah Sekolah siswa"
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

        <n-space>
          <n-button type="primary" @click="handleApplyClick">
            Terapkan
          </n-button>
          <n-button @click="handleCancelClick">
            Batal Edit
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
  useMessage, // Opsional, untuk menampilkan notifikasi
} from 'naive-ui';

// Inisialisasi message untuk notifikasi
const message = useMessage();

// Mereferensikan elemen form (berguna untuk validasi)
const formRef = ref(null);

// Model data untuk form, menggunakan ref agar reaktif
const formModel = ref({
  namaLengkap: '',
  jenjang: 'SMA', // Nilai default sesuai gambar
  sekolah: '',
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
  { label: 'Universitas', value: 'Universitas' },
]);

// Fungsi yang dipanggil saat tombol "Terapkan" diklik
const handleApplyClick = (e) => {
  e.preventDefault(); // Mencegah perilaku default form submission
  
  // Contoh validasi (opsional)
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('Data yang akan dikirim:', formModel.value);
      message.success('Profil berhasil diperbarui!');
    } else {
      console.log('Ditemukan error pada form:', errors);
      message.error('Silakan periksa kembali data yang Anda isikan.');
    }
  });
};

// Fungsi yang dipanggil saat tombol "Batal Edit" diklik
const handleCancelClick = () => {
    console.log('Proses edit dibatalkan');
    message.info('Perubahan dibatalkan.');
    // Di sini Anda bisa menambahkan logika untuk mereset form atau kembali ke halaman sebelumnya
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
</style>