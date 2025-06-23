<template>
  <div class="siswa-container">
    <n-space vertical :size="24">
      <h1 class="headlineb2">Siswa</h1>

      <div class="search-tambah">
        <div class="search-container">
          <n-input
          round
          size="large"
          placeholder="Cari jadwal program bimbel...">
            <template #prefix>
              <img class="img-search" src="@/assets/icons/admin/search.svg" alt="search">
            </template>
          </n-input>
        </div>
        <ButImgTambahSecondNormal label="Tambah Siswa" @click="handleTambahSiswa"/>
      </div>

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
import { useRouter } from 'vue-router'; // Tambahkan ini
import { NButton, NIcon, NDataTable, NSpace, NH1, NInput, useMessage } from 'naive-ui';
import {
  EllipsisHorizontal,
} from '@vicons/ionicons5';
import ButImgTambahSecondNormal from '@/components/dirButton/butImgTambahSecondNormal.vue';

const message = useMessage();
const router = useRouter(); // Inisialisasi router
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
            disabled: !row.id, // Tombol nonaktif jika id tidak ada
            onClick: () => row.id && viewDetails(row),
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
  { id: 1, key: 0, name: 'Arell Saverro Biyanroto', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 2 },
  { id: 2, key: 1, name: 'Alif Abdul Aziz', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { id: 3, key: 2, name: 'Raihan Muhammad R. R.', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { id: 4, key: 3, name: 'Zyan Shainori', level: 'SD', whatsapp: '085xxxxxxxxx', program: 2 },
  { id: 5, key: 4, name: 'Yulius Calvin', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { id: 6, key: 5, name: 'Anina Adelia', level: 'SMP', whatsapp: '085xxxxxxxxx', program: 1 },
  { id: 7, key: 6, name: 'Raihan Muhammad R. R.', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { id: 8, key: 7, name: 'Zyan Shainori', level: 'SD', whatsapp: '085xxxxxxxxx', program: 2 },
  { id: 9, key: 8, name: 'Yulius Calvin', level: 'SMA', whatsapp: '085xxxxxxxxx', program: 1 },
  { id: 10, key: 9, name: 'Anina Adelia', level: 'SMP', whatsapp: '085xxxxxxxxx', program: 1 },
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
  // Navigasi ke halaman detail dengan path sesuai permintaan
  router.push(`/dashboardadmin/siswa/detail/:${row.id}`);
};

// --- Inisialisasi Kolom ---
const columns = createColumns({
  viewDetails,
});
</script>

<style scoped>
.headlineb2 {
  color: #154484;
}
.siswa-container {
  background-color: #fff;
  width: 100%;
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
}

.n-input-wrapper {
  width: 100%;
}

.search-tambah {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.search-container {
  width: 100%;
  max-width: 100%;
}

.img-search {
  width: 16px;
  height: auto;
   margin-right: 8px;
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