<template>
  <div class="dashboard-view">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
    </header>

    <div class="search-container">
      <div class="search-input-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input type="text" placeholder="Cari jadwal program bimbel..." class="search-input">
      </div>
    </div>

    <section class="schedule-section">
      <h2>Jadwal Program</h2>
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
              <td>{{ item.kode }}</td>
              <td>{{ item.tanggal }}</td>
              <td>{{ item.jam }}</td>
              <td>
                <button class="detail-button" @click="showDetail(item)">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      scheduleItems: [
        {
          bimbel: { subject: 'Matematika SMA', teacher: 'Pak Dendy Wan S.Pd' },
          kode: '#11234',
          tanggal: 'Sabtu, 15 Maret 2025',
          jam: '15:00',
        },
        {
          bimbel: { subject: 'Matematika SD', teacher: 'Bu Luna S.Pd' },
          kode: '#11355',
          tanggal: 'Sabtu, 15 Maret 2025',
          jam: '15:00',
        },
        {
          bimbel: { subject: 'Fisika SMA', teacher: 'Bu Wendy S.Pd' },
          kode: '#11237',
          tanggal: 'Sabtu, 15 Maret 2025',
          jam: '15:00',
        },
        {
          bimbel: { subject: 'Seni SMA', teacher: 'Pak Wahyu Hendi S.Pd' },
          kode: '#11244',
          tanggal: 'Sabtu, 15 Maret 2025',
          jam: '15:00',
        },
        {
          bimbel: { subject: 'Fokus UTBK', teacher: 'Pak Indra Jaya S.Pd' },
          kode: '#101',
          tanggal: 'Sabtu, 15 Maret 2025',
          jam: '15:00',
        },
        {
          bimbel: { subject: 'English SMP', teacher: 'Bu Susi Wati S.Pd' },
          kode: '#11199',
          tanggal: 'Sabtu, 15 Maret 2025',
          jam: '15:00',
        },
        {
          bimbel: { subject: 'Matematika SMA', teacher: 'Pak Dendy Wan S.Pd' },
          kode: '#11234', // Sepertinya ada duplikasi kode pada gambar, saya biarkan sesuai gambar
          tanggal: 'Senin, 17 Maret 2025',
          jam: '15:00',
        },
        {
          bimbel: { subject: 'Matematika SD', teacher: 'Bu Luna S.Pd' },
          kode: '#11355', // Sepertinya ada duplikasi kode pada gambar
          tanggal: 'Senin, 17 Maret 2025',
          jam: '15:00',
        },
      ]
    };
  },
  methods: {
    showDetail(item) {
      // Logika untuk menampilkan detail item
      // Misalnya, bisa membuka modal atau navigasi ke halaman detail
      console.log('Menampilkan detail untuk:', item.kode, item.bimbel.subject);
      alert(`Detail untuk ${item.bimbel.subject} (${item.kode})`);
    }
  }
}
</script>

<style scoped>
.dashboard-view {
  padding: 20px 30px; /* Memberikan padding keseluruhan */
  font-family: 'Arial', sans-serif; /* Ganti dengan font yang sesuai */
  background-color: #f8f9fa; /* Warna latar belakang view yang sedikit abu-abu */
  min-height: 100vh;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #0d47a1; /* Warna biru tua untuk judul Dashboard */
  margin-bottom: 25px;
}

.search-container {
  margin-bottom: 30px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #e9ecef; /* Warna latar search bar */
  border-radius: 25px; /* Membuat search bar sangat rounded */
  padding: 5px 15px;
}

.search-icon {
  color: #6c757d; /* Warna ikon search */
  margin-right: 10px;
  font-size: 0.9em;
}

.search-input {
  border: none;
  background-color: transparent;
  outline: none;
  width: 100%;
  padding: 10px 5px;
  font-size: 1em;
  color: #495057;
}

.search-input::placeholder {
  color: #6c757d;
}

.schedule-section h2 {
  font-size: 20px;
  font-weight: bold;
  color: #343a40; /* Warna judul Jadwal Program */
  margin-bottom: 20px;
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

/* Pastikan Anda telah mengimpor Font Awesome jika menggunakan class fas */
/* Contoh import di file main.js atau index.html: */
/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" /> */

/* Untuk tampilan mobile, jika diperlukan */
@media (max-width: 768px) {
  .dashboard-view {
    padding: 15px;
  }
  .dashboard-header h1 {
    font-size: 24px;
  }
  .schedule-section h2 {
    font-size: 18px;
  }
  .schedule-table th,
  .schedule-table td {
    padding: 10px 8px;
    font-size: 0.9em;
  }
  .bimbel-subject {
    font-size: 0.95em;
  }
  .bimbel-teacher {
    font-size: 0.8em;
  }
  .detail-button {
    padding: 5px 10px;
  }
}
</style>