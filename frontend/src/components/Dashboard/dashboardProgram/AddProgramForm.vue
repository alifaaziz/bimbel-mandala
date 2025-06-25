<template>
  <n-card content-style="padding: 24px;">
    <template #header>
      <h2 class="form-title">Tambah Program</h2>
    </template>

    <n-form ref="formRef" :model="formModel">
      <h3 class="section-title">Detail Program</h3>
      <n-grid :x-gap="24" :y-gap="12" :cols="2" responsive="screen" item-responsive>
        
        <n-form-item-gi :span="2" label="Nama Program" path="programName">
          <n-input v-model="formModel.programName" placeholder="Tuliskan nama program" />
        </n-form-item-gi>

        <n-form-item-gi :span="2" label="Area/lokasi" path="location">
          <n-input v-model="formModel.location" placeholder="Semarang" />
        </n-form-item-gi>

        <n-form-item-gi label="Tutor" path="tutorId">
          <n-select v-model="formModel.tutorId" :options="tutorOptions" placeholder="Pilih Tutor" />
        </n-form-item-gi>

        <n-form-item-gi label="Jenjang" path="level">
          <n-select v-model="formModel.level" :options="levelOptions" />
        </n-form-item-gi>

        <n-form-item-gi label="Tipe" path="type">
          <n-select v-model="formModel.type" :options="typeOptions" />
        </n-form-item-gi>

        <n-form-item-gi label="JAM" path="startTime">
          <n-time-picker v-model="formModel.startTime" style="width: 100%;" />
        </n-form-item-gi>

        <n-form-item-gi label="Durasi per sesi" path="duration">
            <n-input-number v-model="formModel.duration" :show-button="false" style="width: 100%;">
                <template #suffix>Menit</template>
            </n-input-number>
        </n-form-item-gi>

        <n-form-item-gi label="Jangka Waktu (Pertemuan)" path="sessionCount">
          <n-input-number v-model="formModel.sessionCount" style="width: 100%;" />
        </n-form-item-gi>

        <n-form-item-gi :span="2" label="Pilih Hari" path="days">
          <n-checkbox-group v-model="formModel.days" class="day-selector">
            <n-space>
              <n-checkbox value="Senin" label="Senin" />
              <n-checkbox value="Selasa" label="Selasa" />
              <n-checkbox value="Rabu" label="Rabu" />
              <n-checkbox value="Kamis" label="Kamis" />
              <n-checkbox value="Jumat" label="Jum'at" />
              <n-checkbox value="Sabtu" label="Sabtu" />
            </n-space>
          </n-checkbox-group>
        </n-form-item-gi>
      </n-grid>

      <n-divider />
      <h3 class="section-title">Biaya</h3>
      <n-grid :x-gap="24" :y-gap="12" :cols="2" responsive="screen" item-responsive>
        
        <n-form-item-gi label="Privat" path="costs.private">
          <n-input-number v-model="formModel.costs.private" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
            <template #prefix>Rp</template>
          </n-input-number>
        </n-form-item-gi>

        <n-form-item-gi label="Kelompok 2 siswa" path="costs.group2">
          <n-input-number v-model="formModel.costs.group2" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
            <template #prefix>Rp</template>
          </n-input-number>
        </n-form-item-gi>

        <n-form-item-gi label="Kelompok 3 siswa" path="costs.group3">
          <n-input-number v-model="formModel.costs.group3" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
            <template #prefix>Rp</template>
          </n-input-number>
        </n-form-item-gi>

        <n-form-item-gi label="Kelompok 4 siswa" path="costs.group4">
          <n-input-number v-model="formModel.costs.group4" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
            <template #prefix>Rp</template>
          </n-input-number>
        </n-form-item-gi>

        <n-form-item-gi label="Kelompok 5 siswa" path="costs.group5">
          <n-input-number v-model="formModel.costs.group5" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
            <template #prefix>Rp</template>
          </n-input-number>
        </n-form-item-gi>

        <n-form-item-gi label="Diskon" path="discount">
          <n-input-number v-model="formModel.discount" :show-button="false" style="width: 100%;">
            <template #suffix>%</template>
          </n-input-number>
        </n-form-item-gi>
      </n-grid>

      <n-divider />
      <h3 class="section-title">Catatan:</h3>
      <n-alert :show-icon="false" type="info" class="notes-alert">
        <n-ul>
            <n-li>Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.</n-li>
            <n-li>Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.</n-li>
            <n-li>Honor Tutor merupakan 70% dari biaya total program.</n-li>
        </n-ul>
      </n-alert>
      
      <n-space justify="end" style="margin-top: 24px;">
        <n-button @click="handleCancel">Batal</n-button>
        <n-button type="primary" @click="handleSave">Buat Program</n-button>
      </n-space>

    </n-form>
  </n-card>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
// Impor semua komponen yang digunakan
import { 
  NCard, NForm, NFormItemGi, NGrid, NInput, NSelect, NTimePicker, NInputNumber,
  NCheckboxGroup, NCheckbox, NSpace, NDivider, NAlert, NUl, NLi, NButton
} from 'naive-ui';

const message = useMessage();
const formRef = ref(null);

// Model data untuk semua input form
const formModel = ref({
  programName: '',
  location: 'Semarang',
  tutorId: 'dendy_wan',
  level: 'SMA',
  type: 'private_group',
  startTime: new Date().setHours(15, 0, 0, 0),
  duration: 120,
  sessionCount: 8,
  days: ['Selasa', 'Kamis'], // Contoh nilai terpilih
  costs: {
    private: 580000,
    group2: 980000,
    group3: 1380000,
    group4: 1900000,
    group5: 2340000,
  },
  discount: 10
});

// Opsi untuk komponen Select
const tutorOptions = [
  { label: 'Pak Dendy Wan S.Pd', value: 'dendy_wan' },
  { label: 'Bu Luna S.Pd', value: 'luna' },
  { label: 'Bu Wendy S.Pd', value: 'wendy' },
];
const levelOptions = [
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SMA', value: 'SMA' },
];
const typeOptions = [
  { label: 'Privat/Kelompok', value: 'private_group' },
  { label: 'Kelas', value: 'class' },
];

// Fungsi untuk format mata uang
const formatCurrency = (value) => {
  if (value === null) return '';
  return `${value.toLocaleString('id-ID')}`;
};
const parseCurrency = (input) => {
  const nums = input.replace(/[^0-9]/g, '');
  return nums ? Number(nums) : null;
};

// Fungsi untuk tombol
const handleSave = (e) => {
  e.preventDefault();
  message.success('Data program berhasil disimpan (lihat console)');
  console.log('Form Data:', formModel.value);
};

const handleCancel = () => {
    message.warning('Aksi dibatalkan');
}
</script>

<style scoped>
.form-title {
    margin: 0;
    font-weight: 700;
    color: #1e3a8a;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}
.n-divider {
  margin-top: 24px;
  margin-bottom: 24px;
}
.notes-alert {
    background-color: #fefce8 !important; /* light yellow */
    color: #854d0e; /* dark yellow text */
    border: 1px solid #fde68a;
}
/* Styling Checkbox menjadi Tombol */
.day-selector :deep(.n-checkbox) {
  display: none;
}
.day-selector :deep(.n-checkbox-box-wrapper) {
  padding: 6px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;
}
.day-selector :deep(.n-checkbox--checked .n-checkbox-box-wrapper) {
  background-color: #1e3a8a;
  color: #fff;
  border-color: #1e3a8a;
}
.day-selector :deep(.n-checkbox:not(.n-checkbox--checked):hover .n-checkbox-box-wrapper) {
    border-color: #1e3a8a;
    color: #1e3a8a;
}
</style>