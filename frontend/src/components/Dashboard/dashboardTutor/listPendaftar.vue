<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';

const message = useMessage();
const router = useRouter();

const registrantList = ref([]);
const page = ref(1);
const pageSize = 3;
const total = ref(0);

const fetchRegistrants = async () => {
  try {
    const res = await fetch(`/apply?page=${page.value}&limit=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    const json = await res.json();
    registrantList.value = json.data || [];
    total.value = json.total || 0; // Pastikan backend mengirim total data
  } catch (e) {
    registrantList.value = [];
    message.error('Gagal mengambil data pendaftar');
  }
};

onMounted(fetchRegistrants);

const handleActionClick = (registrant) => {
  router.push(`/dashboardadmin/tutor/verifikasitutor/${registrant.id}`);
};

function handlePrev() {
  if (page.value > 1) {
    page.value--;
    fetchRegistrants();
  }
}
function handleNext() {
  if (page.value < Math.ceil(total.value / pageSize)) {
    page.value++;
    fetchRegistrants();
  }
}
</script>

<template>
  <div class="registrant-container">
    <n-space vertical :size="20">
      <div class="header-row">
        <h1 class="headerb2" style="margin: 0; color: #154484;">Pendaftar</h1>
        <div class="pagination-wrapper">
          <button
            class="pagination-btn"
            :disabled="page === 1"
            @click="handlePrev"
          >&lt;</button>
          <button
            class="pagination-btn"
            :disabled="page >= Math.ceil(total / pageSize)"
            @click="handleNext"
          >&gt;</button>
        </div>
      </div>
      <n-space vertical size="medium">
        <div
          v-for="registrant in registrantList"
          :key="registrant.id"
          class="registrant-item"
        >
          <span class="registrant-name">{{ registrant.name }}</span>
          <n-button secondary strong @click="handleActionClick(registrant)">
            Aksi
          </n-button>
        </div>
      </n-space>
    </n-space>
  </div>
</template>

<style scoped>
.registrant-container {
  /* Memberi padding dan membatasi lebar container */
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px; /* Sudut membulat seperti pada container di gambar */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Memberi sedikit bayangan */
}

.registrant-item {
  /* Styling untuk setiap item dalam daftar */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eef2f7; /* Warna latar belakang abu-abu muda */
  padding: 12px 20px;
  border-radius: 12px; /* Sudut membulat untuk setiap item */
  width: 100%;
}

.registrant-name {
  /* Styling untuk teks nama */
  font-size: 1.1rem; /* Ukuran font 16px-18px */
  font-weight: 500;
  color: #333;
}

/* Mengubah style tombol Aksi agar lebih mirip dengan gambar */
.n-button {
  border-radius: 20px !important; /* Membuat tombol lebih membulat */
  font-weight: 600;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.pagination-wrapper {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #154484;
  background: #fff;
  color: #154484;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
  line-height: 1;
}
.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>