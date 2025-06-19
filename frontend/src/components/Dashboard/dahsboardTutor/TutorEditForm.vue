<script setup lang="ts">
import { ref } from 'vue';
import {
  NForm,
  NFormItem,
  NFormItemGi,
  NGrid,
  NInput,
  NSelect,
  NCheckboxGroup,
  NCheckbox,
  NButton,
  NSpace,
  NH2,
  NCard
} from 'naive-ui';
import type { SelectOption } from 'naive-ui';

// --- Data Reaktif untuk Form ---
// Data ini akan terikat dengan input form (v-model)
// dan diisi dengan data awal dari gambar.
const formData = ref({
  fullName: 'Pak Dendy Wan S.Pd',
  status: 'S1',
  whatsapp: '085786234264',
  address: 'Jl Sekaran No.05 RT05/04, Gunung Pati, Kota Semarang',
  levels: 'SMP, SMA',
  subjects: 'Matematika, Fisika, Kimia',
  activeDays: ['Senin', 'Selasa', 'Rabu', 'Jum\'at'], // Data untuk checkbox group
});

// --- Opsi untuk Komponen Select ---
const statusOptions: SelectOption[] = [
  { label: 'Sarjana S1', value: 'S1' },
  { label: 'Sarjana S2', value: 'S2' },
  { label: 'Mahasiswa', value: 'Mahasiswa' },
  { label: 'Lainnya', value: 'Lainnya' },
];

// --- Daftar Hari untuk Checkbox ---
const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu', 'Minggu'];

// --- Fungsi untuk Tombol Aksi ---
function handleApply() {
  // Logika untuk menyimpan data form
  // Misalnya, mengirim data ke API
  console.log('Data yang akan diterapkan:', formData.value);
  alert('Data berhasil diterapkan! (Cek console log)');
}

function handleCancel() {
  // Logika untuk membatalkan edit
  // Misalnya, kembali ke halaman sebelumnya atau reset form
  console.log('Edit dibatalkan');
  alert('Edit dibatalkan');
}

</script>

<template>
  <div style="padding: 24px; background-color: #f7f8fa;">
    <NCard :bordered="false" style="max-width: 800px; margin: auto; border-radius: 12px;">
      <NH2 style="font-weight: 600;">Edit Profil Tutor</NH2>
      
      <NForm :model="formData" label-placement="top" style="margin-top: 24px;">
        <NGrid :cols="2" :x-gap="24">
          <NFormItemGi :span="1" path="fullName" label="Nama Lengkap">
            <NInput v-model="formData.fullName" placeholder="Masukkan nama lengkap" />
          </NFormItemGi>

          <NFormItemGi :span="1" path="status" label="Status">
            <NSelect v-model="formData.status" :options="statusOptions" />
          </NFormItemGi>
        </NGrid>

        <NFormItem path="whatsapp" label="No. WhatsApp">
          <NInput v-model="formData.whatsapp" placeholder="Masukkan nomor WhatsApp" />
        </NFormItem>

        <NFormItem path="address" label="Alamat">
          <NInput
            v-model="formData.address"
            placeholder="Masukkan alamat lengkap"
            type="textarea"
            :autosize="{ minRows: 2 }"
          />
        </NFormItem>

        <NFormItem path="levels" label="Jenjang">
          <NInput 
            v-model="formData.levels" 
            placeholder="Contoh: SMP, SMA, SMK" 
          />
        </NFormItem>

        <NFormItem path="subjects" label="Mata Pelajaran">
          <NInput 
            v-model="formData.subjects"
            placeholder="Contoh: Matematika, Fisika, Kimia"
          />
        </NFormItem>

        <NFormItem label="Hari aktif">
          <NCheckboxGroup v-model="formData.activeDays">
            <NSpace>
              <NCheckbox
                v-for="day in allDays"
                :key="day"
                :value="day"
                :label="day"
                button
              />
            </NSpace>
          </NCheckboxGroup>
        </NFormItem>

        <NSpace style="margin-top: 24px;">
          <NButton type="primary" size="large" @click="handleApply" strong>
            Terapkan
          </NButton>
          <NButton type="tertiary" size="large" @click="handleCancel" strong>
            Batal Edit
          </NButton>
        </NSpace>
      </NForm>
    </NCard>
  </div>
</template>

<style scoped>
/* Menyesuaikan gaya checkbox button agar lebih mirip dengan gambar */
:deep(.n-checkbox.n-checkbox--button) {
  border-radius: 9999px !important;
  border: 1px solid #dcdfe6;
  background-color: white;
}
:deep(.n-checkbox.n-checkbox--button.n-checkbox--checked) {
  background-color: #182c61; /* Warna biru tua sesuai gambar */
  border-color: #182c61;
}
:deep(.n-checkbox.n-checkbox--button:not(.n-checkbox--checked):hover) {
    border-color: #182c61;
    color: #182c61;
}
:deep(.n-checkbox.n-checkbox--button .n-checkbox__label) {
  padding: 6px 16px;
}
</style>