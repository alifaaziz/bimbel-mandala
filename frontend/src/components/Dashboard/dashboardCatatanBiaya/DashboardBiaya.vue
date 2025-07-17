<template>
  <div class="dashboard-container">
    <n-space vertical :size="24">
      <h1 class="headlineb2">Catatan & Biaya</h1>

      <n-grid cols="1 s:2 m:4" :x-gap="16" :y-gap="16" responsive="screen">
        <n-gi>
          <n-card>
            <n-statistic label="Biaya masuk">
              Rp{{ stats.totalIncome.toLocaleString('id-ID') }}
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Biaya keluar">
              Rp{{ stats.totalSalary.toLocaleString('id-ID') }}
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Program selesai">
              {{ stats.finishedClassCount }}
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Menunggu pembayaran">
              <n-text type="error">
                {{ stats.pendingSalaryCount }}
              </n-text>
            </n-statistic>
          </n-card>
        </n-gi>
      </n-grid>

      <n-space vertical :size="16">
        <h2 class="headlineb2">Program Selesai</h2>
        <div class="search-container">
      <n-input
      type="text"
      v-model:value="searchTerm"
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
          :data="originalData"
          :bordered="false"
          :single-line="false"
          :pagination="pagination"
        />
      </n-space>

    </n-space>
  </div>
</template>

<script setup>
import { ref, h, computed, onMounted, watch } from 'vue';
import { NTag, NButton, NIcon } from 'naive-ui';
import { EllipsisHorizontal } from '@vicons/ionicons5';
import { useRouter } from 'vue-router'
import { formatTanggal } from '@/utils/formatTanggal';

const router = useRouter();

const originalData = ref([]);
const searchTerm = ref('');
const page = ref(1);
const pageSize = ref(5);
const total = ref(0);
const totalPages = ref(1);

const stats = ref({
  totalIncome: 0,
  totalSalary: 0,
  finishedClassCount: 0,
  pendingSalaryCount: 0
});

const fetchRecap = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:3000/salaries/recap?search=${encodeURIComponent(searchTerm.value)}&page=${page.value}&limit=${pageSize.value}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const result = await response.json();
    if (result.data) {
      originalData.value = result.data.map((item, idx) => ({
        key: idx,
        classId: item.classId,
        subject: item.packageName,
        tutor: item.tutorName,
        code: item.classCode,
        startDate: formatTanggal(item.startDate),
        endDate: formatTanggal(item.endDate),
        paymentStatus: item.salaryStatus === 'pending' ? 'Belum Terbayar' : 'Terbayar'
      }));
      total.value = result.total || result.data.length;
      totalPages.value = result.totalPages || 1;
    }
  } catch (err) {
    console.error('Gagal fetch data recap:', err);
  }
};

const fetchStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/salaries/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (result.data) {
      stats.value = result.data;
    }
  } catch (err) {
    console.error('Gagal fetch statistik:', err);
  }
};

onMounted(() => {
  fetchStats();
  fetchRecap();
});

let searchTimeout = null;
watch(searchTerm, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchRecap();
  }, 400);
});
watch(page, () => {
  fetchRecap();
});

const showDetail = (row) => {
  router.push(`/dashboardadmin/catatanbiaya/detail/${row.classId}`);
};

const columns = [
  {
    title: 'Bimbel',
    key: 'bimbel',
    render(row) {
      return h('div', {}, [
        h('div', { style: 'font-weight: 500;' }, row.subject),
        h('div', { style: 'font-size: 12px; color: grey;' }, row.tutor)
      ]);
    }
  },
  { title: 'Kode', key: 'code', align: 'center' },
  { title: 'Tanggal Mulai', key: 'startDate', align: 'center' },
  { title: 'Tanggal Selesai', key: 'endDate', align: 'center' },
  {
    title: 'Status Pembayaran',
    key: 'paymentStatus',
    align: 'center',
    render(row) {
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

const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  pageCount: totalPages.value,
  showSizePicker: false,
  onUpdatePage: (newPage) => { page.value = newPage; }
}));

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