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
    default:
      return type;
  }
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  const slug = route.params.id; // Ambil slug dari route params
  try {
    const res = await fetch(`http://localhost:3000/packages/my/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Gagal mengambil data program');
    const data = await res.json();

    // Validasi data sebelum mengakses properti
    if (data) {
      program.value = data; // Simpan data program ke state

      // Urutkan groupTypes berdasarkan urutan tertentu
      const order = ['privat', 'grup2', 'grup3', 'grup4', 'grup5'];
      groupTypes.value = (data.groupType || []).sort(
        (a, b) => order.indexOf(a.type) - order.indexOf(b.type)
      );
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
    <div class="card-header headerb3">Skema Honor Tutor</div>
    <div class="card-body">
      <div class="col-skema" v-for="group in groupTypes" :key="group.type">
        <h3 class="headersb4">{{ formatGroupType(group.type) }}</h3>
        <div class="detail-skema">
          <div>
            <span v-if="group.discPrice" class="bodysb3">
              Rp {{ group.discPrice.toLocaleString('id-ID') }}
            </span>
            <span v-else class="bodysb3">
              Rp {{ group.price.toLocaleString('id-ID') }}
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
    max-width: 200px;
    flex: 1;
    margin: 0 auto;
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

@media (max-width: 768px) {

}
</style>
