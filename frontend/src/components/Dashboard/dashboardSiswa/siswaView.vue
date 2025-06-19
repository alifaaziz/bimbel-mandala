<template>
  <div class="siswa-container">
    <n-space vertical :size="24">
      <n-h1 style="margin: 0;">Siswa</n-h1>

      <n-space justify="space-between" align="center">
        <n-input
          v-model="searchText"
          placeholder="Cari siswa..."
          clearable
          style="width: 300px;"
        >
          <template #prefix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>
        <n-button type="primary" ghost @click="handleTambahSiswa">
          <template #icon>
            <n-icon :component="AddOutline" />
          </template>
          Tambah Siswa
        </n-button>
      </n-space>

      <n-data-table
        :columns="columns"
        :data="filteredData"
        :pagination="pagination"
        :bordered="false"
        :single-line="false"
      />
    </n-space>
  </div>
</template>

<script setup>
import { ref, h, computed } from 'vue';
import { NButton, NIcon, NDataTable, NSpace, NH1, NInput, useMessage } from 'naive-ui';
import {
  SearchOutline,
  AddOutline,
  EllipsisHorizontal,
} from '@vicons/ionicons5';

const message = useMessage();
const searchText = ref('');

// --- Definisi Kolom untuk n-data-table ---
const createColumns = ({ viewDetails }) => {
  return [
    {
      title: 'Nama',
      key: 'name',
      sorter: 'default',
    },
    {
      title: 'Jenjang',
      key: 'level',
      filterOptions: [
        { label: 'SMA', value: 'SMA' },
        { label: 'SMP', value: 'SMP' },
        { label: 'SD', value: 'SD' },
      ],
      filter(value, row) {
        return row.level === value;
      },
    },
    {
      title: 'No. WhatsApp',
      key: 'whatsapp',
      sorter: (rowA, rowB) => rowA.whatsapp.localeCompare(rowB.whatsapp),
    },
    {
      title: 'Program',
      key: 'program',
      sorter: (rowA, rowB) => rowA.program - rowB.program,
    },
    {
      title: 'Detail',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            tertiary: true,
            circle: true,
            onClick: () => viewDetails(row),
          },
          {
            icon: () => h(NIcon, { component: EllipsisHorizontal }),
          }
        );
      },
    },
  ];
};

// --- Data Siswa (Mock Data) ---
const data = ref([
  { key: 0, name: 'Arell Saverro Biyanroto', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 2 },
  { key: 1, name: 'Alif Abdul Aziz', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { key: 2, name: 'Raihan Muhammad R. R.', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { key: 3, name: 'Zyan Shainori', level: 'SD', whatsapp: '085xxxxxxxxx', program: 2 },
  { key: 4, name: 'Yulius Calvin', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { key: 5, name: 'Anina Adelia', level: 'SMP', whatsapp: '085xxxxxxxxx', program: 1 },
  { key: 6, name: 'Raihan Muhammad R. R.', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { key: 7, name: 'Zyan Shainori', level: 'SD', whatsapp: '085xxxxxxxxx', program: 2 },
  { key: 8, name: 'Yulius Calvin', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { key: 9, name: 'Anina Adelia', level: 'SMP', whatsapp: '085xxxxxxxxx', program: 1 },
]);

// --- Logika Pencarian ---
const filteredData = computed(() => {
  if (!searchText.value) {
    return data.value;
  }
  return data.value.filter((student) =>
    student.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

// --- Pengaturan Paginasi ---
const pagination = {
  pageSize: 10,
};

// --- Fungsi Handler ---
const handleTambahSiswa = () => {
  message.success('Fungsi "Tambah Siswa" akan diimplementasikan di sini.');
  // Logika untuk membuka modal atau halaman tambah siswa
};

const viewDetails = (row) => {
  message.info(`Melihat detail untuk: ${row.name}`);
  // Logika untuk menampilkan detail siswa, misalnya dengan dropdown atau modal
};

// --- Inisialisasi Kolom ---
const columns = createColumns({
  viewDetails,
});
</script>

<style scoped>
.siswa-container {
  padding: 24px;
  background-color: #fdfdfd; /* Warna latar yang sedikit off-white */
}

/* Kustomisasi gaya tombol Tambah Siswa agar sesuai dengan gambar */
:deep(.n-button--primary-type.n-button--ghost) {
  border-color: #f28e23;
  color: #f28e23;
}
:deep(.n-button--primary-type.n-button--ghost:hover) {
  border-color: #d6791a;
  background-color: #fef4e9;
  color: #d6791a;
}
:deep(.n-button--primary-type.n-button--ghost .n-icon) {
  color: #f28e23;
}
:deep(.n-button--primary-type.n-button--ghost:hover .n-icon) {
  color: #d6791a;
}

/* Kustomisasi tombol detail (...) */
:deep(.n-button--tertiary-type) {
    border: 1px solid #f28e23;
    color: #f28e23;
}
</style>