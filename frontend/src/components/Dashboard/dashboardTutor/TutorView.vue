<script setup>
import { ref, computed, h, onMounted, watch } from 'vue';
import { NButton, NIcon, NDropdown, useMessage } from 'naive-ui';
import {
  EllipsisHorizontal as EllipsisIcon
} from '@vicons/ionicons5';

import ButImgTambahSecondNormal from '@/components/dirButton/butImgTambahSecondNormal.vue';
import router from '@/router';

const message = useMessage();

const searchQuery = ref('');
const tutors = ref([]);
const allTutors = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const loading = ref(false);

const fetchTutors = async () => {
  loading.value = true;
  try {
    const res = await fetch(`http://localhost:3000/users/tutors?page=${page.value}&limit=${pageSize.value}`);
    const json = await res.json();
    tutors.value = json.data.map(t => ({
      key: t.id,
      nama: t.name,
      usia: t.age,
      no_whatsapp: t.phone,
      program: t.classCount,
      subject: t.subject,
      teachLevel: t.teachLevel,
      description: t.description,
      photo: t.photo,
    }));
    total.value = json.total;
  } catch (e) {
    message.error('Gagal mengambil data tutor');
  }
  loading.value = false;
};

const fetchAllTutors = async () => {
  loading.value = true;
  try {
    // Ambil semua data tutor untuk pencarian
    const res = await fetch(`http://localhost:3000/users/tutors?page=1&limit=${total.value || 1000}`);
    const json = await res.json();
    allTutors.value = json.data.map(t => ({
      key: t.id,
      nama: t.name,
      usia: t.age,
      no_whatsapp: t.phone,
      program: t.classCount,
      subject: t.subject,
      teachLevel: t.teachLevel,
      description: t.description,
      photo: t.photo,
    }));
  } catch (e) {
    allTutors.value = [];
  }
  loading.value = false;
};

onMounted(fetchTutors);

watch([page, pageSize], () => {
  if (!searchQuery.value) fetchTutors();
});

watch(searchQuery, async (val) => {
  if (val) {
    await fetchAllTutors();
  } else {
    fetchTutors();
  }
});

const filteredTutors = computed(() => {
  if (!searchQuery.value) return tutors.value;
  return allTutors.value.filter((tutor) =>
    tutor.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const createColumns = ({ handleSelect }) => [
  {
    title: 'Nama',
    key: 'nama',
    sorter: 'default',
  },
  {
    title: 'Usia',
    key: 'usia',
    sorter: (a, b) => a.usia - b.usia,
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
    render(row) {
      return h(
        NDropdown,
        {
          trigger: 'click',
          options: [
            { label: 'Lihat Detail', key: 'view' },
            { label: 'Edit', key: 'edit' },
            { label: 'Hapus', key: 'delete', props: { style: { color: 'red' } } }
          ],
          onSelect: (key) => handleSelect(key, row),
        },
        {
          default: () =>
            h(
              NButton,
              { text: true, style: { padding: '0 8px' } },
              { default: () => h(NIcon, null, { default: () => h(EllipsisIcon) }) }
            ),
        }
      );
    },
  },
];

const columns = createColumns({
  handleSelect: async (key, row) => {
    switch (key) {
      case 'view':
        router.push(`/dashboardadmin/tutor/profiltutor/${row.key}`);
        break;
      case 'edit':
        router.push(`/dashboardadmin/tutor/edit/${row.key}`);
        break;
      case 'delete':
        if (confirm(`Yakin hapus tutor "${row.nama}"?`)) {
          await handleDeleteTutor(row);
        }
        break;
      default:
        message.info(`Aksi tidak dikenal: ${key}`);
    }
  }
});

const handleAddTutor = () => {
  router.push('/dashboardadmin/tutor/tambahtutor');
};

const handleDeleteTutor = async (row) => {
  const token = localStorage.getItem('token');
  if (!token) {
    message.error('Token tidak ditemukan');
    return;
  }
  try {
    loading.value = true;
    const res = await fetch(`http://localhost:3000/users/${row.key}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gagal menghapus tutor');
    }
    message.success('Tutor berhasil dihapus');
    // Refresh data setelah hapus
    if (searchQuery.value) {
      await fetchAllTutors();
    } else {
      await fetchTutors();
    }
  } catch (e) {
    message.error(e.message || 'Gagal menghapus tutor');
  } finally {
    loading.value = false;
  }
};

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
            v-model:value="searchQuery"
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
        :loading="loading"
      />

      <n-pagination
        v-model:page="page"
        :page-size="pageSize"
        :item-count="total"
        style="margin-top: 16px"
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
  height: 100ch;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  background-color: #fff; /* Latar belakang soft-white/blue */
}
</style>