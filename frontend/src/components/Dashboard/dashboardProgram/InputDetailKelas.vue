<template>
  <div class="detail-kelas-container">
    <n-h2>Detail Kelas</n-h2>
    
    <n-grid :cols="2" :x-gap="24" responsive="screen" item-responsive>
      <n-gi>
        <n-form-item label="Maksimal Siswa">
          <n-input-number
            v-model="classDetails.maksimalSiswa"
            :min="1"
            style="width: 100%"
            size="large"
          />
        </n-form-item>
      </n-gi>

      <n-gi>
        <n-form-item label="Tanggal Mulai">
          <n-date-picker
            v-model="classDetails.tanggalMulai"
            type="date"
            format="d MMMM yyyy"
            style="width: 100%"
            size="large"
          />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-form-item label="Per-anak" style="margin-top: 16px;">
      <n-input-number
        v-model="classDetails.biayaPerAnak"
        :format="formatRupiah"
        :parse="parseRupiah"
        :step="50000"
        :min="0"
        placeholder="Masukkan biaya per anak"
        style="width: 100%"
        size="large"
      />
    </n-form-item>

    <n-alert title="Catatan" type="info" style="margin-top: 24px;">
      <n-list :show-divider="false" style="padding: 0; background-color: transparent;">
        <n-list-item>
          <template #prefix><n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg></n-icon></template>
          <n-text>
            <strong>Privat/Kelompok:</strong> Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.
          </n-text>
        </n-list-item>
        <n-list-item>
          <template #prefix><n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg></n-icon></template>
          <n-text>
            <strong>Paket Kelas:</strong> Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.
          </n-text>
        </n-list-item>
        <n-list-item>
          <template #prefix><n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg></n-icon></template>
          <n-text>
            <strong>Honor Tutor</strong> merupakan 70% dari biaya total program.
          </n-text>
        </n-list-item>
      </n-list>
    </n-alert>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import {
  NGrid,
  NGi,
  NFormItem,
  NInputNumber,
  NDatePicker,
  NH2,
  NAlert,
  NList,
  NListItem,
  NText,
  NIcon
} from 'naive-ui';

// --- State Management ---
// Menggunakan reactive untuk data form.
const classDetails = reactive({
  maksimalSiswa: 20,
  // Timestamp untuk 7 Juli 2025. n-date-picker bekerja dengan timestamp.
  tanggalMulai: new Date('2025-07-07').getTime(), 
  biayaPerAnak: 1500000,
});

// --- Helper Functions untuk Formatting ---
// Fungsi untuk memformat angka menjadi format mata uang Rupiah.
const formatRupiah = (value) => {
  if (value === null || isNaN(value)) return '';
  return `Rp. ${value.toLocaleString('id-ID')}`;
};

// Fungsi untuk mengubah kembali input string dari format Rupiah menjadi angka.
const parseRupiah = (input) => {
  const nums = input.replace(/[^0-9]/g, '');
  if (nums === '') return null;
  return Number(nums);
};
</script>

<style scoped>
.detail-kelas-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 24px;
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  background-color: #ffffff;
}
/* Style untuk list di dalam alert agar lebih rapi */
.n-list-item {
  --n-merged-padding: 8px 0 !important;
}
</style>