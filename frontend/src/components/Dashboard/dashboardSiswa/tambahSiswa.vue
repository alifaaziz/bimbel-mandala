<template>
  <div class="form-container">
    <n-card class="form-card" title="Tambah Akun Siswa">
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
                placeholder="Tuliskan nama siswa di sini"
              />
            </n-form-item>
          </n-gi>
          <n-gi :span="12">
            <n-form-item label="Jenjang" path="jenjang">
              <n-select
                v-model="formModel.jenjang"
                :options="jenjangOptions"
                placeholder="Pilih jenjang"
              />
            </n-form-item>
          </n-gi>

          <n-gi :span="24">
            <n-form-item label="E-mail" path="email">
              <n-input
                v-model="formModel.email"
                placeholder="Tuliskan e-mail siswa di sini"
                type="email"
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
                :autosize="{ minRows: 3, maxRows: 5 }"
              />
            </n-form-item>
          </n-gi>
        </n-grid>

        <n-text :depth="3" style="margin-top: 8px; display: block;">
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
import { useRouter } from 'vue-router';
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

const message = useMessage();
const router = useRouter();

const formRef = ref(null);

const formModel = ref({
  namaLengkap: '',
  jenjang: 'SMA',
  email: '',
  password: '',
  noWhatsApp: '',
  noTelpWali: '',
  alamat: '',
});

const jenjangOptions = [
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SMA', value: 'SMA' },
  { label: 'SMK', value: 'SMK' },
];

const rules = {
  namaLengkap: [
    { required: true, message: 'Nama lengkap wajib diisi' }
  ],
  jenjang: [
    { required: true, message: 'Jenjang wajib dipilih' }
  ],
  email: [
    { 
      required: true, 
      message: 'E-mail wajib diisi' 
    },
    {
      validator(rule, value) {
        if (!value) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return new Error('Format e-mail tidak valid');
        return true;
      }
    }
  ],
  password: [
    { required: true, message: 'Password wajib diisi' },
    { min: 6, message: 'Password minimal 6 karakter' }
  ]
};

const handleApplyClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error('Harap isi semua kolom yang wajib diisi dengan benar.');
    } else {
      // Tidak perlu menampilkan pesan sukses di sini, hanya submit ke backend jika diperlukan
      // message.success('Akun siswa berhasil ditambahkan!');
      // Tambahkan logika submit ke backend di sini jika diperlukan
    }
  });
};

const handleCancelClick = () => {
  router.back();
};
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 20px;
}
.form-card {
  border-radius: 16px;
}
</style>