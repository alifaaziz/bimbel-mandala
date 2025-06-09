<template>
  <div class="program-aktif-card">
    <h2 class="card-title">Program Aktif</h2>
    <ul class="program-list">
      <li v-for="program in activePrograms" :key="program.code" class="program-item">
        <div class="program-info">
          <span class="program-subject">{{ program.subject }}</span>
          <span class="program-teacher">{{ program.teacher }}</span>
        </div>
        <span class="program-code">{{ program.code }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProgramAktifList',
  data() {
    return {
      activePrograms: [
        { subject: 'Matematika SMA', teacher: 'Pak Dendy Wan S.Pd', code: '#11234' },
        { subject: 'Matematika SD', teacher: 'Bu Luna S.Pd', code: '#11355' },
        { subject: 'Fisika SMA', teacher: 'Bu Wendy S.Pd', code: '#11237' },
        { subject: 'Seni SMA', teacher: 'Pak Wahyu Hendi S.Pd', code: '#11244' },
      ],
    };
  },
};
</script>

<style scoped>
.program-aktif-card {
  background-color: #ffffff; /* Latar belakang kartu putih */
  border-radius: 20px; /* Lengkungan sudut kartu keseluruhan */
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08); /* Bayangan halus untuk efek kartu */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 400px; /* Batas lebar maksimum kartu */
}

.card-title {
  font-size: 26px; /* Ukuran font judul */
  font-weight: bold;
  color: #1e3a8a; /* Warna biru tua untuk judul */
  margin-bottom: 20px; /* Jarak bawah dari judul ke daftar */
}

.program-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.program-item {
  background-color: #eef2f9; /* Warna latar belakang item (biru keabuan muda) */
  border-radius: 12px; /* Lengkungan sudut untuk setiap item */
  padding: 16px 20px; /* Padding di dalam setiap item */
  margin-bottom: 12px; /* Jarak antar item */
  display: flex;
  justify-content: space-between;
  align-items: center; /* Menjaga item info dan kode sejajar secara vertikal */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.program-item:last-child {
  margin-bottom: 0; /* Menghilangkan margin bawah untuk item terakhir */
}

.program-item:hover {
  transform: translateY(-2px); /* Efek sedikit terangkat saat hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
}

.program-info {
  display: flex;
  flex-direction: column;
  gap: 2px; /* Jarak kecil antara subjek dan nama guru */
}

.program-subject {
  font-size: 1.05rem; /* Ukuran font untuk subjek (sekitar 17px) */
  font-weight: 600; /* Sedikit tebal */
  color: #1f2937; /* Warna abu-abu gelap untuk subjek */
}

.program-teacher {
  font-size: 0.9rem; /* Ukuran font untuk nama guru (sekitar 14.5px) */
  color: #4b6a9c; /* Warna biru yang lebih lembut untuk nama guru */
}

.program-code {
  font-size: 0.95rem; /* Ukuran font untuk kode program */
  font-weight: 500;
  color: #8492a6; /* Warna abu-abu untuk kode program */
  background-color: #dde3ed; /* Latar belakang sedikit berbeda untuk kode (opsional, jika diinginkan) */
  padding: 4px 8px; /* Padding kecil di sekitar kode (opsional) */
  border-radius: 6px; /* Lengkungan untuk latar belakang kode (opsional) */
  white-space: nowrap; /* Mencegah kode dari wrapping jika terlalu panjang */
}
</style>