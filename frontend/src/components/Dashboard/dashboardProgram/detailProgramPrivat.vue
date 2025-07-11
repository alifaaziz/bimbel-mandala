<template>
  <div class="page-container">
    <div class="detail-content">

          <h4 class="headerb1">Detail Program</h4>
          <n-divider class="divider" />
          <n-card :bordered="false" style="border-radius: 12px; background-color: #f7f9fb; padding: 16px;">
            <n-grid cols="1 s:3" x-gap="24" y-gap="24" responsive="screen">
              <n-gi span="">
                <img
                  class="tutor-photo"
                  :src="'/tutor/Tutor_Default.png'"
                  alt="Tutor Photo"
                />
              </n-gi>
              <n-gi span="2">
                <n-space vertical size="large">
                  <n-flex justify="space-between" align="start">
                    <div>
                      <h1 style="font-size: 24px; font-weight: bold; margin: 0;">Matematika</h1>
                      <n-text>Pak Dendy Wan S.Pd</n-text>
                    </div>
                    <n-tag type="info" size="large" round>SMA</n-tag>
                  </n-flex>

                  <n-space>
                    <n-tag :bordered="false">Senin</n-tag>
                    <n-tag type="primary">Selasa</n-tag>
                    <n-tag type="primary">Rabu</n-tag>
                    <n-tag type="primary">Kamis</n-tag>
                    <n-tag :bordered="false">Jum'at</n-tag>
                    <n-tag :bordered="false">Sabtu</n-tag>
                  </n-space>

                  <div>
                    <n-descriptions label-placement="left" :column="1" size="small">
                      <n-descriptions-item label="Area">Semarang</n-descriptions-item>
                      <n-descriptions-item label="Pertemuan">6 Bulan (3x perminggu)</n-descriptions-item>
                      <n-descriptions-item label="Pukul">15:00 WIB</n-descriptions-item>
                      <n-descriptions-item label="Durasi">120 Menit</n-descriptions-item>
                    </n-descriptions>
                  </div>

                  <div>
                    <n-text depth="3">Privat/Kelompok</n-text>
                    <div style="font-size: 18px; font-weight: bold; color: #2a64b5;">
                      Rp1.300.000 - Rp1.720.000
                    </div>
                  </div>

                  <n-button type="primary" strong @click="handleEdit">Edit</n-button>
                </n-space>
              </n-gi>
            </n-grid>
          </n-card>

          <div>
            <div class="table-container">
              <div class="table-header">
                <h2 class="section-title white">Biaya Program</h2>
              </div>
              <n-data-table
                :columns="columns"
                :data="tableData"
                :bordered="false"
                :bottom-bordered="true"
                :single-line="false"
              />
            </div>

            <n-space vertical size="small" style="margin-top: 24px;">
              <h3 style="margin: 0; font-weight: bold;">Catatan:</h3>
              <n-list :show-divider="false" style="margin-top: 0;">
                <n-list-item>• Paket Privat/kelompok: Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.</n-list-item>
                <n-list-item>• Paket Kelas: Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.</n-list-item>
                <n-list-item>• Honor Tutor merupakan 70% dari biaya total program.</n-list-item>
              </n-list>
            </n-space>
          </div>

    </div>
  </div>
</template>

<script setup>
import { h } from 'vue';
import {
  NCard, NGrid, NGi, NSpace, NTag, NText, NButton, NFlex,
  NDataTable, NList, NListItem, NConfigProvider, NDescriptions, NDescriptionsItem
} from 'naive-ui';
import { useRouter, useRoute } from 'vue-router';

// Helper untuk format mata uang
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

// Definisi kolom untuk tabel
const columns = [
  {
    title: 'Jenis',
    key: 'jenis'
  },
  {
    title: 'Biaya Program',
    key: 'biayaProgram',
    render: (row) => h('span', formatCurrency(row.biayaProgram))
  },
  {
    title: 'Biaya/anak',
    key: 'biayaAnak',
    render: (row) => h('span', formatCurrency(row.biayaAnak))
  },
  {
    title: 'Jumlah Siswa',
    key: 'jumlahSiswa',
    align: 'center'
  },
  {
    title: 'Honor Total',
    key: 'honorTotal',
    render: (row) => h('span', formatCurrency(row.honorTotal))
  }
];

// Data untuk tabel
const tableData = [
  {
    key: 0,
    jenis: 'Privat',
    biayaProgram: 1000000,
    biayaAnak: 300000,
    jumlahSiswa: 1,
    honorTotal: 910000
  },
  {
    key: 1,
    jenis: 'Kelompok 3 Siswa',
    biayaProgram: 1000000,
    biayaAnak: 240000,
    jumlahSiswa: 3,
    honorTotal: 1078000
  },
  {
    key: 2,
    jenis: 'Kelompok 5 Siswa',
    biayaProgram: 1000000,
    biayaAnak: 192000,
    jumlahSiswa: 5,
    honorTotal: 1204000
  }
];

const router = useRouter();
const route = useRoute();

const handleEdit = () => {
  // id diambil dari params (misal :id pada route)
  const id = route.params.id;
  router.push(`/dashboardadmin/programadmin/editprogram/${id}`);
};
</script>

<style scoped>
.page-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #ffff; /* Menambahkan warna latar belakang agar kontras */
}

.tutor-photo {
  width: 100%;
  max-width: 480px;
  height: auto;
  object-fit: cover;
  border-radius: 16px;
}

.detail-content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
}

.white {
  color: white;
}

.table-container {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e6;
}

.table-header {
  background-color: #2a64b5;
  padding: 12px 24px;
}

/* Menyesuaikan n-card agar tidak punya background sendiri karena sudah di .detail-content */
.n-card {
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>