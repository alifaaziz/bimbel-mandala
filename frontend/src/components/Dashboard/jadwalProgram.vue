<template>
  <div class="dashboard-view">
    <h1 class="headlineb2">Dashboard</h1>

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

    <section class="schedule-section">
      <h2 class="headersb2">Jadwal Program</h2>
      <div class="table-responsive">
        <table class="schedule-table">
          <thead>
            <tr>
              <th>Bimbel <i class="fas fa-chevron-down sort-icon"></i></th>
              <th>Kode <i class="fas fa-chevron-down sort-icon"></i></th>
              <th>Tanggal <i class="fas fa-chevron-down sort-icon"></i></th>
              <th>Jam <i class="fas fa-chevron-down sort-icon"></i></th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in scheduleItems" :key="item.kode">
              <td>
                <div class="bimbel-subject">{{ item.bimbel.subject }}</div>
                <div class="bimbel-teacher">{{ item.bimbel.teacher }}</div>
              </td>
              <td>#{{ item.kode }}</td>
              <td>{{ item.tanggal }}</td>
              <td>{{ item.jam }}</td>
              <td>
                <button class="detail-button" @click="showDetail(item)">
                  <img src="@/assets/icons/more-horizontal.svg" alt="">
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button @click="goToPreviousPage" :disabled="page === 1">Sebelumnya</button>
        <span>Halaman {{ page }} dari {{ totalPages }}</span>
        <button @click="goToNextPage" :disabled="page === totalPages">Selanjutnya</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      scheduleItems: [], 
      page: 1,
      limit: 10, 
      totalPages: 1
    };
  },
  methods: {
    async fetchClosestSchedules(page = this.page) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan login kembali.');
        }
        const response = await fetch(`http://localhost:3000/schedules/closest?page=${page}&limit=${this.limit}`, {
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
        this.scheduleItems = result.data.data.map(item => ({
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
        this.page = result.data.page;
        this.totalPages = result.data.totalPages;
      } catch (error) {
        console.error('Error fetching closest schedules:', error);
        alert('Gagal mengambil data jadwal terdekat.');
      }
    },
    showDetail(item) {
      console.log('Menampilkan detail untuk:', item.kode, item.bimbel.subject);
      alert(`Detail untuk ${item.bimbel.subject} (${item.kode})`);
    },
    goToNextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchClosestSchedules(this.page);
      }
    },
    goToPreviousPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchClosestSchedules(this.page);
      }
    }
  },
  mounted() {
    this.fetchClosestSchedules();
  }
};
</script>

<style scoped>
.dashboard-view {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
}

.headlineb2, .schedule-section h2 {
  color: #154484;
}

.search-container {
  margin: 20px 0;
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
  justify-content: space-between;
  align-items: center;
}

.pagination button {
  background-color: #154484;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 0.9em;
  color: #333;
}
</style>