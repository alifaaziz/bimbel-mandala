<template>
  <div class="siswa-container">
    <n-space vertical :size="24">
      <h1 class="headlineb2">Program</h1>

      <div class="search-tambah">
        <div class="search-container">
          <n-input
            v-model="searchText"
            round
            size="large"
            placeholder="Cari tutor">
            <template #prefix>
              <img class="img-search" src="@/assets/icons/admin/search.svg" alt="search">
            </template>
          </n-input>
        </div>
        <ButImgTambahSecondNormal label="Tambah Program" @click="handleTambahProgram"/>
      </div>
      <n-data-table
        :columns="columns"
        :data="displayedData"
        :pagination="false"
        :bordered="false"
        :single-line="false"
        :loading="loading"
      />
      <div class="pagination-wrapper">
        <n-pagination
          :page="page"
          :page-size="pageSize"
          :item-count="total"
          :page-slot="7"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
          :page-sizes="[10, 20, 50]"
          v-model="page"
        />
      </div>
    </n-space>
  </div>
</template>

<script setup>
import { ref, h, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NIcon, NDataTable, NSpace, NH1, NInput, useMessage } from 'naive-ui';
import {
  EllipsisHorizontal,
} from '@vicons/ionicons5';
import ButImgTambahSecondNormal from '@/components/dirButton/butImgTambahSecondNormal.vue';

const message = useMessage();
const router = useRouter();
const searchText = ref('');
const loading = ref(false);

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const data = ref([]);

const allData = ref([]); 

async function fetchSiswa() {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/users/new-students?page=${page.value}&limit=${pageSize.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const json = await res.json();
    const siswaArr = json.data.data.map((item, idx) => ({
      id: item.id,
      key: idx,
      name: item.name,
      level: item.level,
      phone: item.phone,
      classCount: item.classCount,
    }));
    data.value = siswaArr;
    total.value = json.data.total;
  } catch (err) {
    message.error('Gagal mengambil data siswa');
  } finally {
    loading.value = false;
  }
}

async function fetchAllSiswa() {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/users/new-students?page=1&limit=${total.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const json = await res.json();
    allData.value = json.data.data.map((item, idx) => ({
      id: item.id,
      key: idx,
      name: item.name,
      level: item.level,
      phone: item.phone,
      classCount: item.classCount,
    }));
  } catch (err) {
    allData.value = [];
  } finally {
    loading.value = false;
  }
}

watch([page, pageSize], () => {
  if (!searchText.value) {
    fetchSiswa();
  }
}, { immediate: true });


watch(searchText, async (val) => {
  if (val) {
    await fetchAllSiswa();
  } else {
    fetchSiswa();
  }
});

const displayedData = computed(() => {
  if (!searchText.value) {
    return data.value;
  }
  return allData.value.filter((student) =>
    student.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

function handlePageChange(newPage) {
  page.value = newPage;
  if (!searchText.value) fetchSiswa();
}

function handlePageSizeChange(newSize) {
  pageSize.value = newSize;
  page.value = 1;
  if (!searchText.value) fetchSiswa();
}

const handleTambahSiswa = () => {
  router.push('/dashboardadmin/siswa/tambahsiswa');
};

const viewDetails = (row) => {
  router.push(`/dashboardadmin/siswa/${row.id}`);
};

const createColumns = ({ viewDetails }) => [
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
    key: 'phone',
    sorter: (rowA, rowB) => rowA.phone.localeCompare(rowB.phone),
  },
  {
    title: 'Program',
    key: 'classCount',
    sorter: (rowA, rowB) => rowA.classCount - rowB.classCount,
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
          disabled: !row.id,
          onClick: () => row.id && viewDetails(row),
        },
        {
          icon: () => h(NIcon, { component: EllipsisHorizontal }),
        }
      );
    },
  },
];

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

.pagination-wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}
</style>