<script setup>
import { ref, computed, h } from 'vue';
import { NButton, NIcon, NDropdown, useMessage } from 'naive-ui';
import {
  EllipsisHorizontal as EllipsisIcon
} from '@vicons/ionicons5';

import ButImgTambahSecondNormal from '@/components/dirButton/butImgTambahSecondNormal.vue';

// Gunakan 'useMessage' untuk menampilkan notifikasi saat aksi dropdown dipilih
const message = useMessage();

// --- 1. State Management ---
// Ref untuk menampung teks dari input pencarian
const searchQuery = ref('');

// Data dummy untuk para tutor
const allTutors = ref([
  { key: 1, nama: 'Pak Dendy Wan S.Pd', usia: 32, no_whatsapp: '085xxxxxxxxxx', program: 4 },
  { key: 2, nama: 'Bu Luna S.Pd', usia: 23, no_whatsapp: '085xxxxxxxxxx', program: 2 },
  { key: 3, nama: 'Bu Wendy S.Pd', usia: 28, no_whatsapp: '085xxxxxxxxxx', program: 5 },
  { key: 4, nama: 'Bu Susi Wati S.Pd', usia: 28, no_whatsapp: '085xxxxxxxxxx', program: 1 },
  { key: 5, nama: 'Pak Indra Jaya S.Pd', usia: 21, no_whatsapp: '085xxxxxxxxxx', program: 1 },
]);

// --- 2. Definisi Kolom untuk n-data-table ---
// Fungsi untuk membuat kolom, agar bisa mengakses 'handleSelect'
const createColumns = ({ handleSelect }) => [
  {
    title: 'Nama',
    key: 'nama',
    sorter: 'default', // Mengaktifkan pengurutan untuk kolom ini
  },
  {
    title: 'Usia',
    key: 'usia',
    sorter: (a, b) => a.usia - b.usia, // Logika pengurutan kustom
  },
  {
    title: 'No. WhatsApp',
    key: 'no_whatsapp',
  },
  {
    title: 'Program',
    key: 'program',
    sorter: (a, b) => a.program - b.program,
  },
  {
    title: 'Detail',
    key: 'actions',
    // 'render' digunakan untuk menampilkan komponen kustom di dalam sel tabel
    render(row) {
      return h(
        NDropdown,
        {
          trigger: 'click', // Dropdown muncul saat diklik
          options: [
            { label: 'Lihat Detail', key: 'view' },
            { label: 'Edit', key: 'edit' },
            { label: 'Hapus', key: 'delete', props: { style: { color: 'red' } } }
          ],
          onSelect: (key) => handleSelect(key, row), // Memanggil fungsi handleSelect saat opsi dipilih
        },
        // Ini adalah slot default dari NDropdown, yaitu tombol pemicunya
        {
          default: () =>
            h(
              NButton,
              { text: true, style: { padding: '0 8px' } }, // Tombol teks tanpa background
              { default: () => h(NIcon, null, { default: () => h(EllipsisIcon) }) }
            ),
        }
      );
    },
  },
];

const columns = createColumns({
  handleSelect: (key, row) => {
    // Menampilkan pesan berdasarkan aksi yang dipilih dari dropdown
    message.info(`Aksi: ${key}, Tutor: ${row.nama}`);
    // Di sini Anda bisa menambahkan logika lebih lanjut,
    // seperti membuka modal, navigasi ke halaman lain, atau memanggil API.
  },
});

// --- 3. Logika Tambahan ---
// Computed property untuk memfilter data tutor berdasarkan 'searchQuery'
const filteredTutors = computed(() => {
  if (!searchQuery.value) {
    return allTutors.value;
  }
  return allTutors.value.filter((tutor) =>
    tutor.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Fungsi yang dipanggil saat tombol 'Tambah Tutor' diklik
const handleAddTutor = () => {
  message.success('Membuka form tambah tutor...');
  // Logika untuk menampilkan modal atau halaman tambah tutor bisa ditambahkan di sini
};

// Fungsi untuk me-render ikon pada tombol
const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

</script>

<template>
  <div class="tutor-container">
    <n-space vertical size="large">
      <h1 class="headlineb2">Tutor</h1>

      <div class="search-tambah">
        <div class="search-container">
          <n-input
          round
          size="large"
          placeholder="Cari tutor...">
            <template #prefix>
              <img class="img-search" src="@/assets/icons/admin/search.svg" alt="search">
            </template>
          </n-input>
        </div>
        <ButImgTambahSecondNormal label="Tambah Tutor" @click="handleAddTutor"/>
      </div>

      <n-data-table
        :columns="columns"
        :data="filteredTutors"
        :pagination="false"
        :bordered="false"
        :single-line="false"
      />
    </n-space>
  </div>
</template>

<style scoped>

.headlineb2 {
  color: #154484;
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

.tutor-container {
  padding: 20px;
  border-radius: 16px;
  width: 100%;
  background-color: #fff; /* Latar belakang soft-white/blue */
}
</style>