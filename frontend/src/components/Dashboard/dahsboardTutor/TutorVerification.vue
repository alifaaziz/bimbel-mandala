<template>
  <n-card title="Verifikasi Pendaftar Tutor" :bordered="false" style="max-width: 800px; margin: auto;">
    <n-form>
      <n-h2>Informasi Pribadi</n-h2>
      <n-grid :x-gap="24" :y-gap="20" :cols="1" responsive="screen" s-responsive="2">
        <n-gi :span="2">
          <n-form-item label="Nama Lengkap">
            <n-input :value="tutorData.fullName" disabled />
          </n-form-item>
        </n-gi>
        
        <n-gi>
          <n-form-item label="Tanggal Lahir">
            <n-date-picker :value="tutorData.dateOfBirth" type="date" format="dd MMMM yyyy" style="width: 100%;" disabled />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item label="Jenis Kelamin">
            <n-input :value="tutorData.gender" disabled />
          </n-form-item>
        </n-gi>
        
        <n-gi>
          <n-form-item label="E-mail">
            <n-input :value="tutorData.email" disabled />
          </n-form-item>
        </n-gi>
        
        <n-gi>
          <n-form-item label="No. WhatsApp">
            <n-input :value="tutorData.whatsapp" disabled />
          </n-form-item>
        </n-gi>
        
        <n-gi :span="2">
          <n-form-item label="Foto Diri">
             <n-input :value="tutorData.profilePicture" disabled>
                <template #prefix>
                    <n-icon :component="FileImageOutline" />
                </template>
             </n-input>
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-divider />

      <n-h2>Pendidikan</n-h2>
      <n-grid :x-gap="24" :y-gap="20" :cols="1" responsive="screen" s-responsive="2">
        <n-gi :span="2">
          <n-form-item label="Asal Universitas">
            <n-input :value="tutorData.university" disabled />
          </n-form-item>
        </n-gi>
        
        <n-gi>
          <n-form-item label="Prodi">
            <n-input :value="tutorData.major" disabled />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item label="Status">
            <n-input :value="tutorData.educationStatus" disabled />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-divider />

      <n-h2>Mengajar</n-h2>
      <n-grid :x-gap="24" :y-gap="20" :cols="1" responsive="screen" s-responsive="2">
        <n-gi>
          <n-form-item label="Jenjang">
             <n-input :value="tutorData.teachingLevels.join(', ')" disabled />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item label="Mata Pelajaran">
            <n-input :value="tutorData.subjects.join(', ')" disabled />
          </n-form-item>
        </n-gi>
      </n-grid>
      
      <n-form-item label="Hari Aktif" :label-style="{ 'margin-top': '10px' }">
        <n-space>
          <n-tag v-for="day in tutorData.activeDays" :key="day" type="info" :bordered="false">
            {{ day }}
          </n-tag>
        </n-space>
      </n-form-item>

      <n-space justify="space-between" align="center" style="margin-top: 30px;">
        <n-space>
            <n-button type="primary" @click="handleVerify">Verifikasi Tutor</n-button>
            <n-button type="error" ghost @click="handleReject">Tolak</n-button>
        </n-space>
        <n-button @click="handleBack">Kembali</n-button>
      </n-space>

    </n-form>
  </n-card>
</template>

<script setup>
import { 
  NCard, NForm, NFormItem, NInput, NDatePicker, NDivider, NH2, NGrid, 
  NGi, NButton, NSpace, NTag, NIcon, useMessage
} from 'naive-ui';
import { FileImageOutline } from '@vicons/ionicons5';

// Mendefinisikan props yang diterima komponen ini
const props = defineProps({
  tutorData: {
    type: Object,
    required: true
  }
});

// Mendefinisikan event yang akan di-emit oleh komponen
const emit = defineEmits(['verify', 'reject', 'back']);

const message = useMessage();

// Fungsi untuk menangani aksi
const handleVerify = () => {
  message.success(`Tutor "${props.tutorData.fullName}" telah diverifikasi.`);
  emit('verify', props.tutorData.id); // Mengirim ID tutor ke parent
};

const handleReject = () => {
  message.error(`Verifikasi untuk "${props.tutorData.fullName}" telah ditolak.`);
  emit('reject', props.tutorData.id); // Mengirim ID tutor ke parent
};

const handleBack = () => {
  emit('back'); // Memberi tahu parent untuk kembali
};
</script>

<style scoped>
.n-h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #efefef;
}
</style>