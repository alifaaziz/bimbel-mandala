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
    <div class="card-header headerb3">Skema Harga Program</div>
    <div class="card-body">
      <div class="col-skema" v-for="group in groupTypes" :key="group.type">
        <h3 class="headersb4">{{ formatGroupType(group.type) }}</h3>
        <div class="detail-skema">
          <div>
            <span v-if="group.discPrice" class="price-normal">
              Rp {{ typeof group.price === 'number' ? formatPrice(group.price) : group.price }}
            </span>
            <span v-if="group.discPrice" class="price-discount">
              Rp {{ typeof group.discPrice === 'number' ? formatPrice(group.discPrice) : group.discPrice }}
            </span>
            <span v-else>
              Rp {{ typeof group.price === 'number' ? formatPrice(group.price) : group.price }}
            </span>
          </div>
        </div>
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
  padding: 2rem 3rem;
}

.col-skema {
  max-width: 180px;
  flex: 1;
  margin: 0 0.5rem;
}

.headersb4 {
  color: #154288;
  margin-bottom: 1rem;
}

.detail-skema {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-normal {
  text-decoration: line-through;
  color: red;
  font-size: 0.9rem;
  margin-right: 8px;
}

.price-discount {
  font-weight: bold;
  color: black;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
}
</style>
