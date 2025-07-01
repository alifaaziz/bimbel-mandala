<template>
  <div class="biaya-form-container">
    <n-h2>Biaya</n-h2>
    
    <n-grid :cols="2" :x-gap="24" :y-gap="16" responsive="screen" item-responsive>
      <n-gi>
        <n-form-item label="Privat">
          <n-input-number
            v-model="biaya.privat"
            :format="formatRupiah"
            :parse="parseRupiah"
            :step="10000"
            :min="0"
            placeholder="Masukkan biaya privat"
            style="width: 100%"
            size="large"
          />
        </n-form-item>
      </n-gi>
      
      <n-gi>
        <n-form-item label="Kelompok 2 siswa">
          <n-input-number
            :value="biayaKelompok2"
            :format="formatRupiah"
            :parse="parseRupiah"
            style="width: 100%"
            size="large"
            disabled
          />
        </n-form-item>
      </n-gi>
      
      <n-gi>
        <n-form-item label="Kelompok 3 siswa">
          <n-input-number
            :value="biayaKelompok3"
            :format="formatRupiah"
            :parse="parseRupiah"
            style="width: 100%"
            size="large"
            disabled
          />
        </n-form-item>
      </n-gi>
      
      <n-gi>
        <n-form-item label="Kelompok 4 siswa">
          <n-input-number
            :value="biayaKelompok4"
            :format="formatRupiah"
            :parse="parseRupiah"
            style="width: 100%"
            size="large"
            disabled
          />
        </n-form-item>
      </n-gi>
      
      <n-gi>
        <n-form-item label="Kelompok 5 siswa">
          <n-input-number
            :value="biayaKelompok5"
            :format="formatRupiah"
            :parse="parseRupiah"
            style="width: 100%"
            size="large"
            disabled
          />
        </n-form-item>
      </n-gi>
      
      <n-gi>
        <n-form-item label="Diskon">
          <n-input-number
            v-model="biaya.diskon"
            :min="0"
            :max="100"
            placeholder="0"
            style="width: 100%"
            size="large"
          >
            <template #suffix>%</template>
          </n-input-number>
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-alert title="Catatan" type="info" style="margin-top: 24px;">
      <n-list :show-divider="false" style="padding: 0; background-color: transparent;">
        <n-list-item>
          <template #prefix><n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg></n-icon></template>
          <n-text>
            <strong>Privat/Kelompok:</strong> Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya per siswa dari paket privat. Field kelompok dinonaktifkan karena dihitung secara otomatis.
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
import { reactive, computed } from 'vue';
import { 
  NGrid, 
  NGi, 
  NFormItem, 
  NInputNumber, 
  NH2, 
  NAlert,
  NList,
  NListItem,
  NText,
  NIcon
} from 'naive-ui';

// --- State Management ---
// Data utama yang bisa diubah oleh pengguna
const biaya = reactive({
  privat: 580000,
  diskon: 10,
});

// --- Logic Perhitungan Otomatis ---
// Menghitung biaya per siswa untuk paket kelompok (80% dari biaya privat)
const biayaPerSiswaKelompok = computed(() => {
  if (!biaya.privat || biaya.privat <= 0) return 0;
  return biaya.privat * 0.8;
});

// Computed properties untuk setiap paket kelompok
// Nilainya akan otomatis diperbarui jika biaya.privat berubah
const biayaKelompok2 = computed(() => Math.round(biayaPerSiswaKelompok.value * 2));
const biayaKelompok3 = computed(() => Math.round(biayaPerSiswaKelompok.value * 3));
const biayaKelompok4 = computed(() => Math.round(biayaPerSiswaKelompok.value * 4));
const biayaKelompok5 = computed(() => Math.round(biayaPerSiswaKelompok.value * 5));


// --- Helper Functions untuk Formatting ---
// Fungsi untuk memformat angka menjadi format mata uang Rupiah
const formatRupiah = (value) => {
  if (value === null || isNaN(value)) return '';
  return `Rp. ${value.toLocaleString('id-ID')}`;
};

// Fungsi untuk mengubah kembali input string dari format Rupiah menjadi angka
const parseRupiah = (input) => {
  const nums = input.replace(/[^0-9]/g, '');
  if (nums === '') return null;
  return Number(nums);
};
</script>

<style scoped>
.biaya-form-container {
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