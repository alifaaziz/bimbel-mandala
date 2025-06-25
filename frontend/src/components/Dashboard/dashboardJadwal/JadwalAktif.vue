<template>
  <n-card content-style="padding: 24px;">
    <n-h1>
      <n-text type="default">
        Jadwal Program Aktif
      </n-text>
    </n-h1>

    <n-space justify="space-between" align="center" style="margin-bottom: 20px;">
      <n-input
        v-model="searchTerm"
        placeholder="Cari Jadwal..."
        clearable
        style="max-width: 400px;"
      >
        <template #prefix>
          <n-icon :component="Search" />
        </template>
      </n-input>
      <n-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="Cari tanggal"
        clearable
        style="width: 200px;"
      />
    </n-space>

    <n-space justify="space-between" align="center" style="padding: 0 16px; margin-bottom: 8px;">
      <n-text :depth="3" class="column-header" style="width: 25%;">Bimbel</n-text>
      <n-text :depth="3" class="column-header" style="width: 15%;">Kode</n-text>
      <n-text :depth="3" class="column-header" style="width: 25%;">Tanggal</n-text>
      <n-text :depth="3" class="column-header" style="width: 15%;">Jam</n-text>
      <n-text :depth="3" class="column-header" style="width: 10%; text-align: center;">Detail</n-text>
    </n-space>
    <n-divider style="margin-top: 0; margin-bottom: 16px;" />

    <n-space vertical>
      <template v-if="filteredSchedule.length > 0">
        <n-card
          v-for="item in filteredSchedule"
          :key="item.kode"
          size="small"
          hoverable
        >
          <n-space justify="space-between" align="center">
            <div style="width: 25%;">
              <n-text strong>{{ item.bimbel }}</n-text><br>
              <n-text :depth="3">{{ item.pengajar }}</n-text>
            </div>
            <n-text style="width: 15%;">{{ item.kode }}</n-text>
            <n-text style="width: 25%;">{{ item.tanggal }}</n-text>
            <n-text style="width: 15%;">{{ item.jam }}</n-text>
            <div style="width: 10%; text-align: center;">
              <n-button tertiary circle @click="handleDetailClick(item)">
                <template #icon>
                  <n-icon :component="EllipsisHorizontal" />
                </template>
              </n-button>
            </div>
          </n-space>
        </n-card>
      </template>
      <template v-else>
        <n-empty description="Tidak ada jadwal yang sesuai dengan pencarian Anda." style="padding: 40px 0;"></n-empty>
      </template>
    </n-space>

  </n-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  NCard,
  NH1,
  NText,
  NInput,
  NDatePicker,
  NSpace,
  NIcon,
  NDivider,
  NButton,
  NEmpty,
} from 'naive-ui';
import { Search, EllipsisHorizontal } from '@vicons/ionicons5';

// --- Data Reaktif ---
const searchTerm = ref('');
const selectedDate = ref(null); // Nilai akan berupa timestamp

// --- Data Jadwal Statis ---
// Dalam aplikasi nyata, data ini akan diambil dari API
const scheduleData = ref([
  {
    bimbel: 'Matematika SMA',
    pengajar: 'Pak Dendy Wan S.Pd',
    kode: '#11234',
    tanggal: 'Sabtu, 15 Maret 2025',
    dateValue: new Date('2025-03-15').setHours(0, 0, 0, 0),
    jam: '15:00',
  },
  {
    bimbel: 'Matematika SD',
    pengajar: 'Bu Luna S.Pd',
    kode: '#11355',
    tanggal: 'Sabtu, 15 Maret 2025',
    dateValue: new Date('2025-03-15').setHours(0, 0, 0, 0),
    jam: '15:00',
  },
  {
    bimbel: 'Fisika SMA',
    pengajar: 'Bu Wendy S.Pd',
    kode: '#11237',
    tanggal: 'Sabtu, 15 Maret 2025',
    dateValue: new Date('2025-03-15').setHours(0, 0, 0, 0),
    jam: '15:00',
  },
  {
    bimbel: 'Seni SMA',
    pengajar: 'Pak Wahyu Hendi S.Pd',
    kode: '#11244',
    tanggal: 'Sabtu, 15 Maret 2025',
    dateValue: new Date('2025-03-15').setHours(0, 0, 0, 0),
    jam: '15:00',
  },
  {
    bimbel: 'Fokus UTBK',
    pengajar: 'Pak Indra Jaya S.Pd',
    kode: '#101',
    tanggal: 'Sabtu, 15 Maret 2025',
    dateValue: new Date('2025-03-15').setHours(0, 0, 0, 0),
    jam: '15:00',
  },
  {
    bimbel: 'English SMP',
    pengajar: 'Bu Susi Wati S.Pd',
    kode: '#11199',
    tanggal: 'Sabtu, 15 Maret 2025',
    dateValue: new Date('2025-03-15').setHours(0, 0, 0, 0),
    jam: '15:00',
  },
  {
    bimbel: 'Matematika SMA',
    pengajar: 'Pak Dendy Wan S.Pd',
    kode: '#11234',
    tanggal: 'Senin, 17 Maret 2025',
    dateValue: new Date('2025-03-17').setHours(0, 0, 0, 0),
    jam: '15:00',
  },
  {
    bimbel: 'Matematika SD',
    pengajar: 'Bu Luna S.Pd',
    kode: '#11355',
    tanggal: 'Senin, 17 Maret 2025',
    dateValue: new Date('2025-03-17').setHours(0, 0, 0, 0),
    jam: '15:00',
  },
]);

// --- Logika Filter ---
const filteredSchedule = computed(() => {
  let data = scheduleData.value;

  // Filter berdasarkan Teks Pencarian
  if (searchTerm.value) {
    const lowerCaseSearch = searchTerm.value.toLowerCase();
    data = data.filter(item =>
      item.bimbel.toLowerCase().includes(lowerCaseSearch) ||
      item.kode.toLowerCase().includes(lowerCaseSearch) ||
      item.pengajar.toLowerCase().includes(lowerCaseSearch)
    );
  }

  // Filter berdasarkan Tanggal
  if (selectedDate.value) {
    data = data.filter(item => item.dateValue === selectedDate.value);
  }

  return data;
});

// --- Methods ---
const handleDetailClick = (item) => {
  // Ganti dengan logika yang Anda inginkan, misal membuka modal
  alert(`Melihat detail untuk: ${item.bimbel} (${item.kode})`);
};
</script>

<style scoped>
.column-header {
  font-weight: bold;
  font-size: 14px;
}

/* Menambahkan sedikit padding pada setiap item jadwal untuk tampilan yang lebih baik */
.n-card {
  border-radius: 8px;
}

.n-card:not(:last-child) {
    margin-bottom: 12px;
}
</style>