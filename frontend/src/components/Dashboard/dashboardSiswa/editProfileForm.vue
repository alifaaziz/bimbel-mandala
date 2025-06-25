<template>
  <div class="form-container">
    <n-card title="Edit Profil Siswa" class="edit-profile-card">
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
  useMessage,
} from 'naive-ui';
import { useRouter } from 'vue-router';

const message = useMessage();
const router = useRouter();

const formRef = ref(null);

const formModel = ref({
  namaLengkap: '',
  jenjang: 'SMA',
  sekolah: '',
  noWhatsApp: '',
  noTelpWali: '',
  alamat: '',
});

const jenjangOptions = ref([
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SMA', value: 'SMA' },
  { label: 'SMK', value: 'SMK' },
  { label: 'Universitas', value: 'Universitas' },
]);

const handleApplyClick = (e) => {
  e.preventDefault();
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

const handleCancelClick = () => {
  message.info('Perubahan dibatalkan.');
  router.back();
};
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 1rem;
}

.edit-profile-card {
  border-radius: 16px;
}
</style>