<template>
  <div class="dashboard-container">
    <h1 class="headlineb2">Program</h1>
    <div class="search-tambah">
      <div class="search-container">
        <n-input
          v-model="searchText"
          round
          size="large"
          placeholder="Cari Program">
          <template #prefix>
            <img class="img-search" src="@/assets/icons/admin/search.svg" alt="search">
          </template>
        </n-input>
      </div>
      <ButImgTambahSecondNormal label="Tambah Program" @click="handleTambahProgram"/>
    </div>

    <section class="schedule-section">
      <h2 class="headersb2">Semua Program</h2>
      <div class="table-responsive">
        <table class="schedule-table">
          <thead>
            <tr>
              <th>Program</th>
              <th>Hari</th>
              <th>Jam</th>
              <th>Durasi</th>
              <th>Aktif</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in packageItems" :key="item.slug">
              <td>
                <div class="bimbel-subject">{{ item.name }} {{ item.level }}</div>
                <div class="bimbel-teacher">{{ item.tutorName }}</div>
              </td>
              <td>{{ item.days.join(', ') }}</td>
              <td>{{ new Date(item.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}</td>
              <td>{{ item.duration }} menit</td>
              <td>
                <n-icon v-if="item.isActive" color="#4caf50" size="22">
                  <CheckmarkCircleOutline />
                </n-icon>
                <n-icon v-else color="#f44336" size="22">
                  <CloseCircleOutline />
                </n-icon>
              </td>
              <td>
                <button class="detail-button" @click="showDetail(item)">
                  <img src="@/assets/icons/more-horizontal.svg" alt="">
                </button>
              </td>
            </tr>
            <tr v-if="packageItems.length === 0">
              <td colspan="6" style="text-align:center;">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <n-pagination
          v-model:page="page"
          :page-count="totalPages"
          :page-size="limit"
          :page-slot="7"
          @update:page="handlePageChange"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { NIcon, NPagination } from 'naive-ui'
import { CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5'

export default {
  name: 'DashboardContainer',
  components: { NIcon, NPagination, CheckmarkCircleOutline, CloseCircleOutline },
  data() {
    return {
      packageItems: [],
      page: 1,
      limit: 8,
      totalPages: 1,
      searchText: ''
    };
  },
  methods: {
    async fetchClosestSchedules(page = this.page) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/packages/all?page=${page}&limit=${this.limit}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        this.packageItems = result.data;
        this.totalPages = Math.ceil(result.total / this.limit);
      } catch (error) {
        console.error('Gagal fetch data:', error);
      }
    },
    handlePageChange(newPage) {
      this.page = newPage;
      this.fetchClosestSchedules(newPage);
    },
    showDetail(item) {
      alert(`Detail untuk ${item.name} (${item.slug})`);
    },
    handleTambahProgram() {
      alert('Tambah Program');
    }
  },
  mounted() {
    this.fetchClosestSchedules();
  }
};
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Tambahkan ini
import ButImgTambahSecondNormal from '@/components/dirButton/butImgTambahSecondNormal.vue';


const scheduleItems = ref([]);
const page = ref(1);
const limit = 10;
const totalPages = ref(1);
const searchText = ref('');

const router = useRouter(); // Tambahkan ini

const fetchClosestSchedules = async (targetPage = page.value) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    const response = await fetch(`http://localhost:3000/schedules/closest?page=${targetPage}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    scheduleItems.value = result.data.data.map(item => ({
      kode: item.classCode,
      bimbel: {
        subject: item.packageName,
        teacher: item.tutorName
      },
      tanggal: new Date(item.date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      jam: new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      slug: item.slug
    }));

    page.value = result.data.page;
    totalPages.value = result.data.totalPages;

  } catch (error) {
    console.error('Error fetching closest schedules:', error);
    alert('Gagal mengambil data jadwal terdekat.');
  }
};

const showDetail = (item) => {
  console.log('Menampilkan detail untuk:', item.kode, item.bimbel.subject);
  alert(`Detail untuk ${item.bimbel.subject} (${item.kode})`);
};

const goToNextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchClosestSchedules(page.value);
  }
};

const goToPreviousPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchClosestSchedules(page.value);
  }
};

const handleTambahProgram = () => {
  router.push('/dashboardadmin/programadmin/tambahprogram');
};

onMounted(() => {
  fetchClosestSchedules();
});
</script>


<style scoped>
.dashboard-container {
  background-color: #fff;
  width: 100%;
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
}

.headlineb2, .schedule-section h2 {
  color: #154484;
}

.search-container {
  margin: 20px 0;
  width: 100%;
}

.search-tambah {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.img-search {
  width: 16px;
  height: auto;
   margin-right: 8px;
}

.table-responsive {
  overflow-x: auto; /* Memungkinkan scroll horizontal jika tabel terlalu lebar */
  background-color: #fff; /* Latar belakang putih untuk area tabel */
  border-radius: 8px; /* Sedikit lengkungan pada kontainer tabel */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* Shadow halus */
  padding: 15px;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse; /* Menghilangkan spasi antar border sel */
}

.schedule-table th,
.schedule-table td {
  padding: 15px 12px; /* Padding sel */
  text-align: left;
  vertical-align: middle; /* Vertikal align tengah */
  border-bottom: 1px solid #dee2e6; /* Garis pemisah antar baris */
}

.schedule-table th {
  font-weight: 600; /* Header lebih tebal */
  font-size: 0.9em;
  color: #495057; /* Warna teks header */
  white-space: nowrap; /* Mencegah header wrap */
}

.sort-icon {
  font-size: 0.7em;
  margin-left: 5px;
  color: #6c757d;
}

.schedule-table td {
  font-size: 0.95em;
  color: #212529; /* Warna teks isi tabel */
}

.bimbel-subject {
  font-weight: 600; /* Nama bimbel sedikit tebal */
  color: #0d47a1; /* Warna biru untuk subjek bimbel */
}

.bimbel-teacher {
  font-size: 0.85em;
  color: #6c757d; /* Warna abu-abu untuk nama guru */
  margin-top: 2px;
}

.detail-button {
  background-color: transparent;
  border: 1px solid #ff9800; /* Border oranye */
  color: #ff9800; /* Warna ikon oranye */
  padding: 6px 12px;
  border-radius: 20px; /* Tombol rounded */
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-button:hover {
  background-color: #ffe0b2; /* Warna latar oranye muda saat hover */
  color: #c66900; /* Warna ikon oranye tua saat hover */
}

.detail-button i {
  font-size: 0.9em;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>