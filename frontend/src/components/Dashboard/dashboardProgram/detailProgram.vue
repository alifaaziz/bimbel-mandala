<template>
  <div class="page-container">
    <n-space vertical size="large">
      <h2 class="page-title">Detail Program</h2>

      <n-card :bordered="false" content-style="padding: 24px;">
        <n-grid :x-gap="24" :y-gap="24" cols="1 s:1 m:3" responsive="screen">
          <n-gi span="1">
            <n-image
              width="100%"
              height="100%"
              object-fit="cover"
              :src="program.tutorImage"
              alt="Foto Tutor"
              style="border-radius: 8px;"
            />
          </n-gi>
          <n-gi span="2">
            <n-space vertical size="large">
              <n-space align="center" justify="space-between">
                <h3 class="program-name">{{ program.subject }}</h3>
                <n-tag :bordered="false" type="info" class="level-tag">{{ program.level }}</n-tag>
              </n-space>

              <n-space>
                <n-tag
                  v-for="day in allDays"
                  :key="day"
                  :type="program.activeDays.includes(day) ? 'primary' : 'default'"
                  :bordered="false"
                >
                  {{ day }}
                </n-tag>
              </n-space>

              <n-descriptions label-placement="left" :column="1" :label-style="{width: '120px'}">
                <n-descriptions-item label="Area" :label-style="{fontWeight: 500}">
                  {{ program.area }}
                </n-descriptions-item>
                <n-descriptions-item label="Pertemuan" :label-style="{fontWeight: 500}">
                  {{ program.meetings }}
                </n-descriptions-item>
                <n-descriptions-item label="Pukul" :label-style="{fontWeight: 500}">
                  {{ program.time }}
                </n-descriptions-item>
                <n-descriptions-item label="Durasi" :label-style="{fontWeight: 500}">
                  {{ program.duration }}
                </n-descriptions-item>
              </n-descriptions>

              <div>
                <p class="program-type">{{ program.type }}</p>
                <p class="price-range">{{ program.priceRange }}</p>
              </div>

              <n-button type="primary" @click="handleEdit">Edit</n-button>
            </n-space>
          </n-gi>
        </n-grid>
      </n-card>

      <div class="table-section">
        <div class="table-header">
          Biaya Program
        </div>
        <n-data-table
          :columns="biayaColumns"
          :data="biayaData"
          :bordered="false"
          :single-line="false"
        />
      </div>

      <div class="notes-section">
        <h4 class="notes-title">Catatan:</h4>
        <ul class="notes-list">
          <li>Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.</li>
          <li>Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.</li>
          <li>Honor Tutor merupakan 70% dari biaya total program.</li>
        </ul>
      </div>

    </n-space>
  </div>
</template>

<script setup>
import { ref, h } from 'vue';
import { useMessage, NSpace, NCard, NGrid, NGi, NImage, NTag, NDescriptions, NDescriptionsItem, NButton, NDataTable } from 'naive-ui';

const message = useMessage();

// --- Data untuk Detail Program (statis, bisa dari API) ---
const program = ref({
  tutorImage: 'https://images.unsplash.com/photo-1542327897-4141c5336f09?q=80&w=2524&auto=format&fit=crop', // Placeholder image
  subject: 'Matematika',
  level: 'SMA',
  activeDays: ['Senin', 'Rabu', 'Kamis', 'Sabtu'],
  area: 'Semarang',
  meetings: '6 Bulan (3x perminggu)',
  time: '15:00 WIB',
  duration: '120 Menit',
  type: 'Privat/Kelompok',
  priceRange: 'Rp1.300.000 - Rp1.720.000'
});
const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];

// --- Helper untuk format mata uang ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

// --- Data dan Kolom untuk Tabel Biaya ---
const biayaColumns = [
  { title: 'Jenis', key: 'jenis' },
  { title: 'Biaya Program', key: 'biayaProgram', render: (row) => formatRupiah(row.biayaProgram) },
  { title: 'Biaya/anak', key: 'biayaAnak1', render: (row) => formatRupiah(row.biayaAnak1) },
  { title: 'Jumlah Siswa', key: 'jumlahSiswa' },
  { title: 'Biaya/anak', key: 'biayaAnak2', render: (row) => formatRupiah(row.biayaAnak2) }, // Kolom duplikat sesuai gambar
  { title: 'Honor Total', key: 'honorTotal', render: (row) => formatRupiah(row.honorTotal) },
];

const biayaData = ref([
  { jenis: 'Privat', biayaProgram: 1000000, biayaAnak1: 300000, jumlahSiswa: 1, biayaAnak2: 300000, honorTotal: 910000 },
  { jenis: 'Kelompok 3 Siswa', biayaProgram: 1000000, biayaAnak1: 240000, jumlahSiswa: 3, biayaAnak2: 240000, honorTotal: 1078000 },
  { jenis: 'Kelompok 5 Siswa', biayaProgram: 1000000, biayaAnak1: 192000, jumlahSiswa: 5, biayaAnak2: 192000, honorTotal: 1204000 },
]);

// --- Fungsi Handler ---
const handleEdit = () => {
  message.info('Tombol "Edit" diklik!');
};

</script>

<style scoped>
.page-container {
  padding: 24px;
  background-color: #f7f9fc;
}
.page-title {
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
}
.program-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.level-tag {
  background-color: #1e3a8a;
  color: white;
  font-weight: 600;
}
.program-type {
  font-weight: 600;
  color: #1f2937;
  margin: 16px 0 4px 0;
}
.price-range {
  font-weight: 700;
  color: #1e3a8a;
  font-size: 1.25rem;
  margin: 0;
}
.table-section {
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  overflow: hidden;
}
.table-header {
  background-color: #1e3a8a;
  color: white;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 1.1rem;
}
:deep(.n-data-table .n-data-table-th) {
  background-color: #f7f9fc;
}
.notes-section {
  margin-top: 16px;
}
.notes-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.notes-list {
  padding-left: 20px;
  color: #4b5563;
  font-size: 0.9rem;
}
.notes-list li {
  margin-bottom: 8px;
}
.notes-list li::marker {
  color: #f97316; /* Warna oranye untuk bullet points */
}
</style>