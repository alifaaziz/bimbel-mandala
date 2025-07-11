<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const program = ref(null);
const groupTypes = ref([]);
const route = useRoute();

// Fungsi untuk memformat tipe grup
const formatGroupType = (type) => {
  switch (type) {
    case 'privat':
      return 'Privat';
    case 'grup2':
      return 'Kelompok 2 Siswa';
    case 'grup3':
      return 'Kelompok 3 Siswa';
    case 'grup4':
      return 'Kelompok 4 Siswa';
    case 'grup5':
      return 'Kelompok 5 Siswa';
    case 'kelas':
      return 'Kelas';
    default:
      return type;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price);
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  const slug = route.params.id;
  try {
    const res = await fetch(`http://localhost:3000/packages/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Gagal mengambil data program');
    const data = await res.json();

    if (data) {
      program.value = data;

      const order = ['privat', 'grup2', 'grup3', 'grup4', 'grup5', 'kelas'];
      // Buat map dari data API
      const typeMap = {};
      (data.groupType || []).forEach((g) => {
        typeMap[g.type] = g;
      });

      // Pastikan semua tipe ada, jika tidak isi dummy
      const types = order.map((type) => {
        if (typeMap[type]) {
          return typeMap[type];
        }
        return {
          type,
          price: '...',
          discPrice: null,
        };
      });

      groupTypes.value = types;
    } else {
      console.error('Data tidak valid:', data);
    }
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div class="program-card">
    <div class="card-header headerb3">Rekap Tutor</div>
    <div class="card-space">
      <div class="card-body">
        <h3 class="headersb3">Rekap Tutor</h3>
        <div class="card-content">
          <div class="column-data">
            <p class="data-label bodysb2">Nama</p>
            <p class="data-fill bodyr2">Dendy Wan S.Pd</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Hadir</p>
            <p class="data-fill bodyr2">140 pertemuan</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Izin</p>
            <p class="data-fill bodyr2">1 pertemuan</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Absen</p>
            <p class="data-fill bodyr2">0 Pertemuan</p>
          </div>  
          <div class="column-data">
            <p class="data-label bodysb2">Kosong</p>
            <p class="data-fill bodyr2">3 Pertemuan</p>
          </div>  
        </div>
      </div>
      <div class="card-body">
        <h3 class="headersb3">Program</h3>
        <div class="card-content">
          <div class="column-data">
            <p class="data-label bodysb2">Total Pertemuan</p>
            <p class="data-fill bodyr2">144 pertemuan</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Kosong</p>
            <p class="data-fill bodyr2">4 Pertemuan</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Progress</p>
            <p class="data-fill bodyr2">100%</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Absensi</p>
            <p class="data-fill bodyr2">97,22%</p>
          </div>  
          <div class="column-data">
            <p class="data-label bodysb2"></p>
            <p class="data-fill bodyr2"></p>
          </div>  
        </div>
      </div>
      <div class="card-body">
        <n-divider class="divider" />
      </div>
      <div class="card-body">
        <div class="result">
          <div class="column-result">
            <p class="result-label bodysb2">Kesesuaian</p>
            <p class="data-fill bodyr2">: 99.31%</p>
          </div>
          <div class="column-result">
            <p class="result-label bodysb2">Honor Tutor</p>
            <p class="data-fill bodyr2">: Rp960.000</p>
          </div>
          <div class="column-result">
            <p class="result-label bodysb2">Diterima</p>
            <p class="data-fill bodyr2">: : Rp953.280</p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <n-divider class="divider" />
      </div>
      <div class="card-body catatan">
        <p class="bodyr2">Catatan:</p>
        <ul>
          <li>
            Izin dan absen pada tutor akan mempengaruhi skor kesesuaian
          </li>
          <li>
            Skor kesesuaian tutor akan dikalikan dengan Honor program untuk menghasilkan Honor yang diterima.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.program-card {
  border: 1px solid #f39c12;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  color: #061222;
}
.card-header {
  background-color: #154288;
  color: white;
  padding: 12px 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.card-space{
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 3rem;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card-content{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
}

.column-data{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.data-label{
  color: #154288;
  width: 200px;
}
.headersb3{
  color: #154288;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.column-result{
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.result{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.result-label{
  width: 100px;
  color: #154288;
}
.catatan{
  color: #f39c12;
}
</style>
