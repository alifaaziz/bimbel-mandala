<template>
  <div class="dashboard-container">
    <n-space vertical :size="24">
      <h1 class="headlineb2">Catatan & Biaya</h1>

      <n-grid cols="1 s:2 m:4" :x-gap="16" :y-gap="16" responsive="screen">
        <n-gi>
          <n-card>
            <n-statistic label="Biaya masuk">
              Rp10.000.000
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Biaya keluar">
              Rp7.000.000
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Program selesai">
              100
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Menunggu pembayaran">
              <n-text type="error">
                1
              </n-text>
            </n-statistic>
          </n-card>
        </n-gi>
      </n-grid>

      <n-space vertical :size="16">
        <h2 class="headlineb2">Program Selesai</h2>
         
        <div class="search-container">
      <n-input
      round
      size="large"
      placeholder="Cari program bimbel berdasarkan nama, tutor, atau kode program">
        <template #prefix>
          <img class="img-search" src="@/assets/icons/admin/search.svg" alt="search">
        </template>
      </n-input>
    </div>

        <n-data-table
          :columns="columns"
          :data="filteredData"
          :bordered="false"
          :single-line="false"
          :pagination="pagination"
        />
      </n-space>

    </n-space>
  </div>
</template>

<script setup>
import { ref, h, computed } from 'vue';
import { NTag, NButton, NIcon } from 'naive-ui';
import { EllipsisHorizontal } from '@vicons/ionicons5';
import { useRouter } from 'vue-router'

const router = useRouter()

// --- Tipe data untuk kolom tabel ---
/**
 * @type {import('naive-ui').DataTableColumns<RowData>}
 */
const createColumns = ({ showDetail }) => {
  return [
    {
      title: 'Bimbel',
      key: 'bimbel',
      render(row) {
        // Render 2 baris teks: Mata Pelajaran dan Nama Tutor
        return h(
          'div',
          {},
          [
            h('div', { style: 'font-weight: 500;' }, row.subject),
            h('div', { style: 'font-size: 12px; color: grey;' }, row.tutor)
          ]
        );
      }
    },
    {
      title: 'Kode',
      key: 'code',
      align: 'center',
    },
    {
      title: 'Tanggal Mulai',
      key: 'startDate',
      align: 'center',
    },
    {
      title: 'Tanggal Selesai',
      key: 'endDate',
      align: 'center',
    },
    {
      title: 'Status Pembayaran',
      key: 'paymentStatus',
      align: 'center',
      render(row) {
        // Render Tag (lencana) berdasarkan status
        if (row.paymentStatus === 'Belum Terbayar') {
          return h(NTag, { type: 'warning', bordered: false }, { default: () => row.paymentStatus });
        }
        return h(NTag, { type: 'info', bordered: false }, { default: () => row.paymentStatus });
      }
    },
    {
      title: 'Detail',
      key: 'actions',
      align: 'center',
      render(row) {
        // Render tombol aksi
        return h(
          NButton,
          {
            tertiary: true,
            circle: true,
            onClick: () => showDetail(row)
          },
          { default: () => h(NIcon, null, { default: () => h(EllipsisHorizontal) }) }
        );
      }
    }
  ];
};

// --- Data Dummy untuk Tabel ---
const originalData = ref([
  {
    key: 0,
    subject: 'Matematika SMA',
    tutor: 'Pak Dendy Wan S.Pd',
    code: '#11132',
    startDate: '27 Januari 2025',
    endDate: '28 Juli 2025',
    paymentStatus: 'Belum Terbayar'
  },
  {
    key: 1,
    subject: 'B. Indonesia SMP',
    tutor: 'Bu Jenny Budi S.Pd',
    code: '#11131',
    startDate: '20 Januari 2025',
    endDate: '21 Juli 2025',
    paymentStatus: 'Terbayar'
  },
  {
    key: 2,
    subject: 'Fisika SMA',
    tutor: 'Pak Muhammad Rendy S.Pd',
    code: '#11130',
    startDate: '13 Januari 2025',
    endDate: '14 Juli 2025',
    paymentStatus: 'Terbayar'
  },
   {
    key: 3,
    subject: 'Kimia SMA',
    tutor: 'Bu Anisa Putri S.Si',
    code: '#11129',
    startDate: '06 Januari 2025',
    endDate: '07 Juli 2025',
    paymentStatus: 'Terbayar'
  }
]);

// --- State untuk Search & Filter ---
const searchTerm = ref('');
const filteredData = computed(() => {
  if (!searchTerm.value) {
    return originalData.value;
  }
  return originalData.value.filter(item =>
    item.subject.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.tutor.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});


// --- Fungsi Aksi dan Konfigurasi Tabel ---
const showDetail = (row) => {
  router.push(`/dashboardadmin/catatanbiaya/detailprogramselesai`);
};

const columns = createColumns({ showDetail });

const pagination = {
  pageSize: 5 // Menampilkan 5 item per halaman
};

</script>

<style scoped>
.headlineb2 {
  color: #154484;
}
.dashboard-container {
  background-color: #fff;
  width: 100%;
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
}
/* Kustomisasi agar NCard tidak memiliki border dan bayangan yang terlalu kuat */
:deep(.n-card) {
  border: 1px solid #e0e0e6;
  box-shadow: none;
}
:deep(.n-h2) {
    font-weight: 600;
}
</style>