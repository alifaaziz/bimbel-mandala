<template>
  <div class="form-container">
    <n-card class="form-card" content-style="padding: 24px;">
        <h1 class="headerb1">Edit Program</h1>
        <n-divider class="divider" />
      

      <n-form ref="formRef" :model="formModel">
        <h2 class="section-title">Detail Program</h2>
        
        <n-grid :cols="1" :y-gap="12">
          <n-form-item-gi label="Nama Program" path="programName">
            <n-input v-model:value="formModel.programName" placeholder="Tuliskan nama program" />
          </n-form-item-gi>
        </n-grid>

        <n-grid :cols="3" :x-gap="24" :y-gap="12" responsive="screen" item-responsive>
          <n-form-item-gi label="Tutor" path="tutorId">
            <n-select v-model:value="formModel.tutorId" :options="tutorOptions" />
          </n-form-item-gi>

          <n-form-item-gi label="Jenjang" path="level">
            <n-select v-model:value="formModel.level" :options="levelOptions" />
          </n-form-item-gi>

          <n-form-item-gi label="Tipe" path="type">
            <n-select v-model:value="formModel.type" :options="typeOptions" />
          </n-form-item-gi>
        </n-grid>
        
        <n-grid :cols="2" :x-gap="24" :y-gap="12" responsive="screen" item-responsive>
          <n-form-item-gi label="JAM" path="startTime">
            <n-time-picker v-model:value="formModel.startTime" style="width: 100%;" />
          </n-form-item-gi>
          
          <n-form-item-gi label="Durasi per sesi" path="duration">
            <n-input-number v-model:value="formModel.duration" :show-button="false" style="width: 100%;">
              <template #suffix>Menit</template>
            </n-input-number>
          </n-form-item-gi>
        </n-grid>

        <n-grid :cols="2" :x-gap="24" :y-gap="12" responsive="screen" item-responsive>
          <n-form-item-gi label="Jangka Waktu" path="durationTerm">
            <n-select v-model:value="formModel.durationTerm" :options="durationTermOptions" />
          </n-form-item-gi>

          <n-form-item-gi label="Paket" path="packageType">
            <n-select v-model:value="formModel.packageType" :options="packageOptions" />
          </n-form-item-gi>
        </n-grid>

        <n-grid :cols="1" :y-gap="12">
          <n-form-item-gi label="Hari Aktif Mengajar" path="days" class="col-span-6">
            <div class="hari-mengajar">
              <div class="days">
                <button
                  v-for="(day, index) in daysOptions"
                  :key="index"
                  :class="['day-button', { active: formModel.days.includes(day) }]"
                  type="button"
                  @click="toggleDay(day)"
                >
                  {{ day }}
                </button>
              </div>
            </div>
          </n-form-item-gi>
        </n-grid>

        <n-divider class="divider" />
        <h2 class="section-title">Biaya</h2>
        <n-grid :x-gap="24" :y-gap="12" :cols="2" responsive="screen" item-responsive>
          
          <n-form-item-gi label="Privat" path="costs.private">
            <n-input-number v-model:value="formModel.costs.private" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
              <template #prefix>Rp</template>
            </n-input-number>
          </n-form-item-gi>

          <n-form-item-gi label="Kelompok 2 siswa" path="costs.group2">
            <n-input-number v-model:value="formModel.costs.group2" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
              <template #prefix>Rp</template>
            </n-input-number>
          </n-form-item-gi>

          <n-form-item-gi label="Kelompok 3 siswa" path="costs.group3">
            <n-input-number v-model:value="formModel.costs.group3" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
              <template #prefix>Rp</template>
            </n-input-number>
          </n-form-item-gi>

          <n-form-item-gi label="Kelompok 4 siswa" path="costs.group4">
            <n-input-number v-model:value="formModel.costs.group4" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
              <template #prefix>Rp</template>
            </n-input-number>
          </n-form-item-gi>

          <n-form-item-gi label="Kelompok 5 siswa" path="costs.group5">
            <n-input-number v-model:value="formModel.costs.group5" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
              <template #prefix>Rp</template>
            </n-input-number>
          </n-form-item-gi>

          <n-form-item-gi label="Diskon" path="discount">
            <n-input-number v-model:value="formModel.discount" :show-button="false" style="width: 100%;">
              <template #suffix>%</template>
            </n-input-number>
          </n-form-item-gi>
        </n-grid>

        <n-divider class="divider" />
        <div class="catatan">
          <h3 class="bodysb1">Catatan:</h3>
          <ul style="padding-left: 20px; line-height: 1.6;">
            <li>Paket Privat/Kelompok: Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.</li>
            <li>Paket Kelas: Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.</li>
            <li>Honor Tutor merupakan 70% dari biaya total program.</li>
          </ul>
        </div>
        
        <n-divider class="divider" />
        <div class="button">
        <butPrimerNormal
          @click="handleValidateClick"
          label="Terapkan"
        />
        <butSecondNormal
          @click="handleBackClick"
          label="Batal Edit"
        />
      </div>

      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";
import butSecondNormal from "@/components/dirButton/butSecondNormal.vue";
import { 
  NCard, NForm, NFormItemGi, NGrid, NInput, NSelect, NTimePicker, NInputNumber,
  NCheckboxGroup, NCheckbox, NSpace, NDivider, NAlert, NUl, NLi, NButton
} from 'naive-ui';

const message = useMessage();
const formRef = ref(null);

// Model data yang sudah terisi untuk simulasi form edit
const formModel = ref({
  programName: null,
  tutorId: 'dendy_wan',
  level: 'SMA',
  type: 'private_group',
  startTime: new Date().setHours(15, 0, 0, 0),
  duration: 120,
  durationTerm: '6m',
  packageType: '3x_week',
  days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
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

const daysOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];


const toggleDay = (day) => {
  const idx = formModel.value.days.indexOf(day);
  if (idx === -1) {
    formModel.value.days.push(day);
  } else {
    formModel.value.days.splice(idx, 1);
  }
};

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
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success('Perubahan berhasil diterapkan (lihat console)');
      console.log('Updated Form Data:', formModel.value);
    } else {
      message.error('Harap isi semua field yang wajib');
    }
  });
};

const handleCancelEdit = () => {
    message.warning('Perubahan dibatalkan');
}
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 24px;
  overflow-y: auto;
  background-color: #0B2343;
}

.form-card {
  border-radius: 8px;
  background-color: #fff;
  height: fit-content;
  border: 1px solid #dee2e6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.headerb1 {
  color: #154484;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.section-title {
  color: #154484;
  margin-bottom: 1rem;
}
.n-divider {
  margin-top: 24px;
  margin-bottom: 24px;
}

.hari-mengajar {
  display: flex;
  flex-direction: column;
}

.days {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.day-button {
  border: 1.5px solid #154484;
  background: #fff;
  color: #154484;
  border-radius: 999px;
  padding: 6px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}

.day-button.active,
.day-button:hover {
  background: #eaf2fb;
  color: #154484;
  border-color: #154484;
  font-weight: 600;
}

.catatan {
  color: #FB8312;
}

.button{
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.bodysb1 {
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}
</style>