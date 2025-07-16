<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ButDownloadSecondSmall from '@/components/dirButton/butDownloadSecondSmall.vue';
import Tinjauan from './Tinjauan.vue';

const tutorStats = ref(null);
const stats = ref(null);
const route = useRoute();
const classId = route.params.classId || route.params.id;

const isPaid = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price);
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:3000/attendance/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Gagal mengambil data absensi');
    const { data } = await res.json();
    if (data) {
      tutorStats.value = data.tutorStats;
      stats.value = data;
      isPaid.value = data.tutorStats.status === 'terbayar';
    }
  } catch (err) {
    console.error(err);
  }
});

watch(tutorStats, () => {
  if (tutorStats.value?.status === 'terbayar') {
    isPaid.value = true;
  } else {
    isPaid.value = false;
  }
});

const railStyle = ({ checked }) => {
  const style = {
    borderRadius: '20px',
  };
  if (checked) {
    style.background = '#2080f0';
  } else {
    style.background = '#d03050';
  }
  return style;
};

function downloadRekap() {
  const token = localStorage.getItem('token');
  const classId = route.params.classId || route.params.id;
  if (!token || !classId) return;
  fetch(`/attendance/download/${classId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Gagal download rekap');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rekap_${stats.value?.classCode || classId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      alert('Gagal download rekap');
      console.error(err);
    });
}

async function updatePaymentStatus(value) {
  const token = localStorage.getItem('token');
  const status = value ? 'terbayar' : 'pending';

  try {
    const res = await fetch('http://localhost:3000/salaries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salaryId: tutorStats.value.salaryId,
        status: status,
      }),
    });

    if (!res.ok) throw new Error('Gagal memperbarui status');

    tutorStats.value.status = status;
  } catch (err) {
    alert('Gagal memperbarui status pembayaran');
    console.error(err);
    isPaid.value = !value; // rollback toggle
  }
}
</script>

<template>
  <div class="program-card" v-if="tutorStats && stats">
    <div class="card-header title-act">
      <div class="headerb3">Rekap Tutor</div>
      <div class="act">
        <ButDownloadSecondSmall @click.stop="downloadRekap" />
        <n-switch v-model:value="isPaid" :rail-style="railStyle" @update:value="updatePaymentStatus">
          <template #checked>
            Sudah Terbayar
          </template>
          <template #unchecked>
            Belum Terbayar
          </template>
        </n-switch>
      </div>
    </div>
    <div class="card-space">
      <div class="card-body">
        <h3 class="headersb3">Rekap Tutor</h3>
        <div class="card-content">
          <div class="column-data">
            <p class="data-label bodysb2">Nama</p>
            <p class="data-fill bodyr2">{{ tutorStats.name }}</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Hadir</p>
            <p class="data-fill bodyr2">{{ tutorStats.masuk }} pertemuan</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Absen</p>
            <p class="data-fill bodyr2">{{ tutorStats.alpha }} pertemuan</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Potensi Tinjauan</p>
            <p class="data-fill bodyr2">{{ stats.tinjauan }} pertemuan</p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h3 class="headersb3">Program</h3>
        <div class="card-content">
          <div class="column-data">
            <p class="data-label bodysb2">Total Pertemuan</p>
            <p class="data-fill bodyr2">{{ stats.pertemuan }} pertemuan</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Kosong</p>
            <p class="data-fill bodyr2">{{ stats.kosong }} pertemuan</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Progress</p>
            <p class="data-fill bodyr2">{{ stats.progress }}%</p>
          </div>
          <div class="column-data">
            <p class="data-label bodysb2">Absensi</p>
            <p class="data-fill bodyr2">{{ stats.absensi }}%</p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <n-divider class="divider" />
      </div>
      <div>
        <h3 class="headersb3">Potensi Tinjauan</h3>
        <div class="tinjauan">
          <Tinjauan />
        </div>
      </div>
      <div class="card-body">
        <n-divider class="divider" />
      </div>
      <div class="card-body">
        <div class="result">
          <div class="column-result">
            <p class="result-label bodysb2">Kesesuaian</p>
            <p class="data-fill bodyr2">: {{ stats.kesesuaian }}%</p>
          </div>
          <div class="column-result">
            <p class="result-label bodysb2">Honor Tutor</p>
            <p class="data-fill bodyr2">: Rp{{ formatPrice(tutorStats.salary) }}</p>
          </div>
          <div class="column-result">
            <p class="result-label bodysb2">Diterima</p>
            <p class="data-fill bodyr2">: Rp{{ formatPrice(tutorStats.payroll) }}</p>
          </div>
          <div class="column-result">
            <p class="result-label bodysb2">Status</p>
            <p class="data-fill bodyr2">
              : 
              <span v-if="tutorStats.status === 'belum'">Belum Terbayar</span>
              <span v-else-if="tutorStats.status === 'terbayar'">Terbayar</span>
              <span v-else>{{ tutorStats.status }}</span>
            </p>
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
.title-act {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.act {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}
.card-header {
  background-color: #154288;
  color: white;
  padding: 12px 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.tinjauan {
  margin-top: 1rem;
}
.card-space {
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
.card-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
}
.column-data {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.data-label {
  color: #154288;
  width: 200px;
}
.headersb3 {
  color: #154288;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.column-result {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.result {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.result-label {
  width: 100px;
  color: #154288;
}
.catatan {
  color: #f39c12;
}
</style>
