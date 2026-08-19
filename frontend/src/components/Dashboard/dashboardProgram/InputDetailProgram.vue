<template>
  <div class="program-form-container">
    <n-h2>Detail Program</n-h2>
    <n-space vertical size="large">
      <n-form-item label="Nama Program">
        <n-input
          type="text"
          v-model="formModel.namaProgram"
          placeholder="Tuliskan nama program"
          size="large"
        />
      </n-form-item>

      <n-form-item label="Area/lokasi">
        <n-input
          type="text"
          v-model="formModel.lokasi"
          placeholder="Masukkan area atau lokasi"
          size="large"
        />
      </n-form-item>

      <n-grid :x-gap="24" :y-gap="12" :cols="3" responsive="screen" item-responsive>
        <n-gi>
          <n-form-item label="Tutor">
            <n-select
              v-model="formModel.tutor"
              :options="tutorOptions"
              size="large"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="Jenjang">
            <n-select
              v-model="formModel.jenjang"
              :options="jenjangOptions"
              size="large"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="Tipe">
            <n-select
              v-model="formModel.tipe"
              :options="tipeOptions"
              size="large"
            />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-grid :x-gap="24" :y-gap="12" :cols="2" item-responsive>
        <n-gi>
          <n-form-item label="JAM">
            <n-time-picker 
              v-model="formModel.jam" 
              format="HH:mm" 
              style="width: 100%;" 
              size="large"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="Durasi per Sesi">
            <n-input-number
                v-model="formModel.durasi"
                :min="0"
                placeholder="Durasi"
                size="large"
                style="width: 100%;"
            >
                <template #suffix>
                    Menit
                </template>
            </n-input-number>
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-grid :x-gap="24" :y-gap="12" :cols="1" item-responsive>
          <n-gi>
             <n-form-item label="Jangka Waktu (Pertemuan)">
               <n-input-number
                 v-model="formModel.jangkaWaktu"
                 :min="1"
                 size="large"
                 style="width: 100%;"
               />
             </n-form-item>
          </n-gi>
           <n-gi>
                <n-checkbox-group v-model="formModel.hari">
                    <n-space item-style="display: flex;">
                        <n-checkbox value="Senin" label="Senin" />
                        <n-checkbox value="Selasa" label="Selasa" />
                        <n-checkbox value="Rabu" label="Rabu" />
                        <n-checkbox value="Kamis" label="Kamis" />
                        <n-checkbox value="Jum'at" label="Jum'at" />
                        <n-checkbox value="Sabtu" label="Sabtu" />
                    </n-space>
                </n-checkbox-group>
           </n-gi>
       </n-grid>
    </n-space>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { 
  NSpace, 
  NH2, 
  NFormItem, 
  NInput, 
  NSelect, 
  NGrid, 
  NGi, 
  NTimePicker,
  NInputNumber,
  NCheckboxGroup,
  NCheckbox
} from 'naive-ui';

// --- State Management ---
// Menggunakan reactive untuk menampung semua data dari form
const formModel = reactive({
  namaProgram: '',
  lokasi: 'Semarang',
  tutor: 'dendy', // value harus cocok dengan value di options
  jenjang: 'SMA',
  tipe: 'Privat/Kelompok',
  jam: new Date().setHours(15, 0, 0, 0), // Mengatur waktu default ke 15:00
  durasi: 120,
  jangkaWaktu: 8,
  hari: ['Selasa', 'Kamis'] // Hari yang terpilih sesuai gambar
});

// --- Options untuk Dropdown (Select) ---
const tutorOptions = [
  { label: 'Pak Dendy Wan S.Pd', value: 'dendy' },
  { label: 'Ibu Susi Susanti M.Kom', value: 'susi' },
  { label: 'Bapak Budi Santoso S.T', value: 'budi' },
];

const jenjangOptions = [
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SMA', value: 'SMA' },
];

const tipeOptions = [
  { label: 'Kelas', value: 'Kelas' },
  { label: 'Privat/Kelompok', value: 'Privat/Kelompok' },
];
</script>

<style scoped>
.program-form-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 24px;
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  background-color: #ffffff;
}
</style>