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
    <div class="card-header headerb3">Biaya Program</div>
    <div class="card-body">
      <div class="column-data">
        <p class="data-label bodysb2">Jenis</p>
        <p class="data-fill bodyr2">Kelompok 3 Siswa</p>
      </div>
      <div class="column-data">
        <p class="data-label bodysb2">Biaya Program</p>
        <p class="data-fill bodyr2">Rp1.200.000</p>
      </div>
      <div class="column-data">
        <p class="data-label bodysb2">Biaya/anak</p>
        <p class="data-fill bodyr2">Rp400.000</p>
      </div>
      <div class="column-data">
        <p class="data-label bodysb2">Honor Program</p>
        <p class="data-fill bodyr2">Rp960.000</p>
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

.card-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2rem 3rem;
}

.column-data{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.data-label{
  color: #154288;
  width: 200px;
}
</style>
