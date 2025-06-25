<template>
  <n-card content-style="padding: 24px;">
    <template #header>
      <h2 class="form-title">Edit Program</h2>
    </template>

    <n-form ref="formRef" :model="formModel">
      <h3 class="section-title">Detail Program</h3>
      <n-grid :x-gap="24" :y-gap="12" :cols="2" responsive="screen" item-responsive>
        
        <n-form-item-gi :span="2" label="Nama Program" path="programName">
          <n-input v-model="formModel.programName" placeholder="Tuliskan nama program" />
        </n-form-item-gi>

        <n-form-item-gi label="Tutor" path="tutorId">
          <n-select v-model="formModel.tutorId" :options="tutorOptions" />
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
        
        <n-form-item-gi label="Jangka Waktu" path="durationTerm">
          <n-select v-model="formModel.durationTerm" :options="durationTermOptions" />
        </n-form-item-gi>

        <n-form-item-gi label="Paket" path="packageType">
          <n-select v-model="formModel.packageType" :options="packageOptions" />
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
      <n-alert :show-icon="false" type="info" class="notes-alert">
        <h4 class="notes-title">Catatan:</h4>
        <n-ul>
            <n-li>Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.</n-li>
            <n-li>Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.</n-li>
            <n-li>Honor Tutor merupakan 70% dari biaya total program.</n-li>
        </n-ul>
      </n-alert>
      
      <n-space justify="end" style="margin-top: 24px;">
        <n-button ghost @click="handleCancelEdit">Batal Edit</n-button>
        <n-button type="primary" @click="handleApplyChanges">Terapkan</n-button>
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

// Model data yang sudah terisi untuk simulasi form edit
const formModel = ref({
  programName: 'Matematika SMA Unggulan',
  tutorId: 'dendy_wan',
  level: 'SMA',
  type: 'private_group',
  startTime: new Date().setHours(15, 0, 0, 0),
  duration: 120,
  durationTerm: '6m',
  packageType: '3x_week',
  days: ['Senin', 'Rabu', 'Jumat'],
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
];
const levelOptions = [ { label: 'SMA', value: 'SMA' }, { label: 'SMP', value: 'SMP' }];
const typeOptions = [ { label: 'Privat/Kelompok', value: 'private_group' }, { label: 'Kelas', value: 'class' }];
const durationTermOptions = [
    { label: '3 Bulan', value: '3m' },
    { label: '6 Bulan', value: '6m' },
    { label: '12 Bulan', value: '12m' },
];
const packageOptions = [
    { label: '2 Kali Seminggu', value: '2x_week' },
    { label: '3 Kali Seminggu', value: '3x_week' },
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
const handleApplyChanges = (e) => {
  e.preventDefault();
  message.success('Perubahan berhasil diterapkan (lihat console)');
  console.log('Updated Form Data:', formModel.value);
};

const handleCancelEdit = () => {
    message.warning('Perubahan dibatalkan');
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
}
.notes-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: #854d0e;
}
.notes-alert .n-ul {
    color: #854d0e;
    font-size: 0.9rem;
}
.notes-alert .n-ul li::marker {
  color: #f97316;
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