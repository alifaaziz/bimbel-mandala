<template>
  <div class="program-container">
    <n-card content-style="padding: 24px;">
      <div class="header-section">
        <n-h2 style="margin: 0;">Program</n-h2>
        <n-space>
          <n-input
            v-model="searchTerm"
            placeholder="Cari tutor..."
            style="width: 240px;"
            clearable
          >
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
          <n-button type="primary" @click="handleTambahProgram">
            <template #icon>
              <n-icon :component="Add" />
            </template>
            Tambah Program
          </n-button>
        </n-space>
      </div>

      <n-divider />

      <n-data-table
        :columns="columns"
        :data="filteredData"
        :pagination="false"
        :bordered="false"
        :single-line="false"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, h, computed } from 'vue';
import {
  NCard,
  NDataTable,
  NButton,
  NSpace,
  NH2,
  NInput,
  NIcon,
  NDivider,
  useMessage // Opsional, untuk menampilkan notifikasi
} from 'naive-ui';
import { SearchOutline, Add, EllipsisHorizontal } from '@vicons/ionicons5';

// Opsional: untuk menampilkan pesan saat tombol di klik
const message = useMessage();

// State untuk kolom pencarian
const searchTerm = ref('');

// Fungsi placeholder saat tombol tambah di klik
const handleTambahProgram = () => {
  message.success('Fungsi "Tambah Program" dipanggil!');
  console.log('Tambah program baru...');
};

// Fungsi placeholder saat tombol detail di klik
const handleDetail = (rowData) => {
  message.info(`Lihat detail untuk: ${rowData.subject}`);
  console.log('Melihat detail untuk baris:', rowData);
};

// Definisi kolom untuk n-data-table
const createColumns = ({ viewDetail }) => {
  return [
    {
      title: 'Bimbel',
      key: 'bimbel',
      // Menggunakan fungsi render untuk membuat tampilan kustom
      render(row) {
        return h(
          'div',
          {},
          [
            h('div', { style: { fontWeight: '500', fontSize: '14px' } }, row.subject),
            h('div', { style: { fontSize: '12px', color: 'gray' } }, row.teacher)
          ]
        );
      }
    },
    {
      title: 'Hari',
      key: 'day',
      align: 'left'
    },
    {
      title: 'Jam',
      key: 'time',
      align: 'left'
    },
    {
      title: 'Durasi',
      key: 'duration',
      align: 'left'
    },
    {
      title: 'Detail',
      key: 'actions',
      align: 'center',
      // Menggunakan fungsi render untuk membuat tombol aksi
      render(row) {
        return h(
          NButton,
          {
            tertiary: true,
            circle: true,
            onClick: () => viewDetail(row)
          },
          { default: () => h(NIcon, null, { default: () => h(EllipsisHorizontal) }) }
        );
      }
    }
  ];
};

// Data statis sesuai gambar
const data = ref([
  {
    key: 0,
    subject: 'Matematika SMA',
    teacher: 'Pak Dendy Wan S.Pd',
    day: 'Senin, Rabu, Sabtu',
    time: '15:00',
    duration: '120 Menit'
  },
  {
    key: 1,
    subject: 'Matematika SD',
    teacher: 'Bu Luna S.Pd',
    day: 'Senin, Rabu, Sabtu',
    time: '15:00',
    duration: '120 Menit'
  },
  {
    key: 2,
    subject: 'Fisika SMA',
    teacher: 'Bu Wendy S.Pd',
    day: 'Selasa, Kamis',
    time: '15:00',
    duration: '120 Menit'
  },
  {
    key: 3,
    subject: 'Seni SMA',
    teacher: 'Pak Wahyu Hendi S.Pd',
    day: 'Senin, Rabu, Sabtu',
    time: '15:00',
    duration: '120 Menit'
  },
    {
    key: 4,
    subject: 'Fokus UTBK',
    teacher: 'Pak Indra Jaya S.Pd',
    day: 'Senin',
    time: '15:00',
    duration: '90 Menit'
  },
  {
    key: 5,
    subject: 'English SMP',
    teacher: 'Bu Susi Wati S.Pd',
    day: 'Selasa, Kamis',
    time: '15:00',
    duration: '120 Menit'
  },
    {
    key: 6,
    subject: 'Fisika SMA',
    teacher: 'Pak Dendy Wan S.Pd',
    day: 'Selasa, Kamis',
    time: '15:00',
    duration: '120 Menit'
  }
]);

// Kolom yang dibuat secara reaktif
const columns = createColumns({
  viewDetail: handleDetail
});

// Logika untuk filter data berdasarkan input pencarian
const filteredData = computed(() => {
  if (!searchTerm.value) {
    return data.value;
  }
  return data.value.filter(item =>
    item.teacher.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

</script>

<style scoped>
.program-container {
  padding: 20px;
  background-color: #f7f8fa; /* Memberi background abu-abu seperti di gambar */
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Kustomisasi agar tabel terlihat lebih mirip dengan desain */
:deep(.n-data-table-th) {
  background-color: transparent;
  font-weight: bold;
  color: #8a8a8e;
}

:deep(.n-data-table-td) {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

:deep(h2.n-h) {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 700;
}
</style>